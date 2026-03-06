markdown
# 🎬 Shadow Plyr

> A fully customizable, production‑grade Web Component video player built with TypeScript, Shadow DOM and zero framework dependency.  
> **Version 2.2.0** – Now with HLS, quality selection, subtitles, theater mode, mini player, and much more.

[![npm version](https://img.shields.io/npm/v/@elementmints/shadow-plyr.svg)](https://www.npmjs.com/package/@elementmints/shadow-plyr)
[![license](https://img.shields.io/npm/l/@elementmints/shadow-plyr.svg)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@elementmints/shadow-plyr)](https://bundlephobia.com/package/@elementmints/shadow-plyr)

---

## ❤️ Support the Project

If **shadow-plyr** helps you, consider supporting development:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-support-yellow?logo=buy-me-a-coffee)](https://www.buymeacoffee.com/elementmint)

Your support helps maintain and improve the Shadow Web Components ecosystem.

---

## ✨ Features

- 🎯 **Native Web Component** – `<shadow-plyr>` works everywhere
- 📦 **Zero framework dependencies** – use with React, Vue, Angular, or vanilla JS
- 🎛 **Fully customizable controls** – show/hide any button, rearrange via CSS
- 📱 **Mobile optimized** – double‑tap seek, tap ripple, responsive design
- 🎨 **Themable via CSS variables and `::part`** – style internal elements from outside
- 🔐 **Secure** – automatic SVG sanitization with DOMPurify, HTTPS‑only validation
- 🧵 **Virtual playback** – only one video plays at a time (great for feeds)
- ⚡ **Performance mode** – reduces resource usage on pages with many videos
- 👆 **Gestures** – double/triple tap to seek, drag seekbar, tap ripple animation
- 🧠 **Smart visibility** – lazy loading, pause when out of view, pause on tab hide
- 🎞 **Advanced features** – HLS with quality switching, manual quality switching via `<source data-quality>`, subtitles, theater mode, mini player, screenshot, AirPlay, Picture‑in‑Picture, loop
- ⌨️ **Keyboard shortcuts** – fully accessible
- 🧩 **Custom icons** – replace all icons with your own SVG
- 🌍 **Wide browser support** – Chrome, Edge, Safari, Firefox, iOS, Android

---

# 📦 Installation

## Using npm

```bash
npm install @elementmints/shadow-plyr
Then import in your JavaScript:

ts
import '@elementmints/shadow-plyr';
Using CDN
html
<script type="module" src="https://unpkg.com/@elementmints/shadow-plyr@2.2.0/dist/shadow-plyr.js"></script>
🚀 Basic Usage
html
<shadow-plyr
  desktop-video="https://example.com/video.mp4"
  desktop-poster="https://example.com/poster.jpg"
  show-controls="true"
  show-center-play="true">
</shadow-plyr>
Using Light DOM <picture> for Art‑Directed Posters
You can place a <picture> element inside the <shadow-plyr> tag. It will be automatically moved into the shadow tree and used as the poster:

html
<shadow-plyr>
  <picture>
    <source media="(max-width: 768px)" srcset="https://example.com/mobile-poster.jpg">
    <img src="https://example.com/desktop-poster.jpg" alt="Video poster">
  </picture>
</shadow-plyr>
All image URLs are validated to be HTTPS.

📱 Mobile Gestures
Gesture	Action
Double tap left half	−10 seconds (configurable)
Double tap right half	+10 seconds
Triple tap left half	−30 seconds (configurable)
Triple tap right half	+30 seconds
Tap on video	Toggle play/pause
Drag seekbar	Scrub
Tap ripple animation	Visual feedback
⚙️ Full Configuration Reference
🎬 Video Sources & Poster
html
<shadow-plyr
  desktop-video="video.mp4"
  mobile-video="video-mobile.mp4"
  desktop-poster="poster.jpg"
  mobile-poster="poster-mobile.jpg"
  video-type="video/mp4"
  preload="metadata"
  autoplay="false"
  muted="false"
  loop="false"
  playsinline="true">
</shadow-plyr>
For HLS streams (.m3u8), the player automatically loads hls.js and enables adaptive quality switching.

🔁 Manual Quality Switching via <source data-quality>
You can provide multiple video sources with different resolutions using the data-quality attribute. The player will automatically build a quality menu:

html
<shadow-plyr show-quality="true">
  <source src="https://example.com/video-1080.mp4" type="video/mp4" data-quality="1080" media="(min-width: 1200px)">
  <source src="https://example.com/video-720.mp4"  type="video/mp4" data-quality="720"  media="(min-width: 768px)">
  <source src="https://example.com/video-480.mp4"  type="video/mp4" data-quality="480">
</shadow-plyr>
data-quality value is used as the label (e.g., "1080p").

The media attribute can be used for responsive pre-selection, but the user can override via the quality menu.

Only sources with valid HTTPS URLs are accepted.

📺 Subtitles / Captions
Add <track> elements inside the <shadow-plyr> tag:

html
<shadow-plyr show-subtitles="true">
  <track src="subtitles-en.vtt" kind="subtitles" srclang="en" label="English">
  <track src="subtitles-es.vtt" kind="subtitles" srclang="es" label="Español">
</shadow-plyr>
🎛 Controls Visibility
html
<shadow-plyr
  show-controls="true"
  controls-type="full"               <!-- or "none" -->
  show-play-pause="true"
  show-seekbar="true"
  show-volume="true"
  show-fullscreen="true"
  show-center-play="true"
  show-speed="true"
  speed-options="0.5,0.75,1,1.25,1.5,2"
  show-loop="true"
  show-pip="true"
  show-subtitles="true"
  show-quality="true"
  show-theater-mode="true"
  show-screenshot="true"
  show-airplay="true"
  show-mini-player="true"
  responsive-controls="true"
  buffer-progress="true">
</shadow-plyr>
👆 Gesture & Interaction
html
<shadow-plyr
  double-tap-seek="true"
  double-tap-seek-seconds="10"
  triple-tap-seek="true"
  triple-tap-seconds="30"
  enable-tap-ripple="true"
  show-seek-buttons="false"
  seek-button-seconds="15"
  poster-click-play="true">
</shadow-plyr>
🧠 Visibility & Performance
html
<shadow-plyr
  lazy="true"
  pause-on-out-of-view="true"
  pause-on-tab-hide="true"
  lazy-threshold="0.5"
  pause-threshold="0.3"
  performance-mode="false"
  single-active="false"
  virtual-playback="false">
</shadow-plyr>
single-active / virtual-playback – only one video plays at a time (pauses others automatically)

🎨 Theming
html
<shadow-plyr
  theme="dark"                       <!-- or "light" -->
  accent-color="#ff3b30"
  controls-background="rgba(0,0,0,0.9)"
  center-play-background="rgba(0,0,0,0.8)"
  center-play-size="100">
</shadow-plyr>
🔁 Loop Behavior
html
<shadow-plyr
  loop="false"
  show-poster-on-ended="true"
  reset-on-ended="false">
</shadow-plyr>
📺 Advanced Features
html
<shadow-plyr
  theater-mode="false"               <!-- toggle via button -->
  resume="true"                      <!-- saves playback position in localStorage -->
  screenshot="true"
  airplay="true"
  mini-player="true"
  skip-intro="0"                      <!-- automatically skip seconds -->
  show-tooltips="true"
  tooltip-play="Play"
  tooltip-pause="Pause"
  tooltip-mute="Mute"
  tooltip-unmute="Unmute"
  tooltip-fullscreen="Fullscreen"
  tooltip-exit-fullscreen="Exit fullscreen"
  tooltip-speed="Playback speed"
  tooltip-center-play="Play">
</shadow-plyr>
🎨 Theming with CSS Variables and ::part
CSS Variables
Override these variables in your global CSS to theme the player:

css
shadow-plyr {
  --accent-color: #00ffcc;
  --controls-bg: rgba(0, 0, 0, 0.95);
  --center-play-size: 90px;
  --tooltip-bg: #333;
  --tooltip-color: #fff;
  --tooltip-font-size: 12px;
}
The player automatically adapts to theme="light" by swapping default backgrounds.

Styling with ::part
Every interactive element inside the shadow tree has a part attribute, allowing you to style them directly from outside using the ::part() pseudo-element.

Example: change the play button color and size

css
shadow-plyr::part(play-pause) {
  background: red;
  border-radius: 50%;
}
shadow-plyr::part(play-pause svg) {
  fill: white;
  width: 32px;
  height: 32px;
}
Available part names (non-exhaustive):

shadow-plyr-wrapper – the main wrapper

video-container – the container

poster – the <picture> element

center-play – the big center play button

controls – the controls bar

seekbar, seekbar-progress, seekbar-buffer, seekbar-handle

play-pause, volume-btn, fullscreen-btn, loop-btn, pip-btn, theater-btn, screenshot-btn, airplay-btn, miniplayer-btn

speed-btn, speed-menu, speed-option

quality-btn, quality-menu, quality-option

subtitle-btn, subtitle-menu, subtitle-option

more-btn, more-menu

time-display, controls-spacer, volume-slider, volume-progress

and many more – inspect the element to see all part attributes.

🧩 Custom SVG Icons
Replace any icon with your own SVG markup (sanitized automatically):

html
<shadow-plyr
  play-icon='<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
  pause-icon='<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>'
  volume-icon="..."
  muted-icon="..."
  fullscreen-icon="..."
  exit-fullscreen-icon="..."
  speed-icon="..."
  loop-icon="..."
  loop-once-icon="..."
  pip-icon="..."
  subtitle-icon="..."
  quality-icon="..."
  more-icon="..."
  theater-icon="..."
  screenshot-icon="..."
  airplay-icon="..."
  miniplayer-icon="...">
</shadow-plyr>
🧑‍💻 JavaScript API
ts
const player = document.querySelector('shadow-plyr');

// Methods
player.play();
player.pause();
player.mute();
player.unmute();
player.seek(120);           // go to 120 seconds

// Properties (read‑only)
player.currentTime;          // video.currentTime
player.duration;
player.volume;
player.muted;
player.playing;              // boolean
📡 Events
Listen to custom events dispatched by the player:

ts
player.addEventListener('video-playing', (e) => {
  console.log('Playing at', e.detail.currentTime);
});
Event	Description	Detail
video-ready	Metadata loaded	{ duration }
video-playing	Playback started	{ currentTime, duration }
video-paused	Playback paused	{ currentTime }
video-ended	Playback ended	{ duration }
video-seeking	Seeking started	{ currentTime }
video-seeked	Seeking finished	{ currentTime }
video-volume-change	Volume or mute changed	{ volume, muted }
video-error	Load error	{ code }
video-fullscreen-enter	Entered fullscreen	–
video-fullscreen-exit	Exited fullscreen	–
video-loop-change	Loop toggled	{ loop }
theater-mode-change	Theater mode toggled	{ enabled }
mini-player-change	Mini player toggled	{ active }
🧪 Real World Presets
🎬 Netflix Style
html
<shadow-plyr
  show-controls="true"
  show-center-play="true"
  double-tap-seek="true"
  triple-tap-seek="true"
  enable-tap-ripple="true"
  theme="dark"
  accent-color="#e50914">
</shadow-plyr>
📱 Minimal Mobile Player
html
<shadow-plyr
  show-controls="false"
  show-center-play="true"
  double-tap-seek="true"
  triple-tap-seek="false">
</shadow-plyr>
🎨 Brand Custom Player
html
<shadow-plyr
  theme="light"
  accent-color="#6c5ce7"
  controls-background="rgba(255,255,255,0.95)"
  center-play-background="rgba(255,255,255,0.8)">
</shadow-plyr>
🎞 HLS with Quality Selector
html
<shadow-plyr
  desktop-video="https://example.com/stream.m3u8"
  show-quality="true"
  show-controls="true">
</shadow-plyr>
🎬 Manual Quality Switching via <source>
html
<shadow-plyr show-quality="true">
  <source src="https://example.com/1080.mp4" data-quality="1080" type="video/mp4">
  <source src="https://example.com/720.mp4"  data-quality="720"  type="video/mp4">
  <source src="https://example.com/480.mp4"  data-quality="480"  type="video/mp4">
</shadow-plyr>
🌍 Browser Support
Browser	Supported
Chrome	✅
Edge	✅
Safari	✅
Firefox	✅
iOS Safari	✅
Android Chrome	✅
Polyfills may be needed for older browsers (e.g., webcomponents.js).

🏗 Built With
Web Components (Custom Elements v1, Shadow DOM v1)

TypeScript

Constructable Stylesheets

DOMPurify

hls.js (optional, loaded dynamically)

🌳 Branch Strategy (Git Flow)
This project follows a structured Git workflow:

master – stable production releases

develop – integration branch (active development)

feature/* – new features

fix/* – bug fixes

release/* – release preparation

hotfix/* – emergency production fixes

Contribution Flow
Fork the repository

Create a feature branch:

bash
git checkout -b feature/your-feature-name
Commit your changes

Push and open a Pull Request

🤝 Contributing
Contributions are welcome! Please read the contribution guidelines before submitting a PR.

📄 License
MIT © Element Mint

⭐ Why Shadow Plyr?
Native <video controls> is limited.
Shadow Plyr gives you full control, modern gestures, performance optimizations, and a clean architecture – all in one zero‑dependency Web Component.