// Поиск браузера на движке Chromium: CHROME_PATH → стандартные пути по ОС → PATH.
const fs = require('fs'), path = require('path'), os = require('os');
const { execSync } = require('child_process');

function candidates(){
  const p = process.platform, home = os.homedir();
  if (p === 'darwin') return [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    path.join(home, 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Yandex.app/Contents/MacOS/Yandex',
  ];
  if (p === 'win32'){
    const roots = [process.env['PROGRAMFILES'], process.env['PROGRAMFILES(X86)'], process.env['LOCALAPPDATA']].filter(Boolean);
    const rel = ['Google\\Chrome\\Application\\chrome.exe', 'Chromium\\Application\\chrome.exe', 'Microsoft\\Edge\\Application\\msedge.exe', 'BraveSoftware\\Brave-Browser\\Application\\brave.exe', 'Yandex\\YandexBrowser\\Application\\browser.exe'];
    return roots.flatMap(r => rel.map(x => path.join(r, x)));
  }
  return ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium', '/usr/bin/microsoft-edge', '/usr/bin/brave-browser', '/opt/google/chrome/chrome'];
}
function fromPath(){
  const names = process.platform === 'win32' ? ['chrome.exe', 'msedge.exe'] : ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge', 'brave-browser'];
  for (const n of names){
    try { const out = execSync((process.platform === 'win32' ? 'where ' : 'command -v ') + n, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().split(/\r?\n/)[0].trim(); if (out && fs.existsSync(out)) return out; } catch {}
  }
  return null;
}
function findChrome(){
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  for (const c of candidates()) if (fs.existsSync(c)) return c;
  return fromPath();
}
const HOW_TO = 'Браузер на движке Chromium не найден. Установите Google Chrome (https://www.google.com/chrome/) — или укажите путь к chrome/msedge в переменной окружения CHROME_PATH.';
module.exports = { findChrome, HOW_TO };
