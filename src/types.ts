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
   * Sanitised with DOMPurify before insertion.
   * `loader-src` takes precedence when both are set.
   */
  loaderHtml?: string;

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
 * Detail object for custom events.
 */
export interface VideoEventDetail {
  [key: string]: any;
}