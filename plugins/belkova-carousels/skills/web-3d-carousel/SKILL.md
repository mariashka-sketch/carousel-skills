---
name: web-3d-carousel
description: "Строит интерактивные 3D-карусели для веба и превью по 12 готовым пресетам (coverflow, dual orbit, concave arc, diagonal descent, depth tunnel, fanned arch, helix, vortex, cylinder marquee, flat fan, peek stack, vertical column). Результат — один HTML-файл без зависимостей. Используй, когда просят: карусель для сайта, 3D-карусель, carousel, coverflow, слайдер карточек, 3D-галерея, крутящееся кольцо картинок, показать готовые слайды каруселью. Для роликов-слайдов в Instagram/Telegram — скилл motion-carousel."
license: MIT
metadata:
  author: Марианна Белькова
  version: "1.1.0"
---

# Web 3D Carousel — библиотека пресетов

Автор пакета: Марианна Белькова, бизнес-тренер в недвижимости. Рядом лежит
`carousel-prompts-ru-en.md` — те же 12 пресетов в виде готовых промтов на русском и
английском: их можно отдать любому ИИ без этого скилла (ChatGPT, Gemini, Claude в браузере)
или показать пользователю, чтобы он выбрал пресет по описанию.

Используй этот скилл, когда пользователь просит сделать карусель, слайдер карточек, 3D-галерею, coverflow, «крутящееся кольцо картинок», «стопку карточек», «туннель из фото» или называет один из пресетов ниже. Результат — один самодостаточный HTML-файл (inline CSS + JS, без библиотек), который точно воспроизводит выбранный пресет.

## Рабочий процесс

1. Определи пресет. Если пользователь назвал его — бери его. Если описал ощущение («как в iTunes», «колода», «бесконечно крутится») — подбери по таблице ниже и скажи, какой выбрал. Если не ясно и пользователь на связи — спроси одним вопросом, предложив 2–3 ближайших.
2. Возьми спецификацию пресета дословно. Все числа (размеры, шаг, угол, радиус, перспектива, easing, длительность) — это контракт, не рекомендация. Пользователь может переопределить любое значение; остальное оставь как в пресете.
3. Подставь контент пользователя (картинки, заголовки). Если контента нет — сгенерируй плейсхолдеры (градиенты + номер карточки) в нужном количестве.
4. Реализуй по правилам из раздела «Правила реализации».
5. Проверь: prefers-reduced-motion, клавиатуру, drag, что размытие делится на масштаб, что джиттер сидированный.
6. Отдай файл пользователю (путь к HTML; в Claude Code — SendUserFile, при необходимости — опубликовать как артефакт). Для превью готовых слайдов из motion-carousel бери картинки `out/<set>-NN.jpg` как карточки пресета Coverflow.

## Таблица выбора

| # | Пресет | Ощущение | Когда брать |
|---|--------|----------|-------------|
| 1 | Coverflow | Пологая дуга, сильный наклон карточек | Классика, галерея обложек, портфолио |
| 2 | Dual orbit | Два плоских кольца, вращаются навстречу | Декоративный hero, логотипы клиентов |
| 3 | Concave arc | Ты стоишь внутри дуги | Иммерсивная витрина, панорама |
| 4 | Diagonal descent | Прямая дорожка с креном, дальние размыты | Редакционный лендинг, кейсы |
| 5 | Depth tunnel | Труба из картинок в 2 ряда | Мудборд, большие коллекции (20+) |
| 6 | Fanned arch | Плоская арка, карточка в фокусе на вершине | Аватары, иконки, круглые карточки |
| 7 | Helix | Винтовая лестница | Много мелких элементов, «wow»-блок |
| 8 | Vortex | Плоское кольцо, карточки растут по кругу | Абстрактный декор, таймлайн |
| 9 | Cylinder marquee | Кольцо с ребра, само крутится | Бегущая строка логотипов/отзывов |
| 10 | Flat fan | Без глубины, «разложено вручную» | Фото-полароиды, живой ряд |
| 11 | Peek stack | Колода, выглядывают края | Сторис, карточки-советы, онбординг |
| 12 | Vertical column | Колонна, листается вниз | Мобильный список, лента |

## Правила реализации (общие для всех пресетов)

- Один файл: HTML + `<style>` + `<script>`. Никаких зависимостей.
- Сцена: контейнер с `perspective: <N>px` из пресета, `transform-style: preserve-3d`. Pitch и roll сцены задаются на обёртке вокруг середины компоновки (`transform-origin: 50% 50%`).
- Позиция карточки считается в JS от `offset = index − focusedIndex` (дробный во время drag/анимации). Для дуги: `angle = offset · stepDeg`, `x = R·sin(angle)`, `z = R·(cos(angle) − 1)` (глубина отрицательная — уходит от зрителя); для перевёрнутой дуги (concave) знак z инвертируется; множитель глубины применяется к z. Для «arc rotation 90°» дуга поворачивается в плоскость экрана: x остаётся, z переходит в y, глубины нет.
- Yaw карточки: `rotateY(±yawMax · clamp(|offset|, 0, 1))` со знаком стороны, когда пресет говорит «yawed»; если «cards follow the curve completely» — карточка поворачивается на свой угол `angle` вдоль дуги (касательная); «75% of the way» — на `0.75·angle`.
- Roll compensation («roll cancelled per card by 1») — карточка получает `rotateZ(−sceneRoll)`, чтобы остаться прямой на наклонённой дорожке.
- Масштаб: `1 / (1 + k·|offset|)`, если задано; иначе только перспектива. Непрозрачность: `1 − step·|offset|`, clamp к 0. Размер-градиент (vortex): `scale *= 1 + g·offset` со знаком.
- Размытие: `blur(px·|offset| / scaleOfCard)` — делить на собственный масштаб карточки, потому что filter вычисляется до трансформации предка.
- Джиттер: только сидированный PRNG (например, mulberry32 с фиксированным seed), никогда `Math.random` — иначе превью и экспорт разойдутся.
- Переход: `transition: transform Dms cubic-bezier(0.32, 0.72, 0, 1), opacity, filter` с длительностью из пресета; во время drag transition отключается.
- Drag: pointer events, инерция (velocity · decay ≈ 0.95 за кадр), затем snap к ближайшей целой карточке, если пресет говорит «snap-to-centre»; «free, without snapping» — оставить где отпустили.
- Управление: тап по карточке центрирует её; ←/→ — на одну карточку; Home/End — к краям; кнопки-стрелки только если пресет их предусматривает; autoplay выключен, кроме случаев, где пресет описывает собственное вращение кольца (dual orbit, cylinder marquee) — это дрейф, а не autoplay, и он тоже останавливается при reduced-motion.
- Замкнутые кольца (helix, vortex, marquee, dual orbit): индекс зациклен по модулю N, карточки за спиной зрителя не скрываются, `backface-visibility: hidden`.
- Доступность: контейнер `role="region" aria-roledescription="carousel"`, каждая карточка `aria-label="N из M"`, фокус клавиатурой на контейнере, живая область для текущего индекса.
- `@media (prefers-reduced-motion: reduce)`: компоновка остаётся в точности той же (дуга, углы, глубина, камера), но смена карточки — кроссфейд 180ms вместо движения; собственный дрейф колец отключён; ничего не движется само.
- Адаптив: сцена масштабируется через `transform: scale()` на обёртке при ширине меньше расчётной, чтобы пропорции пресета не ломались.

## Пресеты — спецификации

Бери текст спецификации как ТЗ. Внутри спецификации «four cards out» — контрольное значение для проверки геометрии.

### 1. Coverflow

Build a 3D coverflow carousel. 14 cards, 288×374px cards with 18px corners. They are laid along a shallow arc, 216px apart — each step advances 4.1° around a circle of radius 3008px, so four cards out the arc has moved 123px in depth. Each card is yawed up to 54° away from the viewer, sign following its side of centre. Scale falls as 1/(1+0.26·n) with distance n from the focused card; opacity falls 0.1 per step. Scene perspective 1800px, no pitch, no roll. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

### 2. Dual orbit

Build a 3D dual orbit carousel. 12 cards, 84×109px cards with 8px corners. They are laid along a ring that closes on itself, 116px apart — each step advances 30° around a circle of radius 222px, so four cards out the arc has moved 332px up the screen. Arc rotation of 90° lays the ring flat in the screen plane, so it reads as a circle of cards on the page rather than as a bowl receding away. Nothing in it has depth. There are 2 concentric rings sharing one centre — ring 1 at 1× the radius, drifting 0.32 cards per second; ring 2 at 2× the radius, drifting −0.32 cards per second. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Cards do not shrink with distance — whatever size change there is comes from perspective alone. Scene perspective 1400px, no pitch, no roll. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum, free, without snapping; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

### 3. Concave arc

Build a 3D concave arc carousel. 7 cards, 200×290px cards with 10px corners. They are laid along a shallow arc, 224px apart — each step advances 13.9° around a circle of radius 924px, so four cards out the arc has moved 344px in depth. That depth is multiplied by 1.1. The curve is inverted: the focused card sits furthest away and the outer cards come toward the viewer, so you are standing inside the arc. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Cards do not shrink with distance — whatever size change there is comes from perspective alone; opacity falls 0.03 per step. Scene perspective 1500px, no pitch, no roll. A move takes 640ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

### 4. Diagonal descent

Build a 3D diagonal descent carousel. 14 cards, 340×432px cards with 18px corners. They sit on a straight track, 280px apart. Cards are not yawed; the scene's roll is cancelled per card by 1, so the track runs diagonally while the cards stay straight. Scale falls as 1/(1+0.43·n) with distance n from the focused card; opacity falls 0.3 per step; blur grows 2px per step, measured in screen pixels — divide by each card's own scale, because a filter resolves before its ancestor's transform. Scene perspective 1400px, no pitch, rolled −18°. A move takes 640ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

### 5. Depth tunnel

Build a 3D depth tunnel carousel. 20 cards, 200×260px cards with 16px corners. They are laid along a deep arc, 190px apart — each step advances 12.6° around a circle of radius 864px, so four cards out the arc has moved 501px in depth. That depth is multiplied by 1.6. The set is split across 2 rows wrapped around the same surface, each row 270px below the one above. Cards are not yawed; cards follow the curve 75% of the way, each partly turned by its own angle around it. Scale falls as 1/(1+0.1·n) with distance n from the focused card; opacity falls 0.16 per step; blur grows 2.8px per step, measured in screen pixels — divide by each card's own scale. Scene perspective 1100px, no pitch, no roll. A move takes 660ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

### 6. Fanned arch

Build a 3D fanned arch carousel. 13 cards, 118×118px cards with 34px corners. They are laid along a deep arc, 128px apart — each step advances 14.4° around a circle of radius 509px, so four cards out the arc has moved 236px up the screen. Arc rotation of 90° stands the bend up in the screen plane as an arch: the focused card at the apex, the rest hanging away down both sides. It is drawn, not projected, so it has no depth. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Scale falls as 1/(1+0.02·n) with distance n from the focused card; opacity falls 0.02 per step. Scene perspective 1400px, no pitch, no roll. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

### 7. Helix

Build a 3D helix carousel. 24 cards, 84×109px cards with 10px corners. They are laid along a ring that closes on itself, 86px apart — each step advances 15° around a circle of radius 328px, so four cards out the arc has moved 164px in depth. The arrangement climbs 320px per full turn, making a helix. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Cards do not shrink with distance — whatever size change there is comes from perspective alone. Scene perspective 3000px, pitched 38° about the middle of the arrangement, no roll. A move takes 720ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

### 8. Vortex

Build a 3D vortex carousel. 18 cards, 108×125px cards with 8px corners. They are laid along a ring that closes on itself, 82px apart — each step advances 20° around a circle of radius 235px, so four cards out the arc has moved 194px up the screen. Arc rotation of 90° lays the ring flat in the screen plane, so it reads as a circle of cards on the page rather than as a bowl receding away. Nothing in it has depth. Cards are not yawed. Cards do not shrink with distance — whatever size change there is comes from perspective alone. On top of that a size gradient of 0.82 runs one way round the ring: scale is multiplied by 1 + 0.0984·offset, so cards grow steadily in one direction and shrink to a speck in the other. Scene perspective 1400px, no pitch, no roll. A move takes 700ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

### 9. Cylinder marquee

Build a 3D cylinder marquee carousel. 24 cards, 114×131px cards with 0px corners. They are laid along a ring that closes on itself, 116px apart — each step advances 15° around a circle of radius 443px, so four cards out the arc has moved 222px in depth. It turns on its own at 0.45 cards per second, continuously. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Cards do not shrink with distance — whatever size change there is comes from perspective alone. Scene perspective 3200px, pitched 10° about the middle of the arrangement, no roll. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum, free, without snapping; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

### 10. Flat fan

Build a 3D flat fan carousel. 16 cards, 170×204px cards with 10px corners. They sit on a straight track, 186px apart. Cards are not yawed. Scale falls as 1/(1+0.05·n) with distance n from the focused card; opacity falls 0.03 per step. A jitter of 0.5 nudges each card up to 9px and tilts it up to 3.5° in the viewing plane, from a seeded random value — the same every load, never Math.random. A size jitter of 0.9 varies card sizes by up to 50% from that same seeded source, so the row reads as hand-laid rather than as a uniform strip. Scene perspective 1400px, no pitch, no roll. A move takes 600ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

### 11. Peek stack

Build a 3D peek stack carousel. 20 cards, 300×402px cards with 26px corners. They are laid along a shallow arc, 44px apart — each step advances 8.1° around a circle of radius 311px, so four cards out the arc has moved 145px in depth. That depth is multiplied by 3. Cards are not yawed. Scale falls as 1/(1+0.42·n) with distance n from the focused card; opacity falls 0.08 per step. A jitter of 0.18 nudges each card up to 3px and tilts it up to 1.3° in the viewing plane, from a seeded random value — the same every load, never Math.random. Scene perspective 2600px, no pitch, no roll. A move takes 600ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

### 12. Vertical column

Build a 3D vertical column carousel. 12 cards, 260×161px cards with 14px corners. They are laid along a shallow arc, 176px apart — each step advances 9° around a circle of radius 1120px, so four cards out the arc has moved 214px in depth. Cards are not yawed; the scene's roll is cancelled per card by 1, so the track runs vertically while the cards stay straight. Scale falls as 1/(1+0.24·n) with distance n from the focused card; opacity falls 0.24 per step; blur grows 1.4px per step, measured in screen pixels — divide by each card's own scale. Scene perspective 1300px, no pitch, rolled 90°. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described and crossfade between cards over 180ms instead of sweeping.

## Кастомизация

Если пользователь просит «как coverflow, но карточки крупнее / больше глубины / без размытия» — меняй только названный параметр и перечисли, что изменилось относительно пресета. Если просит смешать два пресета (например, helix + marquee-дрейф), собери спецификацию в том же формате перед кодом и покажи её пользователю одной строкой.

## Чек-лист перед отдачей

- Числа из пресета совпадают с кодом (размер, шаг, угол, радиус, перспектива, easing, ms).
- Reduced-motion: ничего не движется само, кроссфейд 180ms.
- Клавиатура: ←/→, Home/End, фокус виден.
- Drag с инерцией, snap или free — как в пресете.
- Blur делится на scale; джиттер сидированный.
- Файл открывается без сети и без консольных ошибок.