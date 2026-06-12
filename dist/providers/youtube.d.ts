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
export declare function extractYouTubeId(src: string): string | null;
export declare function isYouTubeSource(src: string | null | undefined): boolean;
declare const YT_THUMB_QUALITIES: readonly ["maxresdefault", "sddefault", "hqdefault", "mqdefault", "default"];
export declare function youTubeThumbnailUrl(videoId: string, quality?: typeof YT_THUMB_QUALITIES[number]): string;
export interface YouTubeProviderOptions {
    videoId: string;
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    privacyEnhanced?: boolean;
    startTime?: number;
    onEvent: YTEventCallback;
}
export declare class YouTubeProvider {
    readonly container: HTMLElement;
    private player;
    private _currentTime;
    private _duration;
    private _volume;
    private _muted;
    private _paused;
    private _ended;
    private _loop;
    private _playbackRate;
    private _ready;
    private _destroyed;
    private _rafId;
    private _opts;
    private _pendingSeek;
    private _pendingPlay;
    constructor(mountInto: HTMLElement, opts: YouTubeProviderOptions);
    private _createPlayer;
    private _onReady;
    private _onStateChange;
    private _onError;
    private _startRaf;
    private _stopRaf;
    get currentTime(): number;
    set currentTime(t: number);
    get duration(): number;
    get paused(): boolean;
    get ended(): boolean;
    get muted(): boolean;
    set muted(v: boolean);
    get volume(): number;
    set volume(v: number);
    get loop(): boolean;
    set loop(v: boolean);
    get playbackRate(): number;
    set playbackRate(r: number);
    get readyState(): number;
    get networkState(): number;
    get videoWidth(): number;
    get videoHeight(): number;
    play(): Promise<void>;
    pause(): void;
    destroy(): void;
    getIframe(): HTMLIFrameElement | null;
    static thumbnailUrl(videoId: string): string;
}
export {};
