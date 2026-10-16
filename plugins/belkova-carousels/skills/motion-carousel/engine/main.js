/* =====================================================================
   РЕЖИМЫ
   ?set=demo&slide=N&anim=1 — слайд для рендера (window.seek(t), window.__qa())
   ?set=demo&slide=N&play=1 — слайд играет по кругу
   без параметров           — все карусели сеткой, клик — проиграть слайд
   ===================================================================== */
const QS = new URLSearchParams(location.search);
function makePage(S){
  const el = document.createElement('div');
  el.className = 'page'; el.dataset.theme = 'dark'; el.dataset.id = S.id;
  el.innerHTML = '<canvas class="bg"></canvas>' + S.html();
  return el;
}
const fontsReady = Promise.all(['300 60px "Unbounded"', '600 60px "Unbounded"', '900 60px "Unbounded"', '500 30px "Manrope"', '800 30px "Manrope"'].map(f => document.fonts.load(f))).then(() => document.fonts.ready);
window.__sets = Object.fromEntries(Object.keys(SETS).map(k => [k, { title: SET_TITLES[k], n: SETS[k].length, dur: SETS[k].map(s => s.dur) }]));
if (QS.has('slide')){
  document.body.classList.add('export');
  const set = QS.get('set') || Object.keys(SETS)[0], list = SETS[set];
  if (!list){ document.body.innerHTML = `<pre style="color:#fff;padding:40px">нет карусели «${set}». Есть: ${Object.keys(SETS).join(', ')}</pre>`; window.__error = `нет карусели ${set}`; }
  else {
    const i = clamp(parseInt(QS.get('slide'), 10) - 1, 0, list.length - 1), S = list[i];
    window.__n = list.length;
    fontsReady.then(() => {
      const pg = makePage(S); document.getElementById('exportHost').appendChild(pg);
      prepare(pg, S, window.devicePixelRatio || 1);
      window.__dur = S.dur; window.__page = pg;
      window.seek = t => seekPage(pg, +t);
      window.__qa = () => { seekPage(pg, S.dur); return qaPage(pg); };
      if (QS.get('play')){ const t0 = performance.now(); (function loop(){ window.seek(((performance.now() - t0)/1000) % (S.dur + 1.5)); requestAnimationFrame(loop); })(); }
      else window.seek(QS.get('anim') ? 0 : S.dur);
      window.__ready = true;
    });
  }
} else {
  document.getElementById('exportHost').style.display = 'none';
  const grid = document.getElementById('grid'); grid.style.display = 'flex';
  fontsReady.then(() => Object.keys(SETS).forEach(k => {
    const h = document.createElement('div'); h.className = 'set'; h.textContent = `${SET_TITLES[k]} (${k})`; grid.appendChild(h);
    SETS[k].forEach((S, i) => { const th = document.createElement('div'); th.className = 'th'; const pg = makePage(S);
      $$(pg, 'video').forEach(v => { v.removeAttribute('src'); v.load(); });
      th.appendChild(pg); grid.appendChild(th); prepare(pg, S, 0.3); seekPage(pg, S.dur);
      th.addEventListener('click', () => open(`?set=${k}&slide=${i + 1}&play=1`, '_blank')); });
  }));
}
