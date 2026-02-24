export declare class ShadowPlyr extends HTMLElement {
    #private;
    constructor();
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    play(): void;
    pause(): void;
    mute(): void;
    unmute(): void;
    seek(seconds: number): void;
    playVideo(): void;
    pauseVideo(silent?: boolean): void;
}
