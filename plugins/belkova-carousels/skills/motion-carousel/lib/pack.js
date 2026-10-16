// Упаковка: out/<set>-NN.mp4|jpg → «к публикации/<название>/01.mp4…», «картинки/01.jpg…», «пост.txt».
const fs = require('fs'), path = require('path');
const safe = s => s.replace(/[\\/:*?"<>|]+/g, '–').replace(/\s+/g, ' ').trim().slice(0, 80);

function pack({ project, set, dest }){
  project = path.resolve(project);
  const sets = JSON.parse(fs.readFileSync(path.join(project, 'out', 'sets.json'), 'utf8'));
  const keys = set ? [set] : Object.keys(sets);
  const root = dest ? path.resolve(dest) : path.join(project, 'к публикации');
  const report = [];
  for (const k of keys){
    if (!sets[k]) throw new Error(`нет карусели «${k}». Есть: ${Object.keys(sets).join(', ')}`);
    const d = path.join(root, safe(sets[k] || k)); fs.mkdirSync(path.join(d, 'картинки'), { recursive: true });
    const files = fs.readdirSync(path.join(project, 'out'));
    const re = new RegExp(`^${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-(\\d\\d)(-story|-wide)?\\.(mp4|jpg)$`);
    let vids = 0, imgs = 0, bytes = 0;
    for (const f of files){ const m = re.exec(f); if (!m) continue;
      const src = path.join(project, 'out', f), num = m[1], sfx = m[2] || '';
      if (m[3] === 'mp4'){ fs.copyFileSync(src, path.join(d, `${num}${sfx}.mp4`)); vids++; bytes += fs.statSync(src).size; }
      else { fs.copyFileSync(src, path.join(d, 'картинки', `${num}${sfx}.jpg`)); imgs++; }
    }
    const cap = [path.join(project, 'caption', `${k}.txt`), path.join(project, 'caption', `${k}.md`)].find(f => fs.existsSync(f));
    if (cap) fs.copyFileSync(cap, path.join(d, 'пост.txt'));
    report.push({ set: k, dir: d, videos: vids, images: imgs, mb: +(bytes/1048576).toFixed(1), caption: !!cap });
  }
  return { root, report };
}
module.exports = { pack };
