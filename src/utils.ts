/**
 * Throttle function execution.
 * @param fn  Function to throttle
 * @param wait Milliseconds to wait between invocations
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

/**
 * Lightweight SVG / HTML sanitizer that strips the most dangerous
 * vectors (inline event handlers, script tags, javascript: URLs).
 * Used in place of the ~45 KB DOMPurify dependency for user-supplied
 * icon and loader strings.
 */
export function sanitizeSvg(input: string): string {
  if (!input || typeof input !== "string") return "";
  let previous: string;
  let result = input;
  do {
    previous = result;
    result = result
      // Remove <script> blocks entirely (allow whitespace in closing tag)
      .replace(/<script[\s\S]*?<\/\s*script\s*>/gi, "")
      // Strip inline event handlers  on*="…" / on*='…' / on*=value
      .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>/]+)/gi, "")
      // Strip javascript: in href / xlink:href / src
      .replace(/(href|src|xlink:href)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, "")
      // Strip <base> tags (can redirect relative URLs)
      .replace(/<base[\s\S]*?>/gi, "");
  } while (result !== previous);
  return result;
}