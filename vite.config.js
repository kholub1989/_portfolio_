import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  define: {
    // use-dark-mode falls back to the Node `global` object, which
    // CRA's webpack polyfilled automatically; Vite doesn't.
    global: "globalThis",
  },
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
