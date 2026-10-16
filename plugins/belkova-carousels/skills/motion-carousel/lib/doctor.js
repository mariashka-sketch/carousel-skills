// Проверка окружения: Node, Chrome, ffmpeg. Недостающий ffmpeg доставляет npm install в папке скилла.
const fs = require('fs'), path = require('path');
const { spawnSync } = require('child_process');
const { findChrome, HOW_TO: CH_HOW } = require('./find-chrome');
const { findFfmpeg, HOW_TO: FF_HOW, SKILL } = require('./find-ffmpeg');

function npmInstall(){
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  console.log(`  … ставлю ffmpeg: npm install в ${SKILL} (один раз, ~40 МБ)`);
  const r = spawnSync(npm, ['install', '--no-audit', '--no-fund', '--omit=dev'], { cwd: SKILL, stdio: 'inherit', shell: process.platform === 'win32', windowsHide: true });
  return r.status === 0;
}
function doctor({ fix = true } = {}){
  const rows = [], major = +process.versions.node.split('.')[0];
  rows.push({ ok: major >= 22, what: 'Node', info: process.version, how: 'нужен Node 22 или новее — установите LTS с https://nodejs.org (Windows: галочка «Add to PATH»)' });
  const chrome = findChrome();
  rows.push({ ok: !!chrome, what: 'Chrome', info: chrome || 'не найден', how: CH_HOW });
  let ff = findFfmpeg();
  if (!ff && fix && npmInstall()) ff = findFfmpeg();
  rows.push({ ok: !!ff, what: 'ffmpeg', info: ff || 'не найден', how: FF_HOW });
  rows.push({ ok: true, what: 'ОС', info: `${process.platform} ${process.arch}` });
  rows.push({ ok: true, what: 'Скилл', info: SKILL });
  for (const r of rows) console.log(`  ${r.ok ? '✓' : '✗'} ${r.what}: ${r.info}${r.ok ? '' : '\n      → ' + r.how}`);
  const bad = rows.filter(r => !r.ok);
  console.log(bad.length ? `\n  Не всё готово (${bad.map(b => b.what).join(', ')}). Исправьте и запустите doctor снова.` : '\n  Всё готово: можно собирать и рендерить.');
  return bad.length === 0;
}
module.exports = { doctor };
