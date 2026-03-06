/**
 * Shadow Plyr
 * A production-grade Web Component video player
 *
 * @version 2.0.0
 * @license MIT
 * @author Element Mint
 * @copyright (c) 2026 Element Mint
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files.
 */

import { VideoPlayerConfig, IconSet } from "./types";
import { DEFAULT_ICONS, IconCache } from "./icons";
import { throttle } from "./utils";
import DOMPurify from "dompurify";

// ---------- SHARED STATIC STYLES ----------
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
    object-fit: contain; display: block; pointer-events: auto;
    opacity: 0; transition: opacity .3s ease; will-change: opacity;
    will-change: opacity, transform;
  transform: translateZ(0);
  }
  .video-loaded.is-playing video,
  .video-loaded:not(.poster-visible) video { opacity: 1 }
  video::-webkit-media-controls { display: none }
  picture {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block;
    z-index: 5; opacity: 0; transition: opacity .3s ease; pointer-events: none;
    cursor: pointer;
  }
  picture img { width: 100%; height: 100%; object-fit: contain display: block; }
  .poster-visible picture { opacity: 1; pointer-events: auto; }
  .video-loading::after {
    content: ''; position: absolute; top: 50%; left: 50%; width: 40px; height: 40px;
    margin: -20px 0 0 -20px; border: 3px solid rgba(255,255,255,.3);
    border-top-color: #fff; border-radius: 50%; animation: spin .8s linear infinite;
    z-index: 10;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  /* ----- CSS CUSTOM PROPERTIES ----- */
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
  position: relative;
  width: 100%;
  height: 14px;
}

.video-seekbar-track {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 8px;
  transform: translateY(-50%);
  background: rgba(255,255,255,.3);
  border-radius: 6px;
  overflow: hidden;
}

.video-seekbar-buffer {
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,.2);
  transform-origin: left center;
  transform: scaleX(0);
}

.video-seekbar-progress{
height:8px;
}

.video-seekbar-fill {
  height: 100%;
  width: 100%;
  background: var(--accent-color,#ff8c42);
  transform-origin: left center;
  transform: scaleX(0);
}

.video-seekbar-handle {
  position: absolute;
  top: 50%;
  left: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--accent-color,#ff8c42);
  transform: translate(-50%, -50%);
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
  .video-speed-control, .video-quality-control, .video-subtitle-control, .video-more-control { position: relative; }
  .video-speed-btn, .video-quality-btn, .video-subtitle-btn, .video-more-btn { min-width: 45px; font-size: 13px; font-weight: 600; color:var(--accent-color,#fff) }
  .video-speed-menu, .video-quality-menu, .video-subtitle-menu, .video-more-menu {
    position: absolute; bottom: 100%; right: 0; border-radius: 4px; padding: 5px 0;
    margin-bottom: 10px; min-width: 80px; opacity: 0; visibility: hidden;
    transform: translateY(10px); transition: all .2s ease; z-index: 100;
    background: var(--controls-bg, rgba(0,0,0,.8));
  }
  .video-speed-menu.active, .video-quality-menu.active, .video-subtitle-menu.active, .video-more-menu.active { opacity: 1; visibility: visible; transform: translateY(0); }
  .video-speed-option, .video-quality-option, .video-subtitle-option, .video-more-option {
    display: block; width: 100%; padding: 8px 15px; background: none; border: none;
    font-size: 13px; text-align: left; cursor: pointer; transition: background .2s;
    color: var(--accent-color, #fff);
  }
  .video-speed-option:hover, .video-quality-option:hover, .video-subtitle-option:hover, .video-more-option:hover { background: rgba(255,255,255,.1); }
  .video-speed-option.active, .video-quality-option.active, .video-subtitle-option.active, .video-more-option.active { background: rgba(255,255,255,.2); font-weight: 600; }
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

  .video-control-btn.disabled,
.video-control-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: auto;
}
  @media (max-width: 768px) {
    .video-center-play { width: 60px; height: 60px; }
    .video-center-play svg { width: 30px; height: 30px; }
    .video-controls-bar { padding: 30px 10px 10px; }
    .video-control-btn svg { width: 20px; height: 20px; }
    .video-volume-slider { display: none; }
    .video-time-display { font-size: 11px; }
  }
  .responsive-hidden { display: none }
  .responsive-more-menu .video-control-btn { display: flex; width: 100%; padding: 10px; }

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
    from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    to { opacity: 0; transform: translate(-50%, -50%) scale(8); }
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
  /* Theater mode – applied to container */
  .video-container.theater-mode {
    max-width: none;
    aspect-ratio: auto;
  }
  /* Mini player */
  .mini-player {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 320px;
    height: 180px;
    z-index: 9999;
    box-shadow: 0 0 20px rgba(0,0,0,.5);
    top:auto;
    left:auto;
    border-radius:8px;
    overflow:hidden;
  }
  .mini-player .video-volume-slider,
.mini-player .video-time-display,
.mini-player .fullscreen-btn,
.mini-player .video-more-control
{
  display: none !important;
}
  .mini-player .miniplayer-btn {
  display:block !important;
  }
  .mini-player .video-controls-bar{
    gap:0;
    padding:16px 6px 2px;
  }
    .mini-player video,
    .mini-player img{
    border-radius:8px;
    }
`);

// ---------- GLOBAL VIDEO ENGINE ----------
const GlobalVideoEngine = (() => {
  const instances = new Set<ShadowPlyr>();
  let activeInstance: ShadowPlyr | null = null;
  return {
    register(instance: ShadowPlyr) {
      instances.add(instance);
    },
    unregister(instance: ShadowPlyr) {
      instances.delete(instance);
      if (activeInstance === instance) activeInstance = null;
    },
    requestPlay(instance: ShadowPlyr) {
      if (activeInstance && activeInstance !== instance)
        activeInstance.pauseVideo(true);
      activeInstance = instance;
    },
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
  #$container: HTMLElement | null = null;
  #$seekbar: HTMLElement | null = null;
  #$seekbarProgress: HTMLElement | null = null;
  #$seekbarBuffer: HTMLElement | null = null;
  #$seekbarHandle!: HTMLElement;
  #$timeDisplay: HTMLElement | null = null;
  #$volumeProgress: HTMLElement | null = null;
  #$speedMenu: HTMLElement | null = null;
  #$speedText: HTMLElement | null = null;
  #$qualityMenu: HTMLElement | null = null;
  #$qualityText: HTMLElement | null = null;
  #$subtitleMenu: HTMLElement | null = null;
  #$subtitleText: HTMLElement | null = null;
  #$moreMenu: HTMLElement | null = null;
  #$moreBtn: HTMLElement | null = null;
  #$seekbarFill!: HTMLElement;
  #tapCount = 0;
  #tapTimeout: number | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #hls: any = null;
  #qualityLevels: any[] = [];
  #manualQualities: Array<{
    src: string;
    type: string;
    label: string;
    media: string | null;
  }> = [];
  #currentQualityLabel: string | null = null;
  #currentQualityIndex: number | null = null;
  #subtitlesTracks: TextTrack[] = [];
  #activeSubtitle: string | null = null;
  #resumeKey: string | null = null;
  #theaterMode = false;
  #miniPlayerActive = false;

  // Event handlers as arrow properties
  #handleKeyboard = (e: KeyboardEvent): void => {
    if (!this.#videoElement) return;
    const key = e.key.toLowerCase();
    const config = this.#getConfig();
    let handled = false;
    const actions: Record<string, () => void> = {
      " ": () => this.#togglePlayPause(),
      k: () => this.#togglePlayPause(),
      arrowleft: () => this.#seekBackward(),
      arrowright: () => this.#seekForward(),
      arrowup: () => this.#adjustVolume(0.1),
      arrowdown: () => this.#adjustVolume(-0.1),
      m: () => this.#toggleMute(),
      f: () => this.#toggleFullscreen(),
      home: () => {
        if (this.#videoElement) this.#videoElement.currentTime = 0;
      },
      end: () => {
        if (this.#videoElement)
          this.#videoElement.currentTime = this.#videoElement.duration;
      },
      l: () => this.#toggleLoop(),
      p: () => this.#togglePip(),
      t: () => this.#toggleTheaterMode(),
      "?": () => this.#showKeyboardHelp(),
    };
    if (actions[key]) {
      e.preventDefault();
      actions[key]();
      handled = true;
    } else if (key >= "0" && key <= "9" && this.#videoElement.duration) {
      e.preventDefault();
      this.#videoElement.currentTime =
        this.#videoElement.duration * (parseInt(key) / 10);
      handled = true;
    }
    if (handled && this.#$wrapper)
      this.#$wrapper.classList.add("show-controls");
  };

  #togglePlayPause = (e?: Event): void => {
    if (e) e.stopPropagation();
    if (!this.#videoElement) return;
    if (this.#isPlaying) this.pauseVideo();
    else this.playVideo();
  };

  #toggleMute = (e?: Event): void => {
    if (e) e.stopPropagation();
    if (this.#videoElement)
      this.#videoElement.muted = !this.#videoElement.muted;
  };

  #toggleFullscreen = (e?: Event): void => {
    if (e) e.stopPropagation();
    const elem = this.#$container;
    const video = this.#videoElement;

    if (
      !document.fullscreenElement &&
      !(document as any).webkitFullscreenElement
    ) {
      // Safari prefers fullscreen on video element
      if (video && "webkitEnterFullscreen" in video) {
        (video as any).webkitEnterFullscreen();
        return;
      }

      if (elem?.requestFullscreen) elem.requestFullscreen();
      else if (elem && "webkitRequestFullscreen" in elem)
        (elem as any).webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen)
        (document as any).webkitExitFullscreen();
    }
  };

  #toggleLoop = (e?: Event): void => {
    if (e) e.stopPropagation();
    if (!this.#videoElement) return;
    this.#videoElement.loop = !this.#videoElement.loop;
    this.#updateLoopIcon(this.#videoElement.loop);
    this.#emit("video-loop-change", { loop: this.#videoElement.loop });
  };

  #togglePip = async (e?: Event): Promise<void> => {
    if (e) e.stopPropagation();
    if (!this.#videoElement) return;
    try {
      if (document.pictureInPictureElement === this.#videoElement) {
        await document.exitPictureInPicture();
      } else if (this.#videoElement.requestPictureInPicture) {
        await this.#videoElement.requestPictureInPicture();
      }
    } catch (err) {
      console.warn("PiP failed", err);
    }
  };

  #toggleTheaterMode = (): void => {
    this.#theaterMode = !this.#theaterMode;
    this.#$container?.classList.toggle("theater-mode", this.#theaterMode);
    this.classList.toggle("theater-mode", this.#theaterMode);
    this.#emit("theater-mode-change", { enabled: this.#theaterMode });
  };

  #toggleMiniPlayer = (): void => {
    if (!this.#videoElement) return;
    if (!this.#miniPlayerActive) {
      this.#miniPlayerActive = true;
      this.#$wrapper?.classList.add("mini-player");
      this.classList.add("mini-player");
    } else {
      this.#miniPlayerActive = false;
      this.#$wrapper?.classList.remove("mini-player");
      this.classList.remove("mini-player");
    }
    this.#emit("mini-player-change", { active: this.#miniPlayerActive });
  };

  #showKeyboardHelp = (): void => {
    const help = document.createElement("div");
    help.className = "keyboard-help";
    help.innerHTML = `
      <div class="help-content">
        <h3>Keyboard Shortcuts</h3>
        <ul>
          <li>Space / K: Play/Pause</li>
          <li>←/→: Seek backward/forward ${this.#getConfig().seekStep}s</li>
          <li>↑/↓: Volume up/down</li>
          <li>M: Mute</li>
          <li>F: Fullscreen</li>
          <li>L: Toggle Loop</li>
          <li>P: Picture-in-Picture</li>
          <li>T: Theater mode</li>
          <li>Home/End: Start/End</li>
          <li>0-9: Seek 0% to 90%</li>
        </ul>
        <button class="close-help">Close</button>
      </div>
    `;
    help.addEventListener("click", () => help.remove());
    help
      .querySelector(".close-help")
      ?.addEventListener("click", () => help.remove());
    this.#$wrapper?.appendChild(help);
  };

  #takeScreenshot = (): void => {
    if (!this.#videoElement) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = this.#videoElement.videoWidth;
      canvas.height = this.#videoElement.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(this.#videoElement, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (!blob) {
          console.warn("Screenshot blocked due to CORS.");
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `screenshot-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.warn("Screenshot failed:", err);
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
      wrapper?.querySelectorAll(".video-speed-option").forEach((opt) => {
        opt.classList.toggle(
          "active",
          parseFloat(opt.getAttribute("data-speed")!) === speed
        );
      });
      if (this.#$speedText) this.#$speedText.textContent = speed + "x";
    }
  };

  // Quality handling
  #setAutoQuality = (): void => {
    const video = this.#videoElement;
    if (!video) return;
    const currentTime = video.currentTime;
    const wasPlaying = this.#isPlaying;
    video.removeAttribute("src");
    video.load();
    video.addEventListener(
      "loadeddata",
      () => {
        video.currentTime = currentTime;
        if (wasPlaying) video.play();
      },
      { once: true }
    );
    this.#currentQualityLabel = null;
    this.#updateQualityText();
    this.#populateQualityMenu(); // refresh active state
  };

  #setManualQuality = (label: string): void => {
    const video = this.#videoElement;
    if (!video) return;

    if (this.#currentQualityLabel === label) {
      return; // already active → do nothing
    }

    const source = this.#manualQualities.find((q) => q.label === label);
    if (!source) return;

    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    // Prevent flash reset
    video.pause();

    video.src = source.src;

    // Safari rendering fix
    video.style.display = "none";
    video.load();

    requestAnimationFrame(() => {
      video.style.display = "";
    });

    video.addEventListener(
      "loadedmetadata",
      () => {
        // ensure metadata ready
        if (currentTime > 0 && currentTime < video.duration) {
          video.currentTime = currentTime;
        }
      },
      { once: true }
    );

    video.addEventListener(
      "canplay",
      () => {
        if (wasPlaying) {
          video.play().catch(() => {});
        }
      },
      { once: true }
    );

    this.#currentQualityLabel = label;
    this.#updateQualityText();
    this.#populateQualityMenu();
  };

  #setSubtitle = (trackId: string | null): void => {
    if (!this.#videoElement) return;
    this.#subtitlesTracks.forEach((track) => {
      track.mode = "disabled";
    });
    if (trackId) {
      const track = this.#subtitlesTracks.find(
        (t) => t.id === trackId || t.label === trackId
      );
      if (track) track.mode = "showing";
    }
    this.#activeSubtitle = trackId;
    this.#updateSubtitleText();
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
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
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
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
    };
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd);
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
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  #onLoadedData = (wrapper: HTMLElement, config: VideoPlayerConfig): void => {
    if (!this.#videoElement) return;
    wrapper.classList.remove("video-loading");
    wrapper.classList.add("video-loaded");
    this.classList.remove("video-loading");
    this.classList.add("video-loaded");
    this.#isInitialized = true;
    this.#videoLoaded = true;

    // Collect subtitle tracks
    this.#subtitlesTracks = Array.from(this.#videoElement.textTracks).filter(
      (t) => t.kind === "subtitles" || t.kind === "captions"
    );
    const subtitleBtn = wrapper.querySelector(
      ".video-subtitle-btn"
    ) as HTMLButtonElement | null;
    
    if (config.showSubtitles) {
      if (this.#subtitlesTracks.length > 0) {
        this.#populateSubtitleMenu(wrapper);
    
        if (subtitleBtn) {
          subtitleBtn.disabled = false;
          subtitleBtn.classList.remove("disabled");
          subtitleBtn.setAttribute("aria-disabled", "false");
    
          const tooltip = subtitleBtn.querySelector(".subtitle-tooltip");
          if (tooltip) tooltip.textContent = "Subtitles";
        }
      } else {
        // Disable button when no subtitle tracks
        if (subtitleBtn) {
          subtitleBtn.disabled = true;
          subtitleBtn.classList.add("disabled");
          subtitleBtn.setAttribute("aria-disabled", "true");
    
          const tooltip = subtitleBtn.querySelector(".subtitle-tooltip");
          if (tooltip) tooltip.textContent = "No subtitles available";
        }
      }
    }

    // Setup quality menu
    if (config.showQuality && this.#videoElement.src.includes(".m3u8")) {
      this.#initHls();
    } else if (config.showQuality && this.#manualQualities.length > 0) {
      this.#populateQualityMenu();
    } else if (config.showQuality) {
      this.#populateQualityMenu(); // shows "No qualities"
    }

    // Playback memory resume
    if (config.resume && this.#resumeKey) {
      const savedTime = localStorage.getItem(this.#resumeKey);
      if (savedTime) {
        const time = parseFloat(savedTime);
        if (time > 5 && time < this.#videoElement.duration - 5) {
          this.#videoElement.currentTime = time;
        }
      }
    }

    if (config.showControls) this.#setupControlButtons(wrapper);
    if (!config.autoplay) {
      this.#hasPlayedOnce = false;
      this.#posterVisible = true;
      wrapper.classList.add("poster-visible");
      this.classList.add("poster-visible");
    }
    this.#updateFullscreenIcon(false, wrapper);
    this.#emit("video-ready", { duration: this.#videoElement.duration });

    if (config.responsiveControls) {
      this.#setupResponsive(wrapper);
    }
  };

  /**
   * Initializes HLS.js for m3u8 streams.
   * Assumes hls.js is available as a local dependency (bundled with the app).
   */
  async #initHls(): Promise<void> {
    if (!this.#videoElement) return;

    const src = this.#videoElement.currentSrc || this.#videoElement.src;
    if (!src.includes(".m3u8")) return;

    try {
      // Import the entire hls.js module (includes default export and named exports like Events)
      const hlsModule = await import("hls.js");
      this.#setupHls(hlsModule, src);
    } catch (err) {
      console.error(
        "HLS.js could not be loaded. Make sure it is included in your bundle.",
        err
      );
    }
  }

  /**
   * Sets up the HLS.js instance after the module has been loaded.
   * @param hlsModule - The entire hls.js module object (containing the constructor and Events)
   * @param src - The URL of the HLS stream (must be a valid HTTPS URL)
   */
  #setupHls(hlsModule: any, src: string): void {
    // Extract the constructor (default export)
    const Hls = hlsModule.default;

    // Create HLS instance with recommended settings
    this.#hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
    });

    // Load the source and attach to video element
    this.#hls.loadSource(src);
    this.#hls.attachMedia(this.#videoElement);

    // Listen for manifest parsed to populate quality menu
    this.#hls.on(hlsModule.Events.MANIFEST_PARSED, () => {
      this.#qualityLevels = this.#hls.levels;
      this.#populateQualityMenu();
    });
  }

  #populateQualityMenu(): void {
    if (!this.#$qualityMenu) return;
    this.#$qualityMenu.innerHTML = "";

    // Collect unique quality labels from manual sources
    const labels = [
      ...new Set(this.#manualQualities.map((q) => q.label)),
    ].sort();

    if (labels.length === 0 && this.#qualityLevels.length === 0) {
      const opt = document.createElement("button");
      opt.className = "video-quality-option";
      opt.disabled = true;
      opt.textContent = "No qualities available";
      opt.setAttribute("part", "quality-option");
      this.#$qualityMenu?.appendChild(opt);
      return;
    }

    // Auto option (for both HLS and manual)
    const auto = document.createElement("button");
    auto.className = `video-quality-option ${
      !this.#currentQualityLabel ? "active" : ""
    }`;
    auto.setAttribute("data-quality", "auto");
    auto.textContent = "Auto";
    auto.setAttribute("part", "quality-option");
    auto.addEventListener("click", () => this.#setAutoQuality());
    this.#$qualityMenu?.appendChild(auto);

    // If HLS levels exist, add them
    if (this.#qualityLevels.length > 0) {
      this.#qualityLevels.forEach((level, index) => {
        const levelLabel = level.height
          ? `${level.height}p`
          : `Level ${index + 1}`;

        const opt = document.createElement("button");
        opt.className = `video-quality-option ${
          this.#currentQualityIndex === index ? "active" : ""
        }`;
        opt.setAttribute("data-quality", index.toString());
        opt.textContent = levelLabel;
        opt.setAttribute("part", "quality-option");
        opt.addEventListener("click", () => this.#setHlsQuality(index));

        this.#$qualityMenu?.appendChild(opt);
      });
    }

    // Manual quality labels
    labels.forEach((label) => {
      const opt = document.createElement("button");
      opt.className = `video-quality-option ${
        this.#currentQualityLabel === label ? "active" : ""
      }`;
      opt.setAttribute("data-quality", label);
      opt.textContent = `${label}p`;
      opt.setAttribute("part", "quality-option");
      opt.addEventListener("click", () => this.#setManualQuality(label));
      this.#$qualityMenu?.appendChild(opt);
    });
  }

  #setHlsQuality = (index: number): void => {
    if (!this.#hls || this.#hls.levels.length === 0) return;

    // Prevent redundant switching
    if (this.#currentQualityIndex === index) return;

    this.#hls.currentLevel = index;
    this.#currentQualityIndex = index;

    const level = this.#hls.levels[index];

    this.#currentQualityLabel = level?.height
      ? `${level.height}p`
      : level?.name || `${Math.round(level?.bitrate / 1000)}kbps`;

    this.#updateQualityText();
    this.#populateQualityMenu();
  };

  #populateSubtitleMenu(wrapper: HTMLElement): void {
    const menu = wrapper.querySelector(".video-subtitle-menu");
    if (!menu) return;
    menu.innerHTML = "";
    // Off option
    const off = document.createElement("button");
    off.className = `video-subtitle-option ${
      !this.#activeSubtitle ? "active" : ""
    }`;
    off.setAttribute("data-subtitle", "");
    off.textContent = "Off";
    off.setAttribute("part", "subtitle-option");
    off.addEventListener("click", () => this.#setSubtitle(null));
    menu?.appendChild(off);
    // Track options
    this.#subtitlesTracks.forEach((track) => {
      const opt = document.createElement("button");
      opt.className = `video-subtitle-option ${
        this.#activeSubtitle === track.label ? "active" : ""
      }`;
      opt.setAttribute("data-subtitle", track.label);
      opt.textContent = track.label || "Subtitles";
      opt.setAttribute("part", "subtitle-option");
      opt.addEventListener("click", () => this.#setSubtitle(track.label));
      menu?.appendChild(opt);
    });
  }

  #startVideoFrameLoop(): void {
    const video = this.#videoElement;
    if (!video) return;

    const loop = () => {
      if (!this.#videoElement) return;

      this.#updateSeekbar();
      this.#updateTimeDisplay();

      if ("requestVideoFrameCallback" in video) {
        (video as any).requestVideoFrameCallback(loop);
      } else {
        this.#rafId = requestAnimationFrame(loop);
      }
    };

    loop();
  }

  #onPlaying = (wrapper: HTMLElement): void => {
    this.#emit("video-playing", {
      currentTime: this.#videoElement!.currentTime,
      duration: this.#videoElement!.duration,
    });
    wrapper.classList.add("is-playing");
    wrapper.classList.remove("poster-visible");
    this.classList.add("is-playing");
    this.classList.remove("poster-visible");
    this.#isPlaying = true;
    this.#hasPlayedOnce = true;
    this.#posterVisible = false;
    this.#updatePlayPauseIcon(true, wrapper);
    this.#startVideoFrameLoop();
  };

  #onPause = (wrapper: HTMLElement): void => {
    if (this.#rafId) {
      cancelAnimationFrame(this.#rafId);
      this.#rafId = null;
    }
    this.#emit("video-paused", {
      currentTime: this.#videoElement!.currentTime,
    });
    wrapper.classList.remove("is-playing");
    this.classList.remove("is-playing");
    this.#isPlaying = false;
    this.#updatePlayPauseIcon(false, wrapper);
    const config = this.#getConfig();
    if (
      config.resume &&
      this.#resumeKey &&
      this.#videoElement &&
      window.isSecureContext
    ) {
      localStorage.setItem(
        this.#resumeKey,
        this.#videoElement.currentTime.toString()
      );
    }
  };

  #onEnded = (wrapper: HTMLElement, config: VideoPlayerConfig): void => {
    this.#emit("video-ended", { duration: this.#videoElement!.duration });
    wrapper.classList.remove("is-playing");
    this.classList.remove("is-playing");
    this.#isPlaying = false;
    this.#updatePlayPauseIcon(false, wrapper);
    if (!config.loop) {
      if (config.resetOnEnded) this.#videoElement!.currentTime = 0;
      if (config.showPosterOnEnded && this.#hasPoster) {
        wrapper.classList.add("poster-visible");
        this.classList.add("poster-visible");
        this.#posterVisible = true;
      }
    }
  };

  #onVolumeChange = (wrapper: HTMLElement): void => {
    const v = this.#videoElement!;
    this.#updateVolumeIcon(v.muted || v.volume === 0, wrapper);
    this.#updateVolumeSlider(v.volume, wrapper);
    this.#emit("video-volume-change", { volume: v.volume, muted: v.muted });
  };

  #onError = (wrapper: HTMLElement): void => {
    console.error("Video load error");
    wrapper.classList.remove("video-loading", "video-loaded");
    this.classList.remove("video-loading", "video-loaded");
    this.#videoLoaded = false;
    this.#emit("video-error", { code: this.#videoElement?.error?.code });
  };

  #onFullscreenChange = (): void => {
    const fsElement =
      document.fullscreenElement || (document as any).webkitFullscreenElement;

    const isFull =
      fsElement === this.#$container ||
      fsElement === this ||
      (fsElement && this.contains(fsElement));

    this.#updateFullscreenIcon(isFull);
    this.#emit(isFull ? "video-fullscreen-enter" : "video-fullscreen-exit");
  };

  #onProgress = (): void => {
    if (!this.#videoElement || !this.#$seekbarBuffer) return;
    const buffered = this.#videoElement.buffered;
    if (buffered.length === 0) return;
    const end = buffered.end(buffered.length - 1);
    const percent = end / this.#videoElement.duration;
    this.#$seekbarBuffer.style.transform = `scaleX(${percent})`;
  };

  #onPipEnter = (): void => {
    this.#updatePipIcon(true);
  };
  #onPipLeave = (): void => {
    this.#updatePipIcon(false);
  };

  #handleTouchTap = (e: TouchEvent): void => {
    const config = this.#getConfig();
    if (!this.#videoElement) return;
    const rect = this.#$wrapper!.getBoundingClientRect();
    const touchX = e.changedTouches[0].clientX;
    const isLeft = touchX < rect.left + rect.width / 2;

    if (config.enableTapRipple) {
      this.#createRipple(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
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
    const overlay = document.createElement("div");
    overlay.className = "seek-overlay";
    overlay.textContent = (seconds > 0 ? "+" : "") + seconds + "s";
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
  #throttledProgressUpdate: () => void;
  #boundFullscreenChange: () => void;

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "open" });
    this.#shadowRoot.adoptedStyleSheets = [sheet];

    this.#throttledSeekbarUpdate = throttle(
      this.#updateSeekbar.bind(this),
      200
    );
    this.#throttledProgressUpdate = throttle(this.#onProgress.bind(this), 1000);
    this.#boundFullscreenChange = this.#onFullscreenChange.bind(this);
  }

  static get observedAttributes(): string[] {
    return [
      "lazy",
      "pause-on-out-of-view",
      "autoplay",
      "loop",
      "muted",
      "playsinline",
      "desktop-poster",
      "mobile-poster",
      "desktop-video",
      "mobile-video",
      "show-controls",
      "controls-type",
      "show-center-play",
      "show-play-pause",
      "show-seekbar",
      "show-volume",
      "show-fullscreen",
      "show-speed",
      "theme",
      "accent-color",
      "controls-background",
      "center-play-background",
      "center-play-size",
      "play-icon",
      "loop-once-icon",
      "loop-icon",
      "pause-icon",
      "volume-icon",
      "muted-icon",
      "fullscreen-icon",
      "exit-fullscreen-icon",
      "speed-icon",
      "video-type",
      "preload",
      "speed-options",
      "controls-hide-delay",
      "seek-step",
      "lazy-threshold",
      "pause-threshold",
      "pause-on-tab-hide",
      "show-poster-on-ended",
      "reset-on-ended",
      "poster-click-play",
      "performance-mode",
      "show-tooltips",
      "tooltip-play",
      "tooltip-pause",
      "tooltip-mute",
      "tooltip-unmute",
      "tooltip-fullscreen",
      "tooltip-exit-fullscreen",
      "tooltip-speed",
      "tooltip-center-play",
      "double-tap-seek",
      "double-tap-seek-seconds",
      "show-seek-buttons",
      "seek-button-seconds",
      "triple-tap-seek",
      "triple-tap-seconds",
      "enable-tap-ripple",
      "single-active",
      "show-loop",
      "show-pip",
      "show-subtitles",
      "show-quality",
      "skip-intro",
      "theater-mode",
      "resume",
      "screenshot",
      "airplay",
      "mini-player",
      "responsive-controls",
      "buffer-progress",
    ];
  }

  #isValidMediaUrl(url: string | null | undefined): boolean {
    if (!url || typeof url !== "string") return false;
    try {
      const parsed = new URL(url, window.location.origin);
      // In banking contexts, enforce HTTPS only.
      return parsed.protocol === "https:";
      // If you must allow HTTP for development, use:
      // return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Validates all sources inside a <picture> element.
   * Returns true only if every img.src and source.srcset is a valid HTTPS URL.
   */
  #isValidPicture(picture: HTMLPictureElement): boolean {
    const img = picture.querySelector("img");
    if (img && !this.#isValidMediaUrl(img.src)) return false;
    const sources = picture.querySelectorAll("source");
    // Convert NodeList to array to ensure iterability in all TS environments
    for (const source of Array.from(sources)) {
      if (source.srcset && !this.#isValidMediaUrl(source.srcset)) return false;
    }
    return true;
  }

  #getConfig(): VideoPlayerConfig {
    const now = Date.now();
    if (
      this.#configCache &&
      now - this.#configCacheTime < this.#CONFIG_CACHE_DURATION
    ) {
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
      preload:
        (this.getAttribute("preload") as VideoPlayerConfig["preload"]) ||
        "metadata",
      desktopPoster: this.getAttribute("desktop-poster") || "",
      mobilePoster: this.getAttribute("mobile-poster") || "",
      desktopVideo: this.getAttribute("desktop-video") || "",
      mobileVideo: this.getAttribute("mobile-video") || "",
      videoType: this.getAttribute("video-type") || "video/mp4",
      showControls: this.getAttribute("show-controls") === "true",
      controlsType:
        (this.getAttribute(
          "controls-type"
        ) as VideoPlayerConfig["controlsType"]) || "full",
      showPlayPause: this.getAttribute("show-play-pause") !== "false",
      showSeekbar: this.getAttribute("show-seekbar") === "true",
      showVolume: this.getAttribute("show-volume") === "true",
      showFullscreen: this.getAttribute("show-fullscreen") === "true",
      showCenterPlay: this.getAttribute("show-center-play") === "true",
      showSpeed: this.getAttribute("show-speed") === "true",
      speedOptions: this.#parseSpeedOptions(),
      controlsHideDelay: parseInt(
        this.getAttribute("controls-hide-delay") || "3000"
      ),
      seekStep: parseInt(this.getAttribute("seek-step") || "5"),
      lazyThreshold: parseFloat(this.getAttribute("lazy-threshold") || "0.5"),
      pauseThreshold: parseFloat(this.getAttribute("pause-threshold") || "0.3"),
      theme:
        (this.getAttribute("theme") as VideoPlayerConfig["theme"]) || "dark",
      accentColor: this.getAttribute("accent-color") || "#ffffff",
      controlsBackground:
        this.getAttribute("controls-background") || "rgba(0, 0, 0, 0.8)",
      centerPlayBackground:
        this.getAttribute("center-play-background") || "rgba(0, 0, 0, 0.7)",
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
      tooltipFullscreen:
        this.getAttribute("tooltip-fullscreen") || "Fullscreen",
      tooltipExitFullscreen:
        this.getAttribute("tooltip-exit-fullscreen") || "Exit fullscreen",
      tooltipSpeed: this.getAttribute("tooltip-speed") || "Playback speed",
      tooltipCenterPlay: this.getAttribute("tooltip-center-play") || "Play",
      doubleTapSeek: this.getAttribute("double-tap-seek") !== "false",
      doubleTapSeekSeconds: parseInt(
        this.getAttribute("double-tap-seek-seconds") || "10"
      ),
      showSeekButtons: this.getAttribute("show-seek-buttons") === "true",
      seekButtonSeconds: parseInt(
        this.getAttribute("seek-button-seconds") || "10"
      ),
      tripleTapSeek: this.getAttribute("triple-tap-seek") !== "false",
      tripleTapSeconds: parseInt(
        this.getAttribute("triple-tap-seconds") || "30"
      ),
      enableTapRipple: this.getAttribute("enable-tap-ripple") !== "false",
      singleActive: this.getAttribute("single-active") === "true",
      showLoop: this.getAttribute("show-loop") === "true",
      showPip: this.getAttribute("show-pip") === "true",
      showSubtitles: this.getAttribute("show-subtitles") === "true",
      showQuality: this.getAttribute("show-quality") === "true",
      skipIntro: parseInt(this.getAttribute("skip-intro") || "0"),
      theaterMode: this.getAttribute("theater-mode") === "true",
      resume: this.getAttribute("resume") === "true",
      screenshot: this.getAttribute("screenshot") === "true",
      airplay: this.getAttribute("airplay") === "true",
      miniPlayer: this.getAttribute("mini-player") === "true",
      responsiveControls: this.getAttribute("responsive-controls") === "true",
      bufferProgress: this.getAttribute("buffer-progress") !== "false",
    };
    this.#configCache = config;
    this.#configCacheTime = now;
    return config;
  }

  #parseSpeedOptions(): number[] {
    const attr = this.getAttribute("speed-options");
    if (!attr) return [0.5, 0.75, 1, 1.25, 1.5, 2];
    try {
      return attr
        .split(",")
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));
    } catch {
      return [0.5, 0.75, 1, 1.25, 1.5, 2];
    }
  }

  #render(): void {
    const config = this.#getConfig();

    // Check if a <picture> exists in light DOM and is valid
    const lightPicture = this.querySelector(
      "picture"
    ) as HTMLPictureElement | null;
    const useLightPicture = lightPicture && this.#isValidPicture(lightPicture);
    this.#hasPoster = !!(
      useLightPicture ||
      config.desktopPoster ||
      config.mobilePoster
    );
    this.#posterVisible = this.#hasPoster && !this.#hasPlayedOnce;
    this.#resumeKey = config.resume
      ? `shadowplyr-${config.desktopVideo || config.mobileVideo}`
      : null;

    const wrapper = document.createElement("div");
    wrapper.className = "shadow-plyr-wrapper";
    wrapper.setAttribute("tabindex", "0");
    wrapper.setAttribute("role", "application");
    wrapper.setAttribute("aria-label", "Video player");
    wrapper.setAttribute("part", "shadow-plyr-wrapper");

    // Handle poster: use light‑DOM picture if available and valid, otherwise create from attributes
    if (useLightPicture) {
      // Sanitize: remove any on* attributes from the picture and its children
      const allElements = [
        lightPicture,
        ...Array.from(lightPicture.querySelectorAll("*")),
      ];
      allElements.forEach((el) => {
        for (let i = el.attributes.length - 1; i >= 0; i--) {
          const attr = el.attributes[i];
          if (attr.name.startsWith("on")) {
            el.removeAttribute(attr.name);
          }
        }
      });
      lightPicture.setAttribute("part", "poster");
      wrapper.appendChild(lightPicture);
    } else if (
      this.#isValidMediaUrl(config.desktopPoster) ||
      this.#isValidMediaUrl(config.mobilePoster)
    ) {
      const picture = document.createElement("picture");
      picture.setAttribute("part", "poster");
      if (config.mobilePoster && this.#isValidMediaUrl(config.mobilePoster)) {
        const source = document.createElement("source");
        source.media = "(max-width: 768px)";
        source.srcset = config.mobilePoster;
        picture.appendChild(source);
      }
      if (this.#isValidMediaUrl(config.desktopPoster)) {
        const img = document.createElement("img");
        img.src = config.desktopPoster;
        img.alt = "Video thumbnail";
        img.loading = "lazy";
        picture.appendChild(img);
      }
      wrapper.appendChild(picture);
    }

    const placeholder = document.createElement("div");
    placeholder.className = "video-placeholder";
    wrapper.appendChild(placeholder);

    if (config.showCenterPlay) {
      const icons = this.#getIcons();
      const centerPlay = document.createElement("div");
      centerPlay.className = "video-center-play";
      centerPlay.setAttribute("role", "button");
      centerPlay.tabIndex = 0;
      centerPlay.setAttribute("aria-label", "Play video");
      centerPlay.setAttribute("part", "center-play");

      const playSpan = document.createElement("span");
      playSpan.className = "play-icon";
      playSpan.setAttribute("aria-hidden", "true");
      playSpan.appendChild(this.#createSVGFromString(icons.play));

      const pauseSpan = document.createElement("span");
      pauseSpan.className = "pause-icon";
      pauseSpan.style.display = "none";
      pauseSpan.setAttribute("aria-hidden", "true");
      pauseSpan.appendChild(this.#createSVGFromString(icons.pause));

      centerPlay.appendChild(playSpan);
      centerPlay.appendChild(pauseSpan);

      if (config.showTooltips) {
        const tooltip = document.createElement("span");
        tooltip.className = "tooltip center-play-tooltip";
        tooltip.textContent = config.tooltipCenterPlay;
        centerPlay.appendChild(tooltip);
      }

      const srOnly = document.createElement("span");
      srOnly.className = "sr-only";
      srOnly.textContent = "Play";
      centerPlay.appendChild(srOnly);

      wrapper.appendChild(centerPlay);
    }

    if (config.showControls && config.controlsType !== "none") {
      wrapper.appendChild(this.#createControlsHTML(config));
    }

    if (config.showSeekButtons) {
      wrapper.appendChild(this.#createSeekButtons(config));
    }

    const container = document.createElement("div");
    container.className = "video-container";
    container.setAttribute("part", "video-container");
    container.appendChild(wrapper);

    this.#shadowRoot.innerHTML = "";
    this.#shadowRoot.appendChild(container);

    this.#$wrapper = wrapper;
    this.#$container = container;
    this.#$seekbar = wrapper.querySelector(".video-seekbar");
    this.#$seekbarProgress = wrapper.querySelector(".video-seekbar-progress");
    this.#$seekbarBuffer = wrapper.querySelector(".video-seekbar-buffer");
    this.#$timeDisplay = wrapper.querySelector(".video-time-display");
    this.#$volumeProgress = wrapper.querySelector(".video-volume-progress");
    this.#$speedMenu = wrapper.querySelector(".video-speed-menu");
    this.#$speedText = wrapper.querySelector(".speed-text");
    this.#$qualityMenu = wrapper.querySelector(".video-quality-menu");
    this.#$qualityText = wrapper.querySelector(".quality-text");
    this.#$subtitleMenu = wrapper.querySelector(".video-subtitle-menu");
    this.#$subtitleText = wrapper.querySelector(".subtitle-text");
    this.#$moreMenu = wrapper.querySelector(".video-more-menu");
    this.#$moreBtn = wrapper.querySelector(".video-more-btn");
  }

  #createSVGFromString(svgString: string): SVGElement {
    const div = document.createElement("div");
    div.innerHTML = svgString.trim();
    const svg = div.firstElementChild as SVGElement;
    if (!svg || svg.tagName.toLowerCase() !== "svg") {
      const fallback = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      fallback.setAttribute("viewBox", "0 0 24 24");
      return fallback;
    }
    return svg;
  }

  #createSeekButtons(config: VideoPlayerConfig): HTMLElement {
    const container = document.createElement("div");
    container.className = "video-seek-buttons";
    container.setAttribute("part", "seek-buttons");

    const left = document.createElement("button");
    left.className = "seek-left";
    left.textContent = `-${config.seekButtonSeconds}s`;
    left.setAttribute("part", "seek-left");
    const right = document.createElement("button");
    right.className = "seek-right";
    right.textContent = `+${config.seekButtonSeconds}s`;
    right.setAttribute("part", "seek-right");

    left.addEventListener("click", () => {
      if (!this.#videoElement) return;
      this.#videoElement.currentTime = Math.max(
        0,
        this.#videoElement.currentTime - config.seekButtonSeconds
      );
    });
    right.addEventListener("click", () => {
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

  #getIcons(): IconSet {
    const cacheKey = `${this.getAttribute("play-icon") || ""}-${
      this.getAttribute("pause-icon") || ""
    }`;
    if (IconCache.has(cacheKey)) return IconCache.get(cacheKey)!;

    // Use DOMPurify's SVG profile – safe, and preserves all SVG content.
    const purifyOptions = {
      USE_PROFILES: { svg: true },
    };

    const icons: IconSet = {
      play: DOMPurify.sanitize(
        this.getAttribute("play-icon") || DEFAULT_ICONS.play,
        purifyOptions
      ),
      pause: DOMPurify.sanitize(
        this.getAttribute("pause-icon") || DEFAULT_ICONS.pause,
        purifyOptions
      ),
      volume: DOMPurify.sanitize(
        this.getAttribute("volume-icon") || DEFAULT_ICONS.volume,
        purifyOptions
      ),
      muted: DOMPurify.sanitize(
        this.getAttribute("muted-icon") || DEFAULT_ICONS.muted,
        purifyOptions
      ),
      fullscreen: DOMPurify.sanitize(
        this.getAttribute("fullscreen-icon") || DEFAULT_ICONS.fullscreen,
        purifyOptions
      ),
      exitFullscreen: DOMPurify.sanitize(
        this.getAttribute("exit-fullscreen-icon") ||
          DEFAULT_ICONS.exitFullscreen,
        purifyOptions
      ),
      speed: DOMPurify.sanitize(
        this.getAttribute("speed-icon") || DEFAULT_ICONS.speed,
        purifyOptions
      ),
      loopOnce: DOMPurify.sanitize(
        this.getAttribute("loop-once-icon") || DEFAULT_ICONS.loopOnce,
        purifyOptions
      ),
      loop: DOMPurify.sanitize(
        this.getAttribute("loop-icon") || DEFAULT_ICONS.loop,
        purifyOptions
      ),
      pip: DOMPurify.sanitize(
        this.getAttribute("pip-icon") || DEFAULT_ICONS.pip,
        purifyOptions
      ),
      subtitle: DOMPurify.sanitize(
        this.getAttribute("subtitle-icon") || DEFAULT_ICONS.subtitle,
        purifyOptions
      ),
      quality: DOMPurify.sanitize(
        this.getAttribute("quality-icon") || DEFAULT_ICONS.quality,
        purifyOptions
      ),
      more: DOMPurify.sanitize(
        this.getAttribute("more-icon") || DEFAULT_ICONS.more,
        purifyOptions
      ),
      theater: DOMPurify.sanitize(
        this.getAttribute("theater-icon") || DEFAULT_ICONS.theater,
        purifyOptions
      ),
      screenshot: DOMPurify.sanitize(
        this.getAttribute("screenshot-icon") || DEFAULT_ICONS.screenshot,
        purifyOptions
      ),
      airplay: DOMPurify.sanitize(
        this.getAttribute("airplay-icon") || DEFAULT_ICONS.airplay,
        purifyOptions
      ),
      miniplayer: DOMPurify.sanitize(
        this.getAttribute("miniplayer-icon") || DEFAULT_ICONS.miniplayer,
        purifyOptions
      ),
    };

    IconCache.set(cacheKey, icons);
    return icons;
  }

  #createControlsHTML(config: VideoPlayerConfig): DocumentFragment {
    const icons = this.#getIcons();
    const frag = document.createDocumentFragment();
    const controlsBar = document.createElement("div");
    controlsBar.className = "video-controls-bar";
    controlsBar.setAttribute("role", "region");
    controlsBar.setAttribute("aria-label", "Video controls");
    controlsBar.setAttribute("part", "controls");

    if (config.showSeekbar) {
      const seekbar = document.createElement("div");
      seekbar.className = "video-seekbar";
      seekbar.setAttribute("role", "slider");
      seekbar.tabIndex = 0;
      seekbar.setAttribute("aria-label", "Seek");
      seekbar.setAttribute("aria-valuemin", "0");
      seekbar.setAttribute("aria-valuemax", "100");
      seekbar.setAttribute("aria-valuenow", "0");
      seekbar.setAttribute("part", "seekbar");

      this.#$seekbar = seekbar;

      /* TRACK (clipping layer) */

      const track = document.createElement("div");
      track.className = "video-seekbar-track";
      track.setAttribute("part", "video-seekbar-track");

      /* BUFFER */

      if (config.bufferProgress) {
        const buffer = document.createElement("div");
        buffer.className = "video-seekbar-buffer";
        buffer.setAttribute("part", "seekbar-buffer");

        this.#$seekbarBuffer = buffer;
        track.appendChild(buffer);
      }

      /* PROGRESS */

      const progress = document.createElement("div");
      progress.className = "video-seekbar-progress";
      progress.setAttribute("part", "video-seekbar-progress");

      const fill = document.createElement("div");
      fill.className = "video-seekbar-fill";
      fill.setAttribute("part", "seekbar-progress");

      this.#$seekbarFill = fill;

      progress.appendChild(fill);
      track.appendChild(progress);

      /* HANDLE (outside track so it can overflow) */

      const handle = document.createElement("div");
      handle.className = "video-seekbar-handle";
      handle.setAttribute("part", "seekbar-handle");

      this.#$seekbarHandle = handle;

      /* assemble */

      seekbar.appendChild(track);
      seekbar.appendChild(handle);

      controlsBar.appendChild(seekbar);
    }

    const row = document.createElement("div");
    row.className = "video-controls-row";
    row.setAttribute("part", "controls-row");
    controlsBar.appendChild(row);

    if (config.showPlayPause) {
      row.appendChild(this.#createPlayPauseButton(icons, config));
    }
    if (config.showVolume) {
      row.appendChild(this.#createVolumeControl(icons, config));
    }

    const timeDisplay = document.createElement("div");
    timeDisplay.className = "video-time-display";
    timeDisplay.textContent = "0:00 / 0:00";
    timeDisplay.setAttribute("part", "time-display");
    row.appendChild(timeDisplay);

    const spacer = document.createElement("div");
    spacer.className = "video-controls-spacer";
    spacer.setAttribute("part", "controls-spacer");
    row.appendChild(spacer);

    if (config.showLoop) {
      row.appendChild(this.#createLoopButton(icons, config));
    }
    if (config.showPip && document.pictureInPictureEnabled) {
      row.appendChild(this.#createPipButton(icons, config));
    }
    if (config.showSubtitles) {
      row.appendChild(this.#createSubtitleButton(icons, config));
    }
    if (config.showQuality) {
      row.appendChild(this.#createQualityButton(icons, config));
    }
    if (config.showSpeed) {
      row.appendChild(this.#createSpeedButton(icons, config));
    }
    if (config.theaterMode) {
      row.appendChild(this.#createTheaterButton(icons, config));
    }
    if (config.screenshot) {
      row.appendChild(this.#createScreenshotButton(icons, config));
    }
    if (
      config.airplay &&
      (window as any).WebKitPlaybackTargetAvailabilityEvent
    ) {
      row.appendChild(this.#createAirPlayButton(icons, config));
    }
    if (config.miniPlayer) {
      row.appendChild(this.#createMiniPlayerButton(icons, config));
    }
    if (config.showFullscreen) {
      row.appendChild(this.#createFullscreenButton(icons, config));
    }
    if (config.responsiveControls) {
      row.appendChild(this.#createMoreButton(icons, config));
    }

    frag.appendChild(controlsBar);
    return frag;
  }

  // Button creation helpers
  #createPlayPauseButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn play-pause";
    btn.setAttribute("aria-label", "Play");
    btn.tabIndex = 0;
    btn.setAttribute("part", "play-pause");

    const playSpan = document.createElement("span");
    playSpan.className = "play-icon";
    playSpan.setAttribute("aria-hidden", "true");
    playSpan.appendChild(this.#createSVGFromString(icons.play));

    const pauseSpan = document.createElement("span");
    pauseSpan.className = "pause-icon";
    pauseSpan.style.display = "none";
    pauseSpan.setAttribute("aria-hidden", "true");
    pauseSpan.appendChild(this.#createSVGFromString(icons.pause));

    btn.appendChild(playSpan);
    btn.appendChild(pauseSpan);

    if (config.showTooltips) {
      const playTooltip = document.createElement("span");
      playTooltip.className = "tooltip play-tooltip";
      playTooltip.textContent = config.tooltipPlay;
      playTooltip.setAttribute("part", "play-tooltip");

      const pauseTooltip = document.createElement("span");
      pauseTooltip.className = "tooltip pause-tooltip";
      playTooltip.setAttribute("part", "pause-tooltip");
      pauseTooltip.style.display = "none";
      pauseTooltip.textContent = config.tooltipPause;

      btn.appendChild(playTooltip);
      btn.appendChild(pauseTooltip);
    }
    return btn;
  }

  #createVolumeControl(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const volumeControl = document.createElement("div");
    volumeControl.className = "video-volume-control";
    volumeControl.setAttribute("part", "volume-control");

    const btn = document.createElement("button");
    btn.className = "video-control-btn volume-btn";
    btn.setAttribute("aria-label", "Mute");
    btn.tabIndex = 0;
    btn.setAttribute("part", "volume-btn");

    const volumeSpan = document.createElement("span");
    volumeSpan.className = "volume-icon";
    volumeSpan.setAttribute("aria-hidden", "true");
    volumeSpan.appendChild(this.#createSVGFromString(icons.volume));

    const mutedSpan = document.createElement("span");
    mutedSpan.className = "muted-icon";
    mutedSpan.style.display = "none";
    mutedSpan.setAttribute("aria-hidden", "true");
    mutedSpan.appendChild(this.#createSVGFromString(icons.muted));

    btn.appendChild(volumeSpan);
    btn.appendChild(mutedSpan);

    if (config.showTooltips) {
      const volTooltip = document.createElement("span");
      volTooltip.className = "tooltip volume-tooltip";
      volTooltip.textContent = config.tooltipMute;
      volTooltip.setAttribute("part", "volume-tooltip");

      const mutedTooltip = document.createElement("span");
      mutedTooltip.className = "tooltip muted-tooltip";
      mutedTooltip.style.display = "none";
      mutedTooltip.textContent = config.tooltipUnmute;
      volTooltip.setAttribute("part", "mute-tooltip");

      btn.appendChild(volTooltip);
      btn.appendChild(mutedTooltip);
    }

    volumeControl.appendChild(btn);

    const slider = document.createElement("div");
    slider.className = "video-volume-slider";
    slider.setAttribute("role", "slider");
    slider.tabIndex = 0;
    slider.setAttribute("aria-label", "Volume");
    slider.setAttribute("aria-valuemin", "0");
    slider.setAttribute("aria-valuemax", "100");
    slider.setAttribute("aria-valuenow", "100");
    slider.setAttribute("part", "volume-slider");

    const progress = document.createElement("div");
    progress.className = "video-volume-progress";
    progress.setAttribute("part", "volume-progress");
    slider.appendChild(progress);

    volumeControl.appendChild(slider);
    return volumeControl;
  }

  #createLoopButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn loop-btn";
    btn.setAttribute("aria-label", "Enable loop");
    btn.tabIndex = 0;
    btn.setAttribute("part", "loop-btn");

    const loopSpan = document.createElement("span");
    loopSpan.className = "loop-icon";
    loopSpan.setAttribute("aria-hidden", "true");
    loopSpan.appendChild(this.#createSVGFromString(icons.loopOnce));
    btn.appendChild(loopSpan);

    if (config.showTooltips) {
      // Tooltip when loop is ON
      const onTooltip = document.createElement("span");
      onTooltip.className = "tooltip loop-on-tooltip";
      onTooltip.textContent = "Disable loop";
      onTooltip.style.display = "none"; // initially hidden
      btn.appendChild(onTooltip);

      // Tooltip when loop is OFF
      const offTooltip = document.createElement("span");
      offTooltip.className = "tooltip loop-off-tooltip";
      offTooltip.textContent = "Enable loop";
      btn.appendChild(offTooltip);
    }
    return btn;
  }

  #createPipButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn pip-btn";
    btn.setAttribute("aria-label", "Picture in Picture");
    btn.tabIndex = 0;
    btn.setAttribute("part", "pip-btn");

    const pipSpan = document.createElement("span");
    pipSpan.className = "pip-icon";
    pipSpan.setAttribute("aria-hidden", "true");
    pipSpan.appendChild(this.#createSVGFromString(icons.pip));
    btn.appendChild(pipSpan);

    if (config.showTooltips) {
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip pip-tooltip";
      tooltip.textContent = "Picture in Picture";
      tooltip.setAttribute("part", "pip-tooltip");
      btn.appendChild(tooltip);
    }
    return btn;
  }

  #createSubtitleButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    const container = document.createElement("div");
    container.className = "video-subtitle-control";
    container.setAttribute("part", "subtitle-control");

    const btn = document.createElement("button");
    btn.className = "video-control-btn video-subtitle-btn";
    btn.setAttribute("aria-label", "Subtitles");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.setAttribute("part", "subtitle-btn");

    const iconSpan = document.createElement("span");
    iconSpan.setAttribute("aria-hidden", "true");
    iconSpan.appendChild(this.#createSVGFromString(icons.subtitle));
    btn.appendChild(iconSpan);

    const textSpan = document.createElement("span");
    textSpan.className = "subtitle-text";
    textSpan.textContent = "CC";
    textSpan.setAttribute("part", "subtitle-text");
    btn.appendChild(textSpan);

    if (config.showTooltips) {
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip subtitle-tooltip";
      tooltip.textContent = "Subtitles";
      tooltip.setAttribute("part", "subtitle-tooltip");
      btn.appendChild(tooltip);
    }

    container.appendChild(btn);

    const menu = document.createElement("div");
    menu.className = "video-subtitle-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("part", "subtitle-menu");
    container.appendChild(menu);

    return container;
  }

  #createQualityButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const container = document.createElement("div");
    container.className = "video-quality-control";
    container.setAttribute("part", "quality-control");

    const btn = document.createElement("button");
    btn.className = "video-control-btn video-quality-btn";
    btn.setAttribute("aria-label", "Quality");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.setAttribute("part", "quality-btn");

    const iconSpan = document.createElement("span");
    iconSpan.setAttribute("aria-hidden", "true");
    iconSpan.appendChild(this.#createSVGFromString(icons.quality));
    btn.appendChild(iconSpan);

    const textSpan = document.createElement("span");
    textSpan.className = "quality-text";
    textSpan.textContent = "Auto";
    textSpan.setAttribute("part", "quality-text");
    btn.appendChild(textSpan);

    if (config.showTooltips) {
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip quality-tooltip";
      tooltip.textContent = "Quality";
      tooltip.setAttribute("part", "quality-tooltip");
      btn.appendChild(tooltip);
    }

    container.appendChild(btn);

    const menu = document.createElement("div");
    menu.className = "video-quality-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("part", "quality-menu");
    container.appendChild(menu);

    return container;
  }

  #createSpeedButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const container = document.createElement("div");
    container.className = "video-speed-control";
    container.setAttribute("part", "speed-control");

    const btn = document.createElement("button");
    btn.className = "video-control-btn video-speed-btn";
    btn.setAttribute("aria-label", "Playback speed");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.setAttribute("part", "speed-btn");

    const iconSpan = document.createElement("span");
    iconSpan.setAttribute("aria-hidden", "true");
    iconSpan.appendChild(this.#createSVGFromString(icons.speed));
    btn.appendChild(iconSpan);

    const textSpan = document.createElement("span");
    textSpan.className = "speed-text";
    textSpan.textContent = "1x";
    textSpan.setAttribute("part", "speed-text");
    btn.appendChild(textSpan);

    if (config.showTooltips) {
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip speed-tooltip";
      tooltip.textContent = config.tooltipSpeed;
      tooltip.setAttribute("part", "speed-tooltip");
      btn.appendChild(tooltip);
    }

    container.appendChild(btn);

    const menu = document.createElement("div");
    menu.className = "video-speed-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("part", "speed-menu");

    config.speedOptions.forEach((speed) => {
      const opt = document.createElement("button");
      opt.className = `video-speed-option ${speed === 1 ? "active" : ""}`;
      opt.setAttribute("role", "menuitem");
      opt.tabIndex = -1;
      opt.setAttribute("data-speed", speed.toString());
      opt.textContent = speed + "x";
      opt.setAttribute("part", "speed-option");
      menu.appendChild(opt);
    });

    container.appendChild(menu);
    return container;
  }

  #createTheaterButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn theater-btn";
    btn.setAttribute("aria-label", "Theater mode");
    btn.tabIndex = 0;
    btn.setAttribute("part", "theater-btn");

    const theaterSpan = document.createElement("span");
    theaterSpan.className = "theater-icon";
    theaterSpan.setAttribute("aria-hidden", "true");
    theaterSpan.appendChild(this.#createSVGFromString(icons.theater));
    btn.appendChild(theaterSpan);

    if (config.showTooltips) {
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip theater-tooltip";
      tooltip.textContent = "Theater mode";
      tooltip.setAttribute("part", "theater-tooltip");
      btn.appendChild(tooltip);
    }
    return btn;
  }

  #createScreenshotButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn screenshot-btn";
    btn.setAttribute("aria-label", "Screenshot");
    btn.tabIndex = 0;
    btn.setAttribute("part", "screenshot-btn");

    const screenSpan = document.createElement("span");
    screenSpan.className = "screenshot-icon";
    screenSpan.setAttribute("aria-hidden", "true");
    screenSpan.appendChild(this.#createSVGFromString(icons.screenshot));
    btn.appendChild(screenSpan);

    if (config.showTooltips) {
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip screenshot-tooltip";
      tooltip.textContent = "Take screenshot";
      tooltip.setAttribute("part", "screenshot-tooltip");
      btn.appendChild(tooltip);
    }
    return btn;
  }

  #createAirPlayButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn airplay-btn";
    btn.setAttribute("aria-label", "AirPlay");
    btn.tabIndex = 0;
    btn.setAttribute("part", "airplay-btn");

    const airSpan = document.createElement("span");
    airSpan.className = "airplay-icon";
    airSpan.setAttribute("aria-hidden", "true");
    airSpan.appendChild(this.#createSVGFromString(icons.airplay));
    btn.appendChild(airSpan);

    if (config.showTooltips) {
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip airplay-tooltip";
      tooltip.textContent = "AirPlay";
      tooltip.setAttribute("part", "airplay-tooltip");
      btn.appendChild(tooltip);
    }
    return btn;
  }

  #createMiniPlayerButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn miniplayer-btn";
    btn.setAttribute("aria-label", "Mini player");
    btn.tabIndex = 0;
    btn.setAttribute("part", "miniplayer-btn");

    const miniSpan = document.createElement("span");
    miniSpan.className = "miniplayer-icon";
    miniSpan.setAttribute("aria-hidden", "true");
    miniSpan.appendChild(this.#createSVGFromString(icons.miniplayer));
    btn.appendChild(miniSpan);

    if (config.showTooltips) {
      const tooltip = document.createElement("span");
      tooltip.className = "tooltip miniplayer-tooltip";
      tooltip.textContent = "Mini player";
      tooltip.setAttribute("part", "miniplayer-tooltip");
      btn.appendChild(tooltip);
    }
    return btn;
  }

  #createFullscreenButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn fullscreen-btn";
    btn.setAttribute("aria-label", "Fullscreen");
    btn.tabIndex = 0;
    btn.setAttribute("part", "fullscreen-btn");

    const fullSpan = document.createElement("span");
    fullSpan.className = "fullscreen-icon";
    fullSpan.setAttribute("aria-hidden", "true");
    fullSpan.appendChild(this.#createSVGFromString(icons.fullscreen));

    const exitSpan = document.createElement("span");
    exitSpan.className = "exit-fullscreen-icon";
    exitSpan.style.display = "none";
    exitSpan.setAttribute("aria-hidden", "true");
    exitSpan.appendChild(this.#createSVGFromString(icons.exitFullscreen));

    btn.appendChild(fullSpan);
    btn.appendChild(exitSpan);

    if (config.showTooltips) {
      const fullTooltip = document.createElement("span");
      fullTooltip.className = "tooltip fullscreen-tooltip";
      fullTooltip.textContent = config.tooltipFullscreen;
      fullTooltip.setAttribute("part", "fullscreen-tooltip");

      const exitTooltip = document.createElement("span");
      exitTooltip.className = "tooltip exit-fullscreen-tooltip";
      exitTooltip.style.display = "none";
      exitTooltip.textContent = config.tooltipExitFullscreen;
      exitTooltip.setAttribute("part", "exit-fullscreen-tooltip");

      btn.appendChild(fullTooltip);
      btn.appendChild(exitTooltip);
    }
    return btn;
  }

  #createMoreButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const container = document.createElement("div");
    container.className = "video-more-control";
    container.setAttribute("part", "more-control");

    const btn = document.createElement("button");
    btn.className = "video-control-btn video-more-btn";
    btn.setAttribute("aria-label", "More controls");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.setAttribute("part", "more-btn");

    const iconSpan = document.createElement("span");
    iconSpan.setAttribute("aria-hidden", "true");
    iconSpan.appendChild(this.#createSVGFromString(icons.more));
    btn.appendChild(iconSpan);

    container.appendChild(btn);

    const menu = document.createElement("div");
    menu.className = "video-more-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("part", "more-menu");
    container.appendChild(menu);

    return container;
  }

  // ---------- LIFECYCLE ----------
  connectedCallback(): void {
    this.#render();
    this.#init();
    this.#setupVisibilityHandling();
    document.addEventListener("fullscreenchange", this.#boundFullscreenChange);
    document.addEventListener(
      "webkitfullscreenchange",
      this.#boundFullscreenChange
    );
    if (
      this.getAttribute("virtual-playback") === "true" ||
      this.#getConfig().singleActive
    ) {
      GlobalVideoEngine.register(this);
    }
  }

  disconnectedCallback(): void {
    this.#destroy();
    this.#removeVisibilityHandling();
    document.removeEventListener(
      "fullscreenchange",
      this.#boundFullscreenChange
    );
    if (this.#rafId) cancelAnimationFrame(this.#rafId);
    GlobalVideoEngine.unregister(this);
    if (this.#resizeObserver) this.#resizeObserver.disconnect();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (oldValue === newValue) return;
    this.#configCache = null;
    if (!this.#isInitialized) return;
    const config = this.#getConfig();
    switch (name) {
      case "muted":
        if (this.#videoElement) this.#videoElement.muted = config.muted;
        break;
      case "loop":
        if (this.#videoElement) this.#videoElement.loop = config.loop;
        break;
      case "accent-color":
      case "theme":
      case "controls-background":
      case "center-play-background":
      case "center-play-size":
        this.#updateCSSVariables(config);
        break;
      default:
        this.#reinitialize();
    }
  }

  #updateCSSVariables(config: VideoPlayerConfig): void {
    const theme =
      config.theme === "light"
        ? {
            accent:
              config.accentColor !== "#ffffff" ? config.accentColor : "#000000",
            controlsBg:
              config.controlsBackground !== "rgba(0,0,0,0.8)"
                ? config.controlsBackground
                : "rgba(255,255,255,0.9)",
            centerPlayBg:
              config.centerPlayBackground !== "rgba(0,0,0,0.7)"
                ? config.centerPlayBackground
                : "rgba(255,255,255,0.8)",
          }
        : {
            accent: config.accentColor,
            controlsBg: config.controlsBackground,
            centerPlayBg: config.centerPlayBackground,
          };
    this.style.setProperty("--accent-color", theme.accent);
    this.style.setProperty("--controls-bg", theme.controlsBg);
    this.style.setProperty("--center-play-bg", theme.centerPlayBg);
    if (config.centerPlaySize) {
      this.style.setProperty(
        "--center-play-size",
        config.centerPlaySize + "px"
      );
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
      document.addEventListener("visibilitychange", this.#visibilityChange, {
        passive: true,
      });
      window.addEventListener("pagehide", this.#pageHide, { passive: true });
      window.addEventListener("pageshow", this.#pageShow, { passive: true });
    }
  }

  #removeVisibilityHandling(): void {
    document.removeEventListener("visibilitychange", this.#visibilityChange);
    window.removeEventListener("pagehide", this.#pageHide);
    window.removeEventListener("pageshow", this.#pageShow);
  }

  // ---------- LAZY LOADING ----------
  #setupLazyLoading(wrapper: HTMLElement, config: VideoPlayerConfig): void {
    if (!("IntersectionObserver" in window))
      return this.#loadVideo(wrapper, config);
    const options = {
      root: null,
      rootMargin: "50px",
      threshold: config.lazyThreshold,
    };
    this.#observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (
          config.lazy &&
          !this.#isInitialized &&
          entry.isIntersecting &&
          entry.intersectionRatio >= config.lazyThreshold
        ) {
          this.#loadVideo(wrapper, config);
        }
        if (
          config.pauseOnOutOfView &&
          this.#videoElement &&
          this.#videoLoaded
        ) {
          if (
            !entry.isIntersecting ||
            entry.intersectionRatio < config.pauseThreshold
          ) {
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
    wrapper.classList.add("video-loading");
    this.classList.add("video-loading");
    const video = document.createElement("video");
    this.#videoElement = video;
    video.muted = config.muted;
    video.defaultMuted = config.muted;

    const attrs: Record<string, string> = {
      preload: config.preload,
      ...(!config.showPip && { disablepictureinpicture: "" }),
      "webkit-playsinline": "",
      ...(config.loop && { loop: "" }),
      ...(config.muted && { muted: "" }),
      ...(config.playsinline && { playsinline: "" }),
    };
    Object.entries(attrs).forEach(([k, v]) => video.setAttribute(k, v));
    video.setAttribute("part", "video");
    video.playsInline = true;

    // ---------- SECURITY: Move and sanitize <track> elements ----------
    const tracks = Array.from(this.querySelectorAll("track"));
    tracks.forEach((track) => {
      // Remove any on* event handlers (defense in depth)
      for (let i = track.attributes.length - 1; i >= 0; i--) {
        const attr = track.attributes[i];
        if (attr.name.startsWith("on")) {
          track.removeAttribute(attr.name);
        }
      }
      video.appendChild(track);
    });

    // Collect light‑DOM <source> elements and validate their src
    const lightSources = Array.from(
      this.querySelectorAll("source")
    ) as HTMLSourceElement[];

    // ---------- SECURITY: Validate and sanitize light‑DOM sources ----------
    const validSources: HTMLSourceElement[] = [];
    lightSources.forEach((source) => {
      // Remove any on* event handlers
      for (let i = source.attributes.length - 1; i >= 0; i--) {
        const attr = source.attributes[i];
        if (attr.name.startsWith("on")) {
          source.removeAttribute(attr.name);
        }
      }

      const src = source.getAttribute("src");
      if (src && this.#isValidMediaUrl(src)) {
        validSources.push(source);
      } else {
        console.warn("ShadowPlyr: Ignored invalid source URL:", src);
      }
    });

    if (validSources.length > 0) {
      // Use only validated light‑DOM sources
      validSources.forEach((source) => video.appendChild(source));
    } else {
      // No valid light‑DOM sources – fall back to attribute-based sources
      // ---------- SECURITY: Validate attribute URLs ----------
      if (config.desktopVideo && this.#isValidMediaUrl(config.desktopVideo)) {
        const s = document.createElement("source");
        s.src = config.desktopVideo;
        s.type = config.videoType;
        s.media = "(min-width: 769px)";
        video.appendChild(s);
      }
      if (config.mobileVideo && this.#isValidMediaUrl(config.mobileVideo)) {
        const s = document.createElement("source");
        s.src = config.mobileVideo;
        s.type = config.videoType;
        s.media = "(max-width: 768px)";
        video.appendChild(s);
      }
      // Final fallback: set src attribute directly (if valid)
      if (config.desktopVideo && this.#isValidMediaUrl(config.desktopVideo)) {
        video.src = config.desktopVideo;
      } else if (
        config.mobileVideo &&
        this.#isValidMediaUrl(config.mobileVideo)
      ) {
        video.src = config.mobileVideo;
      }
    }

    // ---------- SECURITY: Collect manual quality options from sources with data-quality ----------
    // Only include those with valid HTTPS URLs.
    const sourceElements = Array.from(
      video.querySelectorAll("source[data-quality]")
    ) as HTMLSourceElement[];
    this.#manualQualities = sourceElements
      .map((el) => ({
        src: el.src,
        type: el.type || "video/mp4",
        label: el.getAttribute("data-quality")!,
        media: el.media || null,
      }))
      .filter((q) => this.#isValidMediaUrl(q.src)); // <-- filter out invalid URLs

    // ---------- (Rest of the method unchanged) ----------
    video.addEventListener(
      "loadedmetadata",
      this.#onLoadedData.bind(this, wrapper, config),
      { once: true }
    );
    video.addEventListener("playing", this.#onPlaying.bind(this, wrapper));
    video.addEventListener("pause", this.#onPause.bind(this, wrapper));
    video.addEventListener("ended", this.#onEnded.bind(this, wrapper, config));
    video.addEventListener("seeked", () =>
      this.#emit("video-seeked", { currentTime: video.currentTime })
    );
    video.addEventListener("seeking", () =>
      this.#emit("video-seeking", { currentTime: video.currentTime })
    );
    video.addEventListener("progress", this.#throttledProgressUpdate, {
      passive: true,
    });
    video.addEventListener(
      "volumechange",
      this.#onVolumeChange.bind(this, wrapper)
    );

    // Safari fix
    if (video.muted || config.muted) {
      this.#updateVolumeIcon(true, wrapper);
    }

    video.addEventListener("error", this.#onError.bind(this, wrapper));
    video.addEventListener("enterpictureinpicture", this.#onPipEnter);
    video.addEventListener("leavepictureinpicture", this.#onPipLeave);

    const placeholder = wrapper.querySelector(".video-placeholder");
    if (placeholder) placeholder.replaceWith(video);
    video.load();
    video.style.pointerEvents = "auto";

    const picture = wrapper.querySelector("picture");
    if (picture) {
      picture.removeEventListener("click", this.#posterClick);
      picture.addEventListener("click", this.#posterClick);
    }

    if (config.autoplay && config.muted) this.playVideo();
  }

  // ---------- PUBLIC API ----------
  public play(): void {
    this.playVideo();
  }
  public pause(): void {
    this.pauseVideo();
  }
  public mute(): void {
    if (this.#videoElement) this.#videoElement.muted = true;
  }
  public unmute(): void {
    if (this.#videoElement) this.#videoElement.muted = false;
  }
  public seek(seconds: number): void {
    if (this.#videoElement) this.#videoElement.currentTime = seconds;
  }

  public playVideo(): void {
    if (!this.#videoElement) return;
    const config = this.#getConfig();
    if (config.autoplay) this.#videoElement.muted = true;
    if (
      config.singleActive ||
      this.getAttribute("virtual-playback") === "true"
    ) {
      GlobalVideoEngine.requestPlay(this);
    }
    const promise = this.#videoElement.play();
    if (promise) {
      promise.catch(() => {
        this.#posterVisible = true;
        if (this.#$wrapper) {
          this.#$wrapper.classList.add("poster-visible");
          this.classList.add("poster-visible");
        }
      });
    }
  }

  public pauseVideo(silent?: boolean): void {
    if (this.#videoElement) {
      this.#videoElement.pause();
      if (!silent) this.#emit("video-paused");
    }
  }

  // ---------- CONTROLS SETUP ----------
  #setupControlButtons(wrapper: HTMLElement): void {
    wrapper.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const seekbar = target.closest(".video-seekbar");
      if (seekbar) {
        const rect = seekbar.getBoundingClientRect();
        this.#seekTo((e.clientX - rect.left) / rect.width);
        e.stopPropagation();
        return;
      }

      const volumeSlider = target.closest(".video-volume-slider");
      if (volumeSlider) {
        const rect = volumeSlider.getBoundingClientRect();
        this.#setVolume((e.clientX - rect.left) / rect.width);
        e.stopPropagation();
        return;
      }

      const control = target.closest('[class*="video-"]');
      if (!control) return;
      // Do NOT stop propagation here – allow outside-click handler to see clicks

      if (
        control.classList.contains("play-pause") ||
        control.classList.contains("video-center-play")
      ) {
        this.#togglePlayPause(e);
      } else if (control.classList.contains("volume-btn")) {
        this.#toggleMute(e);
      } else if (control.classList.contains("fullscreen-btn")) {
        this.#toggleFullscreen(e);
      } else if (control.classList.contains("loop-btn")) {
        this.#toggleLoop(e);
      } else if (control.classList.contains("pip-btn")) {
        this.#togglePip(e);
      } else if (control.classList.contains("theater-btn")) {
        this.#toggleTheaterMode();
      } else if (control.classList.contains("screenshot-btn")) {
        this.#takeScreenshot();
      } else if (control.classList.contains("airplay-btn")) {
        if (
          this.#videoElement &&
          (this.#videoElement as any).webkitShowPlaybackTargetPicker
        ) {
          (this.#videoElement as any).webkitShowPlaybackTargetPicker();
        }
      } else if (control.classList.contains("miniplayer-btn")) {
        this.#toggleMiniPlayer();
      } else if (control.classList.contains("video-speed-btn")) {
        this.#toggleSpeedMenu(wrapper);
      } else if (control.classList.contains("video-quality-btn")) {
        this.#toggleQualityMenu(wrapper);
      } else if (control.classList.contains("video-subtitle-btn")) {
        this.#toggleSubtitleMenu(wrapper);
      } else if (control.classList.contains("video-more-btn")) {
        this.#toggleMoreMenu(wrapper);
      } else if (control.classList.contains("video-speed-option")) {
        const speed = parseFloat(control.getAttribute("data-speed")!);
        this.#setSpeed(speed, wrapper);
        this.#closeSpeedMenu(wrapper);
      } else if (control.classList.contains("video-quality-option")) {
        const quality = control.getAttribute("data-quality")!;
        if (quality === "auto") {
          this.#setAutoQuality();
        } else if (
          this.#qualityLevels.length > 0 &&
          !isNaN(parseInt(quality))
        ) {
          this.#setHlsQuality(parseInt(quality));
        } else {
          this.#setManualQuality(quality);
        }
        this.#closeQualityMenu(wrapper);
      } else if (control.classList.contains("video-subtitle-option")) {
        const subtitle = control.getAttribute("data-subtitle")!;
        this.#setSubtitle(subtitle || null);
        this.#closeSubtitleMenu(wrapper);
      }
    });

    const seekbarEl = wrapper.querySelector(".video-seekbar");
    if (seekbarEl) {
      seekbarEl.addEventListener(
        "mousedown",
        this.#onSeekbarMouseDown as EventListener
      );
      seekbarEl.addEventListener(
        "touchstart",
        this.#onSeekbarTouchStart as EventListener,
        { passive: true }
      );
    }

    const volumeSliderEl = wrapper.querySelector(".video-volume-slider");
    if (volumeSliderEl) {
      volumeSliderEl.addEventListener(
        "mousedown",
        this.#onVolumeMouseDown as EventListener
      );
    }

    if (this.#videoElement) {
      this.#videoElement.addEventListener("click", this.#togglePlayPause);
    }

    this.#setupControlsInteraction(wrapper);
  }

  #setupControlsInteraction(wrapper: HTMLElement): void {
    wrapper.addEventListener("keydown", this.#handleKeyboard);
    wrapper.addEventListener(
      "mouseenter",
      () => {
        if (this.#videoLoaded) {
          wrapper.classList.add("show-controls");
          this.classList.add("show-controls");
        }
      },
      { passive: true }
    );
    wrapper.addEventListener(
      "mouseleave",
      () => {
        wrapper.classList.remove("show-controls");
        this.classList.remove("show-controls");
        this.#closeAllMenus();
      },
      { passive: true }
    );
    wrapper.addEventListener("touchend", this.#handleTouchTap);
  }

  #closeAllMenus(except?: HTMLElement | null): void {
    if (this.#$speedMenu && this.#$speedMenu !== except)
      this.#$speedMenu.classList.remove("active");
    if (this.#$qualityMenu && this.#$qualityMenu !== except)
      this.#$qualityMenu.classList.remove("active");
    if (this.#$subtitleMenu && this.#$subtitleMenu !== except)
      this.#$subtitleMenu.classList.remove("active");
    if (this.#$moreMenu && this.#$moreMenu !== except)
      this.#$moreMenu.classList.remove("active");
    // Also reset more button active state if needed
    if (this.#$moreBtn && this.#$moreMenu !== except)
      this.#$moreBtn.classList.remove("active");
  }

  #setupResponsive(wrapper: HTMLElement): void {
    if (!this.#resizeObserver) {
      this.#resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          this.#updateResponsiveMenu(wrapper, width);
        }
      });
    }
    this.#resizeObserver.observe(wrapper);
    this.#populateMoreMenu(wrapper);
  }

  #updateResponsiveMenu(wrapper: HTMLElement, width: number): void {
    const threshold = 500;
    const controlSelectors = [
      ".loop-btn",
      ".pip-btn",
      ".video-subtitle-control",
      ".video-quality-control",
      ".video-speed-control",
      ".theater-btn",
      ".screenshot-btn",
      ".airplay-btn",
      ".miniplayer-btn",
    ];
    const moreMenu = wrapper.querySelector(".video-more-menu");
    const moreBtn = wrapper.querySelector(".video-more-btn");
    if (!moreMenu || !moreBtn) return;

    if (width < threshold) {
      controlSelectors.forEach((sel) => {
        const el = wrapper.querySelector(sel);
        if (el && !el.classList.contains("responsive-hidden")) {
          el.classList.add("responsive-hidden");
          const clone = el.cloneNode(true) as HTMLElement;
          clone.classList.remove("responsive-hidden");
          clone.classList.add("video-more-option");
          clone.addEventListener("click", (e) => {
            e.stopPropagation();
            const original = wrapper.querySelector(sel) as HTMLElement;
            if (original) original.click();
          });
          moreMenu.appendChild(clone);
        }
      });
      moreBtn.classList.remove("responsive-hidden");
    } else {
      controlSelectors.forEach((sel) => {
        const el = wrapper.querySelector(sel);
        if (el) el.classList.remove("responsive-hidden");
      });
      moreBtn.classList.add("responsive-hidden");
      moreMenu.innerHTML = "";
    }
  }

  #populateMoreMenu(wrapper: HTMLElement): void {
    // Reserved for future dynamic population
  }

  // ---------- UI UPDATE METHODS ----------
  #updateSeekbar(): void {
    const v = this.#videoElement;
    if (!v || !v.duration) return;

    const percent = v.currentTime / v.duration;

    if (this.#$seekbarFill) {
      this.#$seekbarFill.style.transform = `scaleX(${percent})`;
    }

    if (this.#$seekbarHandle) {
      this.#$seekbarHandle.style.left = `${percent * 100}%`;
    }

    if (this.#$seekbar) {
      this.#$seekbar.setAttribute(
        "aria-valuenow",
        Math.round(percent * 100).toString()
      );
    }

    this.#updateTimeDisplay();
  }

  #updateTimeDisplay(): void {
    if (!this.#$timeDisplay || !this.#videoElement) return;
    const current = this.#formatTime(this.#videoElement.currentTime);
    const duration = this.#formatTime(this.#videoElement.duration);
    this.#$timeDisplay.textContent = `${current} / ${duration}`;
  }

  #formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  #updatePlayPauseIcon(isPlaying: boolean, wrapper?: HTMLElement): void {
    if (!wrapper) wrapper = this.#$wrapper!;
    wrapper
      .querySelectorAll(".play-pause, .video-center-play")
      .forEach((el) => {
        const play = el.querySelector(".play-icon") as HTMLElement;
        const pause = el.querySelector(".pause-icon") as HTMLElement;
        if (play) play.style.display = isPlaying ? "none" : "block";
        if (pause) pause.style.display = isPlaying ? "block" : "none";
        el.setAttribute("aria-label", isPlaying ? "Pause" : "Play");
        const playTooltip = el.querySelector(".play-tooltip") as HTMLElement;
        const pauseTooltip = el.querySelector(".pause-tooltip") as HTMLElement;
        if (playTooltip)
          playTooltip.style.display = isPlaying ? "none" : "block";
        if (pauseTooltip)
          pauseTooltip.style.display = isPlaying ? "block" : "none";
      });
  }

  #updateVolumeIcon(isMuted: boolean, wrapper?: HTMLElement): void {
    if (!wrapper) wrapper = this.#$wrapper!;
    const btn = wrapper.querySelector(".volume-btn");
    if (btn) {
      const vol = btn.querySelector(".volume-icon") as HTMLElement;
      const mut = btn.querySelector(".muted-icon") as HTMLElement;
      if (vol) vol.style.display = isMuted ? "none" : "block";
      if (mut) mut.style.display = isMuted ? "block" : "none";
      btn.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
      const volTooltip = btn.querySelector(".volume-tooltip") as HTMLElement;
      const mutTooltip = btn.querySelector(".muted-tooltip") as HTMLElement;
      if (volTooltip) volTooltip.style.display = isMuted ? "none" : "block";
      if (mutTooltip) mutTooltip.style.display = isMuted ? "block" : "none";
    }
  }

  #updateFullscreenIcon(isFullscreen: boolean, wrapper?: HTMLElement): void {
    if (!wrapper) wrapper = this.#$wrapper!;
    const btn = wrapper.querySelector(".fullscreen-btn");
    if (!btn) return;

    const fullIcon = btn.querySelector(".fullscreen-icon") as HTMLElement;
    const exitIcon = btn.querySelector(".exit-fullscreen-icon") as HTMLElement;

    if (fullIcon) fullIcon.style.display = isFullscreen ? "none" : "block";
    if (exitIcon) exitIcon.style.display = isFullscreen ? "block" : "none";

    btn.setAttribute(
      "aria-label",
      isFullscreen ? "Exit fullscreen" : "Fullscreen"
    );

    const fullTooltip = btn.querySelector(".fullscreen-tooltip") as HTMLElement;
    const exitTooltip = btn.querySelector(
      ".exit-fullscreen-tooltip"
    ) as HTMLElement;

    if (fullTooltip)
      fullTooltip.style.display = isFullscreen ? "none" : "block";
    if (exitTooltip)
      exitTooltip.style.display = isFullscreen ? "block" : "none";
  }

  #updateLoopIcon(isLoop: boolean): void {
    const btn = this.#$wrapper?.querySelector(".loop-btn");
    if (!btn) return;

    const iconContainer = btn.querySelector(".loop-icon");
    if (!iconContainer) return;

    const icons = this.#getIcons();

    iconContainer.innerHTML = "";
    const newSvg = this.#createSVGFromString(
      isLoop ? icons.loop : icons.loopOnce
    );
    iconContainer.appendChild(newSvg);

    btn.setAttribute("aria-label", isLoop ? "Disable loop" : "Enable loop");

    const onTooltip = btn.querySelector(".loop-on-tooltip") as HTMLElement;
    const offTooltip = btn.querySelector(".loop-off-tooltip") as HTMLElement;
    if (onTooltip && offTooltip) {
      onTooltip.style.display = isLoop ? "block" : "none";
      offTooltip.style.display = isLoop ? "none" : "block";
    }
  }

  #updatePipIcon(isPip: boolean): void {
    const btn = this.#$wrapper?.querySelector(".pip-btn");
    if (btn) {
      btn.classList.toggle("active", isPip);
      this.classList.toggle("active", isPip);
    }
  }

  #updateVolumeSlider(volume: number, wrapper?: HTMLElement): void {
    if (this.#$volumeProgress)
      this.#$volumeProgress.style.width = volume * 100 + "%";
  }

  #updateQualityText(): void {
    if (!this.#$qualityText) return;
    if (this.#currentQualityLabel) {
      this.#$qualityText.textContent = this.#currentQualityLabel + "p";
    } else {
      this.#$qualityText.textContent = "Auto";
    }
  }

  #updateSubtitleText(): void {
    if (!this.#$subtitleText) return;
    this.#$subtitleText.textContent = this.#activeSubtitle ? "CC" : "Off";
  }

  #toggleSpeedMenu(wrapper: HTMLElement): void {
    this.#closeAllMenus(this.#$speedMenu);
    this.#$speedMenu?.classList.toggle("active");
  }

  #closeSpeedMenu(wrapper: HTMLElement): void {
    this.#$speedMenu?.classList.remove("active");
  }

  #toggleQualityMenu(wrapper: HTMLElement): void {
    this.#closeAllMenus(this.#$qualityMenu);
    this.#$qualityMenu?.classList.toggle("active");
  }

  #closeQualityMenu(wrapper: HTMLElement): void {
    this.#$qualityMenu?.classList.remove("active");
  }

  #toggleSubtitleMenu(wrapper: HTMLElement): void {
    this.#closeAllMenus(this.#$subtitleMenu);
    this.#$subtitleMenu?.classList.toggle("active");
  }

  #closeSubtitleMenu(wrapper: HTMLElement): void {
    this.#$subtitleMenu?.classList.remove("active");
  }

  #toggleMoreMenu(wrapper: HTMLElement): void {
    this.#closeAllMenus(this.#$moreMenu);
    const isActive = this.#$moreMenu?.classList.toggle("active");
    if (this.#$moreBtn) {
      this.#$moreBtn.classList.toggle("active", isActive);
    }
  }

  #closeMoreMenu(wrapper: HTMLElement): void {
    this.#$moreMenu?.classList.remove("active");
    this.#$moreBtn?.classList.remove("active");
  }

  #seekBackward(): void {
    if (this.#videoElement) {
      this.#videoElement.currentTime = Math.max(
        0,
        this.#videoElement.currentTime - this.#getConfig().seekStep
      );
    }
  }

  #seekForward(): void {
    if (this.#videoElement) {
      this.#videoElement.currentTime = Math.min(
        this.#videoElement.duration,
        this.#videoElement.currentTime + this.#getConfig().seekStep
      );
    }
  }

  #adjustVolume(delta: number): void {
    if (this.#videoElement) {
      this.#setVolume(this.#videoElement.volume + delta);
    }
  }

  // ---------- PERFORMANCE MODE ----------
  #enablePerformanceMode(): void {
    if (this.#$wrapper) {
      this.#$wrapper.classList.add("perf-mode");
      this.classList.add("perf-mode");
    }
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
    if (this.#observer) {
      this.#observer.disconnect();
      this.#observer = null;
    }
    if (this.#$wrapper) {
      this.#$wrapper.removeEventListener("keydown", this.#handleKeyboard);
      if ((this.#$wrapper as any).__closeMenus) {
        document.removeEventListener(
          "click",
          (this.#$wrapper as any).__closeMenus
        );
      }
    }
    if (this.#videoElement) {
      this.#videoElement.pause();
      this.#videoElement.removeEventListener("click", this.#togglePlayPause);
      this.#videoElement.removeEventListener(
        "enterpictureinpicture",
        this.#onPipEnter
      );
      this.#videoElement.removeEventListener(
        "leavepictureinpicture",
        this.#onPipLeave
      );
      this.#videoElement.src = "";
      this.#videoElement.load();
      this.#videoElement = null;
    }
    this.classList.remove(
      "video-loading",
      "video-loaded",
      "is-playing",
      "poster-visible",
      "show-controls",
      "theater-mode",
      "mini-player"
    );
    if (this.#rafId) cancelAnimationFrame(this.#rafId);
    if (this.#hls) this.#hls.destroy();
    this.#isInitialized = false;
    this.#isPlaying = false;
    this.#videoLoaded = false;
    this.#wasPlayingBeforeHidden = false;
    this.#hasPlayedOnce = false;
    this.#posterVisible = this.#hasPoster;
    this.#currentSpeed = 1;
    this.#$wrapper = null;
    this.#$container = null;
    this.#$seekbar = null;
    this.#$seekbarProgress = null;
    this.#$seekbarBuffer = null;
    this.#$timeDisplay = null;
    this.#$volumeProgress = null;
    this.#$speedMenu = null;
    this.#$speedText = null;
    this.#$qualityMenu = null;
    this.#$qualityText = null;
    this.#$subtitleMenu = null;
    this.#$subtitleText = null;
    this.#$moreMenu = null;
    this.#$moreBtn = null;
    this.#configCache = null;
    this.#qualityLevels = [];
    this.#manualQualities = [];
    document.removeEventListener(
      "webkitfullscreenchange",
      this.#boundFullscreenChange
    );
  }

  #emit(name: string, detail: Record<string, any> = {}): void {
    this.dispatchEvent(
      new CustomEvent(name, { detail, bubbles: true, composed: true })
    );
  }
}

// Auto-define if not already defined
if (!customElements.get("shadow-plyr")) {
  customElements.define("shadow-plyr", ShadowPlyr);
}
