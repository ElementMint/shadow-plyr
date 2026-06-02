/**
 * YouTubeProvider
 *
 * Wraps the YouTube IFrame API into an interface that shadow-plyr can drive
 * identically to an HTML5 <video> element.  The host (ShadowPlyr) only calls
 * the methods/properties listed in the public surface below.
 *
 * YouTube IFrame API limitations (enforced by YouTube, cannot be worked around):
 *  – Volume control is ignored on iOS (autoplay policy).
 *  – PiP is not supported.
 *  – Playback speeds are limited to: 0.25, 0.5, 1, 1.25, 1.5, 2.
 *  – Download is not available.
 */

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export type YTEventCallback = (data: {
  type: string;
  currentTime?: number;
  duration?: number;
  volume?: number;
  muted?: boolean;
  code?: number;
}) => void;

/** Extract a YouTube video ID from a URL or bare ID string. */
export function extractYouTubeId(src: string): string | null {
  if (!src) return null;
  // Already a bare ID (11 chars, no slashes/dots)
  if (/^[A-Za-z0-9_-]{11}$/.test(src.trim())) return src.trim();
  try {
    const url = new URL(src);
    // youtu.be/<id>
    if (url.hostname === "youtu.be") return url.pathname.slice(1).split("?")[0] || null;
    // youtube.com/watch?v=<id>
    const v = url.searchParams.get("v");
    if (v) return v;
    // youtube.com/embed/<id>  or  youtube.com/shorts/<id>
    const parts = url.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "v");
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1];
  } catch { /* relative or malformed URL — not YouTube */ }
  return null;
}

/** Returns true when src looks like a YouTube URL or a bare 11-char video ID. */
export function isYouTubeSource(src: string | null | undefined): boolean {
  if (!src) return false;
  if (/^[A-Za-z0-9_-]{11}$/.test(src.trim())) return false; // bare IDs need explicit type="youtube"
  try {
    const url = new URL(src);
    return (
      url.hostname === "youtu.be" ||
      url.hostname === "www.youtube.com" ||
      url.hostname === "youtube.com" ||
      url.hostname === "www.youtube-nocookie.com" ||
      url.hostname === "youtube-nocookie.com"
    );
  } catch { return false; }
}

/** YouTube player state numbers as returned by the IFrame API. */
const YT_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

/** Thumbnail quality identifiers, largest to smallest. */
const YT_THUMB_QUALITIES = ["maxresdefault", "sddefault", "hqdefault", "mqdefault", "default"] as const;

/** Returns the best available thumbnail URL for a given video ID. */
export function youTubeThumbnailUrl(videoId: string, quality: typeof YT_THUMB_QUALITIES[number] = "hqdefault"): string {
  return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

let ytApiLoading = false;
let ytApiReady = false;
const ytReadyCallbacks: Array<() => void> = [];

/** Load the YouTube IFrame API script once across all provider instances. */
function ensureYTApi(onReady: () => void): void {
  if (ytApiReady) { onReady(); return; }
  ytReadyCallbacks.push(onReady);
  if (ytApiLoading) return;
  ytApiLoading = true;

  const prev = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    if (prev) prev();
    ytApiReady = true;
    ytApiLoading = false;
    ytReadyCallbacks.forEach((cb) => cb());
    ytReadyCallbacks.length = 0;
  };

  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  script.async = true;
  document.head.appendChild(script);
}

export interface YouTubeProviderOptions {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** If true, use youtube-nocookie.com domain. Default: true. */
  privacyEnhanced?: boolean;
  /** Start time in seconds. */
  startTime?: number;
  onEvent: YTEventCallback;
}

/**
 * Manages one YouTube IFrame player instance.
 * Call destroy() when the host element is disconnected or reinitialised.
 */
export class YouTubeProvider {
  readonly container: HTMLElement;
  private player: any = null;
  private _currentTime = 0;
  private _duration = 0;
  private _volume = 1;
  private _muted = false;
  private _paused = true;
  private _ended = false;
  private _loop = false;
  private _playbackRate = 1;
  private _ready = false;
  private _destroyed = false;
  private _rafId: number | null = null;
  private _opts: YouTubeProviderOptions;
  // seek requested before player is ready
  private _pendingSeek: number | null = null;

  constructor(mountInto: HTMLElement, opts: YouTubeProviderOptions) {
    this._opts = opts;
    this._muted = !!opts.muted;
    this._loop = !!opts.loop;

    // Build the container div that YT.Player replaces with an <iframe>
    this.container = document.createElement("div");
    this.container.className = "yt-player-container";
    this.container.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;";
    const inner = document.createElement("div");
    inner.className = "yt-player-inner";
    this.container.appendChild(inner);
    mountInto.appendChild(this.container);

    ensureYTApi(() => this._createPlayer(inner));
  }

  // ── Internal ────────────────────────────────────────────────────────────────

  private _createPlayer(el: HTMLElement): void {
    if (this._destroyed) return;
    const host = this._opts.privacyEnhanced !== false ? "www.youtube-nocookie.com" : "www.youtube.com";
    this.player = new window.YT.Player(el, {
      host: `https://${host}`,
      videoId: this._opts.videoId,
      playerVars: {
        autoplay: this._opts.autoplay ? 1 : 0,
        mute: this._opts.muted ? 1 : 0,
        loop: 0, // we manage loop manually to get proper ended event
        controls: 0,         // hide YouTube native controls
        disablekb: 1,        // disable YouTube keyboard shortcuts (we handle them)
        fs: 0,               // hide YouTube fullscreen button
        iv_load_policy: 3,   // hide annotations
        showinfo: 0,         // hide video title/uploader info bar
        modestbranding: 1,
        rel: 0,              // don't show related videos
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin,
        start: this._opts.startTime ?? 0,
      },
      events: {
        onReady:       (e: any) => this._onReady(e),
        onStateChange: (e: any) => this._onStateChange(e),
        onError:       (e: any) => this._onError(e),
      },
    });
  }

  private _onReady(_e: any): void {
    if (this._destroyed) return;
    this._ready = true;
    this._duration = this.player.getDuration() || 0;
    // Apply pre-ready mute state
    if (this._muted) this.player.mute(); else this.player.unMute();
    this.player.setVolume(Math.round(this._volume * 100));
    if (this._pendingSeek !== null) {
      this.player.seekTo(this._pendingSeek, true);
      this._pendingSeek = null;
    }
    // Emit ready so host can finalise UI
    this._opts.onEvent({
      type: "yt-ready",
      duration: this._duration,
    });
    if (this._opts.autoplay) this.player.playVideo();
  }

  private _onStateChange(e: any): void {
    if (this._destroyed) return;
    const state: number = e.data;
    this._duration = this.player.getDuration() || this._duration;

    if (state === YT_STATE.PLAYING) {
      this._paused = false;
      this._ended = false;
      this._startRaf();
      this._opts.onEvent({ type: "yt-playing", currentTime: this.currentTime, duration: this._duration });
    } else if (state === YT_STATE.PAUSED) {
      this._paused = true;
      this._stopRaf();
      this._currentTime = this.player.getCurrentTime() || this._currentTime;
      this._opts.onEvent({ type: "yt-paused", currentTime: this._currentTime });
    } else if (state === YT_STATE.ENDED) {
      this._paused = true;
      this._ended = true;
      this._stopRaf();
      if (this._loop) {
        this.player.seekTo(0, true);
        this.player.playVideo();
        return;
      }
      this._opts.onEvent({ type: "yt-ended", duration: this._duration });
    } else if (state === YT_STATE.BUFFERING) {
      this._opts.onEvent({ type: "yt-buffering" });
    }
  }

  private _onError(e: any): void {
    this._opts.onEvent({ type: "yt-error", code: e.data });
  }

  private _startRaf(): void {
    if (this._rafId !== null) return;
    const tick = () => {
      if (!this._destroyed && !this._paused && this.player && this._ready) {
        this._currentTime = this.player.getCurrentTime() || this._currentTime;
        const vol = this.player.getVolume?.() ?? (this._volume * 100);
        this._volume = vol / 100;
        this._muted = !!this.player.isMuted?.();
        this._rafId = requestAnimationFrame(tick);
      } else {
        this._rafId = null;
      }
    };
    this._rafId = requestAnimationFrame(tick);
  }

  private _stopRaf(): void {
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  // ── Public interface (mirrors HTMLVideoElement surface) ─────────────────────

  get currentTime(): number {
    if (this._ready && this.player?.getCurrentTime) {
      try { return this.player.getCurrentTime() as number; } catch { /**/ }
    }
    return this._currentTime;
  }

  set currentTime(t: number) {
    this._currentTime = t;
    if (this._ready && this.player?.seekTo) {
      this.player.seekTo(t, true);
      this._opts.onEvent({ type: "yt-seeking", currentTime: t });
      // Emit seeked on next frame (YT has no seeked event)
      requestAnimationFrame(() => {
        if (!this._destroyed)
          this._opts.onEvent({ type: "yt-seeked", currentTime: t });
      });
    } else {
      this._pendingSeek = t;
    }
  }

  get duration(): number { return this._duration; }

  get paused(): boolean { return this._paused; }
  get ended(): boolean  { return this._ended; }

  get muted(): boolean { return this._muted; }
  set muted(v: boolean) {
    this._muted = v;
    if (this._ready && this.player) {
      if (v) this.player.mute(); else this.player.unMute();
      this._opts.onEvent({ type: "yt-volumechange", volume: this._volume, muted: v });
    }
  }

  get volume(): number { return this._volume; }
  set volume(v: number) {
    this._volume = Math.max(0, Math.min(1, v));
    this._muted = this._volume === 0;
    if (this._ready && this.player) {
      this.player.setVolume(Math.round(this._volume * 100));
      if (this._muted) this.player.mute(); else this.player.unMute();
      this._opts.onEvent({ type: "yt-volumechange", volume: this._volume, muted: this._muted });
    }
  }

  get loop(): boolean { return this._loop; }
  set loop(v: boolean) { this._loop = v; }

  get playbackRate(): number { return this._playbackRate; }
  set playbackRate(r: number) {
    // Clamp to YouTube-allowed speeds
    const allowed = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const clamped = allowed.reduce((prev, cur) =>
      Math.abs(cur - r) < Math.abs(prev - r) ? cur : prev
    );
    this._playbackRate = clamped;
    if (this._ready && this.player?.setPlaybackRate) {
      this.player.setPlaybackRate(clamped);
    }
  }

  get readyState(): number { return this._ready ? 4 : 0; }
  get networkState(): number { return 0; }
  get videoWidth(): number {
    try { return (this.player?.getIframe?.()?.videoWidth as number) || 1280; } catch { return 1280; }
  }
  get videoHeight(): number {
    try { return (this.player?.getIframe?.()?.videoHeight as number) || 720; } catch { return 720; }
  }

  play(): Promise<void> {
    if (this._ready && this.player?.playVideo) {
      this.player.playVideo();
    }
    return Promise.resolve();
  }

  pause(): void {
    if (this._ready && this.player?.pauseVideo) {
      this.player.pauseVideo();
    }
  }

  /** Clean up the YT player and remove the DOM container. */
  destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._stopRaf();
    try {
      if (this.player?.destroy) this.player.destroy();
    } catch { /**/ }
    this.player = null;
    if (this.container.parentNode) this.container.parentNode.removeChild(this.container);
  }

  /**
   * Get the IFrame element (used for fullscreen requests on some browsers).
   * Returns null before the player is ready.
   */
  getIframe(): HTMLIFrameElement | null {
    try { return this.player?.getIframe?.() ?? null; } catch { return null; }
  }

  /** Get best YouTube thumbnail URL for this video. */
  static thumbnailUrl(videoId: string): string {
    return youTubeThumbnailUrl(videoId, "hqdefault");
  }
}
