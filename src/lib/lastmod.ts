// When a page's words last changed, from git history (the deploy checks out the full history).
// Used for sitemap lastmod and dateModified, which Bing and Google use to decide what to recrawl.
import { execFileSync } from "node:child_process";

const cache = new Map<string, string>();
function lastCommit(files: string[]): string {
  const key = files.join("|");
  if (!cache.has(key)) {
    let date = "";
    try { date = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...files], { encoding: "utf8" }).trim(); } catch {}
    cache.set(key, date || new Date().toISOString());
  }
  return cache.get(key)!;
}

const shared = ["src/i18n/strings.ts", "src/layouts/Base.astro"];
export const homeModified = () => lastCommit([...shared, "src/i18n/home.ts", "src/components/Hero.astro", "src/components/Sections.astro", "src/components/LinkHub.astro"]);
export const caseModified = () => lastCommit([...shared, "src/i18n/work.ts", "src/components/CaseStudy.astro"]);
