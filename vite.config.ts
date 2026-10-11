import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { FAQS } from "./src/features/marketing/content";
import { INDEXED_PAGES, jsonLd, renderHead, renderSitemap } from "./src/routes/seo";

/**
 * Writes one HTML file per public page, plus the sitemap, after the build.
 *
 * The app is a single page, so without this every address is served the home page's
 * title, description and preview tags until JavaScript runs, and a link shared in a
 * chat app never runs JavaScript. Each file is the normal app shell with that page's
 * own head, so the site still boots exactly the same way. The host serves a real file
 * before it falls back to index.html, so these are picked up without extra routing.
 */
function seoPages(): Plugin {
  let outDir = "dist";
  return {
    name: "dolancer-seo-pages",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const shell = readFileSync(join(outDir, "index.html"), "utf8");
      const faq = jsonLd({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      });

      for (const page of INDEXED_PAGES) {
        let html = renderHead(shell, page);
        if (page.path === "/how-it-works") html = html.replace("</head>", `  ${faq}\n  </head>`);
        const file = join(outDir, page.path === "/" ? "" : page.path, "index.html");
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, html);
      }
      writeFileSync(join(outDir, "sitemap.xml"), renderSitemap(new Date().toISOString().slice(0, 10)));
    },
  };
}

// Tailwind v4 runs through its own Vite plugin. There is deliberately no
// postcss.config.js: the legacy PostCSS pipeline is not used anywhere here.
export default defineConfig({
  plugins: [react(), tailwindcss(), seoPages()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["localhost", "127.0.0.1", ".vercel.app"],
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        // Vendor code changes far less often than app code, so splitting it keeps
        // the cacheable chunk stable across deploys.
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) return "react";
          // The whole client, not just its entry file: auth, realtime, storage and postgrest.
          if (/node_modules\/(@supabase|iceberg-js)\//.test(id)) return "supabase";
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return "motion";
          if (id.includes("node_modules/@tanstack/")) return "query";
          return undefined;
        },
      },
    },
  },
});
