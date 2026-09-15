import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// Tailwind v4 runs through its own Vite plugin. There is deliberately no
// postcss.config.js: the legacy PostCSS pipeline is not used anywhere here.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Vendor code changes far less often than app code, so splitting it keeps
        // the cacheable chunk stable across deploys.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          query: ["@tanstack/react-query"],
        },
      },
    },
  },
});
