/**
 * Prefix a /public path with the deploy base path (e.g. /ruth-portfolio on GitHub Pages).
 * Next adds the base path to its own routes, but not to plain <img> sources.
 */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
}
