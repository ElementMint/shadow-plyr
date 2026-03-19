# Shadow Plyr

<h1 align="center">Shadow Plyr</h1>

<p align="center">
A modern Web Component video player built with Shadow DOM.
</p>

<p align="center">

![npm version](https://img.shields.io/npm/v/@elementmints/shadow-plyr)
![npm downloads](https://img.shields.io/npm/dm/@elementmints/shadow-plyr)
![bundle size](https://img.shields.io/bundlephobia/min/@elementmints/shadow-plyr)
![license](https://img.shields.io/npm/l/@elementmints/shadow-plyr)

</p>

<p align="center">
<a href="https://elementmints.github.io/shadow-plyr/">Live Demo</a>
|
<a href="https://www.npmjs.com/package/@elementmints/shadow-plyr">NPM</a>
</p>

---

# 🎬 Demo

```html
<shadow-plyr
  desktop-video="https://example.com/video.mp4"
  desktop-poster="https://example.com/poster.jpg"
  show-controls="true"
  show-center-play="true">
</shadow-plyr>
```

---

# ✨ Features

| Feature | Supported |
|------|------|
| Web Component architecture | ✅ |
| Shadow DOM encapsulation | ✅ |
| Adaptive HLS streaming | ✅ |
| Quality selector | ✅ |
| Subtitles / captions | ✅ |
| Mobile gestures | ✅ |
| Theater mode | ✅ |
| Mini player | ✅ |
| Picture-in-Picture | ✅ |
| Screenshot capture | ✅ |
| AirPlay support | ✅ |
| Custom SVG icons | ✅ |
| CSS theming | ✅ |
| `::part` styling | ✅ |
| Lazy loading | ✅ |
| Resume playback | ✅ |

---

# ⚡ Quick Start

## Install

```bash
npm install @elementmints/shadow-plyr
```

Import the component:

```ts
import "@elementmints/shadow-plyr";
```

---

## Or use CDN

```html
<script type="module" src="https://unpkg.com/@elementmints/shadow-plyr@1.4.0/dist/index.js"></script>
```

---

# 🚀 Basic Usage

```html
<shadow-plyr
  desktop-video="video.mp4"
  desktop-poster="poster.jpg"
  show-controls="true">
</shadow-plyr>
```

---

# 🖼 Poster with `<picture>`

Art-directed responsive posters are supported.

```html
<shadow-plyr>
  <picture>
    <source media="(max-width:768px)" srcset="mobile-poster.jpg">
    <img src="desktop-poster.jpg" alt="Poster">
  </picture>
</shadow-plyr>
```

---

# 📱 Mobile Gestures

| Gesture | Action |
|------|------|
| Double tap left | −10 seconds |
| Double tap right | +10 seconds |
| Triple tap left | −30 seconds |
| Triple tap right | +30 seconds |
| Tap video | Play / pause |
| Seekbar drag | Scrub |

---

# 🎬 Quality Switching

Provide multiple sources using `data-quality`.

```html
<shadow-plyr show-quality="true">

  <source src="video-1080.mp4"
          type="video/mp4"
          data-quality="1080">

  <source src="video-720.mp4"
          type="video/mp4"
          data-quality="720">

  <source src="video-480.mp4"
          type="video/mp4"
          data-quality="480">

</shadow-plyr>
```

---

# 📺 Subtitles

```html
<shadow-plyr show-subtitles="true">

  <track
    src="subtitles-en.vtt"
    kind="subtitles"
    srclang="en"
    label="English">

</shadow-plyr>
```

---

# 🎛 Controls

```html
<shadow-plyr
  show-controls="true"
  show-play-pause="true"
  show-seekbar="true"
  show-volume="true"
  show-fullscreen="true"
  show-speed="true"
  show-quality="true"
  show-subtitles="true"
  show-mini-player="true"
  show-theater-mode="true">
</shadow-plyr>
```

---

# 👆 Gestures

```html
<shadow-plyr
  double-tap-seek="true"
  double-tap-seek-seconds="10"
  triple-tap-seek="true"
  triple-tap-seconds="30"
  enable-tap-ripple="true">
</shadow-plyr>
```

---

# 🧠 Performance Features

```html
<shadow-plyr
  lazy="true"
  pause-on-out-of-view="true"
  pause-on-tab-hide="true"
  single-active="true">
</shadow-plyr>
```

These options improve performance on **video-heavy pages**.

---

# 🎨 Theming

```html
<shadow-plyr
  theme="dark"
  accent-color="#ff3b30"
  controls-background="rgba(0,0,0,0.9)">
</shadow-plyr>
```

---

# 🎨 CSS Variables

```css
shadow-plyr {

  --accent-color: #00ffcc;

  --controls-bg: rgba(0,0,0,0.95);

  --tooltip-bg: #333;

  --tooltip-color: #fff;

}
```

---

# 🎨 Styling with `::part`

```css
shadow-plyr::part(play-pause) {

  background: red;

  border-radius: 50%;

}
```

---

# 🧩 Custom Icons

```html
<shadow-plyr
  play-icon='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
  pause-icon='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6z"/></svg>'>
</shadow-plyr>
```

SVG icons are automatically **sanitized with DOMPurify**.

---

# 🧑‍💻 JavaScript API

```ts
const player = document.querySelector("shadow-plyr");

player.play();
player.pause();
player.mute();
player.unmute();
player.seek(120);
player.setLoop(true);
```

### Properties

```ts
player.currentTime
player.duration
player.volume
player.muted
player.playing
```

---

# 📡 Events

```ts
player.addEventListener("video-playing", e => {
  console.log(e.detail.currentTime);
});
```

| Event | Description |
|------|------|
| video-ready | Metadata loaded |
| video-playing | Playback started |
| video-paused | Playback paused |
| video-ended | Playback ended |
| video-seeking | Seeking started |
| video-seeked | Seeking finished |
| video-volume-change | Volume change |
| video-error | Playback error |

---

# 🌍 Browser Support

| Browser | Supported |
|------|------|
| Chrome | ✅ |
| Edge | ✅ |
| Safari | ✅ |
| Firefox | ✅ |
| iOS Safari | ✅ |
| Android Chrome | ✅ |

---

# 🏗 Built With

- Web Components
- TypeScript
- Shadow DOM
- Constructable Stylesheets
- DOMPurify
- hls.js (optional)

---

# 🤝 Contributing

1. Fork the repository

2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

4. Open a Pull Request

---

# 📄 License

MIT © Element Mint

---

# ⭐ Why Shadow Plyr?

The native `<video>` element provides only basic controls.

Shadow Plyr delivers:

- Modern gesture controls
- Adaptive streaming
- Full UI customization
- Performance optimizations
- Clean Web Component architecture

All inside a **lightweight, zero-dependency video player**.