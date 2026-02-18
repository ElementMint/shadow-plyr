Perfect 👌
You now have a **serious enterprise-grade Web Component**, and what you’re asking for is exactly what makes it production-ready:

> 📘 Proper configuration documentation (like an internal component README / design system doc)

Below is a **complete configuration documentation** for your current `shadow-plyr` component — structured for:

* AEM authors
* Frontend developers
* QA team
* Design system documentation
* Analytics team

You can directly use this in Confluence / README.md / AEM component docs.

---

# 🎬 `shadow-plyr` – Configuration Documentation

Version: 3.0.0
Type: Web Component (Shadow DOM + Constructable Stylesheet)

---

# 1️⃣ Basic Usage

```html
<shadow-plyr
  desktop-video="/content/dam/video.mp4"
  mobile-video="/content/dam/video-mobile.mp4"
  desktop-poster="/content/dam/poster.jpg"
  autoplay="true"
  muted="true"
  show-controls="true"
></shadow-plyr>
```

---

# 2️⃣ Core Video Configuration

## `desktop-video`

**Type:** String
**Required:** Yes (if no mobile-video fallback)
**Description:** Path to desktop video source.

```html
desktop-video="/content/dam/video.mp4"
```

---

## `mobile-video`

**Type:** String
**Required:** Optional
**Description:** Video source used for max-width: 768px.

```html
mobile-video="/content/dam/video-mobile.mp4"
```

---

## `video-type`

**Type:** String
**Default:** `"video/mp4"`
**Description:** MIME type for `<source>` elements.

---

## `desktop-poster`

**Type:** String
**Description:** Poster image for desktop.

---

## `mobile-poster`

**Type:** String
**Description:** Poster image for mobile devices.

---

# 3️⃣ Playback Behavior

## `autoplay`

**Type:** Boolean (`"true"` / `"false"`)
**Default:** false
**Note:** Must be used with `muted="true"` for browser autoplay policy.

---

## `loop`

**Type:** Boolean
**Default:** false
**Description:** Replays video after completion.

---

## `muted`

**Type:** Boolean
**Default:** false
**Description:** Starts video muted.

---

## `playsinline`

**Type:** Boolean
**Default:** false
**Description:** Prevents iOS fullscreen auto takeover.

---

## `preload`

**Type:** `"auto" | "metadata" | "none"`
**Default:** `"metadata"`

---

# 4️⃣ Visibility & Lazy Loading

## `lazy`

**Type:** Boolean
**Default:** false
**Description:** Loads video only when visible.

---

## `lazy-threshold`

**Type:** Number (0–1)
**Default:** 0.5
**Description:** Visibility ratio before loading.

---

## `pause-on-out-of-view`

**Type:** Boolean
**Default:** false
**Description:** Pauses video if not sufficiently visible.

---

## `pause-threshold`

**Type:** Number
**Default:** 0.3
**Description:** Visibility ratio before pausing.

---

## `pause-on-tab-hide`

**Type:** Boolean
**Default:** true
**Description:** Pauses video when tab becomes hidden.

---

# 5️⃣ Controls Configuration

## `show-controls`

**Type:** Boolean
**Default:** false
**Description:** Enables custom controls UI.

---

## `controls-type`

**Type:** `"full" | "none"`
**Default:** `"full"`

---

## `show-play-pause`

**Type:** Boolean
**Default:** true

---

## `show-center-play`

**Type:** Boolean
**Default:** false

---

## `show-seekbar`

**Type:** Boolean
**Default:** false

---

## `show-volume`

**Type:** Boolean
**Default:** false

---

## `show-fullscreen`

**Type:** Boolean
**Default:** false

---

## `show-speed`

**Type:** Boolean
**Default:** false

---

## `speed-options`

**Type:** Comma-separated list
**Default:** `0.5,0.75,1,1.25,1.5,2`

Example:

```html
speed-options="0.5,1,1.5,2"
```

---

## `seek-step`

**Type:** Number (seconds)
**Default:** 5
**Description:** Keyboard arrow seek increment.

---

## `controls-hide-delay`

**Type:** Number (ms)
**Default:** 3000

---

# 6️⃣ Poster & End Behavior

## `poster-click-play`

**Type:** Boolean
**Default:** true
**Description:** Clicking poster starts playback.

---

## `show-poster-on-ended`

**Type:** Boolean
**Default:** false

---

## `reset-on-ended`

**Type:** Boolean
**Default:** false

---

# 7️⃣ Theming & Design System (Enterprise Ready)

Your component uses CSS Custom Properties (Design Tokens).

---

## `theme`

**Type:** String
**Default:** `"dark"`

Supported:

* `dark`
* `light`
* (extendable via CSS)

Example:

```html
<responsive-video theme="light"></responsive-video>
```

---

## `accent-color`

**Type:** Color
**Description:** Overrides primary color token.

```html
accent-color="#0066ff"
```

---

## `controls-background`

Overrides control background.

---

## `center-play-background`

Overrides center play background.

---

## `center-play-size`

**Type:** Number (px)

```html
center-play-size="100"
```

---

# 8️⃣ Performance Mode

## `performance-mode`

**Type:** Boolean
**Default:** false
**Description:**

* Reduces UI updates
* Optimized for 20+ videos on page
* Recommended for content grids

---

# 9️⃣ Virtual Playback Engine

## `virtual-playback`

**Type:** Boolean
**Description:**
Ensures only ONE video plays at a time globally.

```html
virtual-playback="true"
```

---

# 🔟 Public API Methods

Available via JS:

```js
const video = document.querySelector('responsive-video');

video.play();
video.pause();
video.mute();
video.unmute();
video.seek(30);
```

---

# 1️⃣1️⃣ Custom Events (Analytics Ready)

All events bubble outside Shadow DOM.

---

## Playback Events

| Event                  | Trigger          |
| ---------------------- | ---------------- |
| video-ready            | Metadata loaded  |
| video-playing          | Playback started |
| video-paused           | Paused           |
| video-ended            | Ended            |
| video-seeking          | Seeking          |
| video-seeked           | Seek complete    |
| video-volume-change    | Volume changed   |
| video-error            | Load error       |
| video-fullscreen-enter | Enter fullscreen |
| video-fullscreen-exit  | Exit fullscreen  |

Example:

```js
document.addEventListener('video-playing', e => {
  console.log(e.detail);
});
```

---

# 1️⃣2️⃣ CSS Custom Properties (Design Tokens)

These can be overridden in AEM clientlibs:

```css
shadow-plyr.hero {
  --accent-color: #0066ff;
  --controls-bg: rgba(0,0,0,0.9);
  --center-play-bg: rgba(0,102,255,0.8);
  --center-play-size: 100px;
  --seekbar-height: 6px;
}
```

---

# 1️⃣3️⃣ Shadow Parts (Styling Hooks)

Exposed parts:

| Part Name       | Element              |
| --------------- | -------------------- |
| video-wrapper   | Wrapper div          |
| video-container | Container            |
| controls        | Controls bar         |
| video           | Native video element |

Example:

```css
shadow-plyr::part(controls) {
  border-radius: 12px;
}
```

---

# 1️⃣4️⃣ AEM Integration Notes

✔ Works inside HTL
✔ Compatible with ClientLib CSS overrides
✔ No global CSS leakage
✔ Safe for multi-instance pages
✔ Supports DAM video paths

Recommended pattern:

```html
<shadow-plyr
  class="cmp-video"
  data-sly-use.video="..."
  desktop-video="${video.path}"
></shadow-plyr>
```

---

# ⌨️ Keyboard Controls – `shadow-plyr`

Keyboard controls are active when:

* The video wrapper is focused (`tabindex="0"`)
* Video is initialized
* Controls are enabled (recommended: `show-controls="true"`)

The wrapper has:

```html
<div class="shadow-plyr-wrapper" tabindex="0" role="application">
```

So users must first **Tab into the player**.

---

# 🎮 Supported Keyboard Shortcuts

| Key           | Action        | Description                         |
| ------------- | ------------- | ----------------------------------- |
| `Space`       | Play / Pause  | Toggle playback                     |
| `K`           | Play / Pause  | YouTube-style shortcut              |
| `Arrow Left`  | Seek Back     | Jump back by `seek-step` seconds    |
| `Arrow Right` | Seek Forward  | Jump forward by `seek-step` seconds |
| `Arrow Up`    | Volume Up     | +0.1 volume                         |
| `Arrow Down`  | Volume Down   | -0.1 volume                         |
| `M`           | Mute / Unmute | Toggle mute                         |
| `F`           | Fullscreen    | Toggle fullscreen                   |
| `Home`        | Go to Start   | Seek to 0                           |
| `End`         | Go to End     | Seek to duration                    |
| `0 – 9`       | Jump %        | Jump to 0% – 90% of duration        |

---

# 🔢 Number Key Behavior

Pressing number keys jumps to percentage:

| Key | Jump To |
| --- | ------- |
| `0` | 0%      |
| `1` | 10%     |
| `5` | 50%     |
| `9` | 90%     |

Implementation:

```js
this.state.videoElement.currentTime =
  this.state.videoElement.duration * (parseInt(key) / 10);
```

---

# ⚙️ Config Affecting Keyboard

## `seek-step`

Controls arrow key jump duration.

```html
seek-step="10"
```

Arrow keys will now jump 10 seconds.

Default: 5 seconds

---

# 🎯 Accessibility Notes (Important for AEM)

✔ Wrapper has `tabindex="0"`
✔ ARIA role: `application`
✔ Seekbar uses `role="slider"`
✔ Volume uses `role="slider"`
✔ Buttons have `aria-label`

If you want enterprise accessibility compliance (WCAG 2.1 AA), I would recommend:

* Add `aria-valuetext` for seekbar
* Add `aria-valuetext` for volume slider
* Add focus ring styling via CSS token
* Announce time updates for screen readers (optional)

---

# 🧠 Focus Behavior

When keyboard interaction occurs:

```js
if (handled && this.state.$wrapper) {
  this.state.$wrapper.classList.add('show-controls');
}
```

So controls auto-show on keyboard interaction.

---

# 📌 Important Usage Tip (AEM)

If video is used in a hero banner, ensure it receives focus:

```html
<shadow-plyr class="hero-video" tabindex="0"></shadow-plyr>
```

Or auto-focus via JS if required.

---

# 🚀 If You Want Next-Level Keyboard UX

I can enhance it with:

* `J` / `L` for ±10 sec (YouTube style)
* Shift + Arrow = ±30 sec
* `C` for captions (future feature)
* `>` and `<` for speed control
* Better ARIA live region support
* Focus trap when fullscreen
* Configurable keyboard mapping

---


# 🏆 Final Summary

This component now supports:

* Lazy loading
* IntersectionObserver optimization
* Virtual playback engine
* Performance mode
* Design token theming
* CSS custom properties
* Shadow parts
* Analytics hooks
* AEM ready architecture
* Multi-instance optimization

---


