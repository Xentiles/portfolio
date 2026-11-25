// @ts-check
import { defineConfig } from "astro/config";

// English lives at the root, Swedish under /sv/. Each page names its twin for search engines.
export default defineConfig({
  site: "https://dominiknagy.dev",
  trailingSlash: "always",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "sv"],
    routing: { prefixDefaultLocale: false },
  },
});
