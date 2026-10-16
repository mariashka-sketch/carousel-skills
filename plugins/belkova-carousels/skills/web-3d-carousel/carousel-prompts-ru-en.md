# Коллекция промтов для веб-каруселей

---

## 1. Coverflow
Пологая дуга, сильный наклон карточек — та самая карусель, которую знают все.

### Промт (RU)

Создай 3D-карусель в стиле coverflow. 14 карточек размером 288×374px со скруглением углов 18px. Карточки выложены вдоль пологой дуги с шагом 216px — каждый шаг продвигается на 4,1° по окружности радиусом 3008px, так что через четыре карточки дуга уходит на 123px в глубину. Каждая карточка повёрнута по оси Y (yaw) до 54° от зрителя, знак поворота зависит от стороны относительно центра. Масштаб убывает как 1/(1+0,26·n), где n — расстояние от карточки в фокусе; непрозрачность падает на 0,1 за шаг. Перспектива сцены 1800px, без наклона (pitch) и крена (roll). Переход занимает 620ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; кнопки-стрелки; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D coverflow carousel. 14 cards, 288×374px cards with 18px corners. They are laid along a shallow arc, 216px apart — each step advances 4.1° around a circle of radius 3008px, so four cards out the arc has moved 123px in depth. Each card is yawed up to 54° away from the viewer, sign following its side of centre. Scale falls as 1/(1+0.26·n) with distance n from the focused card; opacity falls 0.1 per step. Scene perspective 1800px, no pitch, no roll. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 2. Dual orbit
Два кольца на разных радиусах, вращающиеся в противоположные стороны.

### Промт (RU)

Создай 3D-карусель с двойной орбитой. 12 карточек размером 84×109px со скруглением углов 8px. Они выложены вдоль замкнутого кольца с шагом 116px — каждый шаг продвигается на 30° по окружности радиусом 222px, так что через четыре карточки дуга уходит на 332px вверх по экрану. Поворот дуги на 90° укладывает кольцо плоско в плоскость экрана, поэтому оно читается как круг из карточек на странице, а не как чаша, уходящая вглубь. Ничто в нём не имеет глубины. Есть 2 концентрических кольца с общим центром — кольцо 1 на радиусе 1×, дрейфует со скоростью 0,32 карточки в секунду; кольцо 2 на радиусе 2×, дрейфует со скоростью -0,32 карточки в секунду. Карточки не повёрнуты по оси Y (yaw); карточки полностью следуют кривой, каждая повёрнута на свой угол вдоль дуги так, чтобы оставаться касательной к ней. Карточки не уменьшаются с расстоянием — любое изменение размера идёт только от перспективы. Перспектива сцены 1400px, без наклона (pitch) и крена (roll). Переход занимает 620ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией, свободное, без примагничивания; без кнопок-стрелок; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D dual orbit carousel. 12 cards, 84×109px cards with 8px corners. They are laid along a ring that closes on itself, 116px apart — each step advances 30° around a circle of radius 222px, so four cards out the arc has moved 332px up the screen. Arc rotation of 90° lays the ring flat in the screen plane, so it reads as a circle of cards on the page rather than as a bowl receding away. Nothing in it has depth. There are 2 concentric rings sharing one centre — ring 1 at 1× the radius, drifting 0.32 cards per second; ring 2 at 2× the radius, drifting -0.32 cards per second. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Cards do not shrink with distance — whatever size change there is comes from perspective alone. Scene perspective 1400px, no pitch, no roll. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum, free, without snapping; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 3. Concave arc
Перевёрнутая дуга: ты стоишь внутри кривой, и она огибает тебя.

### Промт (RU)

Создай 3D-карусель с вогнутой дугой. 7 карточек размером 200×290px со скруглением углов 10px. Они выложены вдоль пологой дуги с шагом 224px — каждый шаг продвигается на 13,9° по окружности радиусом 924px, так что через четыре карточки дуга уходит на 344px в глубину. Эта глубина умножается на 1,1. Кривая перевёрнута: карточка в фокусе находится дальше всего, а крайние карточки приближаются к зрителю, так что ты стоишь внутри дуги. Карточки не повёрнуты по оси Y (yaw); карточки полностью следуют кривой, каждая повёрнута на свой угол вдоль дуги так, чтобы оставаться касательной к ней. Карточки не уменьшаются с расстоянием — любое изменение размера идёт только от перспективы; непрозрачность падает на 0,03 за шаг. Перспектива сцены 1500px, без наклона (pitch) и крена (roll). Переход занимает 640ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; кнопки-стрелки; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D concave arc carousel. 7 cards, 200×290px cards with 10px corners. They are laid along a shallow arc, 224px apart — each step advances 13.9° around a circle of radius 924px, so four cards out the arc has moved 344px in depth. That depth is multiplied by 1.1. The curve is inverted: the focused card sits furthest away and the outer cards come toward the viewer, so you are standing inside the arc. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Cards do not shrink with distance — whatever size change there is comes from perspective alone; opacity falls 0.03 per step. Scene perspective 1500px, no pitch, no roll. A move takes 640ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 4. Diagonal descent
Прямая дорожка с креном: карточки взбираются наискось через экран.

### Промт (RU)

Создай 3D-карусель с диагональным спуском. 14 карточек размером 340×432px со скруглением углов 18px. Они сидят на прямой дорожке с шагом 280px. Карточки не повёрнуты по оси Y (yaw); крен сцены компенсируется у каждой карточки с коэффициентом 1, так что дорожка идёт по диагонали, а карточки остаются прямыми. Масштаб убывает как 1/(1+0,43·n), где n — расстояние от карточки в фокусе; непрозрачность падает на 0,3 за шаг; размытие растёт на 2px за шаг, измеряется в экранных пикселях — дели на собственный масштаб каждой карточки, потому что фильтр вычисляется до трансформации предка. Перспектива сцены 1400px, без наклона (pitch), крен -18°. Переход занимает 640ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; кнопки-стрелки; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — кривую, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D diagonal descent carousel. 14 cards, 340×432px cards with 18px corners. They sit on a straight track, 280px apart. Cards are not yawed; the scene's roll is cancelled per card by 1, so the track runs diagonally while the cards stay straight. Scale falls as 1/(1+0.43·n) with distance n from the focused card; opacity falls 0.3 per step; blur grows 2px per step, measured in screen pixels — divide by each card's own scale, because a filter resolves before its ancestor's transform. Scene perspective 1400px, no pitch, rolled -18°. A move takes 640ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 5. Depth tunnel
Внутри трубы из картинок, дальние растворяются в размытии.

### Промт (RU)

Создай 3D-карусель «туннель в глубину». 20 карточек размером 200×260px со скруглением углов 16px. Они выложены вдоль глубокой дуги с шагом 190px — каждый шаг продвигается на 12,6° по окружности радиусом 864px, так что через четыре карточки дуга уходит на 501px в глубину. Эта глубина умножается на 1,6. Набор разделён на 2 ряда, обёрнутых вокруг одной поверхности, каждый ряд на 270px ниже предыдущего. Карточки не повёрнуты по оси Y (yaw); карточки следуют кривой на 75%, каждая частично повёрнута на свой угол вдоль неё. Масштаб убывает как 1/(1+0,1·n), где n — расстояние от карточки в фокусе; непрозрачность падает на 0,16 за шаг; размытие растёт на 2,8px за шаг, измеряется в экранных пикселях — дели на собственный масштаб каждой карточки, потому что фильтр вычисляется до трансформации предка. Перспектива сцены 1100px, без наклона (pitch) и крена (roll). Переход занимает 660ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; без кнопок-стрелок; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D depth tunnel carousel. 20 cards, 200×260px cards with 16px corners. They are laid along a deep arc, 190px apart — each step advances 12.6° around a circle of radius 864px, so four cards out the arc has moved 501px in depth. That depth is multiplied by 1.6. The set is split across 2 rows wrapped around the same surface, each row 270px below the one above. Cards are not yawed; cards follow the curve 75% of the way, each partly turned by its own angle around it. Scale falls as 1/(1+0.1·n) with distance n from the focused card; opacity falls 0.16 per step; blur grows 2.8px per step, measured in screen pixels — divide by each card's own scale, because a filter resolves before its ancestor's transform. Scene perspective 1100px, no pitch, no roll. A move takes 660ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 6. Fanned arch
Арка из карточек, изгибающаяся вверх над серединой страницы.

### Промт (RU)

Создай 3D-карусель «веерная арка». 13 карточек размером 118×118px со скруглением углов 34px. Они выложены вдоль глубокой дуги с шагом 128px — каждый шаг продвигается на 14,4° по окружности радиусом 509px, так что через четыре карточки дуга уходит на 236px вверх по экрану. Поворот дуги на 90° ставит изгиб вертикально в плоскости экрана в виде арки: карточка в фокусе на вершине, остальные свисают вниз по обеим сторонам. Она нарисована, а не спроецирована, поэтому не имеет глубины. Карточки не повёрнуты по оси Y (yaw); карточки полностью следуют кривой, каждая повёрнута на свой угол вдоль дуги так, чтобы оставаться касательной к ней. Масштаб убывает как 1/(1+0,02·n), где n — расстояние от карточки в фокусе; непрозрачность падает на 0,02 за шаг. Перспектива сцены 1400px, без наклона (pitch) и крена (roll). Переход занимает 620ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; без кнопок-стрелок; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D fanned arch carousel. 13 cards, 118×118px cards with 34px corners. They are laid along a deep arc, 128px apart — each step advances 14.4° around a circle of radius 509px, so four cards out the arc has moved 236px up the screen. Arc rotation of 90° stands the bend up in the screen plane as an arch: the focused card at the apex, the rest hanging away down both sides. It is drawn, not projected, so it has no depth. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Scale falls as 1/(1+0.02·n) with distance n from the focused card; opacity falls 0.02 per step. Scene perspective 1400px, no pitch, no roll. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 7. Helix
Кольцо, которое поднимается при вращении — винтовая лестница из изображений.

### Промт (RU)

Создай 3D-карусель «спираль». 24 карточки размером 84×109px со скруглением углов 10px. Они выложены вдоль замкнутого кольца с шагом 86px — каждый шаг продвигается на 15° по окружности радиусом 328px, так что через четыре карточки дуга уходит на 164px в глубину. Компоновка поднимается на 320px за полный оборот, образуя спираль. Карточки не повёрнуты по оси Y (yaw); карточки полностью следуют кривой, каждая повёрнута на свой угол вдоль дуги так, чтобы оставаться касательной к ней. Карточки не уменьшаются с расстоянием — любое изменение размера идёт только от перспективы. Перспектива сцены 3000px, наклон (pitch) 38° вокруг середины компоновки, без крена (roll). Переход занимает 720ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; без кнопок-стрелок; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D helix carousel. 24 cards, 84×109px cards with 10px corners. They are laid along a ring that closes on itself, 86px apart — each step advances 15° around a circle of radius 328px, so four cards out the arc has moved 164px in depth. The arrangement climbs 320px per full turn, making a helix. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Cards do not shrink with distance — whatever size change there is comes from perspective alone. Scene perspective 3000px, pitched 38° about the middle of the arrangement, no roll. A move takes 720ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 8. Vortex
Кольцо, где карточки нарастают по кругу в одну сторону — от крошечных до огромных.

### Промт (RU)

Создай 3D-карусель «вихрь». 18 карточек размером 108×125px со скруглением углов 8px. Они выложены вдоль замкнутого кольца с шагом 82px — каждый шаг продвигается на 20° по окружности радиусом 235px, так что через четыре карточки дуга уходит на 194px вверх по экрану. Поворот дуги на 90° укладывает кольцо плоско в плоскость экрана, поэтому оно читается как круг из карточек на странице, а не как чаша, уходящая вглубь. Ничто в нём не имеет глубины. Карточки не повёрнуты по оси Y (yaw). Карточки не уменьшаются с расстоянием — любое изменение размера идёт только от перспективы. Поверх этого по кольцу в одну сторону идёт градиент размера 0,82: масштаб умножается на 1 + 0,0984·offset, так что карточки стабильно растут в одном направлении и сжимаются до точки в другом. Перспектива сцены 1400px, без наклона (pitch) и крена (roll). Переход занимает 700ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; без кнопок-стрелок; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D vortex carousel. 18 cards, 108×125px cards with 8px corners. They are laid along a ring that closes on itself, 82px apart — each step advances 20° around a circle of radius 235px, so four cards out the arc has moved 194px up the screen. Arc rotation of 90° lays the ring flat in the screen plane, so it reads as a circle of cards on the page rather than as a bowl receding away. Nothing in it has depth. Cards are not yawed. Cards do not shrink with distance — whatever size change there is comes from perspective alone. On top of that a size gradient of 0.82 runs one way round the ring: scale is multiplied by 1 + 0.0984·offset, so cards grow steadily in one direction and shrink to a speck in the other. Scene perspective 1400px, no pitch, no roll. A move takes 700ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 9. Cylinder marquee
Кольцо, видимое почти с ребра, бесконечно вращающееся само по себе.

### Промт (RU)

Создай 3D-карусель «цилиндрическая бегущая строка». 24 карточки размером 114×131px со скруглением углов 0px. Они выложены вдоль замкнутого кольца с шагом 116px — каждый шаг продвигается на 15° по окружности радиусом 443px, так что через четыре карточки дуга уходит на 222px в глубину. Оно вращается само по себе со скоростью 0,45 карточки в секунду, непрерывно. Карточки не повёрнуты по оси Y (yaw); карточки полностью следуют кривой, каждая повёрнута на свой угол вдоль дуги так, чтобы оставаться касательной к ней. Карточки не уменьшаются с расстоянием — любое изменение размера идёт только от перспективы. Перспектива сцены 3200px, наклон (pitch) 10° вокруг середины компоновки, без крена (roll). Переход занимает 620ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией, свободное, без примагничивания; без кнопок-стрелок; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D cylinder marquee carousel. 24 cards, 114×131px cards with 0px corners. They are laid along a ring that closes on itself, 116px apart — each step advances 15° around a circle of radius 443px, so four cards out the arc has moved 222px in depth. It turns on its own at 0.45 cards per second, continuously. Cards are not yawed; cards follow the curve completely, each one turned by its own angle around the arc so it stays tangent to it. Cards do not shrink with distance — whatever size change there is comes from perspective alone. Scene perspective 3200px, pitched 10° about the middle of the arrangement, no roll. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum, free, without snapping; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 10. Flat fan
Без кривой, без глубины — просто карточки, разложенные будто вручную.

### Промт (RU)

Создай 3D-карусель «плоский веер». 16 карточек размером 170×204px со скруглением углов 10px. Они сидят на прямой дорожке с шагом 186px. Карточки не повёрнуты по оси Y (yaw). Масштаб убывает как 1/(1+0,05·n), где n — расстояние от карточки в фокусе; непрозрачность падает на 0,03 за шаг. Джиттер 0,5 сдвигает каждую карточку до 9px и наклоняет её до 3,5° в плоскости обзора по сидированному случайному значению — одинаковому при каждой загрузке, никогда не Math.random, иначе экспортированный код и превью разойдутся. Джиттер размера 0,9 варьирует размеры карточек до 50% из того же сидированного источника, так что ряд читается как разложенный вручную, а не как однородная лента. Перспектива сцены 1400px, без наклона (pitch) и крена (roll). Переход занимает 600ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; кнопки-стрелки; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — кривую, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D flat fan carousel. 16 cards, 170×204px cards with 10px corners. They sit on a straight track, 186px apart. Cards are not yawed. Scale falls as 1/(1+0.05·n) with distance n from the focused card; opacity falls 0.03 per step. A jitter of 0.5 nudges each card up to 9px and tilts it up to 3.5° in the viewing plane, from a seeded random value — the same every load, never Math.random, or the exported code and the preview would disagree. A size jitter of 0.9 varies card sizes by up to 50% from that same seeded source, so the row reads as hand-laid rather than as a uniform strip. Scene perspective 1400px, no pitch, no roll. A move takes 600ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 11. Peek stack
Колода, где из-за последней карточки выглядывает лишь край каждой следующей.

### Промт (RU)

Создай 3D-карусель «выглядывающая стопка». 20 карточек размером 300×402px со скруглением углов 26px. Они выложены вдоль пологой дуги с шагом 44px — каждый шаг продвигается на 8,1° по окружности радиусом 311px, так что через четыре карточки дуга уходит на 145px в глубину. Эта глубина умножается на 3. Карточки не повёрнуты по оси Y (yaw). Масштаб убывает как 1/(1+0,42·n), где n — расстояние от карточки в фокусе; непрозрачность падает на 0,08 за шаг. Джиттер 0,18 сдвигает каждую карточку до 3px и наклоняет её до 1,3° в плоскости обзора по сидированному случайному значению — одинаковому при каждой загрузке, никогда не Math.random, иначе экспортированный код и превью разойдутся. Перспектива сцены 2600px, без наклона (pitch) и крена (roll). Переход занимает 600ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; кнопки-стрелки; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D peek stack carousel. 20 cards, 300×402px cards with 26px corners. They are laid along a shallow arc, 44px apart — each step advances 8.1° around a circle of radius 311px, so four cards out the arc has moved 145px in depth. That depth is multiplied by 3. Cards are not yawed. Scale falls as 1/(1+0.42·n) with distance n from the focused card; opacity falls 0.08 per step. A jitter of 0.18 nudges each card up to 3px and tilts it up to 1.3° in the viewing plane, from a seeded random value — the same every load, never Math.random, or the exported code and the preview would disagree. Scene perspective 2600px, no pitch, no roll. A move takes 600ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.

---

## 12. Vertical column
Колонна из карточек, которую листаешь вниз, — она изгибается вглубь по мере движения.

### Промт (RU)

Создай 3D-карусель «вертикальная колонна». 12 карточек размером 260×161px со скруглением углов 14px. Они выложены вдоль пологой дуги с шагом 176px — каждый шаг продвигается на 9° по окружности радиусом 1120px, так что через четыре карточки дуга уходит на 214px в глубину. Карточки не повёрнуты по оси Y (yaw); крен сцены компенсируется у каждой карточки с коэффициентом 1, так что дорожка идёт по диагонали, а карточки остаются прямыми. Масштаб убывает как 1/(1+0,24·n), где n — расстояние от карточки в фокусе; непрозрачность падает на 0,24 за шаг; размытие растёт на 1,4px за шаг, измеряется в экранных пикселях — дели на собственный масштаб каждой карточки, потому что фильтр вычисляется до трансформации предка. Перспектива сцены 1300px, без наклона (pitch), крен 90°. Переход занимает 620ms по cubic-bezier(0.32, 0.72, 0, 1). Перетаскивание с инерцией и примагничиванием к центру; без кнопок-стрелок; тап по карточке выводит её в центр; клавиши-стрелки двигают на одну карточку, Home и End переходят к краям; без автопрокрутки. При prefers-reduced-motion сохрани компоновку в точности как описано — дугу, углы, глубину, камеру — и вместо пролистывания делай кроссфейд между карточками за 180ms, чтобы ничего не двигалось само по себе.

### Промт (EN)

Build a 3D vertical column carousel. 12 cards, 260×161px cards with 14px corners. They are laid along a shallow arc, 176px apart — each step advances 9° around a circle of radius 1120px, so four cards out the arc has moved 214px in depth. Cards are not yawed; the scene's roll is cancelled per card by 1, so the track runs diagonally while the cards stay straight. Scale falls as 1/(1+0.24·n) with distance n from the focused card; opacity falls 0.24 per step; blur grows 1.4px per step, measured in screen pixels — divide by each card's own scale, because a filter resolves before its ancestor's transform. Scene perspective 1300px, no pitch, rolled 90°. A move takes 620ms on cubic-bezier(0.32, 0.72, 0, 1). Drag with momentum and snap-to-centre; no arrow buttons; tapping a card brings it to the centre; arrow keys move one card, Home and End jump to the ends; no autoplay. Under prefers-reduced-motion, keep the arrangement exactly as described — the curve, the angles, the depth, the camera — and crossfade between cards over 180ms instead of sweeping, with nothing moving on its own.
