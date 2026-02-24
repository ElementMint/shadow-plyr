export declare function throttle<T extends (...args: any[]) => any>(fn: T, wait: number): (...args: Parameters<T>) => void;
