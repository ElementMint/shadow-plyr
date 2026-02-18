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
    preload: 'none' | 'metadata' | 'auto';
    desktopPoster: string;
    mobilePoster: string;
    desktopVideo: string;
    mobileVideo: string;
    videoType: string;
    showControls: boolean;
    controlsType: 'full' | 'minimal' | 'none';
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
    theme: 'dark' | 'light';
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
    doubleTapSeek:boolean;
    doubleTapSeekSeconds:number;
    showSeekButtons:boolean;
    seekButtonSeconds:number;
    tripleTapSeek:boolean;
    tripleTapSeconds:number;
    enableTapRipple:boolean;
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
  }
  
  /**
   * Detail object for custom events.
   */
  export interface VideoEventDetail {
    [key: string]: any;
  }