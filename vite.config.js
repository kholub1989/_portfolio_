import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The whole app is one page with one compiled CSS file (18KB raw / 3.3KB
// gzip) - Vite's default external <link rel="stylesheet"> for it is
// render-blocking with no upside here, since nearly everything on the page
// is above the fold anyway (no real "non-critical" CSS to defer). Inlining
// it as a <style> tag removes both the extra request and the
// render-blocking flag, and is strictly faster to first paint than the
// external link, not just equivalent - unlike deferring, there's no FOUC
// risk either.
function inlineCssPlugin() {
  return {
    name: "inline-css",
    enforce: "post",
    apply: "build",
    transformIndexHtml(html, { bundle }) {
      if (!bundle) return html;
      let output = html;
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === "asset" && fileName.endsWith(".css")) {
          output = output.replace(
            /<link[^>]+href="[^"]+\.css"[^>]*>/i,
            `<style>${chunk.source}</style>`
          );
          delete bundle[fileName];
        }
      }
      return output;
    },
  };
}

export default defineConfig({
  plugins: [react(), inlineCssPlugin()],
  server: { port: 3000 },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: { loader: { ".js": "jsx" } },
  },
  build: { outDir: "build" },
  test: {
    environment: "jsdom",
    globals: true,
    css: true,
    setupFiles: "./src/setupTests.js",
  },
});
