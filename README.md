# Карусели · скиллы Марианны Бельковой

Два навыка для ИИ-агентов — Claude Code, Codex (ChatGPT) и Gemini CLI:

| Скилл | Что делает | Что получаете |
|---|---|---|
| **motion-carousel** | Анимированная карусель для Instagram и Telegram: каждый слайд — ролик 8–10 с с моушен-дизайном | `к публикации/<название>/01.mp4 … NN.mp4`, `картинки/*.jpg`, `пост.txt` |
| **web-3d-carousel** | Интерактивная 3D-карусель для сайта или превью по 12 пресетам (coverflow, helix, vortex…) | один HTML-файл без зависимостей |

Оба написаны в открытом формате Agent Skills (`SKILL.md`), поэтому одна и та же папка
работает во всех трёх агентах. Автор: Марианна Белькова, бизнес-тренер в недвижимости.

## Что нужно на компьютере

1. **Node.js 22 или новее** — https://nodejs.org, кнопка «LTS». На Windows при установке
   оставьте галочку «Add to PATH».
2. **Google Chrome** (подойдут Edge, Chromium, Brave) — в нём рендерятся слайды.
3. Сам агент: Claude Code, Codex CLI или Gemini CLI.

ffmpeg скачается сам при первом запуске (`npm install`, ~40 МБ). Проверено на macOS;
на Windows пути к Chrome ищутся автоматически — если не нашёл, задайте переменную
`CHROME_PATH`.

## Установка

### Claude Code — как плагин (рекомендуется: обновления одной командой)

```bash
claude plugin marketplace add mariashka-sketch/carousel-skills
claude plugin install belkova-carousels@belkova
```

Или внутри сессии: `/plugin marketplace add mariashka-sketch/carousel-skills`, затем
`/plugin install belkova-carousels@belkova`. В приложении Claude: «+» рядом с полем ввода →
Plugins → Add plugin. Обновление: `claude plugin update belkova-carousels@belkova`.

### Claude Code, Codex, Gemini CLI — копией скиллов

```bash
git clone https://github.com/mariashka-sketch/carousel-skills.git
cd carousel-skills
node install.js
```

Скрипт положит оба скилла в `~/.claude/skills`, `~/.codex/skills` и `~/.gemini/skills`
(нужное — `node install.js codex`), поставит ffmpeg и покажет команду проверки.
Обновление: `git pull` и снова `node install.js`.

Gemini CLI умеет ставить и напрямую:
```bash
gemini skills install https://github.com/mariashka-sketch/carousel-skills --path plugins/belkova-carousels/skills/motion-carousel
gemini skills install https://github.com/mariashka-sketch/carousel-skills --path plugins/belkova-carousels/skills/web-3d-carousel
```

### ChatGPT и Gemini в браузере (без агента)

Видео там не собрать — нужен терминал. А 3D-карусель можно: откройте
[`carousel-prompts-ru-en.md`](plugins/belkova-carousels/skills/web-3d-carousel/carousel-prompts-ru-en.md),
скопируйте промт нужного пресета и вставьте в чат — получите HTML-файл.

## Первый запуск

Скажите агенту: **«сделай карусель про …»** — например, «про пять ошибок при продаже
квартиры». Он:

1. проверит окружение (`doctor`) и при необходимости скажет, что доустановить;
2. задаст пять вопросов брифа и спросит имя и роль для подписи;
3. покажет таблицу слайдов и подпись к посту — **дождётся вашего «ок»**;
4. соберёт слайды, проверит вёрстку, покажет контактный лист;
5. отрендерит первый слайд на проверку, потом все (30–60 с на слайд);
6. сложит всё в `к публикации/` и скажет, как публиковать.

3D-карусель: **«сделай coverflow из этих картинок»** или «карусель для сайта, пресет helix».

Правки: «на третьем слайде замени заголовок на …» — перерендерится только этот слайд.

## Как публиковать

- **Telegram** — альбом до 10 видео. У роликов есть тихая звуковая дорожка: без неё
  Telegram превращает MP4 в GIF, а GIF в альбом не собирается.
- **Instagram** — карусель из видео (MP4) или из картинок (`картинки/*.jpg`).
- **ВКонтакте, MAX** — картинки.

## Если не работает

| Что пишет `doctor` | Что сделать |
|---|---|
| Node: нужен 22 или новее | Установить LTS с nodejs.org, перезапустить терминал |
| Chrome: не найден | Установить Google Chrome; или `CHROME_PATH=/путь/к/chrome` |
| ffmpeg: не найден | В папке скилла `motion-carousel` выполнить `npm install`; или поставить ffmpeg и задать `FFMPEG_PATH` |
| Windows: SmartScreen ругается на chrome/ffmpeg | Разрешить запуск — это обычный Chrome и ffmpeg из npm |
| `[js error]` при сборке | Синтаксическая ошибка в `slides/*.js` — агент исправит сам |

Запуск проверки вручную:
```bash
node ~/.claude/skills/motion-carousel/bin/carousel.js doctor
```
(для плагина Claude Code папка скилла — внутри `~/.claude/plugins/cache/belkova/…`).

## Устройство

```
plugins/belkova-carousels/
  skills/motion-carousel/   SKILL.md · dsl.md · rules.md · bin/carousel.js · lib/ · engine/ · templates/
  skills/web-3d-carousel/   SKILL.md · carousel-prompts-ru-en.md
  examples/demo/            готовый проект-пример (brand.json + slides/demo.js)
install.js                  установка копий в ~/.claude, ~/.codex, ~/.gemini
```

Движок — HTML + Canvas, вся анимация — функция времени `seek(t)`; headless Chrome снимает
кадры, ffmpeg собирает MP4 (libx264, 30 к/с, 1080×1350). Шрифты Unbounded и Manrope — по
лицензии OFL. Код — MIT, © 2026 Марианна Белькова.
