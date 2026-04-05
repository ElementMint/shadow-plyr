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
| Unified settings menu (quality + speed + subtitles) | ✅ |
| Netflix-style seek thumbnail preview | ✅ |
| Custom loader (SVG / image / GIF) | ✅ |
| UI error overlay with retry | ✅ |
| Mobile gestures (double/triple tap) | ✅ |
| Theater mode | ✅ |
| Mini player (draggable) | ✅ |
| Picture-in-Picture | ✅ |
| Screenshot capture | ✅ |
| AirPlay support | ✅ |
| Custom SVG icons | ✅ |
| CSS theming via `::part` and CSS variables | ✅ |
| Lazy loading / pause-on-out-of-view | ✅ |
| Resume playback (per-video localStorage) | ✅ |
| Keyboard shortcuts | ✅ |
| **Chapters** (seekbar markers + events) | ✅ **New** |
| **Media Session API** (lock screen / headphones) | ✅ **New** |
| **Quartile analytics** events | ✅ **New** |
| **Speed memory** (per-video, localStorage) | ✅ **New** |
| **Watermark overlay** (text or image) | ✅ **New** |
| **Subtitle style attributes** (font, color, size) | ✅ **New** |
| **High contrast mode** (`prefers-contrast`) | ✅ **New** |
| **Loop A→B** (keyboard `[` / `]`) | ✅ **New** |
| **Playlist** (JSON, auto-advance, prev/next) | ✅ **New** |
| **ARIA live announcements** | ✅ **New** |
| React / Next.js wrapper | ✅ |
| Vue 3 wrapper | ✅ |
| Angular / Svelte compatible | ✅ |

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
<script type="importmap">
  { "imports": {
      "shadow-plyr": "https://cdn.jsdelivr.net/npm/@elementmints/shadow-plyr/dist/index.js",
      "hls.js":      "https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.mjs"
  }}
</script>
<script type="module">import 'shadow-plyr';</script>
```

---

## 🚀 Basic Usage

```html
<shadow-plyr show-controls="true" show-center-play="true">
  <source src="https://example.com/video.mp4" type="video/mp4">
</shadow-plyr>
```

---

## 🖼 Poster / Thumbnail

Use a `<picture>` child element for full art-direction support. The poster is shown immediately and disappears once playback starts.

```html
<shadow-plyr show-controls="true">
  <picture>
    <source media="(max-width: 768px)" srcset="poster-mobile.jpg">
    <img src="poster-desktop.jpg" alt="Video thumbnail">
  </picture>
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

---

## 📼 Video Sources & Quality

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

## ⚙️ Unified Settings Menu

Combine **Quality**, **Speed**, and **Subtitles** into a single gear-icon menu.

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

---

## 🖼 Seek Thumbnail Preview

Show a thumbnail when hovering or dragging the seekbar.

```html
<!-- Option A: WebVTT sprite sheet (recommended) -->
<shadow-plyr show-thumbnails="true" thumbnails-vtt="thumbnails.vtt">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>

<!-- Option B: Live frame capture (no extra files) -->
<shadow-plyr show-thumbnails="true">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

| Attribute | Type | Default | Description |
|---|---|---|---|
| `show-thumbnails` | `boolean` | `false` | Enable seek thumbnail preview |
| `thumbnails-vtt` | `string` | `""` | URL to a WebVTT thumbnail track |

---

## 🎵 Chapters

Add chapter markers on the seekbar derived from a `<track kind="chapters">` element.

```html
<shadow-plyr show-controls="true" show-seekbar="true" show-chapters="true">
  <source src="video.mp4" type="video/mp4">
  <track kind="chapters" src="chapters.vtt" srclang="en">
</shadow-plyr>
```

```vtt
WEBVTT

00:00:00.000 --> 00:01:30.000
Introduction

00:01:30.000 --> 00:05:00.000
Main Content
```

Fires `video-chapter-change` event with `{ index, title, start }` when the chapter changes.

---

## 📡 Media Session API

Registers metadata with the OS/browser media session (lock screen, headphone buttons).

```html
<shadow-plyr
  media-title="My Video Title"
  media-artist="Creator Name"
  media-album="Series Name"
  media-thumbnail="https://example.com/thumb.jpg">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

| Attribute | Description |
|---|---|
| `media-title` | Title shown in OS media controls. Falls back to page `<title>`. |
| `media-artist` | Artist / creator name |
| `media-album` | Album / series name |
| `media-thumbnail` | Artwork image URL. Falls back to poster. |

---

## 📊 Quartile Analytics

Fires `video-quartile` events at 25%, 50%, 75%, and 100% playback milestones.

```html
<shadow-plyr analytics-events="true">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

```js
player.addEventListener('video-quartile', (e) => {
  console.log(e.detail.quartile);    // 25 | 50 | 75 | 100
  console.log(e.detail.currentTime); // seconds
});
```

---

## 💾 Speed Memory (per-video)

Remember the last-used playback speed for each video independently. Each unique video URL gets its own localStorage entry — works correctly with multiple players on one page.

```html
<shadow-plyr speed-memory="true" show-speed="true">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

Storage key format: `shadowplyr-speed-<src-url>`

---

## 🖼 Watermark Overlay

Display a text or image watermark on the player.

```html
<!-- Text watermark -->
<shadow-plyr
  watermark="© My Company"
  watermark-position="top-right"
  watermark-opacity="0.6">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>

<!-- Image watermark with link -->
<shadow-plyr
  watermark="https://example.com/logo.png"
  watermark-position="bottom-right"
  watermark-opacity="0.5"
  watermark-link="https://example.com">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

| Attribute | Type | Default | Description |
|---|---|---|---|
| `watermark` | `string` | `""` | Text string or image URL (auto-detected by extension) |
| `watermark-position` | `string` | `"top-right"` | `top-left` \| `top-right` \| `bottom-left` \| `bottom-right` \| `center` |
| `watermark-opacity` | `number` | `0.5` | Opacity of the watermark (0–1) |
| `watermark-link` | `string` | `""` | URL to open when watermark is clicked |

---

## 🔤 Subtitle Styling

Override subtitle appearance via HTML attributes (maps to CSS `::cue` custom properties).

```html
<shadow-plyr
  show-subtitles="true"
  subtitle-font-size="1.1em"
  subtitle-color="#ffeb3b"
  subtitle-background="rgba(0,0,0,0.8)"
  subtitle-font-family="Arial, sans-serif"
  subtitle-font-weight="600">
  <track kind="subtitles" src="subs.en.vtt" srclang="en" label="English">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

| Attribute | CSS variable | Description |
|---|---|---|
| `subtitle-font-size` | `--subtitle-font-size` | Font size (`em`, `px`, etc.) |
| `subtitle-color` | `--subtitle-color` | Text color |
| `subtitle-background` | `--subtitle-bg` | Background color/value |
| `subtitle-font-family` | `--subtitle-font-family` | Font family |
| `subtitle-font-weight` | `--subtitle-font-weight` | Font weight |

You can also set these CSS variables directly on the element:

```css
shadow-plyr {
  --subtitle-font-size: 1.2em;
  --subtitle-color: #fff;
  --subtitle-bg: rgba(0,0,0,0.75);
}
```

---

## 🔁 Loop A→B

Loop between two points in the video. Enable with `loop-ab="true"` then use keyboard shortcuts to set the range.

```html
<shadow-plyr loop-ab="true">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

| Key | Action |
|---|---|
| `[` | Set loop **start** point at current time (tap again to clear) |
| `]` | Set loop **end** point at current time |

- Green marker on seekbar = start point
- Red marker on seekbar = end point
- Shaded range between them shows the loop region

---

## 📋 Playlist

Pass a JSON array of items. The player auto-advances to the next item on ended, and shows Prev / Next buttons in the controls bar.

```html
<shadow-plyr
  show-controls="true"
  show-play-pause="true"
  playlist='[
    {"src":"video1.mp4","title":"Episode 1","poster":"thumb1.jpg"},
    {"src":"video2.mp4","title":"Episode 2","poster":"thumb2.jpg"},
    {"src":"video3.mp4","title":"Episode 3","poster":"thumb3.jpg"}
  ]'>
</shadow-plyr>
```

| Field | Type | Description |
|---|---|---|
| `src` | `string` | Video URL (required) |
| `title` | `string` | Optional title for media session |
| `poster` | `string` | Optional poster image URL |
| `type` | `string` | Optional MIME type (default `video/mp4`) |

---

## ❌ Error Handling

```html
<shadow-plyr
  error-message="The video could not be loaded. Please try again."
  show-retry="true">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

| Attribute | Type | Default | Description |
|---|---|---|---|
| `error-message` | `string` | `"An error occurred while loading the video."` | Error overlay message |
| `error-icon` | `string` | Built-in triangle icon | Custom SVG icon |
| `show-retry` | `boolean` | `true` | Show a **Try again** button |

---

## ⏳ Custom Loader

```html
<!-- Image / GIF -->
<shadow-plyr loader-src="https://example.com/spinner.gif">
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>

<!-- Inline SVG -->
<shadow-plyr loader-html='<svg viewBox="0 0 50 50">…</svg>'>
  <source src="video.mp4" type="video/mp4">
</shadow-plyr>
```

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
  responsive-controls="true"
  buffer-progress="true"
  show-seek-buttons="true"
  seek-button-seconds="10">
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
  resume="true"
  speed-memory="true">
</shadow-plyr>
```

| Attribute | Default | Description |
|---|---|---|
| `lazy` | `false` | Load video only when near the viewport |
| `pause-on-out-of-view` | `false` | Pause when scrolled off-screen |
| `pause-on-tab-hide` | `true` | Pause when the browser tab is hidden |
| `single-active` | `false` | Only one player plays at a time per page |
| `resume` | `false` | Resume from last position (per-video localStorage) |
| `speed-memory` | `false` | Remember last-used speed per video (localStorage) |

---

## 🎨 Theming

### CSS custom properties

```css
shadow-plyr {
  --accent-color:      #00ffcc;
  --controls-bg:       rgba(0,0,0,0.95);
  --center-play-bg:    rgba(0,0,0,0.7);
  --center-play-size:  80px;
  --aspect-ratio:      16/9;
  --tooltip-bg:        #333;
  --tooltip-color:     #fff;

  /* Subtitle styling */
  --subtitle-font-size:   1em;
  --subtitle-color:       #fff;
  --subtitle-bg:          rgba(0,0,0,0.75);
  --subtitle-font-family: inherit;
  --subtitle-font-weight: normal;
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

```css
shadow-plyr::part(controls)         { background: rgba(0,0,0,0.9); }
shadow-plyr::part(play-pause)       { border-radius: 50%; }
shadow-plyr::part(seekbar)          { height: 6px; }
shadow-plyr::part(seekbar-progress) { background: hotpink; }
shadow-plyr::part(center-play)      { background: rgba(255,255,255,0.2); }
shadow-plyr::part(time-display)     { font-family: monospace; }
shadow-plyr::part(error-overlay)    { background: rgba(0,0,0,0.95); }
```

---

## 🧩 Custom Icons

All icons accept raw SVG strings:

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
  pip-icon='…'
  subtitle-icon='…'
  quality-icon='…'
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
player.currentTime   // number
player.duration      // number
player.volume        // number (0–1)
player.muted         // boolean
player.paused        // boolean
player.ended         // boolean
player.src           // string
player.playbackRate  // number
```

---

## 📡 Events

```ts
player.addEventListener("video-ready",            e => console.log(e.detail.duration));
player.addEventListener("video-playing",           e => console.log(e.detail.currentTime));
player.addEventListener("video-paused",            e => {});
player.addEventListener("video-ended",             e => {});
player.addEventListener("video-seeking",           e => {});
player.addEventListener("video-seeked",            e => {});
player.addEventListener("video-volume-change",     e => console.log(e.detail.volume, e.detail.muted));
player.addEventListener("video-error",             e => console.log(e.detail.code));
player.addEventListener("video-loop-change",       e => console.log(e.detail.loop));
player.addEventListener("video-fullscreen-enter",  () => {});
player.addEventListener("video-fullscreen-exit",   () => {});
player.addEventListener("theater-mode-change",     e => console.log(e.detail.enabled));
player.addEventListener("mini-player-change",      e => console.log(e.detail.active));
// New events
player.addEventListener("video-quartile",          e => console.log(e.detail.quartile)); // 25|50|75|100
player.addEventListener("video-chapter-change",    e => console.log(e.detail.title));
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
| `0`–`9` | Seek to 0%–90% |
| `[` | Set Loop A→B **start** point (requires `loop-ab="true"`) |
| `]` | Set Loop A→B **end** point (requires `loop-ab="true"`) |
| `?` | Show keyboard help overlay |

---

## ♿ Accessibility

- Full keyboard navigation
- ARIA roles on all interactive elements (`role="slider"`, `role="button"`, etc.)
- Hidden `aria-live="polite"` region announces playback state changes to screen readers
- `sr-only` labels on icon-only buttons
- High contrast mode supported via `@media (prefers-contrast: more)`

---

## 🌐 Framework Integration

### React / Next.js

```tsx
'use client'; // Next.js App Router
import { ShadowPlyrReact } from '@elementmints/shadow-plyr/react';

export default function VideoPlayer() {
  return (
    <ShadowPlyrReact
      showControls showSeekbar showPlayPause
      showVolume showFullscreen showSettings
      showQuality showSubtitles showThumbnails
      analyticsEvents speedMemory
      accentColor="#6f8dff"
      mediaTitle="My Video"
      onVideoReady={(e) => console.log('ready', e.detail)}
      onVideoQuartile={(e) => trackAnalytics(e.detail.quartile)}
    >
      <source src="video.mp4" type="video/mp4" data-quality="1080" />
    </ShadowPlyrReact>
  );
}
```

### Vue 3

```vue
<!-- VideoPlayer.vue -->
<template>
  <ShadowPlyrVue
    :show-controls="true"
    :show-seekbar="true"
    :show-settings="true"
    :analytics-events="true"
    :speed-memory="true"
    accent-color="#6f8dff"
    @video-ready="onReady"
    @video-quartile="onQuartile"
  />
</template>

<script setup lang="ts">
import { ShadowPlyrVue } from '@elementmints/shadow-plyr/vue';
const onReady    = (e: CustomEvent) => console.log(e.detail);
const onQuartile = (e: CustomEvent) => trackAnalytics(e.detail.quartile);
</script>
```

### Angular

```ts
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import '@elementmints/shadow-plyr';

@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })
export class AppModule {}
```

```html
<!-- video.component.html -->
<shadow-plyr
  show-controls="true"
  show-seekbar="true"
  show-settings="true"
  speed-memory="true"
  accent-color="#6f8dff"
  (video-ready)="onReady($event)"
  (video-quartile)="onQuartile($event)">
</shadow-plyr>
```

---

## ⚠️ Deprecated Attributes

| Deprecated attribute | Migration |
|---|---|
| `desktop-poster` | Use `<picture><img src="…"></picture>` as a child element |
| `mobile-poster` | Use `<picture><source media="(max-width:768px)" srcset="…">` |
| `desktop-video` | Use `<source src="…" media="(min-width:769px)">` as a child element |
| `mobile-video` | Use `<source src="…" media="(max-width:768px)">` as a child element |

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
