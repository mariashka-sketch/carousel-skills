// Headless Chrome через DevTools Protocol. Без зависимостей: WebSocket и fetch встроены в Node ≥ 22.
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path'), os = require('os');
const { findChrome, HOW_TO } = require('./find-chrome');

const sleep = ms => new Promise(r => setTimeout(r, ms));

class CDP {
  constructor(ws){ this.ws = ws; this.id = 0; this.waiting = new Map(); this.handlers = [];
    ws.addEventListener('message', ev => {
      const m = JSON.parse(ev.data);
      if (m.id && this.waiting.has(m.id)){ const { res, rej } = this.waiting.get(m.id); this.waiting.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); }
      else if (m.method) this.handlers.forEach(h => h(m));
    });
  }
  send(method, params = {}, sessionId){ const id = ++this.id;
    return new Promise((res, rej) => { this.waiting.set(id, { res, rej }); this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); }); }
  on(fn){ this.handlers.push(fn); }
}

async function launch({ width, height, dpr = 2, log = true }){
  if (typeof WebSocket === 'undefined') throw new Error(`Нужен Node 22 или новее (у вас ${process.version}). Установите LTS с https://nodejs.org`);
  const chrome = findChrome(); if (!chrome) throw new Error(HOW_TO);
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'carousel-'));
  const proc = spawn(chrome, [
    '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-sync', '--disable-background-networking',
    '--force-device-scale-factor=1', '--hide-scrollbars', '--mute-audio', '--allow-file-access-from-files',
    `--window-size=${width},${height}`, 'about:blank'
  ], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
  proc.stderr.on('data', d => { if (process.env.CAROUSEL_DEBUG) process.stderr.write('[chrome] ' + d); });
  // порт пишется в DevToolsActivePort профиля
  let port = null;
  for (let i = 0; i < 120 && !port; i++){
    try { const t = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split(/\r?\n/)[0].trim(); if (t) port = +t; } catch {}
    if (!port) await sleep(250);
  }
  if (!port){ proc.kill(); throw new Error('Chrome не поднялся (нет DevToolsActivePort). Попробуйте закрыть другие копии Chrome и повторить.'); }
  let version = null;
  for (let i = 0; i < 40 && !version; i++){ try { version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); } catch { await sleep(250); } }
  if (!version){ proc.kill(); throw new Error('Chrome не отвечает на порту отладки'); }
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  const cdp = new CDP(ws);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank', width, height });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  cdp.on(m => {
    if (m.method === 'Runtime.exceptionThrown') console.error('[js error]', m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Runtime.consoleAPICalled' && log) console.log('[console]', m.params.args.map(a => a.value ?? a.description).join(' '));
  });
  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Runtime.enable', {}, sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: dpr, mobile: false }, sessionId);
  const evaluate = (expression, awaitPromise = false) => cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise }, sessionId).then(r => r.result.value);
  const navigate = url => cdp.send('Page.navigate', { url }, sessionId);
  const screenshot = (format = 'jpeg', quality = 96) => cdp.send('Page.captureScreenshot', { format, ...(format === 'jpeg' ? { quality } : {}), captureBeyondViewport: false }, sessionId).then(r => Buffer.from(r.data, 'base64'));
  const close = async () => { await cdp.send('Browser.close').catch(() => {}); proc.kill(); await sleep(200); try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} };
  return { cdp, sessionId, evaluate, navigate, screenshot, close, chromePath: chrome };
}
module.exports = { launch, sleep };
