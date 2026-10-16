/* =====================================================================
   КОМПОНЕНТЫ. Каждый — { html, setup?(pg), anim?(pg,t), fx?(c,t,pg) }.
   Карусель: CAR(id, название) → CS(id, { kick, h, dur, parts }) на каждый слайд.
   Рамка слайда (плашка, счётчик, подпись, «листайте») берётся из BRAND.
   ===================================================================== */
const SETS = {}, SET_TITLES = {};
function CAR(set, title){ SETS[set] = []; SET_TITLES[set] = title; }
// слайд: { kick, h, hs, hat, hw, hc, dur, parts, bare }
function CS(set, o){
  const parts = (o.parts || []).filter(Boolean), list = SETS[set];
  if (!list) throw new Error(`CS('${set}'): сначала CAR('${set}', 'название')`);
  const S = { set, id: `${set}-${list.length + 1}`, theme: 'dark', dur: o.dur || 8.5,
    html(){
      const n = list.length, i = list.indexOf(S) + 1, last = i === n;
      const segs = Array.from({ length: n }, (_, k) => `<b class="${k < i ? 'on' : ''}"></b>`).join('');
      const label = o.label !== undefined ? o.label : BRAND.label;
      return (label ? `<div class="mk"${rv(0.05, 'fade', 0.6)}><i></i>${label}</div>` : '')
        + (o.bare ? '' : `<div class="ctr"${rv(0.1, 'fade', 0.6)}><span>${String(i).padStart(2, '0')}<em> / ${String(n).padStart(2, '0')}</em></span><span class="sg">${segs}</span></div>`)
        + (o.kick ? kick(o.kick, 0.15) : '')
        + (o.h ? H(o.h, o.hat ?? 0.35, o.hs || '', o.hc || '', o.hw || 600) : '')
        + parts.map(p => p.html).join('')
        + `<div class="ft"${rv(0.6, 'fade', 0.8)}><span><b>${BRAND.name}</b>${BRAND.role ? ` · ${BRAND.role}` : ''}</span>${last || o.bare ? '' : `<span class="sw">${BRAND.swipe || 'листайте'} ${CHEV(3, 'run', 44)}</span>`}</div>`;
    },
    setup(pg){ parts.forEach(p => p.setup && p.setup(pg)); },
    anim(pg, t){ parts.forEach(p => p.anim && p.anim(pg, t)); },
  };
  if (parts.some(p => p.fx)) S.fx = (c, t, pg) => parts.forEach(p => p.fx && p.fx(c, t, pg));
  list.push(S); return S;
}

/* ---------- текст ---------- */
const TX = ({ x = M, y, w = PW - 2*M, html, at = 1, cls = '', fx = 'up' }) => ({ html: `<div class="blk tx ${cls}" style="${box(x, y, w)}"${rv(at, fx, 0.8, 24)}>${html}</div>` });
// крупное утверждение на весь слайд
const BIG = ({ x = M, y, w = PW - 2*M, html, at = 1, fx = 'blur' }) => ({ html: `<div class="blk big-q" style="${box(x, y, w)}"${rv(at, fx, 0.9, 30)}>${html}</div>` });

/* ---------- фото с аурой: поднимается из маски, свечение дышит ---------- */
function PHOTO({ src, x, y, w, h, at = 0.9, flip = false, bust = false }){
  const id = uid('ph');
  return {
    html: `<div class="ph blk ${id}${bust ? ' bust' : ''}" style="${box(x, y, w, h)}" data-ov="1" data-qa-skip="1"><i class="halo"></i><img src="assets/photo/${src}" alt=""${flip ? ' style="transform:scaleX(-1)"' : ''}></div>`,
    setup(pg){ const r = $(pg, '.' + id); pg[id] = { r, img: $(r, 'img'), halo: $(r, '.halo') }; },
    anim(pg, t){ const S = pg[id]; if (!S) return;
      const p = eExpo(seg(t, at, 1.1));
      S.r.style.clipPath = p >= 1 ? 'none' : `inset(${((1 - p)*100).toFixed(2)}% -30% -30% -30%)`;
      S.r.style.transform = `translate3d(0,${((1 - p)*60).toFixed(1)}px,0) scale(${(1.05 - 0.05*p).toFixed(4)})`;
      const a = eOut(seg(t, at + 0.3, 1.0)), br = 0.5 + 0.5*Math.sin(t*1.6);
      S.img.style.filter = `drop-shadow(0 0 ${(3 + 2*br).toFixed(1)}px ${hexA(BG.blobs[0], 0.85*a)}) drop-shadow(0 0 ${(18 + 8*br).toFixed(1)}px ${hexA(BG.blobs[3 % BG.blobs.length], 0.7*a)}) drop-shadow(0 0 ${(46 + 14*br).toFixed(1)}px ${hexA(BG.blobs[0], 0.32*a)})`;
      S.halo.style.opacity = f3(a*(0.75 + 0.25*br)); S.halo.style.transform = `scale(${(0.92 + 0.08*br).toFixed(4)})`; }
  };
}
/* ---------- обычная картинка в скруглённой рамке (объект, скриншот, план) ---------- */
const IMG = ({ src, x, y, w, h, at = 0.8, fit = 'cover', fx = 'up', cls = '' }) => ({ html:
  `<div class="blk pic ${cls}" style="${box(x, y, w, h)}" data-qa-skip="1"${rv(at, fx, 0.9, 40)}><img src="assets/img/${src}" alt="" style="object-fit:${fit}"></div>` });
/* ---------- окно браузера со скриншотом ---------- */
const SHOTW = ({ x, y, w, h, src, at = 0.8, crop = '', fx = 'up' }) => ({ html:
  `<div class="blk win" style="${box(x, y, w, h)}" data-qa-skip="1"${rv(at, fx, 0.9, 50)}><div class="bar"><i></i><i></i><i></i></div><div class="body"><img src="assets/img/${src}" alt="" style="${crop}"></div></div>` });
/* ---------- телефон с картинкой или видео (video: { src, from, len, loop }) ---------- */
const PHONE = ({ x, y, w = 360, h = 740, src, video, at = 0.8, fx = 'up' }) => ({ html:
  `<div class="blk phone" style="${box(x, y, w, h)}" data-qa-skip="1"${rv(at, fx, 0.9, 50)}><div class="scr">${video
    ? `<video src="assets/vid/${video.src}" muted playsinline preload="auto" data-from="${video.from ?? at}" data-len="${video.len}"${video.loop ? ' data-loop' : ''}></video>`
    : `<img src="assets/img/${src}" alt="">`}</div></div>` });

/* ---------- частицы: собираются в цифру / слово / фигуру ---------- */
function sampleGlyph(g, cx, cy, size, step){
  const cv = document.createElement('canvas'); cv.width = PW; cv.height = PH;
  const c = cv.getContext('2d'); c.fillStyle = '#fff'; c.strokeStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'; c.lineCap = 'round';
  const u = size/10;
  if (g === '@cards'){ // три карточки карусели веером
    [[-1, -14], [0, 0], [1, 14]].forEach(([k, a]) => { c.save(); c.translate(cx + k*3.2*u, cy + Math.abs(k)*0.6*u); c.rotate(a*Math.PI/180);
      c.lineWidth = 0.9*u; c.beginPath(); c.roundRect(-2.6*u, -3.4*u, 5.2*u, 6.8*u, 0.7*u); c.stroke();
      if (k === 0){ c.fillRect(-1.8*u, -2.4*u, 3.6*u, 0.7*u); c.fillRect(-1.8*u, -1.2*u, 2.6*u, 0.5*u); c.fillRect(-1.8*u, 1.4*u, 3.6*u, 1.4*u); } c.restore(); });
  } else if (g === '@house'){
    c.lineWidth = 1.0*u; c.beginPath(); c.moveTo(cx - 4.4*u, cy - 0.2*u); c.lineTo(cx, cy - 4.4*u); c.lineTo(cx + 4.4*u, cy - 0.2*u); c.stroke();
    c.beginPath(); c.rect(cx - 3.3*u, cy - 0.9*u, 6.6*u, 5.4*u); c.stroke(); c.fillRect(cx - 0.9*u, cy + 1.6*u, 1.8*u, 2.9*u);
    c.fillRect(cx + 1.4*u, cy + 0.2*u, 1.3*u, 1.3*u); c.fillRect(cx - 2.7*u, cy + 0.2*u, 1.3*u, 1.3*u);
  } else if (g === '@key'){
    c.lineWidth = 1.0*u; c.beginPath(); c.arc(cx - 2.4*u, cy, 2.2*u, 0, 6.283); c.stroke();
    c.fillRect(cx - 0.4*u, cy - 0.5*u, 5.2*u, 1.0*u); c.fillRect(cx + 3.6*u, cy - 0.5*u, 1.0*u, 2.2*u); c.fillRect(cx + 1.9*u, cy - 0.5*u, 1.0*u, 1.7*u);
  } else { c.font = `900 ${size}px Unbounded`; c.fillText(g, cx, cy); }
  const d = c.getImageData(0, 0, PW, PH).data, out = [];
  for (let y = 0; y < PH; y += step) for (let x = 0; x < PW; x += step) if (d[(y*PW + x)*4 + 3] > 128) out.push([x, y]);
  return out;
}
function PART({ g, cx, cy, size, step = 9, at = 0.25, dur = 1.5, g2, at2 }){
  const id = uid('pt');
  return {
    html: '',
    setup(pg){ const R = rng(11), a = sampleGlyph(g, cx, cy, size, step);
      let b = null;
      if (g2){ b = sampleGlyph(g2, cx, cy, size, step).sort((p, q) => p[0] - q[0] || p[1] - q[1]); a.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
        const n = Math.max(a.length, b.length), a0 = a.slice(); while (a.length < n) a.push(a0[Math.floor(a.length*a0.length/n)]);
        b = a.map((_, i) => b[Math.floor(i*b.length/a.length)]); }
      pg[id] = a.map(([x, y], i) => ({ tx: x, ty: y, bx: b ? b[i][0] : x, by: b ? b[i][1] : y, sx: R()*PW, sy: R()*PH, d: R()*0.7, ph: R()*6.28, r: 1.4 + R()*1.6 })); },
    fx(c, t, pg){ const P = pg[id]; if (!P) return;
      for (const p of P){
        const k = eIO(seg(t, at + p.d, dur)), m = g2 ? eIO(seg(t, at2 + p.d*0.35, 1.0)) : 0, burst = Math.sin(Math.PI*m);
        const ox = Math.sin(t*0.9 + p.ph)*60*(1 - k), oy = Math.cos(t*0.7 + p.ph)*60*(1 - k);
        let x = lerp(p.sx, p.tx, k) + ox + Math.sin(t*2 + p.ph)*1.3*k, y = lerp(p.sy, p.ty, k) + oy + Math.cos(t*2.3 + p.ph)*1.3*k;
        if (m > 0){ x = lerp(x, p.bx, m) + Math.cos(p.ph)*26*burst; y = lerp(y, p.by, m) + Math.sin(p.ph)*34*burst; }
        const fx = m > 0.5 ? p.bx : p.tx, glow = 0.55 + 0.45*Math.max(0, Math.sin(fx/90 - t*2.2));
        const q = clamp((fx - (cx - size*0.6))/(size*1.2), 0, 1);
        c.fillStyle = `rgba(255,${Math.round(lerp(214, 150, q))},${Math.round(lerp(80, 255, q))},${(0.35 + 0.65*k*glow).toFixed(3)})`;
        c.fillRect(x - p.r, y - p.r, p.r*2, p.r*2);
      }
    }
  };
}

/* ---------- ряды пунктов со значком ---------- */
function ROWS({ x = M, y, w = PW - 2*M, items, at = 1.0, step = 0.22, cls = '', gap = 16, num = false }){
  return { html: `<div class="blk rows ${cls}" style="${box(x, y, w)}gap:${gap}px">${items.map((it, i) => { const a = at + i*step;
    return `<div class="card row ${it.c || ''}"${rv(a, 'left', 0.7, 34)}>${num ? `<span class="rn">${String(i + 1).padStart(2, '0')}</span>` : `<span class="ib ${it.ib || ''}">${IC(it.ic || 'check', a + 0.2)}</span>`}
      <div class="rt">${it.t ? `<b>${it.t}</b>` : ''}${it.d ? `<p>${it.d}</p>` : ''}</div></div>`; }).join('')}</div>` };
}

/* ---------- сетка карточек: значок, заголовок, текст ---------- */
function CARDS({ x = M, y, w = PW - 2*M, cols = 2, gap = 20, items, at = 1.0, step = 0.14, fx = 'up', h, cls = '' }){
  return { html: `<div class="blk cards ${cls}" style="${box(x, y, w, h)}grid-template-columns:repeat(${cols},1fr);gap:${gap}px">${items.map((it, i) => { const a = at + i*step;
    return `<div class="card cd ${it.c || ''}"${rv(a, it.fx || fx, 0.85, 40)}>${it.n ? `<span class="cnn">${it.n}</span>` : ''}${it.ic ? `<span class="ib ${it.ib || ''}">${IC(it.ic, a + 0.25)}</span>` : ''}
      <div class="cbody">${it.t ? `<b class="ct">${it.t}</b>` : ''}${it.d ? `<p class="cx">${it.d}</p>` : ''}</div></div>`; }).join('')}</div>` };
}

/* ---------- цифры: крупное число бежит от нуля ---------- */
function STATS({ x = M, y, w = PW - 2*M, cols, gap = 20, items, at = 1.0, step = 0.18, h, vsz = 76, cls = '' }){
  const id = uid('stats');
  return {
    html: `<div class="blk stats ${id} ${cls}" style="${box(x, y, w, h)}grid-template-columns:repeat(${cols || items.length},1fr);gap:${gap}px;--vsz:${vsz}px">${items.map((it, i) => { const a = at + i*step;
      return `<div class="card stt-${i} sti ${it.c || ''}"${rv(a, 'up', 0.85, 40)}>
        ${it.ring ? `<svg class="rg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" class="rt"/><circle cx="60" cy="60" r="50" class="ra" pathLength="1"/></svg>` : ''}
        <b class="sv">${CNT(it.v, it.to, a + 0.2, it.cd || 1.4, it.dec || 0, it.pre || '', it.suf || '')}</b>
        <p class="sl2">${it.l}</p>${it.src ? `<span class="ss">${it.src}</span>` : ''}</div>`; }).join('')}</div>`,
    setup(pg){ pg[id] = items.map((it, i) => it.ring ? { el: $(pg, `.${id} .stt-${i} .ra`), p: it.to/100, a: at + i*step + 0.2, d: it.cd || 1.4 } : null).filter(Boolean); },
    anim(pg, t){ (pg[id] || []).forEach(r => { r.el.style.strokeDasharray = `${(r.p*eOut(seg(t, r.a, r.d))).toFixed(4)} 1`; }); }
  };
}

/* ---------- шаги с соединителем и бегущей точкой ---------- */
function STEPS({ x = M, y, w = PW - 2*M, items, at = 1.0, step = 0.3, r = 38, tw, cls = '' }){
  const id = uid('steps'), n = items.length, cw = w/n, cy = r + 4;
  const pts = items.map((_, i) => cw*i + cw/2);
  const segs = pts.slice(1).map((px2, i) => `<path class="cl" d="M${pts[i] + r + 8} ${cy} L${px2 - r - 8} ${cy}" pathLength="1" data-draw="${at + i*step + 0.25},${step}"/>`).join('');
  return {
    html: `<div class="blk steps ${id} ${cls}" style="${box(x, y, w)}">
      <svg class="sc" viewBox="0 0 ${w} ${cy*2}" width="${w}" height="${cy*2}">${segs}<circle class="tr" r="9"/></svg>
      ${items.map((it, i) => `<div class="sp" style="left:${pts[i] - (tw || cw)/2}px;width:${tw || cw}px"${rv(at + i*step, 'up', 0.7, 26)}>
        <span class="sn" style="width:${r*2}px;height:${r*2}px">${it.ic ? IC(it.ic, at + i*step + 0.2) : `<b>${it.n || String(i + 1).padStart(2, '0')}</b>`}</span>
        ${it.t ? `<b class="stt">${it.t}</b>` : ''}${it.d ? `<p class="std">${it.d}</p>` : ''}</div>`).join('')}</div>`,
    setup(pg){ const root = $(pg, '.' + id); pg[id] = { tr: $(root, '.tr') }; },
    anim(pg, t){ const S = pg[id]; if (!S || !S.tr) return; const end = at + (n - 1)*step + 0.6;
      const u = frac((t - end)/(1.2*n)), on = seg(t, end, 0.4);
      S.tr.setAttribute('cx', lerp(pts[0], pts[n - 1], eIO(u)).toFixed(1)); S.tr.setAttribute('cy', cy); S.tr.style.opacity = f3(on*Math.sin(Math.PI*u)); }
  };
}

/* ---------- чек-лист: пункты с галочкой ---------- */
function CHECK({ x = M, y, w = PW - 2*M, items, at = 1.0, step = 0.22, num = true, cls = '', gap = 16 }){
  return { html: `<div class="blk check ${cls}" style="${box(x, y, w)}gap:${gap}px">${items.map((it, i) => { const a = at + i*step;
    return `<div class="card ck"${rv(a, 'left', 0.7, 30)}>${num ? `<span class="kn">${String(i + 1).padStart(2, '0')}</span>` : ''}<span class="kt">${it}</span><span class="kb"${rv(a + 0.45, 'pop', 0.5)}>${IC('check', a + 0.5, '', 0.4)}</span></div>`; }).join('')}</div>` };
}

/* ---------- «было → стало» ---------- */
function SHIFT({ x = M, y, w = PW - 2*M, rows, at = 1.0, step = 0.55, cls = '' }){
  return { html: `<div class="blk shift ${cls}" style="${box(x, y, w)}">${rows.map((r, i) => { const a = at + i*step;
    return `<div class="card sr"${rv(a, 'up', 0.7, 24)}><div class="sa"><span>${r.a}</span><i class="sk"${rv(a + 0.55, 'wipe', 0.45)}></i></div>
      <svg class="sar" viewBox="0 0 70 24"><path d="M2 12h60" pathLength="1" data-draw="${a + 0.75},0.35"/><path d="M52 3l10 9-10 9" pathLength="1" data-draw="${a + 0.95},0.25"/></svg>
      <div class="sb"${rv(a + 1.0, 'left', 0.7, 26)}>${r.b}</div></div>`; }).join('')}</div>` };
}

/* ---------- плашки и чипы ---------- */
const BANNER = ({ x = M, y, w = PW - 2*M, lab, text, at = 2, v = 'hot', ic, fx = 'wipe', cls = '' }) => ({ html:
  `<div class="blk card bn ${v} ${cls}" style="${box(x, y, w)}"${rv(at, fx, 0.9, 30)}>${ic ? `<span class="ib ${v === 'yl' ? '' : 'yl'}">${IC(ic, at + 0.3)}</span>` : CHEV(3, 'run', 66)}<div>${lab ? `<span class="lbl yl">${lab}</span>` : ''}<p>${text}</p></div></div>` });
function CHIPS({ x = M, y, w = PW - 2*M, items, at = 1.5, step = 0.08, lab, cls = '' }){
  return { html: `<div class="blk chips ${cls}" style="${box(x, y, w)}">${lab ? `<span class="lbl"${rv(at - 0.2, 'fade', 0.5)}>${lab}</span>` : ''}${items.map((c, i) =>
    `<span class="pl ${typeof c === 'string' ? 'gl' : (c.v || 'gl')}"${rv(at + i*step, 'pop', 0.6)}>${typeof c === 'string' ? c : `${c.ic ? IC(c.ic, at + i*step + 0.2, 'ci') : ''}${c.t}`}</span>`).join('')}</div>` };
}

/* ---------- финал: карточка предложения + вопрос в комментарии ---------- */
function OFFER({ y = 300, at = 0.7, lab = 'Предложение', title, line, note, x = M, w = PW - 2*M, ic = 'sparkle' }){
  return { html: `<div class="blk card hot ofr" style="${box(x, y, w)}"${rv(at, 'up', 0.9, 40)}>
    <span class="lbl yl">${lab}</span>
    <b class="mt">${title}</b>
    ${line ? `<div class="mw"><span class="pl yl">${IC(ic, at + 0.5)}${line}</span></div>` : ''}
    ${note ? `<p class="mn">${note}</p>` : ''}</div>` };
}
function QUESTION({ y, text, at = 2.4, w = PW - 2*M, x = M }){
  return { html: `<div class="blk qb" style="${box(x, y, w)}"${rv(at, 'up', 0.8, 30)}><span class="ib yl">${IC('comment', at + 0.2)}</span><p>${text}</p></div>` };
}
/* ---------- произвольная HTML-вставка (для ручной вёрстки) ---------- */
const RAW = (html, { x = M, y = 0, w, h, at = 1, fx = 'up', cls = '' } = {}) => ({ html: `<div class="blk ${cls}" style="${box(x, y, w, h)}"${rv(at, fx, 0.8, 30)}>${html}</div>` });
