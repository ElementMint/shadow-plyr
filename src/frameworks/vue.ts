/**
 * Vue 3 wrapper for <shadow-plyr>
 *
 * Usage
 * ─────
 * npm install @elementmints/shadow-plyr
 *
 * // main.ts / main.js
 * import { createApp } from 'vue';
 * import App from './App.vue';
 * import '@elementmints/shadow-plyr';          // registers <shadow-plyr>
 * createApp(App).mount('#app');
 *
 * // SomeComponent.vue
 * <template>
 *   <ShadowPlyrVue
 *     src="video.mp4"
 *     :show-controls="true"
 *     :show-seekbar="true"
 *     accent-color="#6f8dff"
 *     @video-ready="onReady"
 *     @video-playing="onPlay"
 *     @video-quartile="onQuartile"
 *   />
 * </template>
 * <script setup lang="ts">
 * import { ShadowPlyrVue } from '@elementmints/shadow-plyr/vue';
 * const onReady   = (e: CustomEvent) => console.log('ready',    e.detail);
 * const onPlay    = (e: CustomEvent) => console.log('playing',  e.detail);
 * const onQuartile= (e: CustomEvent) => console.log('quartile', e.detail);
 * </script>
 *
 * Vite / Nuxt: add the custom element to the `compilerOptions.isCustomElement`
 * resolver so Vue doesn't warn about unknown elements:
 *
 *   // vite.config.ts
 *   vue({ template: { compilerOptions: { isCustomElement: (t) => t === 'shadow-plyr' } } })
 */

import type { DefineComponent } from "vue";

/** All writable attributes exposed as Vue props (camelCase). */
export interface ShadowPlyrVueProps {
  // Playback
  src?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsinline?: boolean;
  preload?: "none" | "metadata" | "auto";

  // Controls
  showControls?: boolean;
  controlsType?: "full" | "minimal" | "none";
  showPlayPause?: boolean;
  showSeekbar?: boolean;
  showVolume?: boolean;
  showFullscreen?: boolean;
  showCenterPlay?: boolean;
  showSpeed?: boolean;
  speedOptions?: string;
  showLoop?: boolean;
  showPip?: boolean;
  showSubtitles?: boolean;
  showQuality?: boolean;
  showSettings?: boolean;
  showSeekButtons?: boolean;
  seekButtonSeconds?: number;
  responsiveControls?: boolean;
  bufferProgress?: boolean;

  // Gestures
  doubleTapSeek?: boolean;
  doubleTapSeekSeconds?: number;
  tripleTapSeek?: boolean;
  tripleTapSeconds?: number;
  enableTapRipple?: boolean;
  seekStep?: number;

  // Appearance
  accentColor?: string;
  controlsBackground?: string;
  centerPlayBackground?: string;
  centerPlaySize?: number;
  theme?: "dark" | "light";
  showTooltips?: boolean;

  // Features
  theaterMode?: boolean;
  resume?: boolean;
  screenshot?: boolean;
  airplay?: boolean;
  miniPlayer?: boolean;
  skipIntro?: number;
  lazy?: boolean;
  pauseOnOutOfView?: boolean;
  pauseOnTabHide?: boolean;
  singleActive?: boolean;
  performanceMode?: boolean;

  // Thumbnails
  showThumbnails?: boolean;
  thumbnailsVtt?: string;

  // Chapters
  showChapters?: boolean;

  // Media Session
  mediaTitle?: string;
  mediaArtist?: string;
  mediaAlbum?: string;
  mediaThumbnail?: string;

  // Analytics
  analyticsEvents?: boolean;

  // Speed memory
  speedMemory?: boolean;

  // Watermark
  watermark?: string;
  watermarkPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  watermarkOpacity?: number;
  watermarkLink?: string;

  // Subtitle style
  subtitleFontSize?: string;
  subtitleColor?: string;
  subtitleBackground?: string;
  subtitleFontFamily?: string;
  subtitleFontWeight?: string;

  // Loop A→B
  loopAb?: boolean;

  // Playlist
  playlist?: string; // JSON string

  // Error / Loader
  errorMessage?: string;
  showRetry?: boolean;
  loaderSrc?: string;
}

/** Emitted custom events (use @event-name in templates). */
export interface ShadowPlyrVueEmits {
  (e: "video-ready",            detail: CustomEvent): void;
  (e: "video-playing",          detail: CustomEvent): void;
  (e: "video-paused",           detail: CustomEvent): void;
  (e: "video-ended",            detail: CustomEvent): void;
  (e: "video-error",            detail: CustomEvent): void;
  (e: "video-volume-change",    detail: CustomEvent): void;
  (e: "video-seeking",          detail: CustomEvent): void;
  (e: "video-seeked",           detail: CustomEvent): void;
  (e: "video-loop-change",      detail: CustomEvent): void;
  (e: "video-fullscreen-enter", detail: CustomEvent): void;
  (e: "video-fullscreen-exit",  detail: CustomEvent): void;
  (e: "theater-mode-change",    detail: CustomEvent): void;
  (e: "mini-player-change",     detail: CustomEvent): void;
  (e: "video-quartile",         detail: CustomEvent): void;
  (e: "video-chapter-change",   detail: CustomEvent): void;
}

// ── Prop → attribute name mapping ───────────────────────────────────────────
const PROP_TO_ATTR: Record<string, string> = {
  showControls:         "show-controls",
  controlsType:         "controls-type",
  showPlayPause:        "show-play-pause",
  showSeekbar:          "show-seekbar",
  showVolume:           "show-volume",
  showFullscreen:       "show-fullscreen",
  showCenterPlay:       "show-center-play",
  showSpeed:            "show-speed",
  speedOptions:         "speed-options",
  showLoop:             "show-loop",
  showPip:              "show-pip",
  showSubtitles:        "show-subtitles",
  showQuality:          "show-quality",
  showSettings:         "show-settings",
  showSeekButtons:      "show-seek-buttons",
  seekButtonSeconds:    "seek-button-seconds",
  responsiveControls:   "responsive-controls",
  bufferProgress:       "buffer-progress",
  doubleTapSeek:        "double-tap-seek",
  doubleTapSeekSeconds: "double-tap-seek-seconds",
  tripleTapSeek:        "triple-tap-seek",
  tripleTapSeconds:     "triple-tap-seconds",
  enableTapRipple:      "enable-tap-ripple",
  seekStep:             "seek-step",
  accentColor:          "accent-color",
  controlsBackground:   "controls-background",
  centerPlayBackground: "center-play-background",
  centerPlaySize:       "center-play-size",
  showTooltips:         "show-tooltips",
  theaterMode:          "theater-mode",
  miniPlayer:           "mini-player",
  skipIntro:            "skip-intro",
  pauseOnOutOfView:     "pause-on-out-of-view",
  pauseOnTabHide:       "pause-on-tab-hide",
  singleActive:         "single-active",
  performanceMode:      "performance-mode",
  showThumbnails:       "show-thumbnails",
  thumbnailsVtt:        "thumbnails-vtt",
  showChapters:         "show-chapters",
  mediaTitle:           "media-title",
  mediaArtist:          "media-artist",
  mediaAlbum:           "media-album",
  mediaThumbnail:       "media-thumbnail",
  analyticsEvents:      "analytics-events",
  speedMemory:          "speed-memory",
  watermark:            "watermark",
  watermarkPosition:    "watermark-position",
  watermarkOpacity:     "watermark-opacity",
  watermarkLink:        "watermark-link",
  subtitleFontSize:     "subtitle-font-size",
  subtitleColor:        "subtitle-color",
  subtitleBackground:   "subtitle-background",
  subtitleFontFamily:   "subtitle-font-family",
  subtitleFontWeight:   "subtitle-font-weight",
  loopAb:               "loop-ab",
  playlist:             "playlist",
  errorMessage:         "error-message",
  showRetry:            "show-retry",
  loaderSrc:            "loader-src",
};

const ALL_EVENTS = [
  "video-ready", "video-playing", "video-paused", "video-ended",
  "video-error", "video-volume-change", "video-seeking", "video-seeked",
  "video-loop-change", "video-fullscreen-enter", "video-fullscreen-exit",
  "theater-mode-change", "mini-player-change", "video-quartile",
  "video-chapter-change",
];

/**
 * Vue 3 component that wraps <shadow-plyr>.
 * Props mirror all HTML attributes in camelCase; events are forwarded as-is
 * so Vue's `@video-ready` syntax works natively.
 *
 * Register globally:
 *   app.component('ShadowPlyrVue', ShadowPlyrVue)
 *
 * Or use locally:
 *   import { ShadowPlyrVue } from '@elementmints/shadow-plyr/vue';
 */
export const ShadowPlyrVue: DefineComponent<ShadowPlyrVueProps> = {
  name: "ShadowPlyrVue",

  props: Object.keys(PROP_TO_ATTR).reduce(
    (acc, key) => { acc[key] = { default: undefined }; return acc; },
    {} as Record<string, { default: undefined }>
  ),

  emits: ALL_EVENTS,

  setup(props: ShadowPlyrVueProps, { emit, slots }: any) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { ref, onMounted, onUnmounted, h } = require("vue");
    const elRef = ref<HTMLElement | null>(null);
    const cleanups: (() => void)[] = [];

    onMounted(() => {
      const el = elRef.value;
      if (!el) return;
      ALL_EVENTS.forEach((name) => {
        const listener = (e: Event) => emit(name, e);
        el.addEventListener(name, listener);
        cleanups.push(() => el.removeEventListener(name, listener));
      });
    });

    onUnmounted(() => cleanups.forEach((fn) => fn()));

    return () => {
      // Build attrs object from props
      const attrs: Record<string, string> = {};
      (Object.keys(props) as (keyof ShadowPlyrVueProps)[]).forEach((key) => {
        const val = props[key];
        if (val === undefined || val === null) return;
        const attrName = PROP_TO_ATTR[key] ?? key.toLowerCase();
        attrs[attrName] = String(val);
      });

      return h("shadow-plyr", { ...attrs, ref: elRef }, slots.default?.());
    };
  },
} as unknown as DefineComponent<ShadowPlyrVueProps>;
