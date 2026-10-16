// Новый проект карусели из шаблона: brand.json + slides/demo.js + caption/ + assets/.
const fs = require('fs'), path = require('path');
const TPL = path.resolve(__dirname, '../templates/project');

function copyDir(src, dst){
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })){
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else if (!fs.existsSync(d)) fs.copyFileSync(s, d);
  }
}
function init({ dir, name, role, label, swipe, force = false }){
  dir = path.resolve(dir);
  const brandFile = path.join(dir, 'brand.json');
  if (fs.existsSync(brandFile) && !force) throw new Error(`${brandFile} уже есть — проект создан раньше. Правьте brand.json руками или добавьте --force.`);
  copyDir(TPL, dir);
  const brand = JSON.parse(fs.readFileSync(path.join(TPL, 'brand.json'), 'utf8'));
  if (name) brand.name = name; if (role !== undefined) brand.role = role; if (label !== undefined) brand.label = label; if (swipe) brand.swipe = swipe;
  fs.writeFileSync(brandFile, JSON.stringify(brand, null, 2) + '\n');
  return { dir, brand };
}
module.exports = { init };
