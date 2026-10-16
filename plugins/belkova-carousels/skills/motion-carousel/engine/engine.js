const PW = 1080, PH = 1350, M = 80;   // холст карусели 4:5 и поля
/* =====================================================================
   ДВИЖОК. Вся анимация — чистая функция времени: seekPage(page, t).
   Один и тот же код снимает видео (покадрово) и играет живой показ.
   BRAND — объект из brand.json проекта, подставляется при сборке.
   ===================================================================== */
const clamp = (v,a,b) => Math.min(b, Math.max(a, v));
const lerp = (a,b,p) => a + (b-a)*p;
const seg = (t,at,d) => clamp((t-at)/d, 0, 1);
const eOut = p => 1 - Math.pow(1-p, 3);
const eExpo = p => p >= 1 ? 1 : 1 - Math.pow(2, -10*p);
const eIn = p => p*p*p;
const eIO = p => p < .5 ? 4*p*p*p : 1 - Math.pow(-2*p+2, 3)/2;
const eSine = p => 0.5 - 0.5*Math.cos(Math.PI*p);
const eBack = (p, s=1.7) => 1 + (s+1)*Math.pow(p-1,3) + s*Math.pow(p-1,2);
const spring = (t, at, f=1.4, d=5.5) => { const x = t - at; return x <= 0 ? 0 : 1 - Math.exp(-d*x)*Math.cos(2*Math.PI*f*x); };
const hash = (a,b=0) => { const x = Math.sin(a*127.1 + b*311.7 + 13.37)*43758.5453; return x - Math.floor(x); };
const frac = x => ((x % 1) + 1) % 1;
function rng(seed){ let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const $ = (r, s) => r.querySelector(s);
const $$ = (r, s) => [...r.querySelectorAll(s)];
function hexA(hex, a){ const h = hex.replace('#',''); const n = parseInt(h, 16); return `rgba(${n>>16&255},${n>>8&255},${n&255},${a})`; }
function mixHex(a, b, p){ const A = parseInt(a.slice(1),16), B = parseInt(b.slice(1),16);
  const r = Math.round(lerp(A>>16&255, B>>16&255, p)), g = Math.round(lerp(A>>8&255, B>>8&255, p)), bb = Math.round(lerp(A&255, B&255, p));
  return '#' + ((1<<24) + (r<<16) + (g<<8) + bb).toString(16).slice(1); }
const f3 = v => (+v).toFixed(3);
const px = v => (+v).toFixed(1) + 'px';
let UID = 0; const uid = p => `${p}${++UID}`;

/* ---------- разметка ---------- */
const box = (x, y, w, h) => `left:${x}px;top:${y}px;${w ? `width:${w}px;` : ''}${h ? `height:${h}px;` : ''}`;
// появление: data-at — секунда старта, fx — вид, d — длительность, dist — путь
const rv = (at, fx = 'up', d, dist) => ` data-at="${at}" data-fx="${fx}"${d ? ` data-d="${d}"` : ''}${dist !== undefined ? ` data-dist="${dist}"` : ''}`;
const nb = s => String(s).replace(/(\d) (?=\d)/g, '$1 ');   // пробел внутри числа не рвётся
const CHEV = (n = 3, cls = '', w) => { const sp = 22, W = 14 + (n - 1)*sp + 10;
  return `<svg class="chev ${cls}" viewBox="0 0 ${W} 24"${w ? ` style="width:${w}px;height:${Math.round(w*24/W)}px"` : ''}>${
    Array.from({length: n}, (_, i) => `<path d="M${4 + i*sp} 3 L${14 + i*sp} 12 L${4 + i*sp} 21"/>`).join('')}</svg>`; };
const kick = (text, at = 0.1, extra = '') => `<div class="kick${extra}"${rv(at, 'left', 0.8, 40)}><i class="kl"></i><span>${text}</span></div>`;
// заголовок: *слово* — акцент градиентом, **слово** — жёлтый акцент; \n — принудительный перенос
function H(text, at = 0.35, style = '', cls = '', w = 600){
  let acc = '';
  const parts = text.split('\n').map(line => line.split(' ').filter(Boolean).map(w => {
    const m = /^([«(]*)(\*\*|\*)?(.*?)(\*\*|\*)?([.,:;!?»)]*)$/.exec(w);
    const [, lead, open, core, close, tail] = m;
    if (open) acc = open === '**' ? 'acc or' : 'acc';
    const cur = acc;
    if (close) acc = '';
    return `<span class="w"><span class="wi${cur ? ' ' + cur : ''}">${lead}${core}${tail}</span></span>`;
  }).join(' ')).join('<br>');
  return `<h1 class="h ${cls}" data-h="${at}" data-w="${w}" style="${style}">${parts}</h1>`;
}
const bul = (text, at, cls = '', chevCls = '') => `<div class="bul ${cls}"${rv(at, 'up', 0.8, 26)}>${CHEV(2, chevCls)}<span>${text}</span></div>`;
const SRC = (text, at = 2.5) => `<div class="src"${rv(at, 'fade', 0.9)}>${text}</div>`;
const SIG = (at = 1.2) => `<div class="sig"${rv(at, 'fade', 0.9)}><b>${BRAND.name}</b>${BRAND.role ? ` · ${BRAND.role}` : ''}</div>`;
// счётчик: финальный текст = то, что внутри; to — число, к которому бежим
const CNT = (final, to, at, d = 1.4, dec = 0, pre = '', suf = '', cls = 'num') =>
  `<span class="cnt ${cls}" data-to="${to}" data-cat="${at}" data-cd="${d}" data-dec="${dec}" data-pre="${pre}" data-suf="${suf}">${nb(final)}</span>`;

/* ---------- фон (канвас): градиент заката + мягкие пятна + сетка точек + искры ---------- */
function blob(c, x, y, r, col, a){ const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, hexA(col, a)); g.addColorStop(0.55, hexA(col, a*0.45)); g.addColorStop(1, hexA(col, 0)); c.fillStyle = g; c.fillRect(x - r, y - r, r*2, r*2); }
const BG = Object.assign({ bg: ['#1E0B57', '#4B1597', '#9A2A86', '#F25F28'], blobs: ['#FF8A3D', '#7B4DFF', '#FF4F8A', '#B067FF'], dots: true, sparks: true }, (BRAND.colors || {}));
function bgNight(c, t, pg){
  const g = c.createLinearGradient(0, 0, PW, PH);
  const st = BG.bg, n = st.length; st.forEach((col, i) => g.addColorStop(n === 4 ? [0, 0.42, 0.72, 1][i] : i/(n - 1), col));
  c.fillStyle = g; c.fillRect(0, 0, PW, PH);
  const b = BG.blobs;
  blob(c, 1040 + 60*Math.sin(t*0.21), 1300 + 40*Math.cos(t*0.27), 760, b[0], 0.55);
  blob(c, -40 + 50*Math.sin(t*0.17 + 1), 80 + 40*Math.sin(t*0.25), 620, b[1 % b.length], 0.42);
  blob(c, 620 + 140*Math.sin(t*0.13 + 2), 700 + 90*Math.cos(t*0.19), 520, b[2 % b.length], 0.16);
  blob(c, 980 + 40*Math.sin(t*0.3), 160, 380, b[3 % b.length], 0.3);
  if (BG.dots){ // сетка точек с бегущей волной
    const wv = t*1.3;
    for (let y = 24; y < PH; y += 36) for (let x = 24; x < PW; x += 36){
      const w = Math.max(0, Math.sin((x*0.8 + y)/230 - wv));
      c.fillStyle = `rgba(255,${x + y > 1400 ? '220,170' : '230,255'},${(0.05 + 0.12*w*w).toFixed(3)})`; c.fillRect(x - 1.2, y - 1.2, 2.4, 2.4);
    }
  }
  if (BG.sparks) for (let k = 0; k < 40; k++){
    const x = hash(k, 1)*PW + Math.sin(t*0.3*(0.5 + hash(k, 5)) + k)*26, y = frac(hash(k, 2) - t*0.014*(0.4 + hash(k, 3)))*PH;
    const a = 0.2 + 0.45*Math.max(0, Math.sin(t*1.3 + k*1.7));
    c.fillStyle = k % 3 ? `rgba(255,236,214,${a.toFixed(3)})` : `rgba(255,210,120,${a.toFixed(3)})`;
    c.beginPath(); c.arc(x, y, 0.8 + hash(k, 4)*1.9, 0, 6.283); c.fill();
  }
}
const bgLight = bgNight, bgDark = bgNight;

/* ---------- подготовка слайда ---------- */
function fixLines(h){ // фиксирует переносы по финальному весу — анимация веса не перекидывает слова
  const ws = $$(h, '.w'); let top = null;
  ws.forEach(w => { const y = w.offsetTop; if (top !== null && y > top + 4 && !(w.previousSibling && w.previousSibling.nodeName === 'BR')) w.insertAdjacentHTML('beforebegin', '<br>'); top = y; });
}
function prepare(pg, S, dpr){
  pg.__S = S;
  const cv = $(pg, 'canvas.bg'); pg.__cv = cv; pg.__dpr = dpr;
  cv.width = Math.round(PW*dpr); cv.height = Math.round(PH*dpr); pg.__ctx = cv.getContext('2d');
  $$(pg, '.h').forEach(fixLines);
  pg.__heads = $$(pg, '.h').map(h => ({ at: +h.dataset.h, wis: $$(h, '.wi') }));
  pg.__rv = $$(pg, '[data-at]').map(el => ({ el, at: +el.dataset.at, fx: el.dataset.fx || 'up', d: +(el.dataset.d || 0.75), dist: el.dataset.dist !== undefined ? +el.dataset.dist : 34 }));
  pg.__cnt = $$(pg, '.cnt').map(el => ({ el, final: el.innerHTML, to: +el.dataset.to, at: +el.dataset.cat, d: +el.dataset.cd, dec: +el.dataset.dec, pre: el.dataset.pre || '', suf: el.dataset.suf || '' }));
  pg.__draw = $$(pg, '[data-draw]').map(el => { const [at, d] = el.dataset.draw.split(',').map(Number); el.style.strokeDasharray = '1 1'; return { el, at, d }; });
  pg.__chev = $$(pg, '.chev').map(el => { const host = el.closest('[data-at]'); return { paths: $$(el, 'path'), run: el.classList.contains('run'), at: host ? +host.dataset.at : 0 }; });
  pg.__vids = $$(pg, 'video[data-from]');
  if (S.setup) S.setup(pg);
  pg.__ready = true;
}
const fmtNum = (v, dec) => { const s = v.toFixed(dec).split('.'); const i = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' '); return s[1] ? i + ',' + s[1] : i; };

function applyFx(r, t){
  const el = r.el, p = seg(t, r.at, r.d), e = eExpo(p), o = clamp(p*1.8, 0, 1), D = r.dist;
  let tr = '', op = o, cl = '', fl = '';
  switch (r.fx){
    case 'up': tr = `translate3d(0,${px((1 - e)*D)},0)`; break;
    case 'down': tr = `translate3d(0,${px(-(1 - e)*D)},0)`; break;
    case 'left': tr = `translate3d(${px(-(1 - e)*D)},0,0)`; break;
    case 'right': tr = `translate3d(${px((1 - e)*D)},0,0)`; break;
    case 'fade': op = eOut(p); break;
    case 'blur': tr = `translate3d(0,${px((1 - e)*D*0.6)},0)`; fl = p < 0.995 ? `blur(${((1 - e)*10).toFixed(2)}px)` : ''; op = eOut(p); break;
    case 'pop': { const s = p <= 0 ? 0.6 : 0.6 + 0.4*eBack(p, 2.2); tr = `scale(${s.toFixed(4)})`; op = clamp(p*3, 0, 1); break; }
    case 'zoom': tr = `scale(${(1 + (1 - e)*0.12).toFixed(4)})`; op = eOut(p); break;
    case 'wipe': cl = p >= 1 ? '' : `inset(-20px ${f3((1 - eIO(p))*100)}% -20px -20px)`; op = p > 0 ? 1 : 0; break;
    case 'wipeUp': cl = p >= 1 ? '' : `inset(${f3((1 - eIO(p))*100)}% -20px -20px -20px)`; op = p > 0 ? 1 : 0; break;
    case 'drop': { const sp = t < r.at ? 0 : spring(t, r.at, 1.3, 6); tr = `translate3d(0,${px(-(1 - sp)*D)},0)`; op = clamp(p*4, 0, 1); break; }
    case 'flip': tr = `perspective(1400px) rotateX(${((1 - e)*-80).toFixed(2)}deg)`; op = clamp(p*2.5, 0, 1); break;
    case 'show': op = p > 0 ? 1 : 0; break;
  }
  el.style.opacity = f3(op);
  el.style.transform = tr && p < 1 ? tr : '';
  el.style.clipPath = cl;
  el.style.filter = fl;
  el.style.visibility = op <= 0.001 ? 'hidden' : '';
}

function seekPage(pg, t){
  const S = pg.__S, c = pg.__ctx, d = pg.__dpr;
  c.setTransform(d, 0, 0, d, 0, 0);
  (pg.dataset.theme === 'dark' ? bgDark : bgLight)(c, t, pg);
  if (S.fx) S.fx(c, t, pg);
  for (const r of pg.__rv) applyFx(r, t);
  for (const h of pg.__heads){
    h.wis.forEach((w, i) => { const a = h.at + i*0.055, p = eExpo(seg(t, a, 0.8)), pw = eOut(seg(t, a, 1.0));
      w.style.transform = p < 1 ? `translate3d(0,${(1 - p)*112}%,0) rotate(${((1 - p)*5).toFixed(2)}deg)` : '';
      w.style.fontWeight = Math.round(lerp(300, +(w.closest('.h').dataset.w || 600), pw)); });
  }
  for (const k of pg.__cnt){
    const p = seg(t, k.at, k.d);
    k.el.innerHTML = p >= 1 ? k.final : k.pre + fmtNum(k.to*eOut(p), k.dec) + k.suf;
  }
  for (const k of pg.__draw){ const p = eIO(seg(t, k.at, k.d)); k.el.style.strokeDashoffset = f3(1 - p); k.el.style.opacity = p > 0 ? '' : '0'; }
  for (const ch of pg.__chev){
    ch.paths.forEach((p, i) => {
      const base = seg(t, ch.at + 0.2 + i*0.1, 0.3);
      let o = 0.15 + 0.85*base;
      if (ch.run && t > ch.at + 0.6){ const w = Math.max(0, Math.sin((t - ch.at)*4.2 - i*0.95)); o = 0.32 + 0.68*w; }
      p.style.opacity = f3(o);
    });
  }
  // видео внутри слайда: кадр = время слайда минус data-from; после конца — стоп-кадр; data-loop — по кругу
  for (const v of pg.__vids || []){
    const from = +v.dataset.from, len = +v.dataset.len, loop = v.dataset.loop !== undefined;
    let lt = t - from; if (loop && lt > 0) lt = lt % len;
    const ct = clamp(lt, 0, len - 0.04);
    if (Math.abs(v.currentTime - ct) > 0.002) v.currentTime = ct;
  }
  if (S.anim) S.anim(pg, t);
}

/* ---------- проверка вёрстки (в финальном состоянии) ---------- */
function qaPage(pg){
  const out = [], R = el => el.getBoundingClientRect(), P = R(pg), k = PW/P.width;
  const rr = el => { const r = R(el); return { l: (r.left - P.left)*k, t: (r.top - P.top)*k, r: (r.right - P.left)*k, b: (r.bottom - P.top)*k, w: r.width*k, h: r.height*k }; };
  const name = el => (el.dataset.n || el.className || el.tagName).toString().slice(0, 40);
  const blocks = $$(pg, '.blk, .h');
  blocks.forEach(el => { const r = rr(el); if (r.w === 0 || el.classList.contains('ph')) return;
    if (r.l < M - 16 || r.r > PW - M + 16 || r.t < 56 || r.b > (el.classList.contains('low') ? PH - 40 : PH - 110)) out.push(`за полями: ${name(el)} [${Math.round(r.l)},${Math.round(r.t)}–${Math.round(r.r)},${Math.round(r.b)}]`); });
  for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++){
    const a = blocks[i], b = blocks[j]; if (a.contains(b) || b.contains(a) || a.dataset.ov || b.dataset.ov) continue;
    const A = rr(a), B = rr(b); const ix = Math.min(A.r, B.r) - Math.max(A.l, B.l), iy = Math.min(A.b, B.b) - Math.max(A.t, B.t);
    if (ix > 2 && iy > 2) out.push(`наезд: ${name(a)} × ${name(b)} (${Math.round(ix)}×${Math.round(iy)})`);
  }
  $$(pg, '.blk *').forEach(el => { if (el.closest('[data-qa-skip], .mnum')) return; const cs = getComputedStyle(el);
    if ((cs.overflow === 'hidden' || cs.whiteSpace === 'nowrap') && el.scrollWidth - el.clientWidth > 2 && el.clientWidth > 0 && !el.closest('.scr, .body, svg')) out.push(`текст шире блока: ${el.textContent.trim().slice(0, 30)}`);
    if (cs.overflow === 'hidden' && el.scrollHeight - el.clientHeight > 2 && el.clientHeight > 0 && !el.closest('.scr, .body, svg') && !el.classList.contains('w')) out.push(`обрезан снизу: ${el.textContent.trim().slice(0, 30)}`);
  });
  // дети не вылезают из своей карточки
  $$(pg, '.card').forEach(cd => { const C = rr(cd); $$(cd, '*').forEach(el => { if ((el.closest('svg') && el.tagName !== 'svg') || el.closest('[data-qa-skip]')) return; const r = rr(el); if (r.w === 0 || r.h === 0) return;
    if (r.b > C.b + 1.5 || r.r > C.r + 1.5 || r.l < C.l - 1.5) { if (!el.dataset.ov && !el.closest('[data-ov]')) out.push(`вылезает из карточки: ${(el.textContent || el.tagName).trim().slice(0, 28)} (${Math.round(Math.max(r.b - C.b, r.r - C.r, C.l - r.l))}px)`); } }); });
  // фото: графика не должна лежать на лице — верхняя треть фото свободна от других блоков
  $$(pg, '.ph').forEach(ph => { const F = rr(ph); const face = { l: F.l + F.w*0.15, r: F.r - F.w*0.15, t: F.t, b: F.t + F.h*0.36 };
    blocks.forEach(el => { if (el === ph || el.classList.contains('ph') || ph.contains(el)) return; const A = rr(el); if (!A.w) return;
      const ix = Math.min(A.r, face.r) - Math.max(A.l, face.l), iy = Math.min(A.b, face.b) - Math.max(A.t, face.t);
      if (ix > 12 && iy > 12) out.push(`графика на лице: ${name(el)} × фото (${Math.round(ix)}×${Math.round(iy)})`); }); });
  const src = $(pg, '.src'), sig = $(pg, '.sig');
  if (src && sig){ const A = rr(src), B = rr(sig); if (A.r > B.l - 24) out.push('источник наезжает на подпись'); }
  if (src) blocks.forEach(el => { const A = rr(el), B = rr(src); if (A.b > B.t - 8 && A.r > B.l && A.l < B.r && A.w) out.push(`наезд на источник: ${name(el)}`); });
  return [...new Set(out)];
}
