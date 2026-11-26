// The sitemap is generated from the same page lists the site is built from, so a new page can't be forgotten.
// Each URL names its twins in the other languages (hreflang) and when its words last changed (lastmod).
import type { APIRoute } from "astro";
import { langs, homePath, type Lang } from "../i18n/strings";
import { workSlugs } from "../i18n/home";
import { work } from "../i18n/work";
import { homeModified, caseModified } from "../lib/lastmod";

const SITE = "https://dominiknagy.dev";
type Group = { paths: Record<Lang, string>; lastmod: string };

export const GET: APIRoute = () => {
  const groups: Group[] = [
    { paths: homePath, lastmod: homeModified() },
    ...work.en.map((s) => ({ paths: Object.fromEntries(langs.map((l) => [l, workSlugs[l][s.key]])) as Record<Lang, string>, lastmod: caseModified() })),
  ];
  const urls = groups.flatMap(({ paths, lastmod }) => {
    const alts = [...langs.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${paths[l]}"/>`),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${paths.en}"/>`].join("");
    return langs.map((l) => `  <url><loc>${SITE}${paths[l]}</loc><lastmod>${lastmod}</lastmod>${alts}</url>`);
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
