/**
 * Configuration options for the video player, derived from HTML attributes.
 */
export interface VideoPlayerConfig {
  lazy: boolean;
  pauseOnOutOfView: boolean;
  pauseOnTabHide: boolean;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  playsinline: boolean;
  preload: "none" | "metadata" | "auto";
  /** @deprecated Use <picture> child element instead */
  desktopPoster: string;
  /** @deprecated Use <picture> child element instead */
  mobilePoster: string;
  /** @deprecated Use <source> child elements instead */
  desktopVideo: string;
  /** @deprecated Use <source> child elements instead */
  mobileVideo: string;
  videoType: string;
  showControls: boolean;
  controlsType: "full" | "minimal" | "none";
  showPlayPause: boolean;
  showSeekbar: boolean;
  showVolume: boolean;
  showFullscreen: boolean;
  showCenterPlay: boolean;
  showSpeed: boolean;
  speedOptions: number[];
  controlsHideDelay: number;
  seekStep: number;
  lazyThreshold: number;
  pauseThreshold: number;
  theme: "dark" | "light";
  accentColor: string;
  controlsBackground: string;
  centerPlayBackground: string;
  centerPlaySize: number;
  showPosterOnEnded: boolean;
  resetOnEnded: boolean;
  posterClickPlay: boolean;
  performanceMode: boolean;
  showTooltips: boolean;
  tooltipPlay: string;
  tooltipPause: string;
  tooltipMute: string;
  tooltipUnmute: string;
  tooltipFullscreen: string;
  tooltipExitFullscreen: string;
  tooltipSpeed: string;
  tooltipCenterPlay: string;
  doubleTapSeek: boolean;
  doubleTapSeekSeconds: number;
  showSeekButtons: boolean;
  seekButtonSeconds: number;
  tripleTapSeek: boolean;
  tripleTapSeconds: number;
  enableTapRipple: boolean;
  singleActive?: boolean;
  showLoop?: boolean;
  showPip?: boolean;
  showSubtitles?: boolean;
  showQuality?: boolean;
  skipIntro?: number;
  theaterMode?: boolean;
  resume?: boolean;
  screenshot?: boolean;
  airplay?: boolean;
  miniPlayer?: boolean;
  responsiveControls?: boolean;
  bufferProgress?: boolean;

  // ── New features ──────────────────────────────────────────────────────────

  /**
   * Show a unified ⚙ settings button that groups Quality, Speed and
   * Subtitles into a single menu with sub-page navigation.
   * When `true`, the individual quality / speed / subtitle buttons are
   * placed inside the settings menu instead of the main controls bar.
   */
  showSettings?: boolean;
  /** Tooltip label for the settings button. Default: "Settings" */
  tooltipSettings?: string;

  /**
   * Custom message shown in the error overlay.
   * Default: "An error occurred while loading the video."
   */
  errorMessage?: string;
  /**
   * Custom SVG string used as the error icon.
   * Falls back to a built-in warning triangle when omitted.
   */
  errorIcon?: string;
  /**
   * When `true` (default) a "Try again" retry button appears in the
   * error overlay and re-triggers video load on click.
   */
  showRetry?: boolean;

  /**
   * URL of an image or GIF to use as a custom loading indicator.
   * Replaces the default CSS-spinner when set.
   */
  loaderSrc?: string;
  /**
   * Inline HTML string for a fully custom loader (e.g. an SVG animation).
   * Sanitised before insertion.
   * `loader-src` takes precedence when both are set.
   */
  loaderHtml?: string;
  /**
   * Loader type: `"spinner"` (default CSS spinner), `"skeleton"` (animated
   * skeleton shimmer mimicking the controls layout).
   */
  loaderType?: "spinner" | "skeleton";

  /**
   * Enable seekbar thumbnail preview on hover and while dragging.
   * Requires either `thumbnails-vtt` (sprite/VTT approach) or simply
   * works from the main video element when omitted.
   */
  showThumbnails?: boolean;
  /**
   * URL of a WebVTT file whose cues map time ranges to thumbnail images
   * (optionally with `#xywh=x,y,w,h` sprite fragments).
   * When omitted, frames are captured live from a hidden clone of the
   * video element.
   */
  thumbnailsVtt?: string;

  // ── Chapters ─────────────────────────────────────────────────────────────

  /**
   * Show chapter markers on the seekbar derived from a
   * `<track kind="chapters">` child element or the `chapters-vtt` attribute.
   */
  showChapters?: boolean;

  // ── Media Session ─────────────────────────────────────────────────────────

  /**
   * Title shown in the OS / browser media session controls (lock screen,
   * headphone buttons, media hub). Falls back to the page `<title>`.
   */
  mediaTitle?: string;
  /** Artist / creator name shown in media session controls. */
  mediaArtist?: string;
  /** Album / series name shown in media session controls. */
  mediaAlbum?: string;
  /**
   * URL of the artwork image shown in media session controls.
   * Defaults to the poster image when omitted.
   */
  mediaThumbnail?: string;

  // ── Analytics ─────────────────────────────────────────────────────────────

  /**
   * When `true`, fires `video-quartile` CustomEvents at the 25 %, 50 %,
   * 75 % and 100 % playback milestones.
   * Event detail: `{ quartile: 25 | 50 | 75 | 100, currentTime: number }`
   */
  analyticsEvents?: boolean;

  // ── Speed Memory ──────────────────────────────────────────────────────────

  /**
   * When `true`, the last-used playback speed is saved per-video to
   * localStorage (key: `shadowplyr-speed-<src>`) and restored on next load.
   * Each unique video source URL gets its own saved speed entry.
   */
  speedMemory?: boolean;

  // ── Watermark ─────────────────────────────────────────────────────────────

  /**
   * Watermark text or image URL to overlay on the player.
   * A URL ending in an image extension (png/jpg/gif/svg/webp) is rendered
   * as an `<img>`, otherwise the string is treated as text.
   */
  watermark?: string;
  /**
   * Position of the watermark.
   * One of: `top-left` | `top-right` | `bottom-left` | `bottom-right` | `center`.
   * Default: `top-right`.
   */
  watermarkPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  /** Opacity of the watermark (0–1). Default: 0.5. */
  watermarkOpacity?: number;
  /**
   * URL to navigate to when the watermark is clicked.
   * When set the watermark becomes an `<a>` element (opens in a new tab).
   */
  watermarkLink?: string;

  // ── Subtitle style overrides ──────────────────────────────────────────────

  /** Font size for subtitles, e.g. `"1.2em"` or `"18px"`. */
  subtitleFontSize?: string;
  /** CSS colour for subtitle text, e.g. `"#ffffff"`. */
  subtitleColor?: string;
  /** CSS colour / value for the subtitle background, e.g. `"rgba(0,0,0,0.6)"`. */
  subtitleBackground?: string;
  /** Font family for subtitle text. */
  subtitleFontFamily?: string;
  /** Font weight for subtitle text, e.g. `"bold"` or `"600"`. */
  subtitleFontWeight?: string;

  // ── Loop A→B ──────────────────────────────────────────────────────────────

  /**
   * Enable Loop A→B mode.
   * When active the user can mark a start point (`[` key) and an end point
   * (`]` key); playback loops between those two positions.
   * Set via the `loop-ab` attribute.
   */
  loopAb?: boolean;

  // ── Playlist ──────────────────────────────────────────────────────────────

  /**
   * JSON array of playlist items.
   * Each item: `{ src: string, title?: string, poster?: string, type?: string }`.
   * When set, the player shows Prev / Next buttons and auto-advances on ended.
   */
  playlist?: PlaylistItem[];

  // ── Hotspots ──────────────────────────────────────────────────────────────

  /**
   * JSON array of time-based clickable hotspot overlays.
   * Example: `[{"startTime":5,"endTime":15,"x":20,"y":30,"label":"Buy now","link":"https://…"}]`
   */
  hotspots?: HotspotDef[];

  // ── Auto quality ──────────────────────────────────────────────────────────

  /**
   * When `true`, the player measures available bandwidth on load and
   * automatically selects the best quality tier from the available `<source>`
   * elements (matched via `data-quality`).
   * Uses the Network Information API when available, falls back to a timed
   * fetch probe otherwise.
   */
  autoQuality?: boolean;
}

/** A single item in a playlist. */
export interface PlaylistItem {
  src: string;
  title?: string;
  poster?: string;
  type?: string;
}

/**
 * A time-based clickable hotspot overlaid on the video.
 * Coordinates are percentages of the player width/height (0–100).
 */
export interface HotspotDef {
  /** Time (seconds) at which the hotspot becomes visible. */
  startTime: number;
  /** Time (seconds) at which the hotspot disappears. Omit for persistent. */
  endTime?: number;
  /** Horizontal position as % of player width. */
  x: number;
  /** Vertical position as % of player height. */
  y: number;
  /** Width as % of player width. Default 10. */
  width?: number;
  /** Height as % of player height. Default 8. */
  height?: number;
  /** Label text shown inside the hotspot. */
  label?: string;
  /** URL to navigate to when clicked. */
  link?: string;
  /** Open link in new tab. Default true. */
  newTab?: boolean;
}

/**
 * Internal state of the player (UI references and runtime flags).
 */
export interface VideoPlayerState {
  observer: IntersectionObserver | null;
  isInitialized: boolean;
  videoElement: HTMLVideoElement | null;
  isPlaying: boolean;
  isDraggingSeekbar: boolean;
  isDraggingVolume: boolean;
  currentSpeed: number;
  videoLoaded: boolean;
  hasPoster: boolean;
  posterVisible: boolean;
  hasPlayedOnce: boolean;
  wasPlayingBeforeHidden: boolean;
  isPageVisible: boolean;
  rafId: number | null;
  $wrapper: HTMLElement | null;
  $seekbar: HTMLElement | null;
  $seekbarProgress: HTMLElement | null;
  $timeDisplay: HTMLElement | null;
  $volumeProgress: HTMLElement | null;
  $speedMenu: HTMLElement | null;
  $speedText: HTMLElement | null;
}

/**
 * Icon set used in the player.
 */
export interface IconSet {
  play: string;
  pause: string;
  volume: string;
  muted: string;
  fullscreen: string;
  exitFullscreen: string;
  speed: string;
  loopOnce: string;
  loop: string;
  pip: string;
  subtitle: string;
  quality: string;
  more: string;
  theater: string;
  screenshot: string;
  airplay: string;
  miniplayer: string;
  /** Gear / settings icon (built-in, not user-overridable via attribute) */
  settings: string;
}

/**
 * Parsed WebVTT thumbnail cue.
 */
export interface ThumbnailVttCue {
  start: number;
  end: number;
  url: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Parsed WebVTT chapter cue.
 */
export interface ChapterCue {
  start: number;
  end: number;
  title: string;
}

/**
 * Detail object for custom events.
 */
export interface VideoEventDetail {
  [key: string]: any;
}