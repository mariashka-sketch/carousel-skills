# DSL слайдов — справочник

Холст 1080×1350. Координаты в пикселях от левого верхнего угла. Константы: `PW = 1080`,
`PH = 1350`, `M = 80` (поля). Рабочая область по вертикали: от 186 (под рубрикой) до ~1200
(над подписью). Время в секундах от начала слайда; `at` — когда элемент появляется.

```js
CAR('set', 'Название карусели');            // один раз в начале файла
CS('set', { kick, h, hat, hs, hw, dur, bare, label, parts: [ ... ] });   // на каждый слайд
```

| Поле CS | Значение |
|---|---|
| `kick` | рубрика капсом над заголовком («Что делать») |
| `h` | заголовок; `*слово*` — акцент градиентом, `**слово**` — жёлтый; `\n` — перенос |
| `hat` | когда начинается заголовок (0.35) |
| `hs` | свой CSS для заголовка: `'top:700px;width:920px;font-size:78px'` |
| `hw` | финальный вес шрифта заголовка (600; хук — 800) |
| `dur` | длительность слайда, с (8.5). Хук 7–8, насыщенный слайд 9–10 |
| `bare` | `true` — без счётчика и «листайте» (для промо) |
| `label` | плашка слева сверху для этого слайда; по умолчанию `BRAND.label` |
| `parts` | массив компонентов ниже |

Заголовок по умолчанию стоит на `top:186px; width:920px; font-size:60px`. Для хука без
`kick` задай `hs` с крупным кеглем и `hw: 800`. Если заголовок в `parts` (как на хуке), пиши
`{ html: H('текст', at, style, '', weight) }`.

## Компоненты (`parts`)

Все принимают `x, y, w` (по умолчанию `x = M`, `w = PW − 2M`) и `at`.

| Компонент | Для чего | Ключевые параметры |
|---|---|---|
| `TX({ y, html, cls, at, w })` | абзац | `cls`: `''` 30px, `lead`, `mu` (приглушённый 26px), `xl` 36px; в html: `<b>`, `<span class="y">` жёлтый, `<span class="p">` персиковый |
| `BIG({ y, html })` | крупная фраза 50px | `fx: 'blur'` |
| `ROWS({ y, items, step })` | пункты со значком | `items: [{ ic, t, d, ib }]`; `ib`: `yl`, `gl`, `mi`, `rd`; `num: true` — номера вместо значков |
| `CARDS({ y, items, cols, h })` | сетка карточек | `items: [{ ic, t, d, n, c }]`; `c: 'hot'|'yl'|'wh'` |
| `STATS({ y, items, cols })` | цифры бегут от нуля | `items: [{ v: '70 %', to: 70, suf: ' %', pre: '', dec: 0, l: 'подпись', ring: true, src }]` |
| `STEPS({ y, items, r })` | шаги с соединителем | `items: [{ ic|n, t, d }]`, 3–4 шага |
| `CHECK({ y, items })` | чек-лист с галочками | `items: ['текст', …]`, `num: false` без номеров |
| `SHIFT({ y, rows })` | было → стало | `rows: [{ a: 'было', b: 'стало' }]` |
| `BANNER({ y, text, lab, ic, v })` | плашка-вывод | `v: 'hot'|'yl'|'ok'|'no'` |
| `CHIPS({ y, items, lab })` | теги | `items: ['текст' или { ic, t, v }]` |
| `PHOTO({ src, x, y, w, h, bust })` | фото человека с аурой | PNG с прозрачным фоном из `assets/photo/`; `bust: true` — по грудь, обрезка снизу |
| `IMG({ src, x, y, w, h, fit })` | картинка в рамке | из `assets/img/` |
| `SHOTW({ src, x, y, w, h })` | окно браузера со скриншотом | из `assets/img/` |
| `PHONE({ x, y, w, h, src | video })` | телефон | `video: { src, from, len, loop }` из `assets/vid/` |
| `PART({ g, cx, cy, size, step })` | частицы собираются в фигуру | `g`: текст (`'11:00'`, `'5'`), `'@house'`, `'@cards'`, `'@key'`; `g2, at2` — перестроение во вторую фигуру |
| `OFFER({ y, lab, title, line, note, ic })` | карточка предложения на финале | |
| `QUESTION({ y, text, w })` | вопрос для комментариев | |
| `RAW(html, { x, y, w, h, at, fx })` | своя вёрстка | классы из `engine/style.css`: `card`, `card hot`, `lbl`, `pl yl`, `ib` |

Значки `ic` (из `engine/icons.js`): user users chat phone mail eye shield lock key heart star
clock hourglass calendar megaphone target brain compass route funnel magnet bolt warn check
cross question bulb doc pen mic video play sparkle chip layers loop link door home building
coin chartUp chartDown scale stop search globe server laptop smartphone card plug box gavel
book list wave fire battery mask finger anchor stairs seed gift tag crown flag frame film
translate twin music scissors keyframes grid infinity arrowR steps cart ruble eraser sun face
hand share bookmark comment refresh pin wallet bot scan sliders.

Эффекты появления `fx`: `up` (по умолчанию), `down`, `left`, `right`, `fade`, `blur`, `pop`,
`zoom`, `wipe`, `wipeUp`, `drop`, `flip`, `show`.

## Тайминг

Рубрика 0.15 → заголовок 0.35 (слова по 0.055 с) → первый блок ~1.0 → пункты с шагом
0.22–0.35 → вывод/плашка ~2.5–3.5. Всё должно появиться к `dur − 2`, чтобы финальный кадр
подержался. Длинный список из 5 пунктов — `dur: 9.5`.

## Раскладка по вертикали (ориентиры)

- Заголовок в 2 строки занимает 186–330. Первый блок — с `y: 400`.
- `ROWS` из 4 пунктов с `d` ≈ 4×110 + отступы ≈ 500 px → заканчивается у 900.
- `STATS` в 2 колонки ≈ 220 px; `STEPS` ≈ 260 px; `CHECK` из 3 ≈ 230 px.
- Нижняя граница контента — 1200 (подпись на 1250–1300). QA ругается на `за полями`, если
  ниже 1240.
- Фото человека справа: `PHOTO({ x: 600, y: 250, w: 480, h: 1100 })` — текст тогда слева
  `w: 480`. Ничего не ставить в верхнюю треть фото (лицо).

## Пример хука

```js
CS('ipoteka', { dur: 8, parts: [
  PART({ g: '%', cx: 300, cy: 380, size: 380, step: 8, at: 0.2 }),
  { html: H('Ставка упала.\n*Брать?*', 1.3, 'top:610px;width:520px;font-size:80px;line-height:1.06;letter-spacing:-.035em', '', 800) },
  TX({ y: 840, w: 470, html: 'Три случая, когда ждать дальше — дороже. <span class="y">Листайте.</span>', at: 2.3 }),
  PHOTO({ src: 'me.png', x: 600, y: 248, w: 480, h: 1102, at: 0.9 }),
] });
```

## Пример финала

```js
CS('ipoteka', { dur: 9, parts: [
  OFFER({ y: 200, at: 0.5, lab: 'Бесплатно', title: 'Расчёт по вашей ситуации', line: 'напишите «расчёт» в директ', note: 'Отвечу в течение дня.' }),
  QUESTION({ y: 700, at: 1.8, text: 'Какая ставка у вас сейчас? Напишите в комментариях.' }),
] });
```
