// Контактный лист: финальные кадры out/<set>-NN.jpg сеткой → qa/sheet-<set>.jpg (снимает тот же Chrome).
const fs = require('fs'), path = require('path');
const { pathToFileURL } = require('url');
const { launch, sleep } = require('./cdp');

async function sheet({ project, set, cols = 4, w = 360 }){
  project = path.resolve(project);
  const sets = JSON.parse(fs.readFileSync(path.join(project, 'out', 'sets.json'), 'utf8'));
  set = set || Object.keys(sets)[0];
  const files = fs.readdirSync(path.join(project, 'out')).filter(f => f.startsWith(set + '-') && /-\d\d\.jpg$/.test(f)).sort();
  if (!files.length) throw new Error(`нет кадров out/${set}-NN.jpg — сначала render --stills`);
  const h = Math.round(w*1350/1080), rows = Math.ceil(files.length/cols), W = cols*(w + 16) + 16, H = rows*(h + 44) + 16;
  const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#120826;font:600 16px Manrope,sans-serif;color:#fff;width:${W}px;height:${H}px;display:flex;flex-wrap:wrap;gap:16px;padding:16px;box-sizing:border-box;align-content:flex-start">
    ${files.map((f, i) => `<figure style="margin:0;width:${w}px"><img src="${pathToFileURL(path.join(project, 'out', f)).href}" style="display:block;width:${w}px;height:${h}px;border-radius:10px"><figcaption style="padding:6px 2px 0">${i + 1} · ${f}</figcaption></figure>`).join('')}</body>`;
  const tmp = path.join(project, 'qa', `_sheet-${set}.html`); fs.mkdirSync(path.dirname(tmp), { recursive: true }); fs.writeFileSync(tmp, html);
  const page = await launch({ width: W, height: H, dpr: 1, log: false });
  try {
    await page.navigate(pathToFileURL(tmp).href);
    for (let i = 0; i < 60; i++){ if (await page.evaluate(`[...document.images].every(im => im.complete)`)) break; await sleep(150); }
    await sleep(200);
    const out = path.join(project, 'qa', `sheet-${set}.jpg`);
    fs.writeFileSync(out, await page.screenshot('jpeg', 90));
    fs.unlinkSync(tmp);
    return { out, count: files.length };
  } finally { await page.close(); }
}
module.exports = { sheet };
