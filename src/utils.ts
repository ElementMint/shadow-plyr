/**
 * Throttle function execution.
 * @param fn Function to throttle
 * @param wait Milliseconds to wait
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), wait);
      }
    };
  }