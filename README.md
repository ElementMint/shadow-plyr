# Shadow Plyr

<h1 align="center">Shadow Plyr</h1>

<p align="center">
A modern, production-grade Web Component video player built with Shadow DOM.
</p>

<p align="center">

![npm version](https://img.shields.io/npm/v/@elementmints/shadow-plyr)
![npm downloads](https://img.shields.io/npm/dm/@elementmints/shadow-plyr)
![bundle size](https://img.shields.io/bundlephobia/min/@elementmints/shadow-plyr)
![license](https://img.shields.io/npm/l/@elementmints/shadow-plyr)

</p>

<p align="center">
<a href="https://elementmint.github.io/shadow-plyr/">Live Demo</a>
|
<a href="https://www.npmjs.com/package/@elementmints/shadow-plyr">NPM</a>
</p>

---

## 🎬 Demo

```html
<shadow-plyr show-controls="true" show-center-play="true">
  <source src="https://example.com/video.mp4" type="video/mp4">
</shadow-plyr>
```

---

## ✨ Features

| Feature | Supported |
|---|---|
| Web Component / Shadow DOM | ✅ |
| Adaptive HLS streaming | ✅ |
| Quality selector | ✅ |
| Subtitles / captions | ✅ |
| **Unified settings menu** (quality + speed + subtitles) | ✅ **New** |
| **Netflix-style seek thumbnail preview** | ✅ **New** |
| **Custom loader** (SVG / image / GIF) | ✅ **New** |
| **UI error overlay** with retry | ✅ **New** |
| **Poster shown under loader** during buffering | ✅ **New** |
| Mobile gestures | ✅ |
| Theater mode | ✅ |
| Mini player | ✅ |
| Picture-in-Picture | ✅ |
| Screenshot capture | ✅ |
| AirPlay support | ✅ |
| Custom SVG icons | ✅ |
| CSS theming via `::part` | ✅ |
| Lazy loading | ✅ |
| Resume playback | ✅ |
| Keyboard shortcuts | ✅ |

---

## ⚡ Quick Start

### Install

```bash
npm install @elementmints/shadow-plyr
```

```ts
import "@elementmints/shadow-plyr";
```

### Or use CDN

```html
<script type="module"
  src="https://unpkg.com/@elementmints/shadow-plyr@latest/dist/index.js">
</script>
```

---

## 🚀 Basic Usage

```html
<!-- Preferred: use <source> child elements -->
<shadow-plyr show-controls="true" show-center-play="true">
  <source src="https://example.com/video.mp4" type="video/mp4">
</shadow-plyr>
```

---

## 🖼 Poster / Thumbnail

Use a `<picture>` child element for full art-direction support.
The poster image is shown **during loading** at 75 % opacity underneath the loader,
and disappears once playback starts.

```html
<shadow-plyr show-controls="true">
  <picture>
    <source media="(max-width: 768px)" srcset="poster-mobile.jpg">
    <img src="poster-desktop.jpg" alt="Video thumbnail">
  </picture>
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

> **If no poster is supplied**, the player shows a plain black background with the
> loader centred on top.

---

## 📼 Video Sources

Supply video with `<source>` child elements. Multiple sources enable quality switching.

```html
<shadow-plyr show-controls="true" show-quality="true">
  <source src="video-1080p.mp4" type="video/mp4" data-quality="1080">
  <source src="video-720p.mp4"  type="video/mp4" data-quality="720">
  <source src="video-480p.mp4"  type="video/mp4" data-quality="480">
</shadow-plyr>
```

> `data-quality` labels appear in the quality menu (e.g. `"1080"` → shown as **1080p**).

---

## ⚙️ Unified Settings Menu (New in v1.7)

Combine **Quality**, **Speed**, and **Subtitles** into a single gear-icon menu with a
back-navigable submenu. Ideal for small screens.

```html
<shadow-plyr
  show-controls="true"
  show-settings="true"
  show-quality="true"
  show-speed="true"
  show-subtitles="true">
  <source src="video.mp4" type="video/mp4" data-quality="1080">
</shadow-plyr>
```

> When `show-settings="true"`, the individual `show-quality`, `show-speed`, and
> `show-subtitles` buttons are hidden from the controls bar and merged into the settings
> panel. The individual pop-up menus still work if `show-settings` is omitted.

---

## 🖼 Seek Thumbnail Preview (New in v1.7)

Show a thumbnail when the user hovers over or drags the seekbar — Netflix-style.

### Option A — WebVTT sprite sheet (recommended)

```html
<shadow-plyr
  show-controls="true"
  show-seekbar="true"
  show-thumbnails="true"
  thumbnails-vtt="https://example.com/thumbnails.vtt">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

A WebVTT file maps time ranges to image coordinates:

```vtt
WEBVTT

00:00:00.000 --> 00:00:05.000
thumbnails.jpg#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
thumbnails.jpg#xywh=160,0,160,90
```

### Option B — Live frame capture (no extra files)

```html
<shadow-plyr
  show-controls="true"
  show-seekbar="true"
  show-thumbnails="true">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

When `thumbnails-vtt` is omitted a hidden `<video>` clone scrubs to the hovered time
and draws the frame onto an off-screen canvas.

| Attribute | Type | Default | Description |
|---|---|---|---|
| `show-thumbnails` | `boolean` | `false` | Enable the seek thumbnail preview |
| `thumbnails-vtt` | `string` | `""` | URL to a WebVTT thumbnail track |

---

## ❌ Error Handling (New in v1.7)

When a video fails to load, the player now shows a styled error overlay **inside** the
video container instead of silently logging to the console.

```html
<shadow-plyr
  show-controls="true"
  error-message="The video could not be loaded. Please try again."
  show-retry="true">
  <source src="https://example.com/video.mp4" type="video/mp4">
</shadow-plyr>
```

Supply a custom icon (sanitized SVG):

```html
<shadow-plyr
  error-message="Oops! Something went wrong."
  error-icon='<svg viewBox="0 0 24 24"><path d="M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z"/></svg>'>
</shadow-plyr>
```

| Attribute | Type | Default | Description |
|---|---|---|---|
| `error-message` | `string` | `"An error occurred while loading the video."` | Message shown in the error overlay |
| `error-icon` | `string` | Built-in triangle icon | Custom SVG icon (sanitized via DOMPurify) |
| `show-retry` | `boolean` | `true` | Show a **Try again** button |

The error overlay is also accessible via `::part(error-overlay)`.

---

## ⏳ Custom Loader (New in v1.7)

Replace the default CSS spinner with any image, animated GIF, or inline SVG.

### Image / GIF

```html
<shadow-plyr loader-src="https://example.com/spinner.gif">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

### Inline SVG / HTML

```html
<shadow-plyr loader-html='<svg viewBox="0 0 50 50" class="my-spin">…</svg>'>
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

The HTML is sanitized with DOMPurify (SVG profile) before insertion.

| Attribute | Type | Default | Description |
|---|---|---|---|
| `loader-src` | `string` | `""` | URL to an image or GIF (HTTPS only) |
| `loader-html` | `string` | `""` | Raw HTML/SVG markup for the loader |

> When either attribute is set, the default CSS spinner is hidden automatically.

---

## 📺 Subtitles

```html
<shadow-plyr show-controls="true" show-subtitles="true">
  <track src="subtitles-en.vtt" kind="subtitles" srclang="en" label="English">
  <track src="subtitles-es.vtt" kind="subtitles" srclang="es" label="Español">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

---

## 🎛 Controls Reference

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
  show-settings="true"
  show-loop="true"
  show-pip="true"
  mini-player="true"
  theater-mode="true"
  screenshot="true"
  airplay="true"
  responsive-controls="true">
</shadow-plyr>
```

---

## 👆 Gestures

```html
<shadow-plyr
  double-tap-seek="true"
  double-tap-seek-seconds="10"
  triple-tap-seek="true"
  triple-tap-seconds="30"
  enable-tap-ripple="true">
</shadow-plyr>
```

| Gesture | Action |
|---|---|
| Double tap left | −N seconds |
| Double tap right | +N seconds |
| Triple tap left | −30 seconds |
| Triple tap right | +30 seconds |
| Single tap | Play / Pause |
| Seekbar drag | Scrub (shows thumbnail preview when enabled) |

---

## 🧠 Performance & Behaviour

```html
<shadow-plyr
  lazy="true"
  pause-on-out-of-view="true"
  pause-on-tab-hide="true"
  single-active="true"
  resume="true">
</shadow-plyr>
```

| Attribute | Default | Description |
|---|---|---|
| `lazy` | `false` | Load video only when near the viewport |
| `pause-on-out-of-view` | `false` | Pause when scrolled off-screen |
| `pause-on-tab-hide` | `true` | Pause when the browser tab is hidden |
| `single-active` | `false` | Only one player plays at a time per page |
| `resume` | `false` | Resume from last saved position (uses `localStorage`) |

---

## 🎨 Theming

### CSS custom properties

```css
shadow-plyr {
  --accent-color:    #00ffcc;
  --controls-bg:     rgba(0,0,0,0.95);
  --tooltip-bg:      #333;
  --tooltip-color:   #fff;
  --center-play-bg:  rgba(0,0,0,0.7);
  --center-play-size: 80px;
  --aspect-ratio:    16/9;
}
```

### HTML attributes

```html
<shadow-plyr
  theme="dark"
  accent-color="#ff3b30"
  controls-background="rgba(0,0,0,0.9)"
  center-play-background="rgba(0,0,0,0.7)"
  center-play-size="90">
</shadow-plyr>
```

### `::part` CSS API

Every major element exposes a CSS part:

```css
shadow-plyr::part(controls)      { background: rgba(0,0,0,0.9); }
shadow-plyr::part(play-pause)    { border-radius: 50%; }
shadow-plyr::part(seekbar)       { height: 6px; }
shadow-plyr::part(seekbar-progress) { background: hotpink; }
shadow-plyr::part(center-play)   { background: rgba(255,255,255,0.2); }
shadow-plyr::part(time-display)  { font-family: monospace; }
shadow-plyr::part(error-overlay) { background: rgba(0,0,0,0.95); }
shadow-plyr::part(custom-loader) { /* custom loader wrapper */ }
```

---

## 🧩 Custom Icons

All icons accept raw SVG strings and are sanitized with DOMPurify:

```html
<shadow-plyr
  play-icon='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
  pause-icon='<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>'
  fullscreen-icon='…'
  exit-fullscreen-icon='…'
  volume-icon='…'
  muted-icon='…'
  speed-icon='…'
  loop-icon='…'
  loop-once-icon='…'
  pip-icon='…'
  subtitle-icon='…'
  quality-icon='…'
  more-icon='…'
  theater-icon='…'
  screenshot-icon='…'
  airplay-icon='…'
  miniplayer-icon='…'>
</shadow-plyr>
```

---

## 🧑‍💻 JavaScript API

```ts
const player = document.querySelector("shadow-plyr") as ShadowPlyr;

// Playback
player.play();
player.pause();
player.seek(120);          // seek to 120 s

// Volume
player.mute();
player.unmute();

// Loop
player.setLoop(true);

// Properties (proxied from underlying <video>)
player.currentTime  // number
player.duration     // number
player.volume       // number (0–1)
player.muted        // boolean
player.paused       // boolean
player.ended        // boolean
player.src          // string
player.playbackRate // number
```

---

## 📡 Events

```ts
player.addEventListener("video-ready",         e => console.log(e.detail.duration));
player.addEventListener("video-playing",        e => console.log(e.detail.currentTime));
player.addEventListener("video-paused",         e => {});
player.addEventListener("video-ended",          e => {});
player.addEventListener("video-seeking",        e => {});
player.addEventListener("video-seeked",         e => {});
player.addEventListener("video-volume-change",  e => console.log(e.detail.volume, e.detail.muted));
player.addEventListener("video-error",          e => console.log(e.detail.code));
player.addEventListener("video-loop-change",    e => console.log(e.detail.loop));
player.addEventListener("video-fullscreen-enter", () => {});
player.addEventListener("video-fullscreen-exit",  () => {});
player.addEventListener("theater-mode-change",  e => console.log(e.detail.enabled));
player.addEventListener("mini-player-change",   e => console.log(e.detail.active));
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `Space` / `K` | Play / Pause |
| `←` / `→` | Seek backward / forward (`seek-step` seconds) |
| `↑` / `↓` | Volume up / down |
| `M` | Mute toggle |
| `F` | Fullscreen toggle |
| `L` | Loop toggle |
| `P` | Picture-in-Picture |
| `T` | Theater mode |
| `Home` / `End` | Jump to start / end |
| `0`–`9` | Seek to 0 % – 90 % |
| `?` | Show keyboard help overlay |

---

## ⚠️ Deprecated Attributes

The following attributes still work but will be **removed** in a future major version.
Migrate to child elements instead.

| Deprecated attribute | Migration |
|---|---|
| `desktop-poster` | Use `<picture><img src="…"></picture>` as a child element |
| `mobile-poster` | Use `<picture><source media="(max-width:768px)" srcset="…">` |
| `desktop-video` | Use `<source src="…" media="(min-width:769px)">` as a child element |
| `mobile-video` | Use `<source src="…" media="(max-width:768px)">` as a child element |

A deprecation warning is printed to the console if these attributes are detected.

---

## 🌍 Browser Support

| Browser | Supported |
|---|---|
| Chrome / Edge | ✅ |
| Firefox | ✅ |
| Safari (macOS & iOS) | ✅ |
| Android Chrome | ✅ |

> AirPlay requires Safari on Apple devices.
> Picture-in-Picture requires browser API support.

---

## 🏗 Built With

- Web Components (Custom Elements v1, Shadow DOM v1)
- TypeScript
- Constructable Stylesheets (`adoptedStyleSheets`)
- DOMPurify (XSS-safe icon / loader HTML)
- hls.js (optional – peer dependency for HLS streams)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: add xyz"`
4. Open a Pull Request against `develop`

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## 📄 License

MIT © Element Mint