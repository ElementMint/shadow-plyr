# 🎬 Shadow Plyr

> A fully customizable, production-grade Web Component video player built with TypeScript, Shadow DOM and zero framework dependency.

[![npm version](https://img.shields.io/npm/v/shadow-plyr.svg)](https://www.npmjs.com/package/shadow-plyr)
[![license](https://img.shields.io/npm/l/shadow-plyr.svg)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/shadow-plyr)](https://bundlephobia.com/package/shadow-plyr)

---

## ✨ Features

- 🎯 Native Web Component `<shadow-plyr>`
- ⚡ Lazy loading + smart visibility pause
- 📱 Mobile optimized
- 👆 Double tap seek (YouTube style)
- 👆👆👆 Triple tap seek (30s skip)
- 🌊 Tap ripple animation
- 🎛 Custom controls
- 🎨 Fully themeable via CSS variables
- 🔐 Secure SVG sanitization
- 🧵 Virtual playback mode (only one video plays)
- 📦 Framework agnostic (React / Vue / Angular / Vanilla)

---

# 📦 Installation

## Using npm

```bash
npm install shadow-plyr
```

Then import:

```ts
import 'shadow-plyr';
```

---

## Using CDN

```html
<script type="module" src="https://unpkg.com/shadow-plyr/dist/shadow-plyr.js"></script>
```

---

# 🚀 Basic Usage

```html
<shadow-plyr
  desktop-video="video.mp4"
  desktop-poster="poster.jpg"
  show-controls="true"
  show-center-play="true">
</shadow-plyr>
```

---

# 📱 Mobile Gestures

| Gesture | Action |
|----------|--------|
| Double tap left | -10 seconds |
| Double tap right | +10 seconds |
| Triple tap left | -30 seconds |
| Triple tap right | +30 seconds |
| Drag seekbar | Scrub |
| Tap ripple | Visual animation |

---

# ⚙️ Full Configuration Reference

## 🎬 Video Settings

```html
<shadow-plyr
  desktop-video="video.mp4"
  mobile-video="video-mobile.mp4"
  desktop-poster="poster.jpg"
  mobile-poster="poster-mobile.jpg"
  video-type="video/mp4"
  preload="metadata"
  autoplay="true"
  muted="true"
  loop="true"
  playsinline="true">
</shadow-plyr>
```

---

## 🎛 Controls Configuration

```html
<shadow-plyr
  show-controls="true"
  show-play-pause="true"
  show-seekbar="true"
  show-volume="true"
  show-fullscreen="true"
  show-speed="true"
  speed-options="0.5,0.75,1,1.25,1.5,2">
</shadow-plyr>
```

---

## 👆 Double & Triple Tap

```html
<shadow-plyr
  double-tap-seek="true"
  double-tap-seek-seconds="10"
  triple-tap-seek="true"
  triple-tap-seconds="30"
  enable-tap-ripple="true">
</shadow-plyr>
```

Disable triple tap:

```html
<shadow-plyr triple-tap-seek="false"></shadow-plyr>
```

---

## 🔘 Overlay Seek Buttons

```html
<shadow-plyr
  show-seek-buttons="true"
  seek-button-seconds="15">
</shadow-plyr>
```

---

## ⚡ Performance Mode

```html
<shadow-plyr performance-mode="true"></shadow-plyr>
```

Optimized for pages with many videos.

---

## 🧠 Smart Visibility

```html
<shadow-plyr
  lazy="true"
  pause-on-out-of-view="true"
  pause-on-tab-hide="true"
  lazy-threshold="0.5"
  pause-threshold="0.3">
</shadow-plyr>
```

---

## 🔁 Virtual Playback Mode

```html
<shadow-plyr virtual-playback="true"></shadow-plyr>
```

Only one video plays at a time.

---

# 🎨 Theming

## Dark Theme

```html
<shadow-plyr
  theme="dark"
  accent-color="#ff3b30"
  controls-background="rgba(0,0,0,0.9)"
  center-play-background="rgba(0,0,0,0.8)"
  center-play-size="100">
</shadow-plyr>
```

## Light Theme

```html
<shadow-plyr theme="light"></shadow-plyr>
```

---

## 🎨 CSS Custom Properties

You can override styles externally:

```css
shadow-plyr {
  --accent-color: #00ffcc;
  --controls-bg: rgba(0,0,0,0.95);
  --center-play-size: 90px;
}
```

---

# 🧩 Custom SVG Icons

```html
<shadow-plyr
  play-icon="<svg>...</svg>"
  pause-icon="<svg>...</svg>"
  volume-icon="<svg>...</svg>"
  muted-icon="<svg>...</svg>"
  fullscreen-icon="<svg>...</svg>"
  exit-fullscreen-icon="<svg>...</svg>"
  speed-icon="<svg>...</svg>">
</shadow-plyr>
```

Icons are sanitized automatically.

---

# 🧑‍💻 JavaScript API

```ts
const player = document.querySelector('shadow-plyr');

player.play();
player.pause();
player.mute();
player.unmute();
player.seek(120);
```

---

# 📡 Events

```ts
player.addEventListener('video-playing', (e) => {
  console.log('Playing', e.detail);
});
```

### Available Events

| Event | Description |
|--------|-------------|
| video-ready | Metadata loaded |
| video-playing | Playback started |
| video-paused | Playback paused |
| video-ended | Playback ended |
| video-seeking | Seeking started |
| video-seeked | Seeking finished |
| video-volume-change | Volume changed |
| video-error | Load error |
| video-fullscreen-enter | Enter fullscreen |
| video-fullscreen-exit | Exit fullscreen |

---

# 🧪 Real World Presets

---

## 🎬 Netflix Style

```html
<shadow-plyr
  show-controls="true"
  show-center-play="true"
  double-tap-seek="true"
  triple-tap-seek="true"
  enable-tap-ripple="true"
  theme="dark"
  accent-color="#e50914">
</shadow-plyr>
```

---

## 📱 Minimal Mobile Player

```html
<shadow-plyr
  show-controls="false"
  show-center-play="true"
  double-tap-seek="true"
  triple-tap-seek="false">
</shadow-plyr>
```

---

## 🎨 Brand Custom Player

```html
<shadow-plyr
  theme="light"
  accent-color="#6c5ce7"
  controls-background="rgba(255,255,255,0.95)"
  center-play-background="rgba(255,255,255,0.8)">
</shadow-plyr>
```

---

# 🌍 Browser Support

| Browser | Supported |
|----------|-----------|
| Chrome | ✅ |
| Edge | ✅ |
| Safari | ✅ |
| iOS Safari | ✅ |
| Android Chrome | ✅ |
| Firefox | ✅ |

---

# 🏗 Built With

- Web Components
- Shadow DOM
- TypeScript
- Constructable Stylesheets
- DOMPurify

---

# 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Open PR

---

# 📄 License

MIT

---

# ⭐ Why Shadow Plyr?

Native `<video controls>` is limited.

Shadow Plyr provides:

- Full customization
- Modern mobile gestures
- Performance optimization
- Clean architecture
- Production-ready UX
