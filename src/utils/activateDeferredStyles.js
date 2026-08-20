/**
 * Activates non-critical stylesheets (Google Fonts, animate.css) that were
 * loaded via `<link rel="preload" as="style">` in index.html so they don't
 * block first paint. Swaps each one to `rel="stylesheet"` once this module
 * runs, applying it against the resource already fetched by the preload.
 */
export function activateDeferredStyles() {
  const preloadedStyles = document.querySelectorAll('link[rel="preload"][as="style"]');
  preloadedStyles.forEach((link) => {
    link.rel = "stylesheet";
  });
}
