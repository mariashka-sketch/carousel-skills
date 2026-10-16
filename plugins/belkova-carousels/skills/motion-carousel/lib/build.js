// Сборка: brand.json + движок + slides/*.js → index.html проекта (шрифты вшиты base64).
const fs = require('fs'), path = require('path');
const ENGINE = path.resolve(__dirname, '../engine');
const DEFAULT_BRAND = { name: 'Имя Фамилия', role: '', label: '', swipe: 'листайте', colors: {} };

function readBrand(project){
  const f = path.join(project, 'brand.json');
  let b = {};
  if (fs.existsSync(f)){ try { b = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e){ throw new Error(`brand.json: не читается JSON (${e.message})`); } }
  return { ...DEFAULT_BRAND, ...b, colors: { ...(b.colors || {}) } };
}
function brandCss(c){
  const map = { accent: '--pk', accent2: '--pk2', violet: '--vi', violet2: '--vi2', yellow: '--yl', mint: '--mint', red: '--rd', page: '--page' };
  const lines = Object.entries(map).filter(([k]) => c[k]).map(([k, v]) => `${v}:${c[k]};`);
  if (c.bg && c.bg.length) lines.push(`--page:${c.bg[0]};`);
  return lines.length ? `:root{ ${lines.join(' ')} }` : '';
}
function listSlides(project){
  const dir = path.join(project, 'slides');
  if (!fs.existsSync(dir)) throw new Error(`нет папки slides/ в ${project}`);
  return fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.startsWith('.') && !f.startsWith('_')).sort().map(f => path.join(dir, f));
}
function scanSets(files){ // CAR('id', 'название') → { id: название }
  const sets = {};
  for (const f of files){ const s = fs.readFileSync(f, 'utf8'); for (const m of s.matchAll(/CAR\(\s*(['"`])([^'"`]+)\1\s*,\s*(['"`])((?:\\.|(?!\3).)*)\3/g)) sets[m[2]] = m[4]; }
  return sets;
}
function build(project, { out = 'index.html', title } = {}){
  project = path.resolve(project);
  const brand = readBrand(project), files = listSlides(project);
  if (!files.length) throw new Error('в slides/ нет ни одного .js файла');
  const read = f => fs.readFileSync(path.join(ENGINE, f), 'utf8');
  const font = f => `@font-face{ font-family:"${f}"; src:url(data:font/ttf;base64,${fs.readFileSync(path.join(ENGINE, 'fonts', f + '.ttf')).toString('base64')}) format("truetype"); font-weight:200 900; font-display:block; }`;
  const js = ['engine.js', 'icons.js', 'comp.js'].map(read).concat(files.map(f => `/* ===== ${path.basename(f)} ===== */\n` + fs.readFileSync(f, 'utf8')), [read('main.js')]).join('\n');
  const html = read('template.html')
    .replace('/*TITLE*/', () => (title || `Карусели — ${brand.name}`))
    .replace('/*FONTS*/', () => font('Unbounded') + '\n' + font('Manrope'))
    .replace('/*CSS*/', () => read('style.css'))
    .replace('/*BRANDCSS*/', () => brandCss(brand.colors))
    .replace('/*BRAND*/', () => `const BRAND = ${JSON.stringify(brand)};`)
    .replace('/*JS*/', () => js);
  const outFile = path.join(project, out);
  fs.writeFileSync(outFile, html);
  const sets = scanSets(files);
  fs.mkdirSync(path.join(project, 'out'), { recursive: true });
  fs.writeFileSync(path.join(project, 'out', 'sets.json'), JSON.stringify(sets, null, 2));
  return { outFile, size: fs.statSync(outFile).size, sets, slides: files.map(f => path.basename(f)) };
}
module.exports = { build, readBrand, scanSets, listSlides };
