/**
 * Shadow Plyr
 * A production-grade Web Component video player
 *
 * @version 1.8.1
 * @license MIT
 * @author Element Mint
 * @copyright (c) 2026 Element Mint
 */

import { VideoPlayerConfig, IconSet, ThumbnailVttCue } from "./types";
import { DEFAULT_ICONS, IconCache } from "./icons";
import { throttle } from "./utils";
import DOMPurify from "dompurify";
const sheet = new CSSStyleSheet();
sheet.replaceSync(`:host{display:block;position:relative;width:100%;max-width:100%;height:100%;}*{box-sizing:border-box;}.video-container{position:relative;width:100%;aspect-ratio:var(--aspect-ratio,16/9);background:#000;overflow:hidden;height:100%;}.shadow-plyr-wrapper{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;outline:none;}video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:contain;display:block;pointer-events:auto;opacity:0;transition:opacity .3s ease;will-change:opacity,transform;transform:translateZ(0);}.video-loaded.is-playing video,.video-loaded:not(.poster-visible) video{opacity:1;}video::-webkit-media-controls{display:none;}picture{position:absolute;top:0;left:0;width:100%;height:100%;display:block;z-index:5;opacity:0;transition:opacity .3s ease;pointer-events:none;cursor:pointer;}picture img{width:100%;height:100%;object-fit:contain;display:block;}.poster-visible picture{opacity:1;pointer-events:auto;}.video-loading::after{content:'';position:absolute;top:50%;left:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite;z-index:10;}.has-custom-loader.video-loading::after{display:none;}@keyframes spin{to{transform:rotate(360deg);}}.video-custom-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:11;pointer-events:none;display:none;align-items:center;justify-content:center;max-width:80px;max-height:80px;}.video-loading .video-custom-loader{display:flex;}.video-custom-loader img,.video-custom-loader svg{max-width:80px;max-height:80px;display:block;}.video-error-overlay{position:absolute;inset:0;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.88);padding:20px;text-align:center;pointer-events:none;opacity:0;transition:opacity .3s ease;}.has-error .video-error-overlay{opacity:1;pointer-events:auto;}.error-icon{margin-bottom:12px;}.error-icon svg{width:44px;height:44px;fill:#ff5252;color:#ff5252;}.error-title{color:#fff;font-size:.95rem;font-weight:700;margin:0 0 6px;font-family:inherit;}.error-message{color:rgba(255,255,255,.7);font-size:.83rem;line-height:1.6;margin:0 0 16px;font-family:inherit;}.error-retry-btn{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.3);color:#fff;padding:8px 20px;border-radius:4px;cursor:pointer;font-size:.82rem;font-weight:600;transition:background .2s;font-family:inherit;}.error-retry-btn:hover{background:rgba(255,255,255,.24);}.video-center-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:var(--center-play-size,80px);height:var(--center-play-size,80px);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .3s ease;z-index:20;opacity:0;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,.3);background:var(--center-play-bg,rgba(0,0,0,.7));will-change:transform,opacity;}.video-center-play svg{width:calc(var(--center-play-size,80px) * 0.5);height:calc(var(--center-play-size,80px) * 0.5);fill:var(--accent-color,#fff);color:var(--accent-color,#fff);}.video-loaded .video-center-play{opacity:.8;pointer-events:auto;}.video-loaded.is-playing .video-center-play{opacity:0;pointer-events:none;}.video-loaded.is-playing:hover .video-center-play{opacity:.8;pointer-events:auto;}.video-center-play:hover{transform:translate(-50%,-50%) scale(1.1);}.video-controls-bar{position:absolute;bottom:0;left:0;right:0;padding:40px 15px 15px;display:flex;flex-direction:column;gap:10px;transition:opacity .3s ease,transform .3s ease;z-index:25;opacity:0;transform:translateY(100%);pointer-events:none;will-change:transform,opacity;background:var(--controls-bg,linear-gradient(to top,rgba(0,0,0,.8),transparent));}.video-loaded:not(.is-playing) .video-controls-bar,.video-loaded:hover .video-controls-bar,.video-loaded.show-controls .video-controls-bar,.video-loaded.is-playing:hover .video-controls-bar{opacity:1;transform:translateY(0);pointer-events:auto;}.video-loaded.is-playing .video-controls-bar{opacity:0;transform:translateY(100%);pointer-events:none;}.video-seekbar{position:relative;width:100%;height:14px;cursor:pointer;}.video-seekbar-track{position:absolute;top:50%;left:0;width:100%;height:8px;transform:translateY(-50%);background:rgba(255,255,255,.3);border-radius:6px;overflow:hidden;}.video-seekbar-buffer{position:absolute;inset:0;background:rgba(255,255,255,.2);transform-origin:left center;transform:scaleX(0);}.video-seekbar-progress{height:8px;}.video-seekbar-fill{height:100%;width:100%;background:var(--accent-color,#ff8c42);transform-origin:left center;transform:scaleX(0);}.video-seekbar-handle{position:absolute;top:50%;left:0;width:12px;height:12px;border-radius:50%;background:var(--accent-color,#ff8c42);transform:translate(-50%,-50%);}.video-seekbar:hover .video-seekbar-handle{opacity:1;}.seek-thumbnail-preview{position:absolute;bottom:calc(100% + 14px);transform:translateX(-50%);pointer-events:none;opacity:0;z-index:40;transition:opacity .12s ease;}.video-loaded .video-seekbar:hover .seek-thumbnail-preview{opacity:1;}.seek-thumbnail-canvas,.seek-thumbnail-img-el{display:block;width:160px;height:90px;border-radius:4px;border:2px solid rgba(255,255,255,.5);background:#000;object-fit:cover;}.seek-thumbnail-time{text-align:center;font-size:11px;color:#fff;margin-top:4px;font-family:monospace;text-shadow:0 1px 4px rgba(0,0,0,.9);}.video-controls-row{display:flex;align-items:center;gap:15px;}.video-control-btn{background:none;border:none;cursor:pointer;padding:5px;display:flex;align-items:center;justify-content:center;transition:transform .2s;position:relative;}.video-control-btn:hover{transform:scale(1.1);background:rgba(255,255,255,.1);}.video-control-btn svg{width:24px;height:24px;fill:var(--accent-color,#fff);color:var(--accent-color,#fff);}.video-control-btn.play-pause svg{width:28px;height:28px;}.video-volume-control{display:flex;align-items:center;gap:8px;}.video-volume-slider{width:0;height:3px;background:rgba(255,255,255,.3);border-radius:3px;cursor:pointer;position:relative;overflow:hidden;transition:width .3s ease;}.video-volume-control:hover .video-volume-slider{width:60px;}.video-volume-progress{height:100%;width:100%;transition:width .1s;background:var(--accent-color,#fff);will-change:width;}.video-controls-spacer{flex:1;}.video-time-display{font-size:13px;font-family:monospace;user-select:none;color:var(--accent-color,#fff);}.video-speed-control,.video-quality-control,.video-subtitle-control,.video-more-control{position:relative;}.video-speed-btn,.video-quality-btn,.video-subtitle-btn,.video-more-btn{min-width:45px;font-size:13px;font-weight:600;color:var(--accent-color,#fff);}.video-speed-menu,.video-quality-menu,.video-subtitle-menu,.video-more-menu{position:absolute;bottom:100%;right:0;border-radius:4px;padding:5px 0;margin-bottom:10px;min-width:80px;opacity:0;visibility:hidden;transform:translateY(10px);transition:all .2s ease;z-index:100;background:var(--controls-bg,rgba(0,0,0,.8));}.video-speed-menu.active,.video-quality-menu.active,.video-subtitle-menu.active,.video-more-menu.active{opacity:1;visibility:visible;transform:translateY(0);}.settings-page .video-quality-menu,.settings-page .video-speed-menu,.settings-page .video-subtitle-menu{position:static;opacity:1;visibility:visible;transform:none;transition:none;background:transparent;padding:0;margin:0;min-width:0;}.video-speed-option,.video-quality-option,.video-subtitle-option,.video-more-option{display:block;width:100%;padding:8px 15px;background:none;border:none;font-size:13px;text-align:left;cursor:pointer;transition:background .2s;color:var(--accent-color,#fff);}.video-speed-option:hover,.video-quality-option:hover,.video-subtitle-option:hover,.video-more-option:hover{background:rgba(255,255,255,.1);}.video-speed-option.active,.video-quality-option.active,.video-subtitle-option.active,.video-more-option.active{background:rgba(255,255,255,.2);font-weight:600;}.video-settings-control{position:relative;}.video-settings-menu{position:absolute;bottom:100%;right:0;min-width:220px;border-radius:6px;margin-bottom:10px;opacity:0;visibility:hidden;transform:translateY(10px);transition:all .2s ease;z-index:100;overflow:hidden;background:var(--controls-bg,rgba(0,0,0,.85));box-shadow:0 8px 28px rgba(0,0,0,.45); max-height:120px; overflow-y:auto;}.video-settings-menu.active{opacity:1;visibility:visible;transform:translateY(0);}.settings-page{display:none;}.settings-page.active{display:block;animation:sfade .15s ease;}@keyframes sfade{from{opacity:0;transform:translateX(6px);}to{opacity:1;transform:translateX(0);}}.settings-main-item{display:flex;align-items:center;gap:8px;width:100%;padding:11px 15px;background:none;border:none;color:var(--accent-color,#fff);font-size:13px;cursor:pointer;transition:background .15s;text-align:left;}.settings-main-item:hover{background:rgba(255,255,255,.1);}.settings-main-label{flex:1;}.settings-main-value{opacity:.55;font-size:12px;white-space:nowrap;}.settings-main-arrow{opacity:.35;font-size:15px;line-height:1;}.settings-sub-header{display:flex;align-items:center;gap:8px;width:100%;padding:10px 14px;background:rgba(255,255,255,.06);border:none;border-bottom:1px solid rgba(255,255,255,.1);color:var(--accent-color,#fff);font-size:13px;cursor:pointer;font-weight:700;text-align:left;transition:background .15s; position:sticky; top:0; z-index:1; background-color:var(--controls-bg)}.settings-sub-header:hover{background:rgba(255,255,255,.1);}.settings-sub-back{font-size:18px;opacity:.65;line-height:1;}.settings-option{display:block;width:100%;padding:9px 15px;background:none;border:none;font-size:13px;text-align:left;cursor:pointer;transition:background .15s;color:var(--accent-color,#fff);}.settings-option:hover{background:rgba(255,255,255,.1);}.settings-option.active{background:rgba(255,255,255,.15);font-weight:600;}.video-control-btn:focus-visible,.video-seekbar:focus-visible,.video-volume-slider:focus-visible{outline:2px solid var(--accent-color,#fff);outline-offset:2px;}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;}.tooltip{position:absolute;bottom:100%;left:50%;transform:translateX(-50%);margin-bottom:8px;padding:4px 8px;background:var(--tooltip-bg,rgba(0,0,0,0.8));color:var(--tooltip-color,#fff);font-size:var(--tooltip-font-size,12px);white-space:nowrap;border-radius:4px;pointer-events:none;opacity:0;transition:opacity 0.2s;z-index:30;}.video-control-btn:hover .tooltip,.video-center-play:hover .tooltip{opacity:1;}.video-control-btn.disabled,.video-control-btn:disabled{opacity:0.4;cursor:not-allowed;pointer-events:auto;}@media (max-width:768px){.video-center-play{width:60px;height:60px;}.video-center-play svg{width:30px;height:30px;}.video-controls-bar{padding:30px 10px 10px;}.video-control-btn svg{width:20px;height:20px;}.video-volume-slider{display:none;}.video-time-display{font-size:11px;}}.responsive-hidden{display:none;}.responsive-more-menu .video-control-btn{display:flex;width:100%;padding:10px;}.tap-ripple{position:absolute;width:20px;height:20px;background:rgba(255,255,255,0.4);border-radius:50%;transform:translate(-50%,-50%);animation:ripple-expand 0.6s ease-out forwards;pointer-events:none;z-index:50;}@keyframes ripple-expand{from{opacity:1;transform:translate(-50%,-50%) scale(1);}to{opacity:0;transform:translate(-50%,-50%) scale(8);}}.video-seek-buttons{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:center;pointer-events:none;}.video-seek-buttons button{pointer-events:auto;width:30%;height:60%;background:transparent;border:none;color:#fff;font-size:20px;font-weight:bold;opacity:0.6;}.seek-overlay{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:32px;color:white;font-weight:bold;pointer-events:none;animation:fadeOut 0.6s forwards;}@keyframes fadeOut{from{opacity:1;}to{opacity:0;}}.video-container.theater-mode{max-width:none;aspect-ratio:auto;}.mini-player{position:fixed;bottom:20px;right:20px;width:320px;height:180px;z-index:9999;box-shadow:0 0 20px rgba(0,0,0,.5);top:auto;left:auto;border-radius:8px;overflow:hidden;cursor:move;user-select:none;transition:box-shadow .15s ease;}.mini-player.is-dragging{box-shadow:0 8px 40px rgba(0,0,0,.7);transition:none;}.mini-player .video-volume-slider,.mini-player .video-time-display,.mini-player .fullscreen-btn,.mini-player .video-more-control{display:none !important;}.mini-player .miniplayer-btn{display:block !important;}.mini-player .video-controls-bar{gap:0;padding:16px 6px 2px;cursor:default;}.mini-player video,.mini-player img{border-radius:8px;}::cue{font-family:var(--subtitle-font-family,inherit);font-size:var(--subtitle-font-size,1em);color:var(--subtitle-color,#fff);background:var(--subtitle-bg,rgba(0,0,0,0.75));text-shadow:var(--subtitle-text-shadow,none);font-weight:var(--subtitle-font-weight,normal);white-space:pre-line;padding:.1em .3em;border-radius:var(--subtitle-border-radius,2px);}::cue(b){font-weight:bold;}::cue(i){font-style:italic;}::cue(u){text-decoration:underline;}`);
const GlobalVideoEngine = (() => {
  const instances = new Set<ShadowPlyr>();
  let activeInstance: ShadowPlyr | null = null;
  return {
    register(instance: ShadowPlyr) { instances.add(instance); },
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
export class ShadowPlyr extends HTMLElement {
  // ── Shadow root ────────────────────────────────────────────────────────────
  #shadowRoot: ShadowRoot;

  // ── Config cache ───────────────────────────────────────────────────────────
  #configCache: VideoPlayerConfig | null = null;
  #configCacheTime = 0;
  readonly #CONFIG_CACHE_DURATION = 10_000;

  // ── State ──────────────────────────────────────────────────────────────────
  #observer: IntersectionObserver | null = null;
  #isInitialized = false;
  #loadGeneration = 0; // incremented on every #loadVideo call; stale callbacks check this
  #videoElement: HTMLVideoElement | null = null;
  #isPlaying = false;
  #isDraggingSeekbar = false;
  #dragPercent = -1; // set during seekbar drag so UI tracks cursor not video.currentTime
  #isDraggingVolume = false;
  #currentSpeed = 1;
  #videoLoaded = false;
  #hasPoster = false;
  #posterVisible = false;
  #hasPlayedOnce = false;
  #wasPlayingBeforeHidden = false;
  #isPageVisible = true;
  #rafId: number | null = null;
  #hasError = false;

  // ── DOM refs – controls ────────────────────────────────────────────────────
  #$wrapper: HTMLElement | null = null;
  #$container: HTMLElement | null = null;
  #$seekbar: HTMLElement | null = null;
  #$seekbarProgress: HTMLElement | null = null;
  #$seekbarBuffer: HTMLElement | null = null;
  #$seekbarHandle!: HTMLElement;
  #$seekbarFill!: HTMLElement;
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

  // ── DOM refs – settings menu ───────────────────────────────────────────────
  #$settingsMenu: HTMLElement | null = null;
  #$settingsQualityValue: HTMLElement | null = null;
  #$settingsSpeedValue: HTMLElement | null = null;
  #$settingsSubtitleValue: HTMLElement | null = null;
  #settingsCurrentPage = "main";

  // ── DOM refs – thumbnail preview ───────────────────────────────────────────
  #$thumbnailPreview: HTMLElement | null = null;
  #$thumbnailCanvas: HTMLCanvasElement | null = null;
  #$thumbnailLabel: HTMLElement | null = null;
  #thumbnailVideo: HTMLVideoElement | null = null;
  #thumbnailVttCues: ThumbnailVttCue[] = [];
  #thumbnailRAF: number | null = null;

  // ── HLS / quality state ────────────────────────────────────────────────────
  #tapCount = 0;
  #tapTimeout: number | null = null;
  #resizeObserver: ResizeObserver | null = null;
  #hls: any = null;
  #qualityLevels: any[] = [];
  #manualQualities: Array<{src: string; type: string; label: string; media: string | null}> = [];
  #currentQualityLabel: string | null = null;
  #currentQualityIndex: number | null = null;
  #subtitlesTracks: TextTrack[] = [];
  #activeSubtitle: string | null = null;
  #resumeKey: string | null = null;
  #theaterMode = false;
  #miniPlayerActive = false;
  // Light-DOM elements are read once, stored here, then removed from light DOM.
  // This prevents duplicate visible elements and avoids double network requests.
  #savedPicture: HTMLPictureElement | null = null;
  #savedSources: HTMLSourceElement[] = [];
  #savedTracks: HTMLElement[] = [];
  #lightDOMHarvested = false;
  // Mini-player drag state
  #miniDragActive = false;
  #miniDragOffsetX = 0;
  #miniDragOffsetY = 0;
  #boundMiniPointerMove: ((e: PointerEvent) => void) | null = null;
  #boundMiniPointerUp: ((e: PointerEvent) => void) | null = null;

  // ── Bound helpers ──────────────────────────────────────────────────────────
  #throttledSeekbarUpdate: () => void;
  #throttledProgressUpdate: () => void;
  #boundFullscreenChange: () => void;

  // KEYBOARD
  #handleKeyboard = (e: KeyboardEvent): void => {
    if (!this.#videoElement) return;
    const key = e.key.toLowerCase();
    const actions: Record<string, () => void> = {
      " ": () => this.#togglePlayPause(),
      k: () => this.#togglePlayPause(),
      arrowleft: () => this.#seekBackward(),
      arrowright: () => this.#seekForward(),
      arrowup: () => this.#adjustVolume(0.1),
      arrowdown: () => this.#adjustVolume(-0.1),
      m: () => this.#toggleMute(),
      f: () => this.#toggleFullscreen(),
      home: () => { if (this.#videoElement) this.#videoElement.currentTime = 0; },
      end: () => { if (this.#videoElement) this.#videoElement.currentTime = this.#videoElement.duration; },
      l: () => this.#toggleLoop(),
      p: () => this.#togglePip(),
      t: () => this.#toggleTheaterMode(),
      "?": () => this.#showKeyboardHelp(),
    };
    if (actions[key]) {
      e.preventDefault();
      actions[key]();
      if (this.#$wrapper) this.#$wrapper.classList.add("show-controls");
    } else if (key >= "0" && key <= "9" && this.#videoElement.duration) {
      e.preventDefault();
      this.#videoElement.currentTime =
        this.#videoElement.duration * (parseInt(key) / 10);
    }
  };

  // TOGGLE HELPERS
  #togglePlayPause = (e?: Event): void => {
    if (e) e.stopPropagation();
    if (!this.#videoElement) return;
    if (this.#isPlaying) this.pauseVideo(); else this.playVideo();
  };

  #toggleMute = (e?: Event): void => {
    if (e) e.stopPropagation();
    if (this.#videoElement) this.#videoElement.muted = !this.#videoElement.muted;
  };

  #toggleFullscreen = (e?: Event): void => {
    if (e) e.stopPropagation();
    const elem = this.#$container;
    const video = this.#videoElement;
    if (
      !document.fullscreenElement &&
      !(document as any).webkitFullscreenElement
    ) {
      if (video && "webkitEnterFullscreen" in video) {
        (video as any).webkitEnterFullscreen(); return;
      }
      if (elem?.requestFullscreen) elem.requestFullscreen();
      else if (elem && "webkitRequestFullscreen" in elem) (elem as any).webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
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
    } catch (err) { console.warn("PiP failed", err); }
  };

  #toggleTheaterMode = (): void => {
    this.#theaterMode = !this.#theaterMode;
    this.#$container?.classList.toggle("theater-mode", this.#theaterMode);
    this.classList.toggle("theater-mode", this.#theaterMode);
    this.#emit("theater-mode-change", { enabled: this.#theaterMode });
  };

  #toggleMiniPlayer = (): void => {
    if (!this.#videoElement) return;
    this.#miniPlayerActive = !this.#miniPlayerActive;
    this.#$wrapper?.classList.toggle("mini-player", this.#miniPlayerActive);
    this.classList.toggle("mini-player", this.#miniPlayerActive);

    if (this.#miniPlayerActive) {
      this.#attachMiniPlayerDrag();
    } else {
      this.#detachMiniPlayerDrag();
      // Reset inline position so it returns to the CSS default (bottom-right)
      if (this.#$wrapper) {
        this.#$wrapper.style.removeProperty("left");
        this.#$wrapper.style.removeProperty("top");
        this.#$wrapper.style.removeProperty("right");
        this.#$wrapper.style.removeProperty("bottom");
      }
    }

    this.#emit("mini-player-change", { active: this.#miniPlayerActive });
  };

  #attachMiniPlayerDrag(): void {
    const el = this.#$wrapper;
    if (!el) return;

    const onPointerDown = (e: PointerEvent): void => {
      // Only drag from the player itself — not from control buttons
      const target = e.target as HTMLElement;
      if (
        target.closest(".video-controls-bar") ||
        target.closest(".video-center-play")
      )
        return;

      e.preventDefault();
      this.#miniDragActive = true;
      el.classList.add("is-dragging");
      el.setPointerCapture(e.pointerId);

      const rect = el.getBoundingClientRect();
      this.#miniDragOffsetX = e.clientX - rect.left;
      this.#miniDragOffsetY = e.clientY - rect.top;

      // Switch from CSS bottom/right to top/left for free positioning
      el.style.right = "auto";
      el.style.bottom = "auto";
      el.style.left = rect.left + "px";
      el.style.top = rect.top + "px";
    };

    const onPointerMove = (e: PointerEvent): void => {
      if (!this.#miniDragActive) return;
      e.preventDefault();

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const margin = 8; // min gap from viewport edge

      let x = e.clientX - this.#miniDragOffsetX;
      let y = e.clientY - this.#miniDragOffsetY;

      // Clamp inside viewport with a small margin
      x = Math.max(margin, Math.min(vw - w - margin, x));
      y = Math.max(margin, Math.min(vh - h - margin, y));

      el.style.left = x + "px";
      el.style.top = y + "px";
    };

    const onPointerUp = (e: PointerEvent): void => {
      if (!this.#miniDragActive) return;
      this.#miniDragActive = false;
      el.classList.remove("is-dragging");
      el.releasePointerCapture(e.pointerId);

      // Snap to nearest horizontal edge (left / right half)
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const margin = 16;
      const cx = parseFloat(el.style.left) + w / 2;

      let snapX: number;
      if (cx < vw / 2) {
        snapX = margin; // snap left
      } else {
        snapX = vw - w - margin; // snap right
      }
      let snapY = parseFloat(el.style.top);
      snapY = Math.max(margin, Math.min(vh - h - margin, snapY));

      el.style.transition = "left .2s ease, top .2s ease";
      el.style.left = snapX + "px";
      el.style.top = snapY + "px";
      setTimeout(() => {
        el.style.removeProperty("transition");
      }, 220);
    };

    el.addEventListener("pointerdown", onPointerDown);
    this.#boundMiniPointerMove = onPointerMove as (e: PointerEvent) => void;
    this.#boundMiniPointerUp = onPointerUp as (e: PointerEvent) => void;
    el.addEventListener("pointermove", this.#boundMiniPointerMove);
    el.addEventListener("pointerup", this.#boundMiniPointerUp);
    el.addEventListener("pointercancel", this.#boundMiniPointerUp);
    // Store pointerdown so we can remove it on detach
    (el as any).__miniPointerDown = onPointerDown;
  }

  #detachMiniPlayerDrag(): void {
    const el = this.#$wrapper;
    if (!el) return;
    if ((el as any).__miniPointerDown) {
      el.removeEventListener("pointerdown", (el as any).__miniPointerDown);
      delete (el as any).__miniPointerDown;
    }
    if (this.#boundMiniPointerMove) {
      el.removeEventListener("pointermove", this.#boundMiniPointerMove);
      this.#boundMiniPointerMove = null;
    }
    if (this.#boundMiniPointerUp) {
      el.removeEventListener("pointerup", this.#boundMiniPointerUp);
      el.removeEventListener("pointercancel", this.#boundMiniPointerUp);
      this.#boundMiniPointerUp = null;
    }
    this.#miniDragActive = false;
  }

  #showKeyboardHelp = (): void => {
    const help = document.createElement("div");
    help.className = "keyboard-help";
    help.innerHTML = `
      <div class="help-content">
        <h3>Keyboard Shortcuts</h3>
        <ul>
          <li>Space / K: Play/Pause</li>
          <li>←/→: Seek ${this.#getConfig().seekStep}s</li>
          <li>↑/↓: Volume</li>
          <li>M: Mute</li><li>F: Fullscreen</li>
          <li>L: Loop</li><li>P: PiP</li>
          <li>T: Theater mode</li>
          <li>Home/End: Start/End</li>
          <li>0-9: Jump to %</li>
        </ul>
        <button class="close-help">Close</button>
      </div>`;
    help.addEventListener("click", () => help.remove());
    help.querySelector(".close-help")?.addEventListener("click", () => help.remove());
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
        if (!blob) { console.warn("Screenshot blocked due to CORS."); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `screenshot-${Date.now()}.png`; a.click();
        URL.revokeObjectURL(url);
      });
    } catch (err) { console.warn("Screenshot failed:", err); }
  };

  // SEEK / VOLUME / SPEED
  #seekTo = (percent: number): void => {
    if (this.#videoElement?.duration)
      this.#videoElement.currentTime =
        this.#videoElement.duration * Math.max(0, Math.min(1, percent));
  };

  #setVolume = (percent: number): void => {
    if (!this.#videoElement) return;
    const vol = Math.max(0, Math.min(1, percent));
    this.#videoElement.volume = vol;
    this.#videoElement.muted = vol === 0;
  };

  #setSpeed = (speed: number, wrapper?: HTMLElement): void => {
    if (!this.#videoElement) return;
    this.#videoElement.playbackRate = speed;
    this.#currentSpeed = speed;
    const target = wrapper ?? this.#$wrapper;
    target
      ?.querySelectorAll(".video-speed-option, .settings-option[data-speed]")
      .forEach((opt) => {
        opt.classList.toggle(
          "active",
          parseFloat(opt.getAttribute("data-speed")!) === speed
        );
      });
    if (this.#$speedText) this.#$speedText.textContent = speed + "x";
    if (this.#$settingsSpeedValue)
      this.#$settingsSpeedValue.textContent = speed + "x";
  };

  // QUALITY
  #setAutoQuality = (): void => {
    const video = this.#videoElement;
    if (!video) return;
    const currentTime = video.currentTime;
    const wasPlaying = this.#isPlaying;
    video.removeAttribute("src"); video.load();
    video.addEventListener("loadeddata", () => {
      video.currentTime = currentTime;
      if (wasPlaying) video.play();
    }, { once: true });
    this.#currentQualityLabel = null;
    this.#updateQualityText();
    this.#populateQualityMenu();
  };

  #setManualQuality = (label: string): void => {
    const video = this.#videoElement;
    if (!video || this.#currentQualityLabel === label) return;
    const sorted = this.#manualQualities
      .filter((q) => q.label === label)
      .sort((a, b) => {
        const getMin = (m:any) => m?.match(/min-width:\s*(\d+)/)?.[1] || 0;
        return (
          parseInt(b.media?.includes("min-width") ? getMin(b.media) : 0) -
          parseInt(a.media?.includes("min-width") ? getMin(a.media) : 0)
        );
      });

    const source = sorted.find((q) =>
      q.media ? window.matchMedia(q.media).matches : true
    );
    if (!source) return;
    const currentTime = video.currentTime;
    const wasPlaying = !video.paused;

    // Stop playback cleanly
    video.pause();

    // Safari requires ALL <source> children to be removed before changing src.
    // If any <source> elements remain, Safari ignores the new video.src assignment.
    Array.from(video.querySelectorAll("source")).forEach((s) => s.remove());

    // Assign new src directly (not via <source> child) and reload
    video.src = source.src;
    video.load();

    // Restore position once metadata is ready
    video.addEventListener(
      "loadedmetadata",
      () => {
        if (
          currentTime > 0 &&
          isFinite(video.duration) &&
          currentTime < video.duration
        ) {
          video.currentTime = currentTime;
        }
      },
      { once: true }
    );

    // Use canplaythrough for smoother resume (avoids stutter on Safari)
    video.addEventListener(
      "canplaythrough",
      () => {
        if (wasPlaying) video.play().catch(() => {});
      },
      { once: true }
    );

    this.#currentQualityLabel = label;
    this.#updateQualityText();
    this.#populateQualityMenu();
  };

  #setHlsQuality = (index: number): void => {
    if (
      !this.#hls ||
      this.#hls.levels.length === 0 ||
      this.#currentQualityIndex === index
    )
      return;
    this.#hls.currentLevel = index;
    this.#currentQualityIndex = index;
    const level = this.#hls.levels[index];
    this.#currentQualityLabel = level?.height
      ? `${level.height}p`
      : level?.name || `${Math.round(level?.bitrate / 1000)}kbps`;
    this.#updateQualityText();
    this.#populateQualityMenu();
  };

  // SUBTITLE
  #setSubtitle = (trackId: string | null): void => {
    if (!this.#videoElement) return;
    this.#subtitlesTracks.forEach((t) => (t.mode = "disabled"));
    if (trackId) {
      const track = this.#subtitlesTracks.find((t) => t.id === trackId || t.label === trackId);
      if (track) track.mode = "showing";
    }
    this.#activeSubtitle = trackId;
    this.#updateSubtitleText();
  };

  // VISIBILITY / TAB
  #visibilityChange = (): void => {
    if (!this.#videoLoaded || !this.#videoElement) return;
    if (document.hidden) {
      if (this.#isPlaying) { this.#wasPlayingBeforeHidden = true; this.pauseVideo(); }
    } else {
      if (this.#wasPlayingBeforeHidden && !this.#isPlaying) {
        this.playVideo(); this.#wasPlayingBeforeHidden = false;
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
      this.playVideo(); this.#wasPlayingBeforeHidden = false;
    }
  };

  // POSTER CLICK
  #posterClick = (): void => {
    if (
      this.#getConfig().posterClickPlay &&
      this.#videoElement &&
      !this.#hasPlayedOnce
    )
      this.playVideo();
  };

  // SEEKBAR EVENT HANDLERS
  #onSeekbarMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    this.#isDraggingSeekbar = true;
    const seekbar = e.currentTarget as HTMLElement;
    const clamp = (x: number) => Math.max(0, Math.min(1, x));
    const applyDrag = (clientX: number) => {
      const pct = clamp(
        (clientX - seekbar.getBoundingClientRect().left) /
          seekbar.getBoundingClientRect().width
      );
      this.#dragPercent = pct;
      this.#updateSeekbar(); // instant UI update — no RAF delay
      this.#seekTo(pct); // async browser seek (may lag, but UI already moved)
      this.#updateThumbnailAt(pct, seekbar);
    };
    applyDrag(e.clientX);
    const onMove = (e: MouseEvent) => {
      if (this.#isDraggingSeekbar) {
        e.preventDefault();
        applyDrag(e.clientX);
      }
    };
    const onUp = () => {
      this.#isDraggingSeekbar = false;
      this.#dragPercent = -1;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  #onSeekbarTouchStart = (e: TouchEvent): void => {
    if (!this.#videoElement) return;
    this.#isDraggingSeekbar = true;
    const seekbar = e.currentTarget as HTMLElement;
    const clamp = (x: number) => Math.max(0, Math.min(1, x));
    const applyDrag = (touch: Touch) => {
      const pct = clamp(
        (touch.clientX - seekbar.getBoundingClientRect().left) /
          seekbar.getBoundingClientRect().width
      );
      this.#dragPercent = pct;
      this.#updateSeekbar(); // instant UI update
      this.#seekTo(pct);
      this.#updateThumbnailAt(pct, seekbar);
    };
    applyDrag(e.touches[0]);
    const onMove = (e: TouchEvent) => {
      if (this.#isDraggingSeekbar) applyDrag(e.touches[0]);
    };
    const onEnd = () => {
      this.#isDraggingSeekbar = false;
      this.#dragPercent = -1;
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
    };
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);
  };

  #onSeekbarMouseMove = (e: MouseEvent): void => {
    const seekbar = e.currentTarget as HTMLElement;
    const rect = seekbar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    this.#updateThumbnailAt(pct, seekbar);
  };

  // VOLUME HANDLER
  #onVolumeMouseDown = (e: MouseEvent): void => {
    e.preventDefault();
    this.#isDraggingVolume = true;
    const slider = e.currentTarget as HTMLElement;
    const rect = slider.getBoundingClientRect();
    this.#setVolume((e.clientX - rect.left) / rect.width);
    const onMove = (e: MouseEvent) => {
      if (!this.#isDraggingVolume) return;
      e.preventDefault();
      const r = slider.getBoundingClientRect();
      this.#setVolume((e.clientX - r.left) / r.width);
    };
    const onUp = () => {
      this.#isDraggingVolume = false;
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  // VIDEO EVENT HANDLERS
  #onLoadedData = (wrapper: HTMLElement, config: VideoPlayerConfig): void => {
    if (!this.#videoElement) return;
    wrapper.classList.remove("video-loading");
    wrapper.classList.add("video-loaded");
    this.classList.remove("video-loading");
    this.classList.add("video-loaded");
    this.#isInitialized = true;
    this.#videoLoaded = true;
    this.#hasError = false;

    // Subtitle tracks
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
          const tt = subtitleBtn.querySelector(".subtitle-tooltip");
          if (tt) tt.textContent = "Subtitles";
        }
      } else {
        if (subtitleBtn) {
          subtitleBtn.disabled = true;
          subtitleBtn.classList.add("disabled");
          subtitleBtn.setAttribute("aria-disabled", "true");
          const tt = subtitleBtn.querySelector(".subtitle-tooltip");
          if (tt) tt.textContent = "No subtitles available";
        }
      }
    }

    // Quality
    if (config.showQuality && this.#videoElement.src.includes(".m3u8")) {
      this.#initHls();
    } else if (config.showQuality) {
      this.#populateQualityMenu();
    }

    // Settings menu – populate sub-menus if using unified settings
    if (config.showSettings) {
      if (config.showQuality) this.#populateQualityMenu();
      if (config.showSubtitles) this.#populateSubtitleMenu(wrapper);
    }

    // Resume playback position
    if (config.resume && this.#resumeKey) {
      const saved = localStorage.getItem(this.#resumeKey);
      if (saved) {
        const t = parseFloat(saved);
        if (t > 5 && t < this.#videoElement.duration - 5)
          this.#videoElement.currentTime = t;
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
    if (config.responsiveControls) this.#setupResponsive(wrapper);

    // Initialise thumbnail preview if requested
    if (config.showThumbnails) this.#initThumbnailVideo();
  };

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
    this.#cancelFrameLoop();
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
    )
      localStorage.setItem(
        this.#resumeKey,
        this.#videoElement.currentTime.toString()
      );
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

  /** Show a user-visible error overlay instead of leaving a stuck loader */
  #onError = (wrapper: HTMLElement): void => {
    if (this.#hasError) return; // prevent duplicate calls
    const code = this.#videoElement?.error?.code;
    console.error("ShadowPlyr: Video load error (code " + code + ")");
    // Remove loading state from both wrapper and host so the spinner disappears
    wrapper.classList.remove(
      "video-loading",
      "video-loaded",
      "has-custom-loader"
    );
    this.classList.remove("video-loading", "video-loaded", "has-custom-loader");
    // Hide the custom loader element if present
    const customLoader = wrapper.querySelector(
      ".video-custom-loader"
    ) as HTMLElement | null;
    if (customLoader) customLoader.style.display = "none";
    // Show error overlay
    wrapper.classList.add("has-error");
    this.classList.add("has-error");
    this.#videoLoaded = false;
    this.#hasError = true;
    this.#emit("video-error", { code });
  };

  #onFullscreenChange = (): void => {
    const fs =
      document.fullscreenElement || (document as any).webkitFullscreenElement;
    const isFull =
      fs === this.#$container || fs === this || (fs && this.contains(fs));
    this.#updateFullscreenIcon(isFull);
    this.#emit(isFull ? "video-fullscreen-enter" : "video-fullscreen-exit");
  };

  #onProgress = (): void => {
    if (!this.#videoElement || !this.#$seekbarBuffer) return;
    const buf = this.#videoElement.buffered;
    if (buf.length === 0) return;
    const end = buf.end(buf.length - 1);
    this.#$seekbarBuffer.style.transform = `scaleX(${
      end / this.#videoElement.duration
    })`;
  };

  #onPipEnter = (): void => {
    this.#updatePipIcon(true);
  };
  #onPipLeave = (): void => {
    this.#updatePipIcon(false);
  };

  // TOUCH TAP DETECTION
  #handleTouchTap = (e: TouchEvent): void => {
    const config = this.#getConfig();
    if (!this.#videoElement) return;
    const rect = this.#$wrapper!.getBoundingClientRect();
    const touchX = e.changedTouches[0].clientX;
    const isLeft = touchX < rect.left + rect.width / 2;
    if (config.enableTapRipple)
      this.#createRipple(
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
    this.#tapCount++;
    if (this.#tapTimeout) clearTimeout(this.#tapTimeout);
    this.#tapTimeout = window.setTimeout(() => {
      if (this.#tapCount === 2 && config.doubleTapSeek)
        this.#seekBy(
          isLeft ? -config.doubleTapSeekSeconds : config.doubleTapSeekSeconds
        );
      if (this.#tapCount >= 3 && config.tripleTapSeek)
        this.#seekBy(
          isLeft ? -config.tripleTapSeconds : config.tripleTapSeconds
        );
      this.#tapCount = 0;
    }, 300);
  };

  #showSeekOverlay(seconds: number): void {
    const el = document.createElement("div");
    el.className = "seek-overlay";
    el.textContent = (seconds > 0 ? "+" : "") + seconds + "s";
    this.#$wrapper?.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }

  #seekBy(seconds: number): void {
    if (!this.#videoElement) return;
    this.#videoElement.currentTime = Math.min(
      Math.max(0, this.#videoElement.currentTime + seconds),
      this.#videoElement.duration
    );
    this.#showSeekOverlay(seconds);
  }

  #createRipple(x: number, y: number): void {
    if (!this.#$wrapper) return;
    const rect = this.#$wrapper.getBoundingClientRect();
    const ripple = document.createElement("div");
    ripple.className = "tap-ripple";
    ripple.style.left = x - rect.left + "px";
    ripple.style.top  = y - rect.top  + "px";
    this.#$wrapper.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // CONSTRUCTOR
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

  // OBSERVED ATTRIBUTES
  static get observedAttributes(): string[] {
    return [
      "lazy",
      "pause-on-out-of-view",
      "autoplay",
      "loop",
      "muted",
      "playsinline",
      // deprecated (still observed for backward compat)
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
      // New attributes
      "show-settings",
      "tooltip-settings",
      "error-message",
      "error-icon",
      "show-retry",
      "loader-src",
      "loader-html",
      "show-thumbnails",
      "thumbnails-vtt",
    ];
  }

  // URL VALIDATION
  #isValidMediaUrl(url: string | null | undefined): boolean {
    if (!url || typeof url !== "string") return false;
    const isDev = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    try {
      const parsed = new URL(url, window.location.origin);
      if (parsed.protocol === "https:") return true;
      if (isDev && parsed.protocol === "http:") return true;
      return false;
    } catch { return false; }
  }

  #isValidPicture(picture: HTMLPictureElement): boolean {
    const img = picture.querySelector("img");
    if (img && !this.#isValidMediaUrl(img.src)) return false;
    for (const src of Array.from(picture.querySelectorAll("source")))
      if (src.srcset && !this.#isValidMediaUrl(src.srcset)) return false;
    return true;
  }

  // CONFIG
  #getConfig(): VideoPlayerConfig {
    const now = Date.now();
    if (
      this.#configCache &&
      now - this.#configCacheTime < this.#CONFIG_CACHE_DURATION
    )
      return this.#configCache;

    // Deprecation warnings (only log once per render)
    if (
      this.hasAttribute("desktop-poster") ||
      this.hasAttribute("mobile-poster")
    )
      console.warn(
        "[ShadowPlyr] DEPRECATED: 'desktop-poster'/'mobile-poster' are deprecated. Use a <picture> child element instead."
      );
    if (this.hasAttribute("desktop-video") || this.hasAttribute("mobile-video"))
      console.warn(
        "[ShadowPlyr] DEPRECATED: 'desktop-video'/'mobile-video' are deprecated. Use <source> child elements instead."
      );

    const ga = (n: string) => this.getAttribute(n);
    const config: VideoPlayerConfig = {
      lazy: ga("lazy") === "true",
      pauseOnOutOfView: ga("pause-on-out-of-view") === "true",
      pauseOnTabHide: ga("pause-on-tab-hide") !== "false",
      autoplay: ga("autoplay") === "true",
      loop: ga("loop") === "true",
      muted: ga("muted") === "true",
      playsinline: ga("playsinline") === "true",
      preload: (ga("preload") as VideoPlayerConfig["preload"]) || "metadata",
      desktopPoster: ga("desktop-poster") || "",
      mobilePoster: ga("mobile-poster") || "",
      desktopVideo: ga("desktop-video") || "",
      mobileVideo: ga("mobile-video") || "",
      videoType: ga("video-type") || "video/mp4",
      showControls: ga("show-controls") === "true",
      controlsType:
        (ga("controls-type") as VideoPlayerConfig["controlsType"]) || "full",
      showPlayPause: ga("show-play-pause") !== "false",
      showSeekbar: ga("show-seekbar") === "true",
      showVolume: ga("show-volume") === "true",
      showFullscreen: ga("show-fullscreen") === "true",
      showCenterPlay: ga("show-center-play") === "true",
      showSpeed: ga("show-speed") === "true",
      speedOptions: this.#parseSpeedOptions(),
      controlsHideDelay: parseInt(ga("controls-hide-delay") || "3000"),
      seekStep: parseInt(ga("seek-step") || "5"),
      lazyThreshold: parseFloat(ga("lazy-threshold") || "0.5"),
      pauseThreshold: parseFloat(ga("pause-threshold") || "0.3"),
      theme: (ga("theme") as VideoPlayerConfig["theme"]) || "dark",
      accentColor: ga("accent-color") || "#ffffff",
      controlsBackground: ga("controls-background") || "rgba(0, 0, 0, 0.8)",
      centerPlayBackground:
        ga("center-play-background") || "rgba(0, 0, 0, 0.7)",
      centerPlaySize: parseInt(ga("center-play-size") || "80"),
      showPosterOnEnded: ga("show-poster-on-ended") === "true",
      resetOnEnded: ga("reset-on-ended") === "true",
      posterClickPlay: ga("poster-click-play") !== "false",
      performanceMode: ga("performance-mode") === "true",
      showTooltips: ga("show-tooltips") === "true",
      tooltipPlay: ga("tooltip-play") || "Play",
      tooltipPause: ga("tooltip-pause") || "Pause",
      tooltipMute: ga("tooltip-mute") || "Mute",
      tooltipUnmute: ga("tooltip-unmute") || "Unmute",
      tooltipFullscreen: ga("tooltip-fullscreen") || "Fullscreen",
      tooltipExitFullscreen: ga("tooltip-exit-fullscreen") || "Exit fullscreen",
      tooltipSpeed: ga("tooltip-speed") || "Playback speed",
      tooltipCenterPlay: ga("tooltip-center-play") || "Play",
      doubleTapSeek: ga("double-tap-seek") !== "false",
      doubleTapSeekSeconds: parseInt(ga("double-tap-seek-seconds") || "10"),
      showSeekButtons: ga("show-seek-buttons") === "true",
      seekButtonSeconds: parseInt(ga("seek-button-seconds") || "10"),
      tripleTapSeek: ga("triple-tap-seek") !== "false",
      tripleTapSeconds: parseInt(ga("triple-tap-seconds") || "30"),
      enableTapRipple: ga("enable-tap-ripple") !== "false",
      singleActive: ga("single-active") === "true",
      showLoop: ga("show-loop") === "true",
      showPip: ga("show-pip") === "true",
      showSubtitles: ga("show-subtitles") === "true",
      showQuality: ga("show-quality") === "true",
      skipIntro: parseInt(ga("skip-intro") || "0"),
      theaterMode: ga("theater-mode") === "true",
      resume: ga("resume") === "true",
      screenshot: ga("screenshot") === "true",
      airplay: ga("airplay") === "true",
      miniPlayer: ga("mini-player") === "true",
      responsiveControls: ga("responsive-controls") === "true",
      bufferProgress: ga("buffer-progress") !== "false",
      // New
      showSettings: ga("show-settings") === "true",
      tooltipSettings: ga("tooltip-settings") || "Settings",
      errorMessage:
        ga("error-message") || "An error occurred while loading the video.",
      errorIcon: ga("error-icon") || "",
      showRetry: ga("show-retry") !== "false",
      loaderSrc: ga("loader-src") || "",
      loaderHtml: ga("loader-html") || "",
      showThumbnails: ga("show-thumbnails") === "true",
      thumbnailsVtt: ga("thumbnails-vtt") || "",
    };
    this.#configCache = config;
    this.#configCacheTime = now;
    return config;
  }

  #parseSpeedOptions(): number[] {
    const attr = this.getAttribute("speed-options");
    if (!attr) return [0.5, 0.75, 1, 1.25, 1.5, 2];
    try {
      return attr.split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
    } catch { return [0.5, 0.75, 1, 1.25, 1.5, 2]; }
  }

  // RENDER
  /**
   * Called once on connectedCallback. Reads <picture>, <source>, <track> from
   * light DOM, stores them in memory, then removes them so the user never sees
   * duplicate elements in the inspector and the browser never makes double
   * network requests.
   */
  #harvestLightDOM(): void {
    if (this.#lightDOMHarvested) return;
    this.#lightDOMHarvested = true;

    // <picture> poster — direct child only
    const pic = this.querySelector(
      ":scope > picture"
    ) as HTMLPictureElement | null;
    if (pic && this.#isValidPicture(pic)) {
      // Sanitise on the original before saving
      [pic, ...Array.from(pic.querySelectorAll("*"))].forEach((el) => {
        for (let i = el.attributes.length - 1; i >= 0; i--)
          if (el.attributes[i].name.startsWith("on"))
            el.removeAttribute(el.attributes[i].name);
      });
      this.#savedPicture = pic.cloneNode(true) as HTMLPictureElement;
      pic.remove(); // remove from light DOM — shadow DOM owns it now
    }

    // <source> direct children only (excludes sources nested inside <picture>)
    (
      Array.from(
        this.querySelectorAll(":scope > source")
      ) as HTMLSourceElement[]
    ).forEach((src) => {
      for (let i = src.attributes.length - 1; i >= 0; i--)
        if (src.attributes[i].name.startsWith("on"))
          src.removeAttribute(src.attributes[i].name);
      const url = src.getAttribute("src");
      if (url && this.#isValidMediaUrl(url)) {
        this.#savedSources.push(src.cloneNode(true) as HTMLSourceElement);
      } else {
        console.warn("ShadowPlyr: Ignored invalid source URL:", url);
      }
      src.remove();
    });

    // <track> direct children only
    (
      Array.from(this.querySelectorAll(":scope > track")) as HTMLElement[]
    ).forEach((track) => {
      for (let i = track.attributes.length - 1; i >= 0; i--)
        if (track.attributes[i].name.startsWith("on"))
          track.removeAttribute(track.attributes[i].name);
      this.#savedTracks.push(track.cloneNode(true) as HTMLElement);
      track.remove();
    });
  }

  #render(): void {
    const config = this.#getConfig();

    // Poster source detection — use harvested copy (light DOM elements were removed in #harvestLightDOM)
    const useLightPicture = !!this.#savedPicture;
    this.#hasPoster = !!(
      useLightPicture ||
      config.desktopPoster ||
      config.mobilePoster
    );
    this.#posterVisible = this.#hasPoster && !this.#hasPlayedOnce;
    this.#resumeKey = config.resume
      ? `shadowplyr-${config.desktopVideo || config.mobileVideo}`
      : null;

    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "shadow-plyr-wrapper";
    wrapper.setAttribute("tabindex", "0");
    wrapper.setAttribute("role", "application");
    wrapper.setAttribute("aria-label", "Video player");
    wrapper.setAttribute("part", "shadow-plyr-wrapper");

    // Poster — clone from saved copy (already sanitised in #harvestLightDOM)
    if (useLightPicture && this.#savedPicture) {
      const clonedPicture = this.#savedPicture.cloneNode(
        true
      ) as HTMLPictureElement;
      clonedPicture.setAttribute("part", "poster");
      wrapper.appendChild(clonedPicture);
    } else if (
      this.#isValidMediaUrl(config.desktopPoster) ||
      this.#isValidMediaUrl(config.mobilePoster)
    ) {
      const picture = document.createElement("picture");
      picture.setAttribute("part", "poster");
      if (config.mobilePoster && this.#isValidMediaUrl(config.mobilePoster)) {
        const src = document.createElement("source");
        src.media = "(max-width: 768px)";
        src.srcset = config.mobilePoster;
        picture.appendChild(src);
      }
      if (this.#isValidMediaUrl(config.desktopPoster)) {
        const img = document.createElement("img");
        img.src = config.desktopPoster; img.alt = "Video thumbnail"; img.loading = "lazy";
        picture.appendChild(img);
      }
      wrapper.appendChild(picture);
    }

    // Placeholder (replaced by video in #loadVideo)
    const placeholder = document.createElement("div");
    placeholder.className = "video-placeholder";
    wrapper.appendChild(placeholder);

    // Custom loader (if configured)
    if (config.loaderSrc || config.loaderHtml) {
      wrapper.classList.add("has-custom-loader");
      wrapper.appendChild(this.#createCustomLoader(config));
    }

    // Error overlay (always present, toggled via class)
    wrapper.appendChild(this.#createErrorOverlay(config));

    // Center play button
    if (config.showCenterPlay) {
      const icons = this.#getIcons();
      const centerPlay = document.createElement("div");
      centerPlay.className = "video-center-play";
      centerPlay.setAttribute("role", "button");
      centerPlay.tabIndex = 0;
      centerPlay.setAttribute("aria-label", "Play video");
      centerPlay.setAttribute("part", "center-play");
      const playSpan = document.createElement("span");
      playSpan.className = "play-icon"; playSpan.setAttribute("aria-hidden", "true");
      playSpan.appendChild(this.#createSVGFromString(icons.play));
      const pauseSpan = document.createElement("span");
      pauseSpan.className = "pause-icon"; pauseSpan.style.display = "none";
      pauseSpan.setAttribute("aria-hidden", "true");
      pauseSpan.appendChild(this.#createSVGFromString(icons.pause));
      centerPlay.appendChild(playSpan);
      centerPlay.appendChild(pauseSpan);
      if (config.showTooltips) {
        const tt = document.createElement("span");
        tt.className = "tooltip center-play-tooltip";
        tt.textContent = config.tooltipCenterPlay;
        centerPlay.appendChild(tt);
      }
      const sr = document.createElement("span");
      sr.className = "sr-only";
      sr.textContent = "Play";
      centerPlay.appendChild(sr);
      wrapper.appendChild(centerPlay);
    }

    if (config.showControls && config.controlsType !== "none")
      wrapper.appendChild(this.#createControlsHTML(config));
    if (config.showSeekButtons)
      wrapper.appendChild(this.#createSeekButtons(config));

    // Container
    const container = document.createElement("div");
    container.className = "video-container";
    container.setAttribute("part", "video-container");
    container.appendChild(wrapper);

    this.#shadowRoot.innerHTML = "";
    this.#shadowRoot.appendChild(container);

    // Cache DOM refs
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
    this.#$settingsMenu = wrapper.querySelector(".video-settings-menu");
    // settings value refs set lazily in #buildSettingsMenu()
    this.#$thumbnailPreview = wrapper.querySelector(".seek-thumbnail-preview");
    this.#$thumbnailCanvas = wrapper.querySelector(".seek-thumbnail-canvas");
    this.#$thumbnailLabel = wrapper.querySelector(".seek-thumbnail-time");
  }

  // DOM BUILDER HELPERS

  /** Build and return the error overlay div. */
  #createErrorOverlay(config: VideoPlayerConfig): HTMLElement {
    const overlay = document.createElement("div");
    overlay.className = "video-error-overlay";
    overlay.setAttribute("part", "error-overlay");

    // Icon
    const iconWrap = document.createElement("div");
    iconWrap.className = "error-icon";
    const defaultErrorIcon = `<svg viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`;
    const rawIcon = config.errorIcon
      ? DOMPurify.sanitize(config.errorIcon, { USE_PROFILES: { svg: true } })
      : defaultErrorIcon;
    iconWrap.appendChild(this.#createSVGFromString(rawIcon));
    overlay.appendChild(iconWrap);

    const title = document.createElement("p");
    title.className = "error-title";
    title.textContent = "Playback Error";
    overlay.appendChild(title);

    const msg = document.createElement("p");
    msg.className = "error-message";
    msg.textContent = config.errorMessage ?? "";
    overlay.appendChild(msg);

    if (config.showRetry !== false) {
      const btn = document.createElement("button");
      btn.className = "error-retry-btn";
      btn.textContent = "Try again";
      btn.addEventListener("click", () => this.#retryLoad());
      overlay.appendChild(btn);
    }
    return overlay;
  }

  /** Re-initialise the video element for a retry after error. */
  #retryLoad(): void {
    if (!this.#$wrapper) return;
    // Clear error state on both host and wrapper
    this.#$wrapper.classList.remove("has-error");
    this.classList.remove("has-error");
    this.#hasError = false;
    // Reinitialize — this will re-add video-loading while the new load starts
    this.#reinitialize();
  }

  /** Build the custom loader element. */
  #createCustomLoader(config: VideoPlayerConfig): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "video-custom-loader";
    wrap.setAttribute("part", "custom-loader");

    if (config.loaderSrc) {
      // URL-based: img for raster/gif, inline for data URIs
      const img = document.createElement("img");
      img.src = config.loaderSrc;
      img.alt = "Loading";
      img.setAttribute("aria-hidden", "true");
      wrap.appendChild(img);
    } else if (config.loaderHtml) {
      const clean = DOMPurify.sanitize(config.loaderHtml, {
        USE_PROFILES: { svg: true, html: true },
      });
      const tmp = document.createElement("div");
      tmp.innerHTML = clean;
      while (tmp.firstChild) wrap.appendChild(tmp.firstChild);
    }
    return wrap;
  }

  #createSVGFromString(svgString: string): SVGElement {
    const div = document.createElement("div");
    div.innerHTML = svgString.trim();
    const svg = div.firstElementChild as SVGElement;
    if (!svg || svg.tagName.toLowerCase() !== "svg") {
      const fallback = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      fallback.setAttribute("viewBox", "0 0 24 24");
      return fallback;
    }
    return svg;
  }

  /**
   * Create a standard icon-only control button. Reduces ~200 bytes of boilerplate
   * per button (className, aria-label, tabIndex, part attr, icon span).
   */
  #mkBtn(
    cls: string,
    ariaLabel: string,
    iconSvg: string,
    tooltip?: string
  ): HTMLButtonElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn " + cls;
    btn.setAttribute("aria-label", ariaLabel);
    btn.tabIndex = 0;
    btn.setAttribute("part", cls);
    const span = document.createElement("span");
    // Named icon span — updateLoopIcon (and similar) query by e.g. ".loop-icon"
    span.className = cls.replace("video-", "").replace("-btn", "") + "-icon";
    span.setAttribute("aria-hidden", "true");
    span.appendChild(this.#createSVGFromString(iconSvg));
    btn.appendChild(span);
    if (tooltip) {
      const tt = document.createElement("span");
      tt.className = "tooltip " + cls + "-tooltip";
      tt.textContent = tooltip;
      btn.appendChild(tt);
    }
    return btn;
  }

  #createSeekButtons(config: VideoPlayerConfig): HTMLElement {
    const container = document.createElement("div");
    container.className = "video-seek-buttons";
    container.setAttribute("part", "seek-buttons");
    const left = document.createElement("button");
    left.className = "seek-left"; left.textContent = `-${config.seekButtonSeconds}s`;
    left.setAttribute("part", "seek-left");
    const right = document.createElement("button");
    right.className = "seek-right"; right.textContent = `+${config.seekButtonSeconds}s`;
    right.setAttribute("part", "seek-right");
    left.addEventListener("click", () => {
      if (!this.#videoElement) return;
      this.#videoElement.currentTime = Math.max(0, this.#videoElement.currentTime - config.seekButtonSeconds);
    });
    right.addEventListener("click", () => {
      if (!this.#videoElement) return;
      this.#videoElement.currentTime = Math.min(this.#videoElement.duration, this.#videoElement.currentTime + config.seekButtonSeconds);
    });
    container.appendChild(left);
    container.appendChild(right);
    return container;
  }

  // ICONS
  #getIcons(): IconSet {
    const cacheKey = `${this.getAttribute("play-icon") || ""}-${this.getAttribute("pause-icon") || ""}`;
    if (IconCache.has(cacheKey)) return IconCache.get(cacheKey)!;
    const p = { USE_PROFILES: { svg: true } };
    const icons: IconSet = {
      play: DOMPurify.sanitize(
        this.getAttribute("play-icon") || DEFAULT_ICONS.play,
        p
      ),
      pause: DOMPurify.sanitize(
        this.getAttribute("pause-icon") || DEFAULT_ICONS.pause,
        p
      ),
      volume: DOMPurify.sanitize(
        this.getAttribute("volume-icon") || DEFAULT_ICONS.volume,
        p
      ),
      muted: DOMPurify.sanitize(
        this.getAttribute("muted-icon") || DEFAULT_ICONS.muted,
        p
      ),
      fullscreen: DOMPurify.sanitize(
        this.getAttribute("fullscreen-icon") || DEFAULT_ICONS.fullscreen,
        p
      ),
      exitFullscreen: DOMPurify.sanitize(
        this.getAttribute("exit-fullscreen-icon") ||
          DEFAULT_ICONS.exitFullscreen,
        p
      ),
      speed: DOMPurify.sanitize(
        this.getAttribute("speed-icon") || DEFAULT_ICONS.speed,
        p
      ),
      loopOnce: DOMPurify.sanitize(
        this.getAttribute("loop-once-icon") || DEFAULT_ICONS.loopOnce,
        p
      ),
      loop: DOMPurify.sanitize(
        this.getAttribute("loop-icon") || DEFAULT_ICONS.loop,
        p
      ),
      pip: DOMPurify.sanitize(
        this.getAttribute("pip-icon") || DEFAULT_ICONS.pip,
        p
      ),
      subtitle: DOMPurify.sanitize(
        this.getAttribute("subtitle-icon") || DEFAULT_ICONS.subtitle,
        p
      ),
      quality: DOMPurify.sanitize(
        this.getAttribute("quality-icon") || DEFAULT_ICONS.quality,
        p
      ),
      more: DOMPurify.sanitize(
        this.getAttribute("more-icon") || DEFAULT_ICONS.more,
        p
      ),
      theater: DOMPurify.sanitize(
        this.getAttribute("theater-icon") || DEFAULT_ICONS.theater,
        p
      ),
      screenshot: DOMPurify.sanitize(
        this.getAttribute("screenshot-icon") || DEFAULT_ICONS.screenshot,
        p
      ),
      airplay: DOMPurify.sanitize(
        this.getAttribute("airplay-icon") || DEFAULT_ICONS.airplay,
        p
      ),
      miniplayer: DOMPurify.sanitize(
        this.getAttribute("miniplayer-icon") || DEFAULT_ICONS.miniplayer,
        p
      ),
      settings: DEFAULT_ICONS.settings, // not user-overridable
    };
    IconCache.set(cacheKey, icons);
    return icons;
  }

  // CONTROLS HTML
  #createControlsHTML(config: VideoPlayerConfig): DocumentFragment {
    const icons = this.#getIcons();
    const frag = document.createDocumentFragment();
    const bar = document.createElement("div");
    bar.className = "video-controls-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Video controls");
    bar.setAttribute("part", "controls");

    // Seekbar
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

      const track = document.createElement("div");
      track.className = "video-seekbar-track";
      track;

      if (config.bufferProgress) {
        const buf = document.createElement("div");
        buf.className = "video-seekbar-buffer";
        buf.setAttribute("part", "seekbar-buffer");
        this.#$seekbarBuffer = buf;
        track.appendChild(buf);
      }

      const progress = document.createElement("div");
      progress.className = "video-seekbar-progress";
      progress;
      const fill = document.createElement("div");
      fill.className = "video-seekbar-fill";
      fill.setAttribute("part", "seekbar-progress");
      this.#$seekbarFill = fill;
      progress.appendChild(fill);
      track.appendChild(progress);

      const handle = document.createElement("div");
      handle.className = "video-seekbar-handle";
      handle.setAttribute("part", "seekbar-handle");
      this.#$seekbarHandle = handle;

      seekbar.appendChild(track);
      seekbar.appendChild(handle);

      // Thumbnail preview container (appended inside seekbar)
      if (config.showThumbnails) {
        const preview = document.createElement("div");
        preview.className = "seek-thumbnail-preview";
        const canvas = document.createElement("canvas");
        canvas.className = "seek-thumbnail-canvas";
        canvas.width = 160;
        canvas.height = 90;
        const label = document.createElement("div");
        label.className = "seek-thumbnail-time";
        preview.appendChild(canvas);
        preview.appendChild(label);
        seekbar.appendChild(preview);
      }

      bar.appendChild(seekbar);
    }

    // Controls row
    const row = document.createElement("div");
    row.className = "video-controls-row";
    row.setAttribute("part", "controls-row");
    bar.appendChild(row);

    if (config.showPlayPause)
      row.appendChild(this.#createPlayPauseButton(icons, config));
    if (config.showVolume)
      row.appendChild(this.#createVolumeControl(icons, config));

    const timeDisplay = document.createElement("div");
    timeDisplay.className = "video-time-display"; timeDisplay.textContent = "0:00 / 0:00";
    timeDisplay.setAttribute("part", "time-display");
    row.appendChild(timeDisplay);

    const spacer = document.createElement("div");
    spacer.className = "video-controls-spacer"; spacer.setAttribute("part", "controls-spacer");
    row.appendChild(spacer);

    if (config.showLoop) row.appendChild(this.#createLoopButton(icons, config));
    if (config.showPip && document.pictureInPictureEnabled)
      row.appendChild(this.#createPipButton(icons, config));

    // Unified settings button vs. individual buttons
    const hasSettingsItems =
      config.showQuality || config.showSpeed || config.showSubtitles;
    if (config.showSettings && hasSettingsItems) {
      row.appendChild(this.#createSettingsButton(icons, config));
    } else {
      if (config.showSubtitles)
        row.appendChild(this.#createSubtitleButton(icons, config));
      if (config.showQuality)
        row.appendChild(this.#createQualityButton(icons, config));
      if (config.showSpeed)
        row.appendChild(this.#createSpeedButton(icons, config));
    }

    if (config.theaterMode)
      row.appendChild(this.#createTheaterButton(icons, config));
    if (config.screenshot)
      row.appendChild(this.#createScreenshotButton(icons, config));
    if (config.airplay && (window as any).WebKitPlaybackTargetAvailabilityEvent)
      row.appendChild(this.#createAirPlayButton(icons, config));
    if (config.miniPlayer)
      row.appendChild(this.#createMiniPlayerButton(icons, config));
    if (config.showFullscreen)
      row.appendChild(this.#createFullscreenButton(icons, config));
    // Only render the kabab (more) button when the unified settings menu is NOT active.
    // When show-settings="true", quality/speed/subtitles are consolidated in the settings panel.
    if (config.responsiveControls && !config.showSettings)
      row.appendChild(this.#createMoreButton(icons, config));

    frag.appendChild(bar);
    return frag;
  }

  // ── individual button factories ───────────────────────────────────────────
  #createPlayPauseButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    const btn = document.createElement("button");
    btn.className = "video-control-btn play-pause";
    btn.setAttribute("aria-label", "Play");
    btn.tabIndex = 0;
    btn.setAttribute("part", "play-pause");
    const ps = document.createElement("span");
    ps.className = "play-icon";
    ps.setAttribute("aria-hidden", "true");
    ps.appendChild(this.#createSVGFromString(icons.play));
    const pa = document.createElement("span");
    pa.className = "pause-icon";
    pa.style.display = "none";
    pa.setAttribute("aria-hidden", "true");
    pa.appendChild(this.#createSVGFromString(icons.pause));
    btn.appendChild(ps);
    btn.appendChild(pa);
    if (config.showTooltips) {
      const tt1 = document.createElement("span");
      tt1.className = "tooltip play-tooltip";
      tt1.textContent = config.tooltipPlay;
      tt1;
      const tt2 = document.createElement("span");
      tt2.className = "tooltip pause-tooltip";
      tt2.style.display = "none";
      tt2.textContent = config.tooltipPause;
      tt2;
      btn.appendChild(tt1);
      btn.appendChild(tt2);
    }
    return btn;
  }

  #createVolumeControl(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "video-volume-control";
    wrap.setAttribute("part", "volume-control");
    const btn = document.createElement("button");
    btn.className = "video-control-btn volume-btn";
    btn.setAttribute("aria-label", "Mute");
    btn.tabIndex = 0;
    btn.setAttribute("part", "volume-btn");
    const vs = document.createElement("span");
    vs.className = "volume-icon";
    vs.setAttribute("aria-hidden", "true");
    vs.appendChild(this.#createSVGFromString(icons.volume));
    const ms = document.createElement("span");
    ms.className = "muted-icon";
    ms.style.display = "none";
    ms.setAttribute("aria-hidden", "true");
    ms.appendChild(this.#createSVGFromString(icons.muted));
    btn.appendChild(vs);
    btn.appendChild(ms);
    if (config.showTooltips) {
      const vt = document.createElement("span");
      vt.className = "tooltip volume-tooltip";
      vt.textContent = config.tooltipMute;
      vt;
      const mt = document.createElement("span");
      mt.className = "tooltip muted-tooltip";
      mt.style.display = "none";
      mt.textContent = config.tooltipUnmute;
      mt;
      btn.appendChild(vt);
      btn.appendChild(mt);
    }
    wrap.appendChild(btn);
    const slider = document.createElement("div");
    slider.className = "video-volume-slider";
    slider.setAttribute("role", "slider");
    slider.tabIndex = 0;
    slider.setAttribute("aria-label", "Volume");
    slider.setAttribute("aria-valuemin", "0");
    slider.setAttribute("aria-valuemax", "100");
    slider.setAttribute("aria-valuenow", "100");
    slider.setAttribute("part", "volume-slider");
    const prog = document.createElement("div");
    prog.className = "video-volume-progress";
    prog.setAttribute("part", "volume-progress");
    slider.appendChild(prog);
    wrap.appendChild(slider);
    return wrap;
  }

  #createLoopButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const btn = this.#mkBtn("loop-btn", "Enable loop", icons.loopOnce);
    if (config.showTooltips) {
      const t1 = document.createElement("span");
      t1.className = "tooltip loop-on-tooltip";
      t1.textContent = "Disable loop";
      t1.style.display = "none";
      btn.appendChild(t1);
      const t2 = document.createElement("span");
      t2.className = "tooltip loop-off-tooltip";
      t2.textContent = "Enable loop";
      btn.appendChild(t2);
    }
    return btn;
  }

  #createPipButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    return this.#mkBtn(
      "pip-btn",
      "Picture in Picture",
      icons.pip,
      config.showTooltips ? "Picture in Picture" : undefined
    );
  }

  #createSubtitleButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "video-subtitle-control";
    wrap;
    const btn = document.createElement("button");
    btn.className = "video-control-btn video-subtitle-btn";
    btn.setAttribute("aria-label", "Subtitles");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.setAttribute("part", "subtitle-btn");
    const is = document.createElement("span");
    is.setAttribute("aria-hidden", "true");
    is.appendChild(this.#createSVGFromString(icons.subtitle));
    btn.appendChild(is);
    const ts = document.createElement("span");
    ts.className = "subtitle-text";
    ts.textContent = "CC";
    ts;
    btn.appendChild(ts);
    if (config.showTooltips) {
      const t = document.createElement("span");
      t.className = "tooltip subtitle-tooltip";
      t.textContent = "Subtitles";
      t;
      btn.appendChild(t);
    }
    wrap.appendChild(btn);
    const menu = document.createElement("div");
    menu.className = "video-subtitle-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("part", "subtitle-menu");
    wrap.appendChild(menu);
    return wrap;
  }

  #createQualityButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "video-quality-control";
    wrap;
    const btn = document.createElement("button");
    btn.className = "video-control-btn video-settings-btn";
    btn.setAttribute("aria-label", config.tooltipSettings ?? "Settings");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.setAttribute("part", "quality-btn");
    const is = document.createElement("span");
    is.setAttribute("aria-hidden", "true");
    is.appendChild(this.#createSVGFromString(icons.quality));
    btn.appendChild(is);
    const ts = document.createElement("span");
    ts.className = "quality-text";
    ts.textContent = "Auto";
    ts;
    btn.appendChild(ts);
    if (config.showTooltips) {
      const t = document.createElement("span");
      t.className = "tooltip quality-tooltip";
      t.textContent = "Quality";
      t;
      btn.appendChild(t);
    }
    wrap.appendChild(btn);
    const menu = document.createElement("div");
    menu.className = "video-settings-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("part", "quality-menu");
    wrap.appendChild(menu);
    return wrap;
  }

  #createSpeedButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "video-speed-control";
    wrap;
    const btn = document.createElement("button");
    btn.className = "video-control-btn video-speed-btn";
    btn.setAttribute("aria-label", "Playback speed");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.setAttribute("part", "speed-btn");
    const is = document.createElement("span");
    is.setAttribute("aria-hidden", "true");
    is.appendChild(this.#createSVGFromString(icons.speed));
    btn.appendChild(is);
    const ts = document.createElement("span");
    ts.className = "speed-text";
    ts.textContent = "1x";
    ts;
    btn.appendChild(ts);
    if (config.showTooltips) {
      const t = document.createElement("span");
      t.className = "tooltip speed-tooltip";
      t.textContent = config.tooltipSpeed;
      t;
      btn.appendChild(t);
    }
    wrap.appendChild(btn);
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
    wrap.appendChild(menu);
    return wrap;
  }

  /** Unified ⚙ settings button with Quality / Speed / Subtitle submenus */
  #createSettingsButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "video-settings-control";
    const btn = document.createElement("button");
    btn.className = "video-control-btn video-settings-btn";
    btn.setAttribute("aria-label", config.tooltipSettings ?? "Settings");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.setAttribute("part", "settings-btn");
    const is = document.createElement("span");
    is.setAttribute("aria-hidden", "true");
    is.appendChild(this.#createSVGFromString(icons.settings));
    btn.appendChild(is);
    if (config.showTooltips) {
      const tt = document.createElement("span");
      tt.className = "tooltip settings-tooltip";
      tt.textContent = config.tooltipSettings ?? "Settings";
      btn.appendChild(tt);
    }
    wrap.appendChild(btn);
    // Menu built lazily on first open — placeholder div swapped in #buildSettingsMenu()
    const menuPlaceholder = document.createElement("div");
    menuPlaceholder.className = "video-settings-menu";
    menuPlaceholder.setAttribute("role", "menu");
    menuPlaceholder.setAttribute("part", "settings-menu");
    wrap.appendChild(menuPlaceholder);
    return wrap;
  }

  /** Build the settings menu interior on first open (lazy). */
  #buildSettingsMenu(config: VideoPlayerConfig): void {
    const menu = this.#$settingsMenu;
    if (!menu || menu.children.length > 0) return;

    // Build HTML string — faster than createElement chains, much less source code
    let html = `<div class="settings-page active" data-page="main">`;
    if (config.showQuality)
      html += `<button class="settings-main-item" data-submenu="quality"><span class="settings-main-label">Quality</span><span class="settings-main-value settings-quality-value">Auto</span><span class="settings-main-arrow">›</span></button>`;
    if (config.showSpeed)
      html += `<button class="settings-main-item" data-submenu="speed"><span class="settings-main-label">Speed</span><span class="settings-main-value settings-speed-value">${
        this.#currentSpeed
      }x</span><span class="settings-main-arrow">›</span></button>`;
    if (config.showSubtitles)
      html += `<button class="settings-main-item" data-submenu="subtitle"><span class="settings-main-label">Subtitles</span><span class="settings-main-value settings-subtitle-value">Off</span><span class="settings-main-arrow">›</span></button>`;
    html += `</div>`;

    if (config.showQuality)
      html += `<div class="settings-page" data-page="quality"><button class="settings-sub-header" data-back="true"><span class="settings-sub-back">‹</span><span>Quality</span></button><div class="video-quality-menu" role="menu" part="quality-menu"></div></div>`;
    if (config.showSpeed) {
      const opts = config.speedOptions
        .map(
          (s) =>
            `<button class="settings-option${
              s === 1 ? " active" : ""
            }" data-speed="${s}">${s}x</button>`
        )
        .join("");
      html += `<div class="settings-page" data-page="speed"><button class="settings-sub-header" data-back="true"><span class="settings-sub-back">‹</span><span>Speed</span></button><div class="video-speed-menu" role="menu" part="speed-menu">${opts}</div></div>`;
    }
    if (config.showSubtitles)
      html += `<div class="settings-page" data-page="subtitle"><button class="settings-sub-header" data-back="true"><span class="settings-sub-back">‹</span><span>Subtitles</span></button><div class="video-subtitle-menu" role="menu" part="subtitle-menu"></div></div>`;

    menu.innerHTML = html;

    // Wire live DOM refs
    this.#$settingsQualityValue = menu.querySelector(".settings-quality-value");
    this.#$settingsSpeedValue = menu.querySelector(".settings-speed-value");
    this.#$settingsSubtitleValue = menu.querySelector(
      ".settings-subtitle-value"
    );
    this.#$qualityMenu = menu.querySelector(".video-quality-menu");
    this.#$subtitleMenu = menu.querySelector(".video-subtitle-menu");
    // Populate now that refs exist (population ran at load time when refs were null)
    this.#populateQualityMenu();
    if (this.#$wrapper) this.#populateSubtitleMenu(this.#$wrapper);
  }

  #createTheaterButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    return this.#mkBtn(
      "theater-btn",
      "Theater mode",
      icons.theater,
      config.showTooltips ? "Theater mode" : undefined
    );
  }

  #createScreenshotButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    return this.#mkBtn(
      "screenshot-btn",
      "Screenshot",
      icons.screenshot,
      config.showTooltips ? "Take screenshot" : undefined
    );
  }

  #createAirPlayButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    return this.#mkBtn(
      "airplay-btn",
      "AirPlay",
      icons.airplay,
      config.showTooltips ? "AirPlay" : undefined
    );
  }

  #createMiniPlayerButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    return this.#mkBtn(
      "miniplayer-btn",
      "Mini player",
      icons.miniplayer,
      config.showTooltips ? "Mini player" : undefined
    );
  }

  #createFullscreenButton(
    icons: IconSet,
    config: VideoPlayerConfig
  ): HTMLElement {
    const btn = this.#mkBtn("fullscreen-btn", "Fullscreen", icons.fullscreen);
    const exitSpan = document.createElement("span");
    exitSpan.className = "exit-fullscreen-icon";
    exitSpan.style.display = "none";
    exitSpan.setAttribute("aria-hidden", "true");
    exitSpan.appendChild(this.#createSVGFromString(icons.exitFullscreen));
    btn.appendChild(exitSpan);
    if (config.showTooltips) {
      const t1 = document.createElement("span");
      t1.className = "tooltip fullscreen-tooltip";
      t1.textContent = config.tooltipFullscreen;
      btn.appendChild(t1);
      const t2 = document.createElement("span");
      t2.className = "tooltip exit-fullscreen-tooltip";
      t2.style.display = "none";
      t2.textContent = config.tooltipExitFullscreen;
      btn.appendChild(t2);
    }
    return btn;
  }

  #createMoreButton(icons: IconSet, config: VideoPlayerConfig): HTMLElement {
    const wrap = document.createElement("div");
    wrap.className = "video-more-control";
    wrap;
    const btn = document.createElement("button");
    btn.className = "video-control-btn video-more-btn";
    btn.setAttribute("aria-label", "More controls");
    btn.setAttribute("aria-haspopup", "true");
    btn.setAttribute("aria-expanded", "false");
    btn.tabIndex = 0;
    btn.setAttribute("part", "more-btn");
    const is = document.createElement("span");
    is.setAttribute("aria-hidden", "true");
    is.appendChild(this.#createSVGFromString(icons.more));
    btn.appendChild(is);
    wrap.appendChild(btn);
    const menu = document.createElement("div");
    menu.className = "video-more-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("part", "more-menu");
    wrap.appendChild(menu);
    return wrap;
  }

  // LIFECYCLE
  connectedCallback(): void {
    this.#harvestLightDOM(); // must run before #render() so saved data is ready
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
    )
      GlobalVideoEngine.register(this);
  }

  disconnectedCallback(): void {
    this.#destroy();
    this.#removeVisibilityHandling();
    // Release saved light DOM data — element is leaving the page
    this.#savedPicture = null;
    this.#savedSources = [];
    this.#savedTracks = [];
    this.#lightDOMHarvested = false;
    document.removeEventListener(
      "fullscreenchange",
      this.#boundFullscreenChange
    );
    this.#cancelFrameLoop();
    if (this.#thumbnailRAF) cancelAnimationFrame(this.#thumbnailRAF);
    GlobalVideoEngine.unregister(this);
    if (this.#resizeObserver) this.#resizeObserver.disconnect();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;
    this.#configCache = null;
    if (!this.#isInitialized) return;
    const config = this.#getConfig();
    switch (name) {
      case "muted": if (this.#videoElement) this.#videoElement.muted = config.muted; break;
      case "loop":  if (this.#videoElement) this.#videoElement.loop  = config.loop;  break;
      case "accent-color": case "theme": case "controls-background":
      case "center-play-background": case "center-play-size":
        this.#updateCSSVariables(config); break;
      default: this.#reinitialize();
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
    this.style.setProperty("--controls-bg",  theme.controlsBg);
    this.style.setProperty("--center-play-bg", theme.centerPlayBg);
    if (config.centerPlaySize)
      this.style.setProperty(
        "--center-play-size",
        config.centerPlaySize + "px"
      );
  }

  // INIT
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
      document.addEventListener("visibilitychange", this.#visibilityChange, { passive: true });
      window.addEventListener("pagehide", this.#pageHide, { passive: true });
      window.addEventListener("pageshow", this.#pageShow, { passive: true });
    }
  }

  #removeVisibilityHandling(): void {
    document.removeEventListener("visibilitychange", this.#visibilityChange);
    window.removeEventListener("pagehide", this.#pageHide);
    window.removeEventListener("pageshow", this.#pageShow);
  }

  // LAZY LOADING
  #setupLazyLoading(wrapper: HTMLElement, config: VideoPlayerConfig): void {
    if (!("IntersectionObserver" in window))
      return this.#loadVideo(wrapper, config);
    this.#observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            config.lazy &&
            !this.#isInitialized &&
            entry.isIntersecting &&
            entry.intersectionRatio >= config.lazyThreshold
          )
            this.#loadVideo(wrapper, config);
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
      },
      { root: null, rootMargin: "50px", threshold: config.lazyThreshold }
    );
    this.#observer.observe(wrapper);
    if (!config.lazy && config.pauseOnOutOfView && !this.#isInitialized)
      this.#loadVideo(wrapper, config);
  }

  // VIDEO LOADING
  #loadVideo(wrapper: HTMLElement, config: VideoPlayerConfig): void {
    if (this.#isInitialized) return;
    // Stamp this load cycle so stale async callbacks (timeouts, source error
    // listeners) from a previous load can detect they are outdated and bail.
    const myGeneration = ++this.#loadGeneration;
    wrapper.classList.add("video-loading");
    this.classList.add("video-loading");

    // ── Fix: show poster behind loader immediately ──
    if (this.#hasPoster) {
      wrapper.classList.add("poster-visible");
      this.classList.add("poster-visible");
      this.#posterVisible = true;
    }

    const video = document.createElement("video");
    this.#videoElement = video;
    this.#exposeVideoAPI();
    this.#exposeVideoMethods();
    this.#forwardNativeEvents();

    video.muted = config.muted;
    video.defaultMuted = config.muted;
    // crossOrigin must be set BEFORE sources/tracks are appended.
    // Without it the browser blocks all cross-origin <track> files (status: blocked:origin)
    // even when the server sends correct CORS headers.
    video.crossOrigin = "anonymous";

    const attrs: Record<string, string> = {
      preload: config.preload,
      ...(!config.showPip && { disablepictureinpicture: "" }),
      "webkit-playsinline": "",
      ...(config.loop     && { loop:      "" }),
      ...(config.muted    && { muted:     "" }),
      ...(config.playsinline && { playsinline: "" }),
    };
    Object.entries(attrs).forEach(([k, v]) => video.setAttribute(k, v));
    video.setAttribute("part", "video");
    video.playsInline = true;

    // Append saved <track> clones (originals were removed from light DOM in #harvestLightDOM)
    this.#savedTracks.forEach((track) =>
      video.appendChild(track.cloneNode(true) as HTMLElement)
    );

    // Collect and validate light-DOM <source> elements
    // Use saved <source> elements (originals removed from light DOM in #harvestLightDOM)
    if (this.#savedSources.length > 0) {
      this.#savedSources.forEach((s) =>
        video.appendChild(s.cloneNode(true) as HTMLSourceElement)
      );
    } else {
      // Deprecated attribute fallback
      if (config.desktopVideo && this.#isValidMediaUrl(config.desktopVideo)) {
        const s = document.createElement("source"); s.src = config.desktopVideo; s.type = config.videoType; s.media = "(min-width: 769px)"; video.appendChild(s);
      }
      if (config.mobileVideo && this.#isValidMediaUrl(config.mobileVideo)) {
        const s = document.createElement("source");
        s.src = config.mobileVideo;
        s.type = config.videoType;
        s.media = "(max-width: 768px)";
        video.appendChild(s);
      }
      if (config.desktopVideo && this.#isValidMediaUrl(config.desktopVideo))
        video.src = config.desktopVideo;
      else if (config.mobileVideo && this.#isValidMediaUrl(config.mobileVideo))
        video.src = config.mobileVideo;
    }

    // Manual quality sources
    this.#manualQualities = (
      Array.from(
        video.querySelectorAll("source[data-quality]")
      ) as HTMLSourceElement[]
    )
      .map((el) => ({
        src: el.src,
        type: el.type || "video/mp4",
        label: el.getAttribute("data-quality")!,
        media: el.media || null,
      }))
      .filter((q) => {
        const isValid = this.#isValidMediaUrl(q.src);

        const isMediaMatch = q.media
          ? window.matchMedia(q.media).matches
          : true;

        return isValid && isMediaMatch;
      });

    // Wire events
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
    video.addEventListener("error", this.#onError.bind(this, wrapper));
    video.addEventListener("enterpictureinpicture", this.#onPipEnter);
    video.addEventListener("leavepictureinpicture", this.#onPipLeave);

    const sourcesInVideo = Array.from(video.querySelectorAll("source"));
    if (sourcesInVideo.length > 0) {
      let sourceErrorCount = 0;
      sourcesInVideo.forEach((srcEl) => {
        srcEl.addEventListener("error", () => {
          if (myGeneration !== this.#loadGeneration) return; // stale load cycle
          if (this.#videoLoaded || this.#hasError) return;
          sourceErrorCount++;
          if (sourceErrorCount >= sourcesInVideo.length) {
            this.#onError(wrapper);
          }
        });
      });
    }

    const loadTimeoutId = window.setTimeout(() => {
      if (myGeneration !== this.#loadGeneration) return; // stale load cycle
      if (!this.#videoLoaded && !this.#hasError) {
        this.#onError(wrapper);
      }
    }, 8000);
    // Cancel the timeout as soon as the video resolves one way or another
    video.addEventListener(
      "loadedmetadata",
      () => clearTimeout(loadTimeoutId),
      { once: true }
    );
    video.addEventListener("error", () => clearTimeout(loadTimeoutId), {
      once: true,
    });

    if (video.muted || config.muted) this.#updateVolumeIcon(true, wrapper);

    // Insert video
    const placeholder = wrapper.querySelector(".video-placeholder");
    if (placeholder) placeholder.replaceWith(video);
    video.load();
    video.style.pointerEvents = "auto";

    // Poster click handler
    const picture = wrapper.querySelector("picture");
    if (picture) { picture.removeEventListener("click", this.#posterClick); picture.addEventListener("click", this.#posterClick); }

    if (config.autoplay && config.muted) this.playVideo();
  }

  // PUBLIC API EXPOSURE
  #exposeVideoAPI() {
    const props: (keyof HTMLVideoElement)[] = [
      "muted","loop","autoplay","controls","currentTime","volume","playbackRate",
      "paused","duration","ended","readyState","networkState","videoWidth","videoHeight","src",
    ];
    props.forEach((prop) => {
      Object.defineProperty(this, prop, {
        get: () => this.#videoElement?.[prop],
        set: (v) => {
          if (this.#videoElement) (this.#videoElement as any)[prop] = v;
        },
        configurable: true,
      });
    });
  }

  #exposeVideoMethods() {
    (
      [
        "play",
        "pause",
        "load",
        "requestPictureInPicture",
      ] as (keyof HTMLVideoElement)[]
    ).forEach((m) => {
      (this as any)[m] = (...args: any[]) =>
        (this.#videoElement as any)?.[m]?.(...args);
    });
  }

  #forwardNativeEvents() {
    [
      "play",
      "pause",
      "ended",
      "timeupdate",
      "volumechange",
      "seeking",
      "seeked",
      "loadedmetadata",
      "error",
    ].forEach((ev) => {
      this.#videoElement?.addEventListener(ev, () =>
        this.dispatchEvent(new Event(ev))
      );
    });
  }

  // PUBLIC METHODS
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

  public setLoop(isLoop: boolean): void {
    if (!this.#videoElement) return;
    this.#videoElement.loop = isLoop;
    this.#updateLoopIcon(isLoop);
    this.#emit("video-loop-change", { loop: isLoop });
  }

  public playVideo(): void {
    if (!this.#videoElement) return;
    const config = this.#getConfig();
    if (config.autoplay) this.#videoElement.muted = true;
    if (config.singleActive || this.getAttribute("virtual-playback") === "true")
      GlobalVideoEngine.requestPlay(this);
    const p = this.#videoElement.play();
    if (p)
      p.catch(() => {
        this.#posterVisible = true;
        if (this.#$wrapper) {
          this.#$wrapper.classList.add("poster-visible");
          this.classList.add("poster-visible");
        }
      });
  }

  public pauseVideo(silent?: boolean): void {
    if (this.#videoElement) { this.#videoElement.pause(); if (!silent) this.#emit("video-paused"); }
  }

  // CONTROLS SETUP
  #setupControlButtons(wrapper: HTMLElement): void {
    wrapper.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Seekbar click
      const seekbar = target.closest(".video-seekbar");
      if (seekbar) {
        const rect = seekbar.getBoundingClientRect();
        this.#seekTo((e.clientX - rect.left) / rect.width);
        e.stopPropagation(); return;
      }
      // Volume click
      const volSlider = target.closest(".video-volume-slider");
      if (volSlider) {
        const rect = volSlider.getBoundingClientRect();
        this.#setVolume((e.clientX - rect.left) / rect.width);
        e.stopPropagation(); return;
      }

      // ── Settings submenu navigation (check BEFORE generic closest sweep) ──
      // Using closest() on data-* attrs so clicks on child spans still bubble up correctly.
      const subBtn = target.closest<HTMLElement>("[data-submenu]");
      if (subBtn) {
        this.#navigateSettings(wrapper, subBtn.getAttribute("data-submenu")!);
        return;
      }
      const backBtn = target.closest<HTMLElement>("[data-back]");
      if (backBtn) {
        this.#navigateSettings(wrapper, "main");
        return;
      }

      const ctl = target.closest(
        '[class*="video-"],[class*="settings-"]'
      ) as HTMLElement | null;
      if (!ctl) return;

      // Settings button toggle
      if (ctl.classList.contains("video-settings-btn")) {
        this.#toggleSettingsMenu(wrapper);
        return;
      }

      // ── Controls ──────────────────────────────────────────────────────
      if (
        ctl.classList.contains("play-pause") ||
        ctl.classList.contains("video-center-play")
      )
        this.#togglePlayPause(e);
      else if (ctl.classList.contains("volume-btn")) this.#toggleMute(e);
      else if (ctl.classList.contains("fullscreen-btn"))
        this.#toggleFullscreen(e);
      else if (ctl.classList.contains("loop-btn")) this.#toggleLoop(e);
      else if (ctl.classList.contains("pip-btn")) this.#togglePip(e);
      else if (ctl.classList.contains("theater-btn")) this.#toggleTheaterMode();
      else if (ctl.classList.contains("screenshot-btn")) this.#takeScreenshot();
      else if (ctl.classList.contains("airplay-btn")) {
        if (
          this.#videoElement &&
          (this.#videoElement as any).webkitShowPlaybackTargetPicker
        )
          (this.#videoElement as any).webkitShowPlaybackTargetPicker();
      } else if (ctl.classList.contains("miniplayer-btn"))
        this.#toggleMiniPlayer();
      else if (ctl.classList.contains("video-speed-btn"))
        this.#toggleSpeedMenu(wrapper);
      else if (ctl.classList.contains("video-quality-btn"))
        this.#toggleQualityMenu(wrapper);
      else if (ctl.classList.contains("video-subtitle-btn"))
        this.#toggleSubtitleMenu(wrapper);
      else if (ctl.classList.contains("video-more-btn"))
        this.#toggleMoreMenu(wrapper);
      else if (
        ctl.classList.contains("video-speed-option") ||
        (ctl.classList.contains("settings-option") &&
          ctl.hasAttribute("data-speed"))
      ) {
        const speed = parseFloat(ctl.getAttribute("data-speed")!);
        this.#setSpeed(speed, wrapper);
        this.#closeSpeedMenu(wrapper);
        if (this.#$settingsMenu) this.#navigateSettings(wrapper, "main");
      } else if (ctl.classList.contains("video-quality-option")) {
        const quality = ctl.getAttribute("data-quality")!;
        if (quality === "auto") this.#setAutoQuality();
        else if (this.#qualityLevels.length > 0 && !isNaN(parseInt(quality)))
          this.#setHlsQuality(parseInt(quality));
        else this.#setManualQuality(quality);
        this.#closeQualityMenu(wrapper);
        if (this.#$settingsMenu) this.#navigateSettings(wrapper, "main");
      } else if (ctl.classList.contains("video-subtitle-option")) {
        const sub = ctl.getAttribute("data-subtitle")!;
        this.#setSubtitle(sub || null);
        this.#closeSubtitleMenu(wrapper);
        if (this.#$settingsMenu) this.#navigateSettings(wrapper, "main");
      }
    });

    // Seekbar drag + mousemove (thumbnails)
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
      seekbarEl.addEventListener(
        "mousemove",
        this.#onSeekbarMouseMove as EventListener,
        { passive: true }
      );
    }

    // Volume drag
    const volEl = wrapper.querySelector(".video-volume-slider");
    if (volEl)
      volEl.addEventListener(
        "mousedown",
        this.#onVolumeMouseDown as EventListener
      );

    if (this.#videoElement)
      this.#videoElement.addEventListener("click", this.#togglePlayPause);

    this.#setupControlsInteraction(wrapper);
  }

  #setupControlsInteraction(wrapper: HTMLElement): void {
    wrapper.addEventListener("keydown", this.#handleKeyboard);
    wrapper.addEventListener("mouseenter", () => {
      if (this.#videoLoaded) { wrapper.classList.add("show-controls"); this.classList.add("show-controls"); }
    }, { passive: true });
    wrapper.addEventListener("mouseleave", () => {
      wrapper.classList.remove("show-controls"); this.classList.remove("show-controls");
      this.#closeAllMenus();
    }, { passive: true });
    wrapper.addEventListener("touchend", this.#handleTouchTap);

    // Close menus on click outside
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target as Node)) this.#closeAllMenus();
    });
  }

  // SETTINGS MENU NAVIGATION
  #toggleSettingsMenu(_wrapper: HTMLElement): void {
    if (!this.#$settingsMenu) return;
    // Build menu contents on first open (lazy init)
    this.#buildSettingsMenu(this.#getConfig());
    this.#closeAllMenus(this.#$settingsMenu);
    const isOpen = this.#$settingsMenu.classList.toggle("active");
    if (isOpen && this.#settingsCurrentPage !== "main")
      this.#navigateSettings(_wrapper, "main", false);
  }

  #navigateSettings(wrapper: HTMLElement, page: string, animate = true): void {
    if (!this.#$settingsMenu) return;
    this.#settingsCurrentPage = page;
    // Show correct page
    this.#$settingsMenu
      .querySelectorAll<HTMLElement>(".settings-page")
      .forEach((p) => {
        p.classList.toggle("active", p.getAttribute("data-page") === page);
      });
  }

  // QUALITY / SPEED / SUBTITLE MENUS
  #closeAllMenus(except?: HTMLElement | null): void {
    if (this.#$speedMenu && this.#$speedMenu !== except)
      this.#$speedMenu.classList.remove("active");
    if (this.#$qualityMenu && this.#$qualityMenu !== except)
      this.#$qualityMenu.classList.remove("active");
    if (this.#$subtitleMenu && this.#$subtitleMenu !== except)
      this.#$subtitleMenu.classList.remove("active");
    if (this.#$moreMenu && this.#$moreMenu !== except)
      this.#$moreMenu.classList.remove("active");
    if (this.#$settingsMenu && this.#$settingsMenu !== except)
      this.#$settingsMenu.classList.remove("active");
    if (this.#$moreBtn && this.#$moreMenu !== except)
      this.#$moreBtn.classList.remove("active");
  }

  #toggleSpeedMenu(wrapper: HTMLElement): void {
    this.#closeAllMenus(this.#$speedMenu);
    this.#$speedMenu?.classList.toggle("active");
  }
  #closeSpeedMenu(_wrapper: HTMLElement): void {
    this.#$speedMenu?.classList.remove("active");
  }
  #toggleQualityMenu(wrapper: HTMLElement): void {
    this.#closeAllMenus(this.#$qualityMenu);
    this.#$qualityMenu?.classList.toggle("active");
  }
  #closeQualityMenu(_wrapper: HTMLElement): void {
    this.#$qualityMenu?.classList.remove("active");
  }
  #toggleSubtitleMenu(wrapper: HTMLElement): void {
    this.#closeAllMenus(this.#$subtitleMenu);
    this.#$subtitleMenu?.classList.toggle("active");
  }
  #closeSubtitleMenu(_wrapper: HTMLElement): void {
    this.#$subtitleMenu?.classList.remove("active");
  }
  #toggleMoreMenu(wrapper: HTMLElement): void {
    this.#closeAllMenus(this.#$moreMenu);
    const isActive = this.#$moreMenu?.classList.toggle("active");
    if (this.#$moreBtn) this.#$moreBtn.classList.toggle("active", isActive);
  }

  // POPULATE MENUS
  #populateQualityMenu(): void {
    if (!this.#$qualityMenu) return;
    this.#$qualityMenu.innerHTML = "";
    const labels = [
      ...new Set(this.#manualQualities.map((q) => q.label)),
    ].sort();
    if (labels.length === 0 && this.#qualityLevels.length === 0) {
      const opt = document.createElement("button");
      opt.className = "video-quality-option";
      opt.disabled = true;
      opt.textContent = "No qualities available";
      opt.setAttribute("part", "quality-option");
      this.#$qualityMenu.appendChild(opt);
      return;
    }
    const auto = document.createElement("button");
    auto.className = `video-quality-option ${
      !this.#currentQualityLabel ? "active" : ""
    }`;
    auto.setAttribute("data-quality", "auto");
    auto.textContent = "Auto";
    auto.setAttribute("part", "quality-option");
    auto.addEventListener("click", () => this.#setAutoQuality());
    this.#$qualityMenu.appendChild(auto);
    this.#qualityLevels.forEach((level, index) => {
      const lbl = level.height ? `${level.height}` : `Level ${index + 1}`;
      const opt = document.createElement("button");
      opt.className = `video-quality-option ${
        this.#currentQualityIndex === index ? "active" : ""
      }`;
      opt.setAttribute("data-quality", index.toString());
      opt.textContent = lbl;
      opt.setAttribute("part", "quality-option");
      opt.addEventListener("click", () => this.#setHlsQuality(index));
      this.#$qualityMenu?.appendChild(opt);
    });
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

  #populateSubtitleMenu(wrapper: HTMLElement): void {
    const menu = wrapper.querySelector(".video-subtitle-menu");
    if (!menu) return;
    menu.innerHTML = "";
    const off = document.createElement("button");
    off.className = `video-subtitle-option ${
      !this.#activeSubtitle ? "active" : ""
    }`;
    off.setAttribute("data-subtitle", "");
    off.textContent = "Off";
    off.setAttribute("part", "subtitle-option");
    off.addEventListener("click", () => this.#setSubtitle(null));
    menu.appendChild(off);
    this.#subtitlesTracks.forEach((track) => {
      const opt = document.createElement("button");
      opt.className = `video-subtitle-option ${
        this.#activeSubtitle === track.label ? "active" : ""
      }`;
      opt.setAttribute("data-subtitle", track.label);
      opt.textContent = track.label || "Subtitles";
      opt.setAttribute("part", "subtitle-option");
      opt.addEventListener("click", () => this.#setSubtitle(track.label));
      menu.appendChild(opt);
    });
  }

  // FRAME LOOP
  #startVideoFrameLoop(): void {
    const video = this.#videoElement;
    if (!video) return;
    const useRvfc = "requestVideoFrameCallback" in video;
    const loop = () => {
      if (!this.#videoElement || !this.#isPlaying) return; // stop if paused/destroyed
      this.#updateSeekbar();
      this.#updateTimeDisplay();
      if (useRvfc) {
        this.#rafId = (video as any).requestVideoFrameCallback(
          loop
        ) as unknown as number;
      } else {
        this.#rafId = requestAnimationFrame(loop);
      }
    };
    // kick off
    if (useRvfc) {
      this.#rafId = (video as any).requestVideoFrameCallback(
        loop
      ) as unknown as number;
    } else {
      this.#rafId = requestAnimationFrame(loop);
    }
  }

  #cancelFrameLoop(): void {
    if (this.#rafId === null) return;
    const video = this.#videoElement;
    if (video && "requestVideoFrameCallback" in video) {
      (video as any).cancelVideoFrameCallback(this.#rafId);
    } else {
      cancelAnimationFrame(this.#rafId);
    }
    this.#rafId = null;
  }

  // HLS
  async #initHls(): Promise<void> {
    if (!this.#videoElement) return;
    const src = this.#videoElement.currentSrc || this.#videoElement.src;
    if (!/\.m3u8($|\?)/i.test(src)) return;
    try {
      const mod = await import("hls.js");
      const Hls = mod.default;
      if (!Hls.isSupported()) {
        console.warn("ShadowPlyr: HLS not supported in this browser.");
        return;
      }
      this.#setupHls(mod, src);
    } catch {
      console.warn(
        "ShadowPlyr: HLS stream detected but hls.js is not installed. Run `npm install hls.js`."
      );
    }
  }

  #setupHls(hlsModule: any, src: string): void {
    const Hls = hlsModule.default;
    this.#hls = new Hls({ enableWorker: true, lowLatencyMode: true });
    this.#hls.loadSource(src);
    this.#hls.attachMedia(this.#videoElement);
    this.#hls.on(hlsModule.Events.MANIFEST_PARSED, () => {
      this.#qualityLevels = this.#hls.levels;
      this.#populateQualityMenu();
    });
  }

  // THUMBNAIL PREVIEW
  #initThumbnailVideo(): void {
    const config = this.#getConfig();
    if (!config.showThumbnails) return;
    if (config.thumbnailsVtt) {
      this.#parseThumbnailVtt(config.thumbnailsVtt);
      return;
    }
    // Create hidden video clone for live frame capture
    const src = this.#videoElement?.currentSrc || this.#videoElement?.src;
    if (!src || !this.#isValidMediaUrl(src)) return;
    if (this.#thumbnailVideo) return; // already created
    const vid = document.createElement("video");
    vid.preload = "metadata";
    vid.muted = true;
    vid.style.cssText =
      "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;top:0;left:0;";
    vid.src = src;
    vid.load();
    this.#thumbnailVideo = vid;
    this.#$wrapper?.appendChild(vid);
  }

  async #parseThumbnailVtt(url: string): Promise<void> {
    try {
      const res = await fetch(url);
      const text = await res.text();
      this.#thumbnailVttCues = this.#parseVttCues(text);
    } catch {
      console.warn("ShadowPlyr: Failed to fetch thumbnails VTT:", url);
    }
  }

  #parseVttCues(vttText: string): ThumbnailVttCue[] {
    const cues: ThumbnailVttCue[] = [];
    const lines = vttText.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const tm = lines[i]
        .trim()
        .match(
          /^(\d{2}:\d{2}:\d{2}[.,]\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}[.,]\d{3})/
        );
      if (tm) {
        const start = this.#vttTimeToSec(tm[1]);
        const end = this.#vttTimeToSec(tm[2]);
        const content = (lines[++i] || "").trim();
        const xywh = content.match(/#xywh=(\d+),(\d+),(\d+),(\d+)/);
        const url = content.split("#")[0];
        if (url)
          cues.push({
            start,
            end,
            url,
            x: xywh ? +xywh[1] : 0,
            y: xywh ? +xywh[2] : 0,
            w: xywh ? +xywh[3] : 160,
            h: xywh ? +xywh[4] : 90,
          });
      }
    }
    return cues;
  }

  #vttTimeToSec(t: string): number {
    const [h, m, s] = t.split(":");
    return +h * 3600 + +m * 60 + parseFloat(s.replace(",", "."));
  }

  /** Called on seekbar mousemove / drag; updates the floating thumbnail preview */
  #updateThumbnailAt(percent: number, seekbar: Element): void {
    if (!this.#getConfig().showThumbnails) return;
    const preview = this.#$thumbnailPreview;
    const canvas = this.#$thumbnailCanvas;
    const label = this.#$thumbnailLabel;
    if (!preview || !canvas || !label) return;

    const duration = this.#videoElement?.duration || 0;
    if (!duration) return;
    const time = Math.max(0, Math.min(1, percent)) * duration;
    label.textContent = this.#formatTime(time);

    // Position preview
    const rect = (seekbar as HTMLElement).offsetWidth;
    const pos = Math.max(80, Math.min(rect - 80, percent * rect));
    preview.style.left = pos + "px";

    // VTT cue lookup
    if (this.#thumbnailVttCues.length > 0) {
      const cue =
        this.#thumbnailVttCues.find((c) => time >= c.start && time <= c.end) ??
        this.#thumbnailVttCues[this.#thumbnailVttCues.length - 1];
      if (cue) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          canvas
            .getContext("2d")
            ?.drawImage(img, cue.x, cue.y, cue.w, cue.h, 0, 0, 160, 90);
        };
        img.src = cue.url;
      }
      return;
    }

    // Hidden video frame capture
    if (this.#thumbnailVideo && this.#thumbnailVideo.readyState >= 1) {
      if (this.#thumbnailRAF) cancelAnimationFrame(this.#thumbnailRAF);
      this.#thumbnailRAF = requestAnimationFrame(() => {
        const vid = this.#thumbnailVideo!;
        vid.currentTime = time;
        vid.addEventListener(
          "seeked",
          () => {
            canvas.getContext("2d")?.drawImage(vid, 0, 0, 160, 90);
          },
          { once: true }
        );
      });
    }
  }

  // UI UPDATE METHODS
  #updateSeekbar(): void {
    const v = this.#videoElement;
    if (!v || !v.duration) return;
    // During drag show cursor position instantly; otherwise track actual playback position
    const pct = this.#isDraggingSeekbar
      ? this.#dragPercent
      : v.currentTime / v.duration;
    if (this.#$seekbarFill)
      this.#$seekbarFill.style.transform = `scaleX(${pct})`;
    if (this.#$seekbarHandle) this.#$seekbarHandle.style.left = `${pct * 100}%`;
    if (this.#$seekbar)
      this.#$seekbar.setAttribute(
        "aria-valuenow",
        Math.round(pct * 100).toString()
      );
    this.#updateTimeDisplay();
  }

  #updateTimeDisplay(): void {
    if (!this.#$timeDisplay || !this.#videoElement) return;
    const dur = this.#videoElement.duration;
    // During drag, show the drag position time so it matches the seekbar thumb
    const cur =
      this.#isDraggingSeekbar && this.#dragPercent >= 0
        ? dur * this.#dragPercent
        : this.#videoElement.currentTime;
    this.#$timeDisplay.textContent = `${this.#formatTime(
      cur
    )} / ${this.#formatTime(dur)}`;
  }

  #formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
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
        const pt = el.querySelector(".play-tooltip") as HTMLElement;
        const pa = el.querySelector(".pause-tooltip") as HTMLElement;
        if (pt) pt.style.display = isPlaying ? "none" : "block";
        if (pa) pa.style.display = isPlaying ? "block" : "none";
      });
  }

  #updateVolumeIcon(isMuted: boolean, wrapper?: HTMLElement): void {
    if (!wrapper) wrapper = this.#$wrapper!;
    const btn = wrapper.querySelector(".volume-btn");
    if (!btn) return;
    const v = btn.querySelector(".volume-icon") as HTMLElement;
    const m = btn.querySelector(".muted-icon") as HTMLElement;
    if (v) v.style.display = isMuted ? "none" : "block";
    if (m) m.style.display = isMuted ? "block" : "none";
    btn.setAttribute("aria-label", isMuted ? "Unmute" : "Mute");
    const vt = btn.querySelector(".volume-tooltip") as HTMLElement;
    const mt = btn.querySelector(".muted-tooltip") as HTMLElement;
    if (vt) vt.style.display = isMuted ? "none" : "block";
    if (mt) mt.style.display = isMuted ? "block" : "none";
  }

  #updateFullscreenIcon(isFullscreen: boolean, wrapper?: HTMLElement): void {
    if (!wrapper) wrapper = this.#$wrapper!;
    const btn = wrapper.querySelector(".fullscreen-btn");
    if (!btn) return;
    const fi = btn.querySelector(".fullscreen-icon") as HTMLElement;
    const ei = btn.querySelector(".exit-fullscreen-icon") as HTMLElement;
    if (fi) fi.style.display = isFullscreen ? "none" : "block";
    if (ei) ei.style.display = isFullscreen ? "block" : "none";
    btn.setAttribute(
      "aria-label",
      isFullscreen ? "Exit fullscreen" : "Fullscreen"
    );
    const ft = btn.querySelector(".fullscreen-tooltip") as HTMLElement;
    const et = btn.querySelector(".exit-fullscreen-tooltip") as HTMLElement;
    if (ft) ft.style.display = isFullscreen ? "none" : "block";
    if (et) et.style.display = isFullscreen ? "block" : "none";
  }

  #updateLoopIcon(isLoop: boolean): void {
    const icons = this.#getIcons();
    // Update loop button wherever it appears (main bar or responsive kabob clone)
    this.#$wrapper?.querySelectorAll(".loop-btn").forEach((btn) => {
      // span class is "loop-icon" — set by #mkBtn (cls "loop-btn" → strip "-btn" → "loop-icon")
      const ic = btn.querySelector(
        ".loop-icon, span[aria-hidden]"
      ) as HTMLElement | null;
      if (ic) {
        ic.innerHTML = "";
        ic.appendChild(
          this.#createSVGFromString(isLoop ? icons.loop : icons.loopOnce)
        );
      }
      btn.setAttribute("aria-label", isLoop ? "Disable loop" : "Enable loop");
      const on = btn.querySelector(".loop-on-tooltip") as HTMLElement | null;
      const off = btn.querySelector(".loop-off-tooltip") as HTMLElement | null;
      if (on) on.style.display = isLoop ? "block" : "none";
      if (off) off.style.display = isLoop ? "none" : "block";
    });
  }

  #updatePipIcon(isPip: boolean): void {
    const btn = this.#$wrapper?.querySelector(".pip-btn");
    if (btn) { btn.classList.toggle("active", isPip); this.classList.toggle("active", isPip); }
  }

  #updateVolumeSlider(volume: number, _wrapper?: HTMLElement): void {
    if (this.#$volumeProgress)
      this.#$volumeProgress.style.width = volume * 100 + "%";
  }

  #updateQualityText(): void {
    const val = this.#currentQualityLabel
      ? this.#currentQualityLabel + "p"
      : "Auto";
    if (this.#$qualityText) this.#$qualityText.textContent = val;
    if (this.#$settingsQualityValue)
      this.#$settingsQualityValue.textContent = val;
  }

  #updateSubtitleText(): void {
    const val = this.#activeSubtitle ? "On" : "Off";
    if (this.#$subtitleText)
      this.#$subtitleText.textContent = this.#activeSubtitle ? "CC" : "Off";
    if (this.#$settingsSubtitleValue)
      this.#$settingsSubtitleValue.textContent = val;
  }

  // RESPONSIVE
  #setupResponsive(wrapper: HTMLElement): void {
    if (!this.#resizeObserver) {
      this.#resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries)
          this.#updateResponsiveMenu(wrapper, entry.contentRect.width);
      });
    }
    this.#resizeObserver.observe(wrapper);
    this.#populateMoreMenu(wrapper);
  }

  #updateResponsiveMenu(wrapper: HTMLElement, width: number): void {
    // When the unified settings menu is active there is no kabab button — nothing to do.
    if (this.#getConfig().showSettings) return;

    const threshold = 500;
    const selectors = [
      ".loop-btn",
      ".pip-btn",
      ".video-subtitle-control",
      ".video-quality-control",
      ".video-speed-control",
      ".video-settings-control",
      ".theater-btn",
      ".screenshot-btn",
      ".airplay-btn",
      ".miniplayer-btn",
    ];
    const moreMenu = wrapper.querySelector(".video-more-menu");
    const moreBtn = wrapper.querySelector(".video-more-btn");
    if (!moreMenu || !moreBtn) return;
    if (width < threshold) {
      selectors.forEach((sel) => {
        const el = wrapper.querySelector(sel);
        if (el && !el.classList.contains("responsive-hidden")) {
          el.classList.add("responsive-hidden");
          const clone = el.cloneNode(true) as HTMLElement;
          clone.classList.remove("responsive-hidden");
          clone.classList.add("video-more-option");
          clone.addEventListener("click", (e) => {
            e.stopPropagation();
            (wrapper.querySelector(sel) as HTMLElement)?.click();
          });
          moreMenu.appendChild(clone);
        }
      });
      moreBtn.classList.remove("responsive-hidden");
    } else {
      selectors.forEach((sel) =>
        wrapper.querySelector(sel)?.classList.remove("responsive-hidden")
      );
      moreBtn.classList.add("responsive-hidden");
      moreMenu.innerHTML = "";
    }
  }

  #populateMoreMenu(_wrapper: HTMLElement): void {
    /* reserved */
  }

  // MISC HELPERS
  #seekBackward(): void {
    if (this.#videoElement)
      this.#videoElement.currentTime = Math.max(
        0,
        this.#videoElement.currentTime - this.#getConfig().seekStep
      );
  }
  #seekForward(): void {
    if (this.#videoElement)
      this.#videoElement.currentTime = Math.min(
        this.#videoElement.duration,
        this.#videoElement.currentTime + this.#getConfig().seekStep
      );
  }
  #adjustVolume(delta: number): void { if (this.#videoElement) this.#setVolume(this.#videoElement.volume + delta); }

  #enablePerformanceMode(): void {
    if (this.#$wrapper) { this.#$wrapper.classList.add("perf-mode"); this.classList.add("perf-mode"); }
  }

  // REINITIALIZE / DESTROY
  #reinitialize(): void {
    this.#destroy();
    this.#render();
    requestAnimationFrame(() => { this.#init(); this.#setupVisibilityHandling(); });
  }

  #destroy(): void {
    this.#removeVisibilityHandling();
    if (this.#observer) { this.#observer.disconnect(); this.#observer = null; }
    if (this.#$wrapper) {
      this.#$wrapper.removeEventListener("keydown", this.#handleKeyboard);
      document.removeEventListener("click", () => this.#closeAllMenus());
    }
    if (this.#videoElement) {
      this.#videoElement.pause();
      this.#videoElement.removeEventListener("click", this.#togglePlayPause);
      this.#videoElement.removeEventListener("enterpictureinpicture", this.#onPipEnter);
      this.#videoElement.removeEventListener("leavepictureinpicture",  this.#onPipLeave);
      this.#videoElement.src = ""; this.#videoElement.load();
      this.#videoElement = null;
    }
    // Thumbnail cleanup
    if (this.#thumbnailVideo) {
      this.#thumbnailVideo.src = "";
      this.#thumbnailVideo = null;
    }
    if (this.#thumbnailRAF) {
      cancelAnimationFrame(this.#thumbnailRAF);
      this.#thumbnailRAF = null;
    }
    this.#thumbnailVttCues = [];

    // Clean up mini-player drag listeners
    this.#detachMiniPlayerDrag();
    this.#miniPlayerActive = false;

    this.classList.remove(
      "video-loading",
      "video-loaded",
      "is-playing",
      "poster-visible",
      "show-controls",
      "theater-mode",
      "mini-player",
      "has-error",
      "has-custom-loader"
    );
    this.#cancelFrameLoop();
    if (this.#hls) {
      this.#hls.destroy();
      this.#hls = null;
    }
    this.#isInitialized = false;
    this.#isPlaying = false;
    this.#videoLoaded = false;
    this.#loadGeneration++; // invalidate any in-flight async callbacks from previous load
    this.#wasPlayingBeforeHidden = false;
    this.#hasPlayedOnce = false;
    this.#posterVisible = this.#hasPoster;
    this.#currentSpeed = 1;
    this.#hasError = false;
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
    this.#$settingsMenu = null;
    this.#$settingsQualityValue = null;
    this.#$settingsSpeedValue = null;
    this.#$settingsSubtitleValue = null;
    this.#$thumbnailPreview = null;
    this.#$thumbnailCanvas = null;
    this.#$thumbnailLabel = null;
    this.#configCache = null;
    this.#qualityLevels = [];
    this.#manualQualities = [];
    document.removeEventListener(
      "webkitfullscreenchange",
      this.#boundFullscreenChange
    );
  }

  #emit(name: string, detail: Record<string, any> = {}): void {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }
}

// Auto-define
if (!customElements.get("shadow-plyr")) customElements.define("shadow-plyr", ShadowPlyr);

declare global {
  interface HTMLElementTagNameMap { "shadow-plyr": ShadowPlyr; }
}
export {};