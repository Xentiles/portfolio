// @ts-check
import { defineConfig } from "astro/config";
import { readdir, readFile, writeFile } from "node:fs/promises";

// The ink script is served from public/ as written (readable in the repo). At build time it is minified in
// the output only, with the minifier Astro's own bundler already ships. If that minifier is ever missing,
// the build still succeeds and simply serves the readable file.
const minifyPublicScripts = {
  name: "minify-public-scripts",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      let minifySync;
      try { ({ minifySync } = await import("rolldown/utils")); } catch { logger.warn("minifier not found, scripts left as written"); return; }
      const scripts = new URL("scripts/", dir);
      for (const name of (await readdir(scripts)).filter((n) => n.endsWith(".js"))) {
        const file = new URL(name, scripts), src = await readFile(file, "utf8");
        const out = minifySync(name, src, { compress: true, mangle: true });
        if (out.errors?.length) { logger.warn(`${name} left as written: ${out.errors[0].message}`); continue; }
        await writeFile(file, out.code);
        logger.info(`${name}: ${src.length} → ${out.code.length} bytes`);
      }
    },
  },
};

// English lives at the root, Swedish under /sv/, Hungarian under /hu/. Each page names its twin for search engines.
export default defineConfig({
  site: "https://dominiknagy.dev",
  trailingSlash: "always",
  // The stylesheet is small, so it ships inside each page: the first paint no longer waits for a second request.
  build: { inlineStylesheets: "always" },
  integrations: [minifyPublicScripts],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "sv", "hu"],
    routing: { prefixDefaultLocale: false },
  },
});
