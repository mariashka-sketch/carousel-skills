// Поиск ffmpeg: FFMPEG_PATH → пакет @ffmpeg-installer/ffmpeg (в node_modules скилла) → ffmpeg в PATH.
const fs = require('fs'), path = require('path');
const { execSync } = require('child_process');
const SKILL = path.resolve(__dirname, '..');

function fromPackage(){
  for (const root of [SKILL, path.resolve(SKILL, '../..')]){
    try {
      const mod = require.resolve('@ffmpeg-installer/ffmpeg', { paths: [root] });
      const p = require(mod).path;
      if (p && fs.existsSync(p)) return p;
    } catch {}
  }
  return null;
}
function fromPath(){
  try { const out = execSync((process.platform === 'win32' ? 'where ' : 'command -v ') + 'ffmpeg', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().split(/\r?\n/)[0].trim(); if (out && fs.existsSync(out)) return out; } catch {}
  return null;
}
function findFfmpeg(){
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  return fromPackage() || fromPath();
}
const HOW_TO = `ffmpeg не найден. Выполните в папке скилла:  npm install   (${SKILL}) — или установите ffmpeg (brew install ffmpeg / winget install ffmpeg) и укажите путь в FFMPEG_PATH.`;
module.exports = { findFfmpeg, HOW_TO, SKILL };
