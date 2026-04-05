/**
 * React / Next.js wrapper for <shadow-plyr>
 *
 * Usage
 * ─────
 * npm install @elementmints/shadow-plyr
 *
 * // React 18 / Next.js (App Router or Pages)
 * import { ShadowPlyrReact } from '@elementmints/shadow-plyr/react';
 *
 * export default function Page() {
 *   return (
 *     <ShadowPlyrReact
 *       src="video.mp4"
 *       showControls
 *       showSeekbar
 *       showPlayPause
 *       showVolume
 *       showFullscreen
 *       accentColor="#6f8dff"
 *       onVideoReady={(e) => console.log('ready', e.detail)}
 *       onVideoPlaying={(e) => console.log('playing')}
 *     />
 *   );
 * }
 *
 * Next.js (App Router) — add 'use client' to the file that imports this, or
 * wrap with next/dynamic: `const ShadowPlyrReact = dynamic(() => import(…), { ssr: false })`
 */

// NOTE: This file contains TypeScript JSX types but NO React runtime import.
// Consumers must have `react` installed.  We keep it import-free so this
// wrapper is a zero-cost peer-dependency shim.

export interface ShadowPlyrReactProps
  extends React.HTMLAttributes<HTMLElement> {
  // ── Playback ──────────────────────────────────────────────────────────────
  src?: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsinline?: boolean;
  preload?: "none" | "metadata" | "auto";

  // ── Controls ──────────────────────────────────────────────────────────────
  showControls?: boolean;
  controlsType?: "full" | "minimal" | "none";
  showPlayPause?: boolean;
  showSeekbar?: boolean;
  showVolume?: boolean;
  showFullscreen?: boolean;
  showCenterPlay?: boolean;
  showSpeed?: boolean;
  speedOptions?: string; // comma-separated, e.g. "0.5,1,1.5,2"
  showLoop?: boolean;
  showPip?: boolean;
  showSubtitles?: boolean;
  showQuality?: boolean;
  showSettings?: boolean;
  showSeekButtons?: boolean;
  seekButtonSeconds?: number;
  responsiveControls?: boolean;
  bufferProgress?: boolean;

  // ── Seek / gestures ───────────────────────────────────────────────────────
  doubleTapSeek?: boolean;
  doubleTapSeekSeconds?: number;
  tripleTapSeek?: boolean;
  tripleTapSeconds?: number;
  enableTapRipple?: boolean;
  seekStep?: number;

  // ── Appearance ────────────────────────────────────────────────────────────
  accentColor?: string;
  controlsBackground?: string;
  centerPlayBackground?: string;
  centerPlaySize?: number;
  theme?: "dark" | "light";
  showTooltips?: boolean;

  // ── Features ──────────────────────────────────────────────────────────────
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

  // ── Thumbnails ────────────────────────────────────────────────────────────
  showThumbnails?: boolean;
  thumbnailsVtt?: string;

  // ── Chapters ──────────────────────────────────────────────────────────────
  showChapters?: boolean;

  // ── Media Session ─────────────────────────────────────────────────────────
  mediaTitle?: string;
  mediaArtist?: string;
  mediaAlbum?: string;
  mediaThumbnail?: string;

  // ── Analytics ─────────────────────────────────────────────────────────────
  analyticsEvents?: boolean;

  // ── Speed memory ──────────────────────────────────────────────────────────
  speedMemory?: boolean;

  // ── Watermark ─────────────────────────────────────────────────────────────
  watermark?: string;
  watermarkPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  watermarkOpacity?: number;
  watermarkLink?: string;

  // ── Subtitle style ────────────────────────────────────────────────────────
  subtitleFontSize?: string;
  subtitleColor?: string;
  subtitleBackground?: string;
  subtitleFontFamily?: string;
  subtitleFontWeight?: string;

  // ── Loop A→B ──────────────────────────────────────────────────────────────
  loopAb?: boolean;

  // ── Playlist ──────────────────────────────────────────────────────────────
  playlist?: string; // JSON string

  // ── Error / Loader ────────────────────────────────────────────────────────
  errorMessage?: string;
  showRetry?: boolean;
  loaderSrc?: string;

  // ── Custom events ─────────────────────────────────────────────────────────
  onVideoReady?: (e: CustomEvent) => void;
  onVideoPlaying?: (e: CustomEvent) => void;
  onVideoPaused?: (e: CustomEvent) => void;
  onVideoEnded?: (e: CustomEvent) => void;
  onVideoError?: (e: CustomEvent) => void;
  onVideoVolumeChange?: (e: CustomEvent) => void;
  onVideoSeeking?: (e: CustomEvent) => void;
  onVideoSeeked?: (e: CustomEvent) => void;
  onVideoLoopChange?: (e: CustomEvent) => void;
  onVideoFullscreenEnter?: (e: CustomEvent) => void;
  onVideoFullscreenExit?: (e: CustomEvent) => void;
  onTheaterModeChange?: (e: CustomEvent) => void;
  onMiniPlayerChange?: (e: CustomEvent) => void;
  onVideoQuartile?: (e: CustomEvent) => void;
  onVideoChapterChange?: (e: CustomEvent) => void;
}

// ── Prop → attribute name mapping ────────────────────────────────────────────
const BOOL_ATTRS: (keyof ShadowPlyrReactProps)[] = [
  "autoplay","muted","loop","playsinline","showControls","showPlayPause",
  "showSeekbar","showVolume","showFullscreen","showCenterPlay","showSpeed",
  "showLoop","showPip","showSubtitles","showQuality","showSettings",
  "showSeekButtons","responsiveControls","bufferProgress","doubleTapSeek",
  "tripleTapSeek","enableTapRipple","showTooltips","theaterMode","resume",
  "screenshot","airplay","miniPlayer","lazy","pauseOnOutOfView",
  "pauseOnTabHide","singleActive","performanceMode","showThumbnails",
  "showChapters","analyticsEvents","showRetry","speedMemory","loopAb",
];

const PROP_TO_ATTR: Partial<Record<keyof ShadowPlyrReactProps, string>> = {
  showControls:        "show-controls",
  controlsType:        "controls-type",
  showPlayPause:       "show-play-pause",
  showSeekbar:         "show-seekbar",
  showVolume:          "show-volume",
  showFullscreen:      "show-fullscreen",
  showCenterPlay:      "show-center-play",
  showSpeed:           "show-speed",
  speedOptions:        "speed-options",
  showLoop:            "show-loop",
  showPip:             "show-pip",
  showSubtitles:       "show-subtitles",
  showQuality:         "show-quality",
  showSettings:        "show-settings",
  showSeekButtons:     "show-seek-buttons",
  seekButtonSeconds:   "seek-button-seconds",
  responsiveControls:  "responsive-controls",
  bufferProgress:      "buffer-progress",
  doubleTapSeek:       "double-tap-seek",
  doubleTapSeekSeconds:"double-tap-seek-seconds",
  tripleTapSeek:       "triple-tap-seek",
  tripleTapSeconds:    "triple-tap-seconds",
  enableTapRipple:     "enable-tap-ripple",
  seekStep:            "seek-step",
  accentColor:         "accent-color",
  controlsBackground:  "controls-background",
  centerPlayBackground:"center-play-background",
  centerPlaySize:      "center-play-size",
  showTooltips:        "show-tooltips",
  theaterMode:         "theater-mode",
  miniPlayer:          "mini-player",
  skipIntro:           "skip-intro",
  pauseOnOutOfView:    "pause-on-out-of-view",
  pauseOnTabHide:      "pause-on-tab-hide",
  singleActive:        "single-active",
  performanceMode:     "performance-mode",
  showThumbnails:      "show-thumbnails",
  thumbnailsVtt:       "thumbnails-vtt",
  showChapters:        "show-chapters",
  mediaTitle:          "media-title",
  mediaArtist:         "media-artist",
  mediaAlbum:          "media-album",
  mediaThumbnail:      "media-thumbnail",
  analyticsEvents:     "analytics-events",
  speedMemory:         "speed-memory",
  watermark:           "watermark",
  watermarkPosition:   "watermark-position",
  watermarkOpacity:    "watermark-opacity",
  watermarkLink:       "watermark-link",
  subtitleFontSize:    "subtitle-font-size",
  subtitleColor:       "subtitle-color",
  subtitleBackground:  "subtitle-background",
  subtitleFontFamily:  "subtitle-font-family",
  subtitleFontWeight:  "subtitle-font-weight",
  loopAb:              "loop-ab",
  playlist:            "playlist",
  errorMessage:        "error-message",
  showRetry:           "show-retry",
  loaderSrc:           "loader-src",
};

// ── Event → DOM event name mapping ───────────────────────────────────────────
const EVENT_MAP: Partial<Record<keyof ShadowPlyrReactProps, string>> = {
  onVideoReady:            "video-ready",
  onVideoPlaying:          "video-playing",
  onVideoPaused:           "video-paused",
  onVideoEnded:            "video-ended",
  onVideoError:            "video-error",
  onVideoVolumeChange:     "video-volume-change",
  onVideoSeeking:          "video-seeking",
  onVideoSeeked:           "video-seeked",
  onVideoLoopChange:       "video-loop-change",
  onVideoFullscreenEnter:  "video-fullscreen-enter",
  onVideoFullscreenExit:   "video-fullscreen-exit",
  onTheaterModeChange:     "theater-mode-change",
  onMiniPlayerChange:      "mini-player-change",
  onVideoQuartile:         "video-quartile",
  onVideoChapterChange:    "video-chapter-change",
};

/**
 * Thin React wrapper around <shadow-plyr>.
 * Converts camelCase props to kebab-case HTML attributes and wires up
 * custom DOM events as React-style callbacks.
 *
 * Compatible with React 18+ and Next.js (mark the importing file with
 * 'use client' in the App Router, or use `next/dynamic` with `ssr: false`).
 */
export function ShadowPlyrReact(
  props: ShadowPlyrReactProps
): React.ReactElement {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require("react") as typeof import("react");
  const ref = React.useRef<HTMLElement>(null);

  // Sync custom events to handler props
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cleanups: (() => void)[] = [];

    (Object.keys(EVENT_MAP) as (keyof ShadowPlyrReactProps)[]).forEach((key) => {
      const handler = props[key] as ((e: CustomEvent) => void) | undefined;
      const eventName = EVENT_MAP[key];
      if (handler && eventName) {
        const listener = (e: Event) => handler(e as CustomEvent);
        el.addEventListener(eventName, listener);
        cleanups.push(() => el.removeEventListener(eventName, listener));
      }
    });

    return () => cleanups.forEach((fn) => fn());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  // Build the attribute object for the web component
  const attrs: Record<string, string> = {};
  (Object.keys(props) as (keyof ShadowPlyrReactProps)[]).forEach((key) => {
    if (key in EVENT_MAP || key === "ref" || key === "children") return;
    const val = props[key];
    if (val === undefined || val === null) return;

    const attrName = PROP_TO_ATTR[key] ?? key.toLowerCase();

    if (BOOL_ATTRS.includes(key)) {
      // Boolean: pass "true" / "false" string so the WC parser picks it up
      attrs[attrName] = String(val);
    } else {
      attrs[attrName] = String(val);
    }
  });

  return React.createElement("shadow-plyr", { ...attrs, ref }, props.children);
}

// Augment the global JSX namespace so TypeScript accepts <shadow-plyr> directly
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "shadow-plyr": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & Record<string, unknown>,
        HTMLElement
      >;
    }
  }
}
