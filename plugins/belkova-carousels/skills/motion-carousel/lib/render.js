// Рендер слайдов: QA вёрстки, стилл-кадры (JPEG), MP4 через headless Chrome + ffmpeg.
const fs = require('fs'), path = require('path');
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');
const { launch, sleep } = require('./cdp');
const { findFfmpeg, HOW_TO: FF_HOW } = require('./find-ffmpeg');

const pad = n => String(n).padStart(2, '0');

async function openSlide(page, url, n){
  await page.navigate(url);
  let ready = false, err = null;
  for (let i = 0; i < 120; i++){
    const r = await page.evaluate(`(function(){ if (window.__error) return 'ERR:' + window.__error; if(!window.__ready) return false;
      return [...document.images].every(im => im.complete) && [...document.querySelectorAll('#exportHost video')].every(v => v.readyState >= 2); })()`);
    if (typeof r === 'string' && r.startsWith('ERR:')){ err = r.slice(4); break; }
    if (r === true){ ready = true; break; }
    await sleep(150);
  }
  if (err) throw new Error(err);
  if (!ready) throw new Error(`слайд ${n}: страница не инициализировалась (ошибка в slides/*.js? смотрите [js error] выше)`);
  await page.evaluate(`document.fonts.ready.then(()=>1)`, true);
  const broken = await page.evaluate(`[...document.images].filter(im => im.complete && im.naturalWidth === 0 && im.getAttribute('src')).map(im => im.getAttribute('src'))`);
  return { dur: await page.evaluate(`window.__dur`) || 8, broken: broken || [] };
}

async function render({ project, set, slides, qa = false, stills = false, times, story = false, wide = false, fps = 30, dpr = 2, page: pageFile = 'index.html', crf = 17 }){
  project = path.resolve(project);
  const index = path.join(project, pageFile);
  if (!fs.existsSync(index)) throw new Error(`нет ${pageFile} — сначала build`);
  const sets = JSON.parse(fs.readFileSync(path.join(project, 'out', 'sets.json'), 'utf8'));
  set = set || Object.keys(sets)[0];
  if (!sets[set]) throw new Error(`нет карусели «${set}». Есть: ${Object.keys(sets).join(', ')}`);
  const W = wide ? 1920 : 1080, H = story ? 1920 : wide ? 1080 : 1350;
  const suffix = story ? '-story' : wide ? '-wide' : '';
  const OUT = path.join(project, 'out'), QA = path.join(project, 'qa');
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(QA, { recursive: true });
  const ffmpeg = (qa || stills) ? null : findFfmpeg();
  if (!qa && !stills && !ffmpeg) throw new Error(FF_HOW);

  const page = await launch({ width: W, height: H, dpr });
  const base = pathToFileURL(index).href;
  const result = { set, slides: [], issues: {} };
  try {
    // сколько слайдов в наборе
    await page.navigate(`${base}?set=${set}&slide=1`);
    let n = 0; for (let i = 0; i < 80 && !n; i++){ n = await page.evaluate('window.__n || 0'); if (!n) await sleep(150); }
    if (!n) throw new Error('не удалось определить число слайдов — ошибка в slides/*.js? смотрите [js error] выше');
    const list = (slides && slides.length ? slides : Array.from({ length: n }, (_, i) => i + 1)).filter(k => k >= 1 && k <= n);
    for (const k of list){
      const t0 = Date.now();
      const url = `${base}?set=${set}&slide=${k}&anim=1${story ? '&story=1' : ''}${wide ? '&wide=1' : ''}`;
      const { dur, broken } = await openSlide(page, url, k);
      const issues = (await page.evaluate(`window.__qa()`)) || [];
      broken.forEach(b => issues.push(`картинка не найдена: ${b}`));
      result.issues[k] = issues;
      console.log(issues.length ? `  ⚠ слайд ${k}: ${issues.join(' | ')}` : `  ✓ слайд ${k}: вёрстка чистая`);
      if (qa) continue;
      if (stills){
        const tt = times && times.length ? times : [dur];
        for (const t of tt){
          await page.evaluate(`seek(${t})`);
          await page.evaluate(`new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))`, true);
          const buf = await page.screenshot('jpeg', 92);
          const file = times && times.length ? path.join(QA, `${set}-${pad(k)}${suffix}-t${t.toFixed(1)}.jpg`) : path.join(OUT, `${set}-${pad(k)}${suffix}.jpg`);
          fs.writeFileSync(file, buf); console.log(`  ✓ ${path.relative(project, file)}`); result.slides.push(file);
        }
        continue;
      }
      const file = path.join(OUT, `${set}-${pad(k)}${suffix}.mp4`), TOTAL = Math.round(fps*dur);
      const ff = spawn(ffmpeg, [
        '-y', '-v', 'error',
        '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
        '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
        '-vf', `scale=${W}:${H}:flags=lanczos,format=yuv420p`,
        '-c:v', 'libx264', '-profile:v', 'high', '-crf', String(crf), '-preset', 'medium',
        '-x264-params', 'keyint=60:min-keyint=30',
        '-c:a', 'aac', '-b:a', '96k', '-shortest',
        '-movflags', '+faststart', file
      ], { stdio: ['pipe', 'ignore', 'inherit'], windowsHide: true });
      let ffErr = null; ff.on('error', e => { ffErr = e; });
      for (let f = 0; f < TOTAL; f++){
        if (ffErr) throw new Error('ffmpeg: ' + ffErr.message);
        await page.evaluate(`(async()=>{ seek(${(f/fps).toFixed(4)});
          const vs=[...document.querySelectorAll('#exportHost video')];
          await Promise.all(vs.map(v=>new Promise(r=>{ if(!v.seeking && v.readyState>=2) return r();
            const done=()=>{v.removeEventListener('seeked',done); r();}; v.addEventListener('seeked',done); setTimeout(r,2000); })));
          await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))); return vs.length; })()`, true);
        const buf = await page.screenshot('jpeg', 96);
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        if (f % 45 === 0) process.stdout.write(`\r  слайд ${k}: кадр ${f}/${TOTAL}   `);
      }
      ff.stdin.end();
      const code = await new Promise(r => ff.on('close', r));
      if (code !== 0) throw new Error(`ffmpeg завершился с кодом ${code}`);
      console.log(`\r  ✓ ${path.relative(project, file)}  (${((Date.now() - t0)/1000).toFixed(1)} с)      `);
      result.slides.push(file);
    }
  } finally { await page.close(); }
  return result;
}
module.exports = { render };
