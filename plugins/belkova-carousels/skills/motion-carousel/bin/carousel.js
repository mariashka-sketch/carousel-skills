#!/usr/bin/env node
/* Анимированные карусели: CLI.
   node carousel.js doctor
   node carousel.js init <папка> --name "Имя Фамилия" --role "риелтор · Москва" [--label "Рубрика"] [--swipe "листайте"]
   node carousel.js build   --project <папка>
   node carousel.js render  --project <папка> [--set demo] [--slides 1,3] [--qa | --stills [--t 1.5,3.2]] [--story | --wide] [--fps 30] [--dpr 2]
   node carousel.js sheet   --project <папка> [--set demo]
   node carousel.js pack    --project <папка> [--set demo] [--dest <папка>]
   node carousel.js preview --project <папка> [--port 8800]
*/
const path = require('path');
const args = process.argv.slice(2);
const cmd = args.shift();
const opt = {}, pos = [];
for (let i = 0; i < args.length; i++){
  const a = args[i];
  if (a.startsWith('--')){ const k = a.slice(2); const v = args[i + 1]; if (v !== undefined && !v.startsWith('--')){ opt[k] = v; i++; } else opt[k] = true; }
  else pos.push(a);
}
const project = path.resolve(opt.project || pos[0] || '.');
const nums = s => String(s).split(',').map(Number).filter(n => !isNaN(n));
const fail = e => { console.error('\n  ✗ ' + (e && e.message || e)); process.exit(1); };

(async () => {
  switch (cmd){
    case 'doctor': { const ok = require('../lib/doctor').doctor({ fix: opt['no-install'] ? false : true }); process.exit(ok ? 0 : 2); }
    case 'init': { const dir = pos[0] || opt.dir || '.'; const r = require('../lib/init').init({ dir, name: opt.name, role: opt.role, label: opt.label, swipe: opt.swipe, force: !!opt.force });
      console.log(`  ✓ проект создан: ${r.dir}\n  brand.json: ${JSON.stringify(r.brand)}\n  слайды: slides/demo.js — замените своими; фото → assets/photo, картинки → assets/img`); break; }
    case 'build': { const r = require('../lib/build').build(project, { out: opt.out, title: opt.title });
      console.log(`  ✓ ${r.outFile} (${Math.round(r.size/1024)} КБ)\n  карусели: ${Object.entries(r.sets).map(([k, t]) => `${k} — «${t}»`).join('; ') || 'не найдено CAR(...)'}\n  файлы: ${r.slides.join(', ')}`); break; }
    case 'render': { const r = await require('../lib/render').render({ project, set: opt.set, slides: opt.slides ? nums(opt.slides) : null, qa: !!opt.qa, stills: !!opt.stills, times: opt.t ? nums(opt.t) : null,
        story: !!opt.story, wide: !!opt.wide, fps: opt.fps ? +opt.fps : 30, dpr: opt.dpr ? +opt.dpr : 2, page: opt.page, crf: opt.crf ? +opt.crf : 17 });
      const bad = Object.entries(r.issues).filter(([, v]) => v.length);
      console.log(bad.length ? `\n  Замечания по вёрстке: слайды ${bad.map(([k]) => k).join(', ')} — исправьте и повторите.` : '\n  Вёрстка чистая.'); break; }
    case 'sheet': { const r = await require('../lib/sheet').sheet({ project, set: opt.set, cols: opt.cols ? +opt.cols : 4 }); console.log(`  ✓ ${r.out} (${r.count} кадров)`); break; }
    case 'pack': { const r = require('../lib/pack').pack({ project, set: opt.set, dest: opt.dest });
      for (const x of r.report) console.log(`  ✓ ${x.dir}\n      видео: ${x.videos}, картинок: ${x.images}, ${x.mb} МБ, пост.txt: ${x.caption ? 'есть' : 'нет (положите caption/<set>.txt)'}`); break; }
    case 'preview': { const s = await require('../lib/serve').serve(project, opt.port ? +opt.port : 8800); console.log(`  предпросмотр: ${s.url}  (сетка всех слайдов; клик — проиграть; Ctrl+C — остановить)`); await new Promise(() => {}); }
    default: console.log(require('fs').readFileSync(__filename, 'utf8').split('*/')[0].replace('#!/usr/bin/env node\n/* ', '')); process.exit(cmd ? 1 : 0);
  }
})().catch(fail);
