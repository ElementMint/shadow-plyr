import { VideoPlayerConfig, IconSet } from './types';
import { DEFAULT_ICONS, IconCache } from './icons';
import { throttle } from './utils';
import DOMPurify from 'dompurify';

// ---------- SHARED STATIC STYLES (Constructable Stylesheet) ----------
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  :host { display: block; position: relative; width: 100%; max-width: 100%; height:100%; }
  * { box-sizing: border-box; }
  .video-container {
    position: relative; width: 100%; aspect-ratio:var(--aspect-ratio,16:9); background: #000;
    overflow: hidden;
    height:100%;
  }
  .shadow-plyr-wrapper {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center; outline: none;
  }
  video {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    object-fit: contain !important; display: block; pointer-events: auto !important;
    opacity: 0; transition: opacity .3s ease; will-change: opacity;
  }
  .video-loaded.is-playing video,
  .video-loaded:not(.poster-visible) video { opacity: 1 !important; }
  video::-webkit-media-controls { display: none !important; }
  picture {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block;
    z-index: 5; opacity: 0; transition: opacity .3s ease; pointer-events: none;
    cursor: pointer;
  }
  picture img { width: 100%; height: 100%; object-fit: contain !important; display: block; }
  .poster-visible picture { opacity: 1 !important; pointer-events: auto !important; }
  .video-loading::after {
    content: ''; position: absolute; top: 50%; left: 50%; width: 40px; height: 40px;
    margin: -20px 0 0 -20px; border: 3px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%; animation: spin .8s linear infinite;
    z-index: 10;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  /* ----- CSS CUSTOM PROPERTIES (allows external styling) ----- */
  .video-center-play {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
    width: var(--center-play-size, 80px); height: var(--center-play-size, 80px);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .3s ease; z-index: 20; opacity: 0;
    pointer-events: none; box-shadow: 0 4px 20px rgba(0,0,0,.3);
    background: var(--center-play-bg, rgba(0,0,0,.7)); will-change: transform,opacity;
  }
  .video-center-play svg {
    width: calc(var(--center-play-size, 80px) * 0.5);
    height: calc(var(--center-play-size, 80px) * 0.5);
    fill: var(--accent-color, #fff);
    color:var(--accent-color, #fff);
  }
  .video-loaded .video-center-play { opacity: .8; pointer-events: auto; }
  .video-loaded.is-playing .video-center-play { opacity: 0; pointer-events: none; }
  .video-loaded.is-playing:hover .video-center-play { opacity: .8; pointer-events: auto; }
  .video-center-play:hover { transform: translate(-50%,-50%) scale(1.1); }
  .video-controls-bar {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 40px 15px 15px; display: flex; flex-direction: column; gap: 10px;
    transition: opacity .3s ease, transform .3s ease; z-index: 25; opacity: 0;
    transform: translateY(100%); pointer-events: none; will-change: transform,opacity;
    background: var(--controls-bg, linear-gradient(to top, rgba(0,0,0,.8), transparent));
  }
  .video-loaded:not(.is-playing) .video-controls-bar,
  .video-loaded:hover .video-controls-bar,
  .video-loaded.show-controls .video-controls-bar,
  .video-loaded.is-playing:hover .video-controls-bar {
    opacity: 1; transform: translateY(0); pointer-events: auto;
  }
  .video-loaded.is-playing .video-controls-bar { opacity: 0; transform: translateY(100%); pointer-events: none; }
  .video-seekbar {
    width: 100%; height: var(--seekbar-height, 5px); background: rgba(255,255,255,.3);
    border-radius: 3px; cursor: pointer; position: relative; margin-bottom: 5px;
  }
  .video-seekbar-progress {
    height: 100%; border-radius: 3px; width: 0%; position: relative;
    transition: width .1s linear; background: var(--accent-color, #fff); will-change: width;
  }
  .video-seekbar-handle {
    position: absolute; right: -6px; top: 50%; transform: translateY(-50%);
    width: 12px; height: 12px; border-radius: 50%; background: var(--accent-color, #fff);
    opacity: 0; transition: opacity .2s;
  }
  .video-seekbar:hover .video-seekbar-handle { opacity: 1; }
  .video-controls-row { display: flex; align-items: center; gap: 15px; }
  .video-control-btn {
    background: none; border: none; cursor: pointer; padding: 5px;
    display: flex; align-items: center; justify-content: center; transition: transform .2s;
  }
  .video-control-btn:hover { transform: scale(1.1); background: rgba(255,255,255,.1); }
  .video-control-btn svg { width: 24px; height: 24px; fill: var(--accent-color, #fff); color:var(--accent-color,#fff); }
  .video-control-btn.play-pause svg { width: 28px; height: 28px; }
  .video-volume-control { display: flex; align-items: center; gap: 8px; }
  .video-volume-slider {
    width: 0; height: 3px; background: rgba(255,255,255,.3); border-radius: 3px;
    cursor: pointer; position: relative; overflow: hidden; transition: width .3s ease;
  }
  .video-volume-control:hover .video-volume-slider { width: 60px; }
  .video-volume-progress {
    height: 100%; width: 100%; transition: width .1s;
    background: var(--accent-color, #fff); will-change: width;
  }
  .video-controls-spacer { flex: 1; }
  .video-time-display {
    font-size: 13px; font-family: monospace; user-select: none;
    color: var(--accent-color, #fff);
  }
  .video-speed-control { position: relative; }
  .video-speed-btn { min-width: 45px; font-size: 13px; font-weight: 600; color:var(--accent-color,#fff) }
  .video-speed-menu {
    position: absolute; bottom: 100%; right: 0; border-radius: 4px; padding: 5px 0;
    margin-bottom: 10px; min-width: 80px; opacity: 0; visibility: hidden;
    transform: translateY(10px); transition: all .2s ease; z-index: 100;
    background: var(--controls-bg, rgba(0,0,0,.8));
  }
  .video-speed-menu.active { opacity: 1; visibility: visible; transform: translateY(0); }
  .video-speed-option {
    display: block; width: 100%; padding: 8px 15px; background: none; border: none;
    font-size: 13px; text-align: left; cursor: pointer; transition: background .2s;
    color: var(--accent-color, #fff);
  }
  .video-speed-option:hover { background: rgba(255,255,255,.1); }
  .video-speed-option.active { background: rgba(255,255,255,.2); font-weight: 600; }
  .video-control-btn:focus-visible,
  .video-seekbar:focus-visible,
  .video-volume-slider:focus-visible { outline: 2px solid var(--accent-color, #fff); outline-offset: 2px; }
  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border-width: 0;
  }
  /* ----- Tooltip styles ----- */
  .tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-bottom: 8px;
    padding: 4px 8px;
    background: var(--tooltip-bg,rgba(0,0,0,0.8));
    color: var(--tooltip-color,#fff);
    font-size: var(--tooltip-font-size,12px);
    white-space: nowrap;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 30;
  }
  .video-control-btn:hover .tooltip,
  .video-center-play:hover .tooltip {
    opacity: 1;
  }
  @media (max-width: 768px) {
    .video-center-play { width: 60px; height: 60px; }
    .video-center-play svg { width: 30px; height: 30px; }
    .video-controls-bar { padding: 30px 10px 10px; }
    .video-control-btn svg { width: 20px; height: 20px; }
    .video-volume-slider { display: none; }
    .video-time-display { font-size: 11px; }
  }

  .tap-ripple {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255,255,255,0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple-expand 0.6s ease-out forwards;
  pointer-events: none;
  z-index: 50;
}

@keyframes ripple-expand {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(8);
  }
}

.video-seek-buttons {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.video-seek-buttons button {
  pointer-events: auto;
  width: 30%;
  height: 60%;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  opacity: 0.6;
}
.seek-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-size: 32px;
  color: white;
  font-weight: bold;
  pointer-events: none;
  animation: fadeOut 0.6s forwards;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

`);

// ---------- GLOBAL VIDEO ENGINE ----------
const GlobalVideoEngine = (() => {
  const instances = new Set<ShadowPlyr>();
  let activeInstance: ShadowPlyr | null = null;
  return {
    register(instance: ShadowPlyr) { instances.add(instance); },
    unregister(instance: ShadowPlyr) { instances.delete(instance); if (activeInstance === instance) activeInstance = null; },
    requestPlay(instance: ShadowPlyr) {
      if (activeInstance && activeInstance !== instance) activeInstance.pauseVideo(true);
      activeInstance = instance;
    }
  };
})();

// ---------- MAIN COMPONENT ----------
export class ShadowPlyr extends HTMLElement {
  // Private fields
  #shadowRoot: ShadowRoot;
  #configCache: VideoPlayerConfig | null = null;
  #configCacheTime = 0;
  readonly #CONFIG_CACHE_DURATION = 10000;

  // State
  #observer: IntersectionObserver | null = null;
  #isInitialized = false;
  #videoElement: HTMLVideoElement | null = null;
  #isPlaying = false;
  #isDraggingSeekbar = false;
  #isDraggingVolume = false;
  #currentSpeed = 1;
  #videoLoaded = false;
  #hasPoster = false;
  #posterVisible = false;
  #hasPlayedOnce = false;
  #wasPlayingBeforeHidden = false;
  #isPageVisible = true;
  #rafId: number | null = null;
  #$wrapper: HTMLElement | null = null;
  #$seekbar: HTMLElement | null = null;
  #$seekbarProgress: HTMLElement | null = null;
  #$timeDisplay: HTMLElement | null = null;
  #$volumeProgress: HTMLElement | null = null;
  #$speedMenu: HTMLElement | null = null;
  #$speedText: HTMLElement | null = null;
  #tapCount = 0;
  #tapTimeout: number | null = null;


  // Event handlers as arrow properties (auto-bound)
  #handleKeyboard = (e: KeyboardEvent): void => {
    if (!this.#videoElement) return;
    const key = e.key.toLowerCase();
    const config = this.#getConfig();
    let handled = false;
    const actions: Record<string, () => void> = {
      ' ': () => this.#togglePlayPause(),
      'k': () => this.#togglePlayPause(),
      'arrowleft': () => this.#seekBackward(),
      'arrowright': () => this.#seekForward(),
      'arrowup': () => this.#adjustVolume(0.1),
      'arrowdown': () => this.#adjustVolume(-0.1),
      'm': () => this.#toggleMute(),
      'f': () => this.#toggleFullscreen(),
      'home': () => { if (this.#videoElement) this.#videoElement.currentTime = 0; },
      'end': () => { if (this.#videoElement) this.#videoElement.currentTime = this.#videoElement.duration; },
    };
    if (actions[key]) { e.preventDefault(); actions[key](); handled = true; }
    else if (key >= '0' && key <= '9' && this.#videoElement.duration) {
      e.preventDefault();
      this.#videoElement.currentTime = this.#videoElement.duration * (parseInt(key) / 10);
      handled = true;
    }
    if (handled && this.#$wrapper) this.#$wrapper.classList.add('show-controls');
  };

  #togglePlayPause = (e?: Event): void => {
    if (e) e.stopPropagation();
    if (!this.#videoElement) return;
    if (this.#isPlaying) this.pauseVideo();
    else this.playVideo();
  };

  #toggleMute = (e?: Event): void => {
    if (e) e.stopPropagation();
    if (this.#videoElement) this.#videoElement.muted = !this.#videoElement.muted;
  };

  #toggleFullscreen = (e?: Event): void => {
    if (e) e.stopPropagation();
    const elem = this.#shadowRoot.querySelector('.video-container');
    if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
      if (elem?.requestFullscreen) elem.requestFullscreen();
      else if (elem && 'webkitRequestFullscreen' in elem) (elem as any).webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
    }
  };

  #seekTo = (percent: number): void => {
    if (this.#videoElement?.duration) {
      this.#videoElement.currentTime = this.#videoElement.duration * percent;
    }
  };

  #setVolume = (percent: number): void => {
    if (this.#videoElement) {
      const vol = Math.max(0, Math.min(1, percent));
      this.#videoElement.volume = vol;
      this.#videoElement.muted = vol === 0;
    }
  };

  #setSpeed = (speed: number, wrapper?: HTMLElement): void => {
    if (this.#videoElement) {
      this.#videoElement.playbackRate = speed;
      this.#currentSpeed = speed;
      wrapper?.querySelectorAll('.video-speed-option').forEach(opt => {
        opt.classList.toggle('active', parseFloat(opt.getAttribute('data-speed')!) === speed);
      });
      if (this.#$speedText) this.#$speedText.textContent = speed + 'x';
    }
  };

  #visibilityChange = (): void => {
    if (!this.#videoLoaded || !this.#videoElement) return;
    if (document.hidden) {
      if (this.#isPlaying) {
        this.#wasPlayingBeforeHidden = true;
        this.pauseVideo();
      }
    } else {
      if (this.#wasPlayingBeforeHidden && !this.#isPlaying) {
        this.playVideo();
        this.#wasPlayingBeforeHidden = false;
      }
    }
  };

  #pageHide = (): void => {
    if (this.#isPlaying) {
      this.#wasPlayingBeforeHidden = true;
      this.pauseVideo();
    }
  };

  #pageShow = (): void => {
    if (this.#wasPlayingBeforeHidden && !this.#isPlaying) {
      this.playVideo();
      this.#wasPlayingBeforeHidden = false;
    }
  };

  #posterClick = (): void => {
    const config = this.#getConfig();
    if (config.posterClickPlay && this.#videoElement && !this.#hasPlayedOnce) {
      this.playVideo();
    }
  };

  #onSeekbarMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    this.#isDraggingSeekbar = true;
    const seekbar = e.currentTarget as HTMLElement;

    const rect = seekbar.getBoundingClientRect();
    this.#seekTo((e.clientX - rect.left) / rect.width);

    const onMouseMove = (e: MouseEvent) => {
      if (!this.#isDraggingSeekbar) return;
      e.preventDefault();
      const rect = seekbar.getBoundingClientRect();
      this.#seekTo((e.clientX - rect.left) / rect.width);
    };

    const onMouseUp = () => {
      this.#isDraggingSeekbar = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  #onSeekbarTouchStart = (e: TouchEvent): void => {
    if (!this.#videoElement) return;
    this.#isDraggingSeekbar = true;
  
    const seekbar = e.currentTarget as HTMLElement;
  
    const move = (touch: Touch) => {
      const rect = seekbar.getBoundingClientRect();
      const percent = (touch.clientX - rect.left) / rect.width;
      this.#seekTo(percent);
    };
  
    move(e.touches[0]);
  
    const onTouchMove = (e: TouchEvent) => {
      if (!this.#isDraggingSeekbar) return;
      move(e.touches[0]);
    };
  
    const onTouchEnd = () => {
      this.#isDraggingSeekbar = false;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
  };
  

  #onVolumeMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    this.#isDraggingVolume = true;
    const volumeSlider = e.currentTarget as HTMLElement;

    const rect = volumeSlider.getBoundingClientRect();
    this.#setVolume((e.clientX - rect.left) / rect.width);

    const onMouseMove = (e: MouseEvent) => {
      if (!this.#isDraggingVolume) return;
      e.preventDefault();
      const rect = volumeSlider.getBoundingClientRect();
      this.#setVolume((e.clientX - rect.left) / rect.width);
    };

    const onMouseUp = () => {
      this.#isDraggingVolume = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  #onLoadedData = (wrapper: HTMLElement, config: VideoPlayerConfig): void => {
    if (!this.#videoElement) return;
    wrapper.classList.remove('video-loading');
    wrapper.classList.add('video-loaded');
    this.#isInitialized = true;
    this.#videoLoaded = true;
    if (config.showControls) this.#setupControlButtons(wrapper);
    if (!config.autoplay) {
      this.#hasPlayedOnce = false;
      this.#posterVisible = true;
      wrapper.classList.add('poster-visible');
    }
    this.#updateFullscreenIcon(false, wrapper);
    this.#emit('video-ready', { duration: this.#videoElement.duration });
  };

  #onPlaying = (wrapper: HTMLElement): void => {
    this.#emit('video-playing', { src: this.#videoElement!.currentSrc, currentTime: this.#videoElement!.currentTime, duration: this.#videoElement!.duration });
    wrapper.classList.add('is-playing');
    wrapper.classList.remove('poster-visible');
    this.#isPlaying = true;
    this.#hasPlayedOnce = true;
    this.#posterVisible = false;
    this.#updatePlayPauseIcon(true, wrapper);
  };

  #onPause = (wrapper: HTMLElement): void => {
    this.#emit('video-paused', { currentTime: this.#videoElement!.currentTime });
    wrapper.classList.remove('is-playing');
    this.#isPlaying = false;
    this.#updatePlayPauseIcon(false, wrapper);
  };

  #onEnded = (wrapper: HTMLElement, config: VideoPlayerConfig): void => {
    this.#emit('video-ended', { duration: this.#videoElement!.duration });
    wrapper.classList.remove('is-playing');
    this.#isPlaying = false;
    this.#updatePlayPauseIcon(false, wrapper);
    if (!config.loop) {
      if (config.resetOnEnded) this.#videoElement!.currentTime = 0;
      if (config.showPosterOnEnded && this.#hasPoster) {
        wrapper.classList.add('poster-visible');
        this.#posterVisible = true;
      }
    }
  };

  #onVolumeChange = (wrapper: HTMLElement): void => {
    const v = this.#videoElement!;
    this.#updateVolumeIcon(v.muted || v.volume === 0, wrapper);
    this.#updateVolumeSlider(v.volume, wrapper);
    this.#emit('video-volume-change', { volume: v.volume, muted: v.muted });
  };

  #onError = (wrapper: HTMLElement): void => {
    console.error('Video load error');
    wrapper.classList.remove('video-loading', 'video-loaded');
    this.#videoLoaded = false;
    this.#emit('video-error', { code: this.#videoElement?.error?.code });
  };

  #onFullscreenChange = (): void => {
    const isFull = document.fullscreenElement === this.#shadowRoot.querySelector('.video-container');
    this.#updateFullscreenIcon(isFull);
    this.#emit(isFull ? 'video-fullscreen-enter' : 'video-fullscreen-exit');
  };

  #handleTouchTap = (e: TouchEvent): void => {
    const config = this.#getConfig();
    if (!this.#videoElement) return;
  
    const rect = this.#$wrapper!.getBoundingClientRect();
    const touchX = e.changedTouches[0].clientX;
    const isLeft = touchX < rect.left + rect.width / 2;
  
    if (config.enableTapRipple) {
      this.#createRipple(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }
  
    this.#tapCount++;
  
    if (this.#tapTimeout) clearTimeout(this.#tapTimeout);
  
    this.#tapTimeout = window.setTimeout(() => {
      const doubleSeconds = config.doubleTapSeekSeconds;
      const tripleSeconds = config.tripleTapSeconds;
  
      if (this.#tapCount === 2 && config.doubleTapSeek) {
        this.#seekBy(isLeft ? -doubleSeconds : doubleSeconds);
      }
  
      if (this.#tapCount >= 3 && config.tripleTapSeek) {
        this.#seekBy(isLeft ? -tripleSeconds : tripleSeconds);
      }
  
      this.#tapCount = 0;
    }, 300);
  };

  #showSeekOverlay(seconds: number): void {
    const overlay = document.createElement('div');
    overlay.className = 'seek-overlay';
    overlay.textContent = (seconds > 0 ? '+' : '') + seconds + 's';
  
    this.#$wrapper?.appendChild(overlay);
  
    setTimeout(() => overlay.remove(), 600);
  }
  
  #seekBy(seconds: number): void {
    if (!this.#videoElement) return;
  
    const newTime = Math.min(
      Math.max(0, this.#videoElement.currentTime + seconds),
      this.#videoElement.duration
    );
  
    this.#videoElement.currentTime = newTime;
    this.#showSeekOverlay(seconds);
  }

  
  #createRipple(x: number, y: number): void {
    if (!this.#$wrapper) return;
  
    const rect = this.#$wrapper.getBoundingClientRect();
  
    const ripple = document.createElement("div");
    ripple.className = "tap-ripple";
  
    ripple.style.left = x - rect.left + "px";
    ripple.style.top = y - rect.top + "px";
  
    this.#$wrapper.appendChild(ripple);
  
    setTimeout(() => ripple.remove(), 600);
  }
  
  

  #throttledSeekbarUpdate: () => void;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: 'open' });
    this.#shadowRoot.adoptedStyleSheets = [sheet];

    this.#throttledSeekbarUpdate = throttle(this.#updateSeekbar.bind(this), 100);
  }

  static get observedAttributes(): string[] {
    return [
      "lazy", "pause-on-out-of-view", "autoplay", "loop", "muted", "playsinline",
      "desktop-poster", "mobile-poster", "desktop-video", "mobile-video",
      "show-controls", "controls-type", "show-center-play", "show-play-pause",
      "show-seekbar", "show-volume", "show-fullscreen", "show-speed", "theme",
      "accent-color", "controls-background", "center-play-background",
      "center-play-size", "play-icon", "pause-icon", "volume-icon", "muted-icon",
      "fullscreen-icon", "exit-fullscreen-icon", "speed-icon", "video-type",
      "preload", "speed-options", "controls-hide-delay", "seek-step",
      "lazy-threshold", "pause-threshold", "pause-on-tab-hide",
      "show-poster-on-ended", "reset-on-ended", "poster-click-play", "performance-mode",
      "show-tooltips", "tooltip-play", "tooltip-pause", "tooltip-mute", "tooltip-unmute",
      "tooltip-fullscreen", "tooltip-exit-fullscreen", "tooltip-speed", "tooltip-center-play",
      "double-tap-seek","double-tap-seek-seconds","show-seek-buttons","seek-button-seconds",
      "triple-tap-seek","triple-tap-seconds","enable-tap-ripple"

    ];
  }

  // ---------- CACHED CONFIG ----------
  #getConfig(): VideoPlayerConfig {
    const now = Date.now();
    if (this.#configCache && now - this.#configCacheTime < this.#CONFIG_CACHE_DURATION) {
      return this.#configCache;
    }
    const config: VideoPlayerConfig = {
      lazy: this.getAttribute("lazy") === "true",
      pauseOnOutOfView: this.getAttribute("pause-on-out-of-view") === "true",
      pauseOnTabHide: this.getAttribute("pause-on-tab-hide") !== "false",
      autoplay: this.getAttribute("autoplay") === "true",
      loop: this.getAttribute("loop") === "true",
      muted: this.getAttribute("muted") === "true",
      playsinline: this.getAttribute("playsinline") === "true",
      preload: (this.getAttribute("preload") as VideoPlayerConfig['preload']) || "metadata",
      desktopPoster: this.getAttribute("desktop-poster") || "",
      mobilePoster: this.getAttribute("mobile-poster") || "",
      desktopVideo: this.getAttribute("desktop-video") || "",
      mobileVideo: this.getAttribute("mobile-video") || "",
      videoType: this.getAttribute("video-type") || "video/mp4",
      showControls: this.getAttribute("show-controls") === "true",
      controlsType: (this.getAttribute("controls-type") as VideoPlayerConfig['controlsType']) || "full",
      showPlayPause: this.getAttribute("show-play-pause") !== "false",
      showSeekbar: this.getAttribute("show-seekbar") === "true",
      showVolume: this.getAttribute("show-volume") === "true",
      showFullscreen: this.getAttribute("show-fullscreen") === "true",
      showCenterPlay: this.getAttribute("show-center-play") === "true",
      showSpeed: this.getAttribute("show-speed") === "true",
      speedOptions: this.#parseSpeedOptions(),
      controlsHideDelay: parseInt(this.getAttribute("controls-hide-delay") || "3000"),
      seekStep: parseInt(this.getAttribute("seek-step") || "5"),
      lazyThreshold: parseFloat(this.getAttribute("lazy-threshold") || "0.5"),
      pauseThreshold: parseFloat(this.getAttribute("pause-threshold") || "0.3"),
      theme: (this.getAttribute("theme") as VideoPlayerConfig['theme']) || "dark",
      accentColor: this.getAttribute("accent-color") || "#ffffff",
      controlsBackground: this.getAttribute("controls-background") || "rgba(0, 0, 0, 0.8)",
      centerPlayBackground: this.getAttribute("center-play-background") || "rgba(0, 0, 0, 0.7)",
      centerPlaySize: parseInt(this.getAttribute("center-play-size") || "80"),
      showPosterOnEnded: this.getAttribute("show-poster-on-ended") === "true",
      resetOnEnded: this.getAttribute("reset-on-ended") === "true",
      posterClickPlay: this.getAttribute("poster-click-play") !== "false",
      performanceMode: this.getAttribute("performance-mode") === "true",
      showTooltips: this.getAttribute("show-tooltips") === "true",
      tooltipPlay: this.getAttribute("tooltip-play") || "Play",
      tooltipPause: this.getAttribute("tooltip-pause") || "Pause",
      tooltipMute: this.getAttribute("tooltip-mute") || "Mute",
      tooltipUnmute: this.getAttribute("tooltip-unmute") || "Unmute",
      tooltipFullscreen: this.getAttribute("tooltip-fullscreen") || "Fullscreen",
      tooltipExitFullscreen: this.getAttribute("tooltip-exit-fullscreen") || "Exit fullscreen",
      tooltipSpeed: this.getAttribute("tooltip-speed") || "Playback speed",
      tooltipCenterPlay: this.getAttribute("tooltip-center-play") || "Play",
      doubleTapSeek: this.getAttribute("double-tap-seek") !== "false",
      doubleTapSeekSeconds: parseInt(this.getAttribute("double-tap-seek-seconds") || "10"),
      showSeekButtons: this.getAttribute("show-seek-buttons") === "true",
      seekButtonSeconds: parseInt(this.getAttribute("seek-button-seconds") || "10"),
      tripleTapSeek: this.getAttribute("triple-tap-seek") !== "false",
      tripleTapSeconds: parseInt(this.getAttribute("triple-tap-seconds") || "30"),
      enableTapRipple: this.getAttribute("enable-tap-ripple") !== "false",

    };
    this.#configCache = config;
    this.#configCacheTime = now;
    return config;
  }

  #parseSpeedOptions(): number[] {
    const attr = this.getAttribute("speed-options");
    if (!attr) return [0.5, 0.75, 1, 1.25, 1.5, 2];
    try {
      return attr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    } catch {
      return [0.5, 0.75, 1, 1.25, 1.5, 2];
    }
  }

  // ---------- RENDER ----------
  #render(): void {
    const config = this.#getConfig();
    this.#hasPoster = !!(config.desktopPoster || config.mobilePoster);
    this.#posterVisible = this.#hasPoster && !this.#hasPlayedOnce;

    const wrapper = document.createElement('div');
    wrapper.className = 'shadow-plyr-wrapper';
    wrapper.setAttribute('tabindex', '0');
    wrapper.setAttribute('role', 'application');
    wrapper.setAttribute('aria-label', 'Video player');
    wrapper.setAttribute('part', 'shadow-plyr-wrapper');

    // Poster
    if (config.desktopPoster || config.mobilePoster) {
      const picture = document.createElement('picture');
      if (config.mobilePoster) {
        const source = document.createElement('source');
        source.media = '(max-width: 768px)';
        source.srcset = config.mobilePoster;
        picture.appendChild(source);
      }
      const img = document.createElement('img');
      img.src = config.desktopPoster;
      img.alt = 'Video thumbnail';
      img.loading = 'lazy';
      picture.appendChild(img);
      wrapper.appendChild(picture);
    }

    // Video placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'video-placeholder';
    wrapper.appendChild(placeholder);

    // Center play button (built with DOM APIs, safe)
    if (config.showCenterPlay) {
      const icons = this.#getIcons(); // already sanitized

      const centerPlay = document.createElement('div');
      centerPlay.className = 'video-center-play';
      centerPlay.setAttribute('role', 'button');
      centerPlay.tabIndex = 0;
      centerPlay.setAttribute('aria-label', 'Play video');

      const playSpan = document.createElement('span');
      playSpan.className = 'play-icon';
      playSpan.setAttribute('aria-hidden', 'true');
      playSpan.appendChild(this.#createSVGFromString(icons.play));

      const pauseSpan = document.createElement('span');
      pauseSpan.className = 'pause-icon';
      pauseSpan.style.display = 'none';
      pauseSpan.setAttribute('aria-hidden', 'true');
      pauseSpan.appendChild(this.#createSVGFromString(icons.pause));

      centerPlay.appendChild(playSpan);
      centerPlay.appendChild(pauseSpan);

      if (config.showTooltips) {
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip center-play-tooltip';
        tooltip.textContent = config.tooltipCenterPlay;
        centerPlay.appendChild(tooltip);
      }

      const srOnly = document.createElement('span');
      srOnly.className = 'sr-only';
      srOnly.textContent = 'Play';
      centerPlay.appendChild(srOnly);

      wrapper.appendChild(centerPlay);
    }

    // Controls
    if (config.showControls && config.controlsType !== 'none') {
      wrapper.appendChild(this.#createControlsHTML(config));
    }

    if (config.showSeekButtons) {
      wrapper.appendChild(this.#createSeekButtons(config));
    }
    

    // Container
    const container = document.createElement('div');
    container.className = 'video-container';
    container.setAttribute('part', 'video-container');
    container.appendChild(wrapper);

    this.#shadowRoot.innerHTML = '';
    this.#shadowRoot.appendChild(container);

    // Cache references
    this.#$wrapper = wrapper;
    this.#$seekbar = wrapper.querySelector('.video-seekbar');
    this.#$seekbarProgress = wrapper.querySelector('.video-seekbar-progress');
    this.#$timeDisplay = wrapper.querySelector('.video-time-display');
    this.#$volumeProgress = wrapper.querySelector('.video-volume-progress');
    this.#$speedMenu = wrapper.querySelector('.video-speed-menu');
    this.#$speedText = wrapper.querySelector('.speed-text');
  }

  // Safe SVG parser: returns an SVG element from a sanitized string
  #createSVGFromString(svgString: string): SVGElement {
    const div = document.createElement('div');
    div.innerHTML = svgString.trim(); // safe because svgString is already sanitized
    const svg = div.firstElementChild as SVGElement;
    if (!svg || svg.tagName.toLowerCase() !== 'svg') {
      // Fallback to a minimal safe SVG if parsing fails
      const fallback = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      fallback.setAttribute('viewBox', '0 0 24 24');
      return fallback;
    }
    return svg;
  }

  #createSeekButtons(config: VideoPlayerConfig): HTMLElement {
    const container = document.createElement('div');
    container.className = 'video-seek-buttons';
  
    const left = document.createElement('button');
    left.className = 'seek-left';
    left.textContent = `-${config.seekButtonSeconds}s`;
  
    const right = document.createElement('button');
    right.className = 'seek-right';
    right.textContent = `+${config.seekButtonSeconds}s`;
  
    left.addEventListener('click', () => {
      if (!this.#videoElement) return;
      this.#videoElement.currentTime = Math.max(
        0,
        this.#videoElement.currentTime - config.seekButtonSeconds
      );
    });
  
    right.addEventListener('click', () => {
      if (!this.#videoElement) return;
      this.#videoElement.currentTime = Math.min(
        this.#videoElement.duration,
        this.#videoElement.currentTime + config.seekButtonSeconds
      );
    });
  
    container.appendChild(left);
    container.appendChild(right);
  
    return container;
  }
  

  // ---------- ICON CACHING WITH SANITIZATION ----------
  #getIcons(): IconSet {
    const cacheKey = `${this.getAttribute('play-icon') || ''}-${this.getAttribute('pause-icon') || ''}`;
    if (IconCache.has(cacheKey)) return IconCache.get(cacheKey)!;
    const icons: IconSet = {
      play: DOMPurify.sanitize(this.getAttribute('play-icon') || DEFAULT_ICONS.play, { USE_PROFILES: { svg: true } }),
      pause: DOMPurify.sanitize(this.getAttribute('pause-icon') || DEFAULT_ICONS.pause, { USE_PROFILES: { svg: true } }),
      volume: DOMPurify.sanitize(this.getAttribute('volume-icon') || DEFAULT_ICONS.volume, { USE_PROFILES: { svg: true } }),
      muted: DOMPurify.sanitize(this.getAttribute('muted-icon') || DEFAULT_ICONS.muted, { USE_PROFILES: { svg: true } }),
      fullscreen: DOMPurify.sanitize(this.getAttribute('fullscreen-icon') || DEFAULT_ICONS.fullscreen, { USE_PROFILES: { svg: true } }),
      exitFullscreen: DOMPurify.sanitize(this.getAttribute('exit-fullscreen-icon') || DEFAULT_ICONS.exitFullscreen, { USE_PROFILES: { svg: true } }),
      speed: DOMPurify.sanitize(this.getAttribute('speed-icon') || DEFAULT_ICONS.speed, { USE_PROFILES: { svg: true } }),
    };
    IconCache.set(cacheKey, icons);
    return icons;
  }

  // ---------- BUILD CONTROLS WITH DOM APIS (SAFE) ----------
  #createControlsHTML(config: VideoPlayerConfig): DocumentFragment {
    const icons = this.#getIcons(); // sanitized
    const frag = document.createDocumentFragment();

    const controlsBar = document.createElement('div');
    controlsBar.className = 'video-controls-bar';
    controlsBar.setAttribute('role', 'region');
    controlsBar.setAttribute('aria-label', 'Video controls');
    controlsBar.setAttribute('part', 'controls');

    // Seekbar
    if (config.showSeekbar) {
      const seekbar = document.createElement('div');
      seekbar.className = 'video-seekbar';
      seekbar.setAttribute('role', 'slider');
      seekbar.tabIndex = 0;
      seekbar.setAttribute('aria-label', 'Seek');
      seekbar.setAttribute('aria-valuemin', '0');
      seekbar.setAttribute('aria-valuemax', '100');
      seekbar.setAttribute('aria-valuenow', '0');

      const progress = document.createElement('div');
      progress.className = 'video-seekbar-progress';
      const handle = document.createElement('div');
      handle.className = 'video-seekbar-handle';
      progress.appendChild(handle);
      seekbar.appendChild(progress);
      controlsBar.appendChild(seekbar);
    }

    const row = document.createElement('div');
    row.className = 'video-controls-row';

    // Play/Pause button
    if (config.showPlayPause) {
      const btn = document.createElement('button');
      btn.className = 'video-control-btn play-pause';
      btn.setAttribute('aria-label', 'Play');
      btn.tabIndex = 0;

      const playSpan = document.createElement('span');
      playSpan.className = 'play-icon';
      playSpan.setAttribute('aria-hidden', 'true');
      playSpan.appendChild(this.#createSVGFromString(icons.play));

      const pauseSpan = document.createElement('span');
      pauseSpan.className = 'pause-icon';
      pauseSpan.style.display = 'none';
      pauseSpan.setAttribute('aria-hidden', 'true');
      pauseSpan.appendChild(this.#createSVGFromString(icons.pause));

      btn.appendChild(playSpan);
      btn.appendChild(pauseSpan);

      if (config.showTooltips) {
        const playTooltip = document.createElement('span');
        playTooltip.className = 'tooltip play-tooltip';
        playTooltip.textContent = config.tooltipPlay;

        const pauseTooltip = document.createElement('span');
        pauseTooltip.className = 'tooltip pause-tooltip';
        pauseTooltip.style.display = 'none';
        pauseTooltip.textContent = config.tooltipPause;

        btn.appendChild(playTooltip);
        btn.appendChild(pauseTooltip);
      }

      row.appendChild(btn);
    }

    // Volume control
    if (config.showVolume) {
      const volumeControl = document.createElement('div');
      volumeControl.className = 'video-volume-control';

      const btn = document.createElement('button');
      btn.className = 'video-control-btn volume-btn';
      btn.setAttribute('aria-label', 'Mute');
      btn.tabIndex = 0;

      const volumeSpan = document.createElement('span');
      volumeSpan.className = 'volume-icon';
      volumeSpan.setAttribute('aria-hidden', 'true');
      volumeSpan.appendChild(this.#createSVGFromString(icons.volume));

      const mutedSpan = document.createElement('span');
      mutedSpan.className = 'muted-icon';
      mutedSpan.style.display = 'none';
      mutedSpan.setAttribute('aria-hidden', 'true');
      mutedSpan.appendChild(this.#createSVGFromString(icons.muted));

      btn.appendChild(volumeSpan);
      btn.appendChild(mutedSpan);

      if (config.showTooltips) {
        const volTooltip = document.createElement('span');
        volTooltip.className = 'tooltip volume-tooltip';
        volTooltip.textContent = config.tooltipMute;

        const mutedTooltip = document.createElement('span');
        mutedTooltip.className = 'tooltip muted-tooltip';
        mutedTooltip.style.display = 'none';
        mutedTooltip.textContent = config.tooltipUnmute;

        btn.appendChild(volTooltip);
        btn.appendChild(mutedTooltip);
      }

      volumeControl.appendChild(btn);

      const slider = document.createElement('div');
      slider.className = 'video-volume-slider';
      slider.setAttribute('role', 'slider');
      slider.tabIndex = 0;
      slider.setAttribute('aria-label', 'Volume');
      slider.setAttribute('aria-valuemin', '0');
      slider.setAttribute('aria-valuemax', '100');
      slider.setAttribute('aria-valuenow', '100');

      const progress = document.createElement('div');
      progress.className = 'video-volume-progress';
      slider.appendChild(progress);

      volumeControl.appendChild(slider);
      row.appendChild(volumeControl);
    }

    // Time display
    const timeDisplay = document.createElement('div');
    timeDisplay.className = 'video-time-display';
    timeDisplay.textContent = '0:00 / 0:00';
    row.appendChild(timeDisplay);

    // Spacer
    const spacer = document.createElement('div');
    spacer.className = 'video-controls-spacer';
    row.appendChild(spacer);

    // Speed control
    if (config.showSpeed) {
      const speedControl = document.createElement('div');
      speedControl.className = 'video-speed-control';

      const btn = document.createElement('button');
      btn.className = 'video-control-btn video-speed-btn';
      btn.setAttribute('aria-label', 'Playback speed');
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.tabIndex = 0;

      const speedSpan = document.createElement('span');
      speedSpan.className = 'speed-text';
      speedSpan.textContent = '1x';

      // Speed icon
      const iconSpan = document.createElement('span');
      iconSpan.setAttribute('aria-hidden', 'true');
      iconSpan.appendChild(this.#createSVGFromString(icons.speed));

      btn.appendChild(iconSpan);
      btn.appendChild(speedSpan);

      if (config.showTooltips) {
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip speed-tooltip';
        tooltip.textContent = config.tooltipSpeed;
        btn.appendChild(tooltip);
      }

      speedControl.appendChild(btn);

      const menu = document.createElement('div');
      menu.className = 'video-speed-menu';
      menu.setAttribute('role', 'menu');

      config.speedOptions.forEach(speed => {
        const opt = document.createElement('button');
        opt.className = `video-speed-option ${speed === 1 ? 'active' : ''}`;
        opt.setAttribute('role', 'menuitem');
        opt.tabIndex = -1;
        opt.setAttribute('data-speed', speed.toString());
        opt.textContent = speed + 'x';
        menu.appendChild(opt);
      });

      speedControl.appendChild(menu);
      row.appendChild(speedControl);
    }

    // Fullscreen button
    if (config.showFullscreen) {
      const btn = document.createElement('button');
      btn.className = 'video-control-btn fullscreen-btn';
      btn.setAttribute('aria-label', 'Fullscreen');
      btn.tabIndex = 0;

      const fullSpan = document.createElement('span');
      fullSpan.className = 'fullscreen-icon';
      fullSpan.setAttribute('aria-hidden', 'true');
      fullSpan.appendChild(this.#createSVGFromString(icons.fullscreen));

      const exitSpan = document.createElement('span');
      exitSpan.className = 'exit-fullscreen-icon';
      exitSpan.style.display = 'none';
      exitSpan.setAttribute('aria-hidden', 'true');
      exitSpan.appendChild(this.#createSVGFromString(icons.exitFullscreen));

      btn.appendChild(fullSpan);
      btn.appendChild(exitSpan);

      if (config.showTooltips) {
        const fullTooltip = document.createElement('span');
        fullTooltip.className = 'tooltip fullscreen-tooltip';
        fullTooltip.textContent = config.tooltipFullscreen;

        const exitTooltip = document.createElement('span');
        exitTooltip.className = 'tooltip exit-fullscreen-tooltip';
        exitTooltip.style.display = 'none';
        exitTooltip.textContent = config.tooltipExitFullscreen;

        btn.appendChild(fullTooltip);
        btn.appendChild(exitTooltip);
      }

      row.appendChild(btn);
    }

    controlsBar.appendChild(row);
    frag.appendChild(controlsBar);
    return frag;
  }

  // ---------- LIFECYCLE ----------
  connectedCallback(): void {
    this.#render();
    this.#init();
    this.#setupVisibilityHandling();
    if (this.getAttribute('virtual-playback') === 'true') {
      GlobalVideoEngine.register(this);
    }
  }

  disconnectedCallback(): void {
    this.#destroy();
    this.#removeVisibilityHandling();
    if (this.#rafId) cancelAnimationFrame(this.#rafId);
    GlobalVideoEngine.unregister(this);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this.#configCache = null;
    if (!this.#isInitialized) return;
    const config = this.#getConfig();
    switch (name) {
      case 'muted': if (this.#videoElement) this.#videoElement.muted = config.muted; break;
      case 'loop': if (this.#videoElement) this.#videoElement.loop = config.loop; break;
      case 'accent-color':
      case 'theme':
      case 'controls-background':
      case 'center-play-background':
      case 'center-play-size':
        this.#updateCSSVariables(config);
        break;
      default: this.#reinitialize();
    }
  }

  #updateCSSVariables(config: VideoPlayerConfig): void {
    const theme = config.theme === 'light' ? {
      accent: config.accentColor !== '#ffffff' ? config.accentColor : '#000000',
      controlsBg: config.controlsBackground !== 'rgba(0,0,0,0.8)' ? config.controlsBackground : 'rgba(255,255,255,0.9)',
      centerPlayBg: config.centerPlayBackground !== 'rgba(0,0,0,0.7)' ? config.centerPlayBackground : 'rgba(255,255,255,0.8)',
    } : {
      accent: config.accentColor,
      controlsBg: config.controlsBackground,
      centerPlayBg: config.centerPlayBackground,
    };
    this.style.setProperty('--accent-color', theme.accent);
    this.style.setProperty('--controls-bg', theme.controlsBg);
    this.style.setProperty('--center-play-bg', theme.centerPlayBg);
    if (config.centerPlaySize) {
      this.style.setProperty('--center-play-size', config.centerPlaySize + 'px');
    }
  }

  // ---------- INITIALIZATION ----------
  #init(): void {
    const config = this.#getConfig();
    if (config.lazy || config.pauseOnOutOfView) {
      this.#setupLazyLoading(this.#$wrapper!, config);
    } else {
      this.#loadVideo(this.#$wrapper!, config);
    }
    if (config.performanceMode) this.#enablePerformanceMode();
    this.#updateCSSVariables(config);
  }

  #setupVisibilityHandling(): void {
    const config = this.#getConfig();
    if (config.pauseOnTabHide) {
      document.addEventListener('visibilitychange', this.#visibilityChange, { passive: true });
      window.addEventListener('pagehide', this.#pageHide, { passive: true });
      window.addEventListener('pageshow', this.#pageShow, { passive: true });
    }
  }

  #removeVisibilityHandling(): void {
    document.removeEventListener('visibilitychange', this.#visibilityChange);
    window.removeEventListener('pagehide', this.#pageHide);
    window.removeEventListener('pageshow', this.#pageShow);
  }

  // ---------- LAZY LOADING ----------
  #setupLazyLoading(wrapper: HTMLElement, config: VideoPlayerConfig): void {
    if (!('IntersectionObserver' in window)) return this.#loadVideo(wrapper, config);
    const options = { root: null, rootMargin: '50px', threshold: config.lazyThreshold };
    this.#observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (config.lazy && !this.#isInitialized && entry.isIntersecting && entry.intersectionRatio >= config.lazyThreshold) {
          this.#loadVideo(wrapper, config);
        }
        if (config.pauseOnOutOfView && this.#videoElement && this.#videoLoaded) {
          if (!entry.isIntersecting || entry.intersectionRatio < config.pauseThreshold) {
            if (this.#isPlaying) { this.#wasPlayingBeforeHidden = true; this.pauseVideo(); }
          } else {
            if (this.#wasPlayingBeforeHidden && !this.#isPlaying) { this.playVideo(); this.#wasPlayingBeforeHidden = false; }
          }
        }
      });
    }, options);
    this.#observer.observe(wrapper);
    if (!config.lazy && config.pauseOnOutOfView && !this.#isInitialized) {
      this.#loadVideo(wrapper, config);
    }
  }

  // ---------- VIDEO LOADING ----------
  #loadVideo(wrapper: HTMLElement, config: VideoPlayerConfig): void {
    if (this.#isInitialized) return;
    wrapper.classList.add('video-loading');

    const video = document.createElement('video');
    this.#videoElement = video;

    const attrs: Record<string, string> = {
      preload: config.preload,
      disablepictureinpicture: '',
      'webkit-playsinline': '',
      ...(config.loop && { loop: '' }),
      ...(config.muted && { muted: '' }),
      ...(config.playsinline && { playsinline: '' })
    };
    Object.entries(attrs).forEach(([k, v]) => video.setAttribute(k, v));
    video.setAttribute('part', 'video');

    // Sources
    if (config.desktopVideo) {
      const s = document.createElement('source');
      s.src = config.desktopVideo;
      s.type = config.videoType;
      s.media = '(min-width: 769px)';
      video.appendChild(s);
    }
    if (config.mobileVideo) {
      const s = document.createElement('source');
      s.src = config.mobileVideo;
      s.type = config.videoType;
      s.media = '(max-width: 768px)';
      video.appendChild(s);
    }
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    video.src = isMobile && config.mobileVideo ? config.mobileVideo : config.desktopVideo;

    // Event listeners
    video.addEventListener('loadeddata', this.#onLoadedData.bind(this, wrapper, config), { once: true });
    video.addEventListener('playing', this.#onPlaying.bind(this, wrapper));
    video.addEventListener('pause', this.#onPause.bind(this, wrapper));
    video.addEventListener('ended', this.#onEnded.bind(this, wrapper, config));
    video.addEventListener('seeked', () => this.#emit('video-seeked', { currentTime: video.currentTime }));
    video.addEventListener('seeking', () => this.#emit('video-seeking', { currentTime: video.currentTime }));
    video.addEventListener('timeupdate', this.#throttledSeekbarUpdate, { passive: true });
    video.addEventListener('volumechange', this.#onVolumeChange.bind(this, wrapper));
    video.addEventListener('error', this.#onError.bind(this, wrapper));

    document.addEventListener('fullscreenchange', this.#onFullscreenChange);

    const placeholder = wrapper.querySelector('.video-placeholder');
    if (placeholder) placeholder.replaceWith(video);
    video.style.pointerEvents = 'auto';

    // Poster click
    const picture = wrapper.querySelector('picture');
    if (picture) {
      picture.removeEventListener('click', this.#posterClick);
      picture.addEventListener('click', this.#posterClick);
    }

    // Autoplay if needed
    if (config.autoplay && config.muted) this.playVideo();
  }

  // ---------- PUBLIC API ----------
  public play(): void { this.playVideo(); }
  public pause(): void { this.pauseVideo(); }
  public mute(): void { if (this.#videoElement) this.#videoElement.muted = true; }
  public unmute(): void { if (this.#videoElement) this.#videoElement.muted = false; }
  public seek(seconds: number): void { if (this.#videoElement) this.#videoElement.currentTime = seconds; }

  public playVideo(): void {
    if (!this.#videoElement) return;
    const config = this.#getConfig();
    if (config.autoplay) this.#videoElement.muted = true;
    if (this.getAttribute('virtual-playback') === 'true') GlobalVideoEngine.requestPlay(this);
    const promise = this.#videoElement.play();
    if (promise) {
      promise.catch(() => {
        this.#posterVisible = true;
        if (this.#$wrapper) this.#$wrapper.classList.add('poster-visible');
      });
    }
  }

  public pauseVideo(silent?: boolean): void {
    if (this.#videoElement) {
      this.#videoElement.pause();
      if (!silent) this.#emit('video-paused');
    }
  }

  // ---------- CONTROLS SETUP ----------
  #setupControlButtons(wrapper: HTMLElement): void {
    wrapper.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const seekbar = target.closest('.video-seekbar');
      if (seekbar) {
        const rect = seekbar.getBoundingClientRect();
        this.#seekTo((e.clientX - rect.left) / rect.width);
        e.stopPropagation();
        return;
      }

      const volumeSlider = target.closest('.video-volume-slider');
      if (volumeSlider) {
        const rect = volumeSlider.getBoundingClientRect();
        this.#setVolume((e.clientX - rect.left) / rect.width);
        e.stopPropagation();
        return;
      }

      const control = target.closest('[class*="video-"]');
      if (!control) return;
      e.stopPropagation();

      if (control.classList.contains('play-pause') || control.classList.contains('video-center-play')) {
        this.#togglePlayPause(e);
      } else if (control.classList.contains('volume-btn')) {
        this.#toggleMute(e);
      } else if (control.classList.contains('fullscreen-btn')) {
        this.#toggleFullscreen(e);
      } else if (control.classList.contains('video-speed-btn')) {
        this.#toggleSpeedMenu(wrapper);
      } else if (control.classList.contains('video-speed-option')) {
        const speed = parseFloat(control.getAttribute('data-speed')!);
        this.#setSpeed(speed, wrapper);
        this.#closeSpeedMenu(wrapper);
      }
    });

    const seekbarEl = wrapper.querySelector('.video-seekbar');
    if (seekbarEl) {
      seekbarEl.addEventListener('mousedown', this.#onSeekbarMouseDown as EventListener);
      seekbarEl.addEventListener('touchstart', this.#onSeekbarTouchStart as EventListener, { passive: true });
    }    

    const volumeSliderEl = wrapper.querySelector('.video-volume-slider');
    if (volumeSliderEl) {
      volumeSliderEl.addEventListener('mousedown', this.#onVolumeMouseDown as EventListener);
    }

    if (this.#videoElement) {
      this.#videoElement.addEventListener('click', this.#togglePlayPause);
    }

    this.#setupControlsInteraction(wrapper);
  }

  #setupControlsInteraction(wrapper: HTMLElement): void {
    wrapper.addEventListener('keydown', this.#handleKeyboard);
    wrapper.addEventListener('mouseenter', () => { if (this.#videoLoaded) wrapper.classList.add('show-controls'); }, { passive: true });
    wrapper.addEventListener('mouseleave', () => { wrapper.classList.remove('show-controls'); }, { passive: true });
    wrapper.addEventListener('touchend', this.#handleTouchTap);
  }

  // ---------- UI UPDATE METHODS ----------
  #updateSeekbar(): void {
    const v = this.#videoElement;
    if (!v || !v.duration) return;
    const percent = (v.currentTime / v.duration) * 100;
    if (this.#$seekbarProgress) this.#$seekbarProgress.style.width = percent + '%';
    if (this.#$seekbar) this.#$seekbar.setAttribute('aria-valuenow', Math.round(percent).toString());
    this.#updateTimeDisplay();
  }

  #updateTimeDisplay(): void {
    if (!this.#$timeDisplay || !this.#videoElement) return;
    const current = this.#formatTime(this.#videoElement.currentTime);
    const duration = this.#formatTime(this.#videoElement.duration);
    this.#$timeDisplay.textContent = `${current} / ${duration}`;
  }

  #formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  #updatePlayPauseIcon(isPlaying: boolean, wrapper?: HTMLElement): void {
    if (!wrapper) wrapper = this.#$wrapper!;
    wrapper.querySelectorAll('.play-pause, .video-center-play').forEach(el => {
      const play = el.querySelector('.play-icon') as HTMLElement;
      const pause = el.querySelector('.pause-icon') as HTMLElement;
      if (play) play.style.display = isPlaying ? 'none' : 'block';
      if (pause) pause.style.display = isPlaying ? 'block' : 'none';
      el.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
      const playTooltip = el.querySelector('.play-tooltip') as HTMLElement;
      const pauseTooltip = el.querySelector('.pause-tooltip') as HTMLElement;
      if (playTooltip) playTooltip.style.display = isPlaying ? 'none' : 'block';
      if (pauseTooltip) pauseTooltip.style.display = isPlaying ? 'block' : 'none';
    });
  }

  #updateVolumeIcon(isMuted: boolean, wrapper?: HTMLElement): void {
    if (!wrapper) wrapper = this.#$wrapper!;
    const btn = wrapper.querySelector('.volume-btn');
    if (btn) {
      const vol = btn.querySelector('.volume-icon') as HTMLElement;
      const mut = btn.querySelector('.muted-icon') as HTMLElement;
      if (vol) vol.style.display = isMuted ? 'none' : 'block';
      if (mut) mut.style.display = isMuted ? 'block' : 'none';
      btn.setAttribute('aria-label', isMuted ? 'Unmute' : 'Mute');
      const volTooltip = btn.querySelector('.volume-tooltip') as HTMLElement;
      const mutTooltip = btn.querySelector('.muted-tooltip') as HTMLElement;
      if (volTooltip) volTooltip.style.display = isMuted ? 'none' : 'block';
      if (mutTooltip) mutTooltip.style.display = isMuted ? 'block' : 'none';
    }
  }

  #updateFullscreenIcon(isFullscreen: boolean, wrapper?: HTMLElement): void {
    if (!wrapper) wrapper = this.#$wrapper!;
    const btn = wrapper.querySelector('.fullscreen-btn');
    if (btn) {
      const fullIcon = btn.querySelector('.fullscreen-icon') as HTMLElement;
      const exitIcon = btn.querySelector('.exit-fullscreen-icon') as HTMLElement;
      if (fullIcon) fullIcon.style.display = isFullscreen ? 'none' : 'block';
      if (exitIcon) exitIcon.style.display = isFullscreen ? 'block' : 'none';
      btn.setAttribute('aria-label', isFullscreen ? 'Exit fullscreen' : 'Fullscreen');
      const fullTooltip = btn.querySelector('.fullscreen-tooltip') as HTMLElement;
      const exitTooltip = btn.querySelector('.exit-fullscreen-tooltip') as HTMLElement;
      if (fullTooltip) fullTooltip.style.display = isFullscreen ? 'none' : 'block';
      if (exitTooltip) exitTooltip.style.display = isFullscreen ? 'block' : 'none';
    }
  }

  #updateVolumeSlider(volume: number, wrapper?: HTMLElement): void {
    if (this.#$volumeProgress) this.#$volumeProgress.style.width = volume * 100 + '%';
  }

  #toggleSpeedMenu(wrapper: HTMLElement): void {
    this.#$speedMenu?.classList.toggle('active');
  }

  #closeSpeedMenu(wrapper: HTMLElement): void {
    this.#$speedMenu?.classList.remove('active');
  }

  #seekBackward(): void {
    if (this.#videoElement) {
      this.#videoElement.currentTime = Math.max(0, this.#videoElement.currentTime - this.#getConfig().seekStep);
    }
  }

  #seekForward(): void {
    if (this.#videoElement) {
      this.#videoElement.currentTime = Math.min(this.#videoElement.duration, this.#videoElement.currentTime + this.#getConfig().seekStep);
    }
  }

  #adjustVolume(delta: number): void {
    if (this.#videoElement) {
      this.#setVolume(this.#videoElement.volume + delta);
    }
  }

  // ---------- PERFORMANCE MODE ----------
  #enablePerformanceMode(): void {
    if (this.#$wrapper) this.#$wrapper.classList.add('perf-mode');
  }

  // ---------- REINITIALIZE / DESTROY ----------
  #reinitialize(): void {
    this.#destroy();
    this.#render();
    requestAnimationFrame(() => {
      this.#init();
      this.#setupVisibilityHandling();
    });
  }

  #destroy(): void {
    this.#removeVisibilityHandling();
    if (this.#observer) { this.#observer.disconnect(); this.#observer = null; }
    if (this.#$wrapper) {
      this.#$wrapper.removeEventListener('keydown', this.#handleKeyboard);
    }
    if (this.#videoElement) {
      this.#videoElement.pause();
      this.#videoElement.removeEventListener('click', this.#togglePlayPause);
      this.#videoElement.src = '';
      this.#videoElement.load();
      this.#videoElement = null;
    }
    if (this.#rafId) cancelAnimationFrame(this.#rafId);
    // Reset state
    this.#isInitialized = false;
    this.#isPlaying = false;
    this.#videoLoaded = false;
    this.#wasPlayingBeforeHidden = false;
    this.#hasPlayedOnce = false;
    this.#posterVisible = this.#hasPoster;
    this.#currentSpeed = 1;
    this.#$wrapper = null;
    this.#$seekbar = null;
    this.#$seekbarProgress = null;
    this.#$timeDisplay = null;
    this.#$volumeProgress = null;
    this.#$speedMenu = null;
    this.#$speedText = null;
    this.#configCache = null;
  }

  #emit(name: string, detail: Record<string, any> = {}): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}

// Auto-define if not already defined
if (!customElements.get('shadow-plyr')) {
  customElements.define('shadow-plyr', ShadowPlyr);
}