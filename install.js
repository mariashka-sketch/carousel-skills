#!/usr/bin/env node
/* Установка скиллов в Claude Code, Codex (ChatGPT) и Gemini CLI одной командой.
   node install.js            — во все три (куда найдёт папку ~/.claude, ~/.codex, ~/.gemini — или создаст)
   node install.js claude     — только ~/.claude/skills
   node install.js codex      — только ~/.codex/skills
   node install.js gemini     — только ~/.gemini/skills
   node install.js --link     — символические ссылки вместо копий (обновляются через git pull)
*/
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const SRC = path.join(__dirname, 'plugins', 'belkova-carousels', 'skills');
const SKILLS = fs.readdirSync(SRC).filter(d => fs.existsSync(path.join(SRC, d, 'SKILL.md')));
const TARGETS = { claude: path.join(os.homedir(), '.claude', 'skills'), codex: path.join(os.homedir(), '.codex', 'skills'), gemini: path.join(os.homedir(), '.gemini', 'skills') };
const args = process.argv.slice(2), link = args.includes('--link');
const which = args.filter(a => TARGETS[a]); const names = which.length ? which : Object.keys(TARGETS);

function copyDir(s, d){ fs.mkdirSync(d, { recursive: true });
  for (const e of fs.readdirSync(s, { withFileTypes: true })){ if (e.name === 'node_modules' || e.name.startsWith('._') || e.name === '.DS_Store') continue;
    const a = path.join(s, e.name), b = path.join(d, e.name); e.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b); } }

for (const n of names){
  const root = TARGETS[n]; fs.mkdirSync(root, { recursive: true });
  for (const sk of SKILLS){
    const s = path.join(SRC, sk), d = path.join(root, sk);
    if (fs.existsSync(d) || (() => { try { fs.lstatSync(d); return true; } catch { return false; } })()) fs.rmSync(d, { recursive: true, force: true });
    if (link) fs.symlinkSync(s, d, 'dir'); else copyDir(s, d);
    console.log(`  ✓ ${n}: ${d}${link ? ' → ' + s : ''}`);
  }
}
// ffmpeg для motion-carousel: npm install в папке скилла (один раз, ~40 МБ)
const mc = path.join(SRC, 'motion-carousel');
if (!fs.existsSync(path.join(mc, 'node_modules', '@ffmpeg-installer'))){
  console.log('  … npm install (ffmpeg) в ' + mc);
  const r = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', '--no-audit', '--no-fund', '--omit=dev'], { cwd: mc, stdio: 'inherit', shell: process.platform === 'win32' });
  if (r.status !== 0) console.log('  ✗ npm install не удался — позже выполните его вручную в этой папке или запустите doctor');
}
if (!link) for (const n of names){ // копиям тоже нужен node_modules
  const d = path.join(TARGETS[n], 'motion-carousel'); const nm = path.join(mc, 'node_modules');
  if (fs.existsSync(nm) && !fs.existsSync(path.join(d, 'node_modules'))) copyDir(nm, path.join(d, 'node_modules'));
}
console.log(`\nГотово. Проверка: node "${path.join(TARGETS[names[0]], 'motion-carousel', 'bin', 'carousel.js')}" doctor`);
console.log('Дальше в своём ИИ-агенте: «сделай карусель про …» или «сделай coverflow из этих картинок».');
