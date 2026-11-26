// Structured data (JSON-LD) that tells search engines and AI tools who this site is about.
// One Person with a stable @id; every page points back to it, so all languages and case studies add up to one identity.
import { strings, homePath, type Lang } from "../i18n/strings";
import type { CaseStudy } from "../i18n/work";

const SITE = "https://dominiknagy.dev";
export const personId = `${SITE}/#person`;
const websiteId = `${SITE}/#website`;
const inLanguage = { en: "en", sv: "sv", hu: "hu" } as const;

const jobTitle: Record<Lang, string> = { en: "Applied AI Developer", sv: "Utvecklare inom tillämpad AI", hu: "Alkalmazott MI-fejlesztő" };
const knowsAbout: Record<Lang, string[]> = {
  en: ["Applied artificial intelligence", "Machine learning", "Computer vision", "Software engineering", "Data systems", "Automation"],
  sv: ["Tillämpad artificiell intelligens", "Maskininlärning", "Datorseende", "Mjukvaruutveckling", "Datasystem", "Automation"],
  hu: ["Alkalmazott mesterséges intelligencia", "Gépi tanulás", "Gépi látás", "Szoftverfejlesztés", "Adatrendszerek", "Automatizálás"],
};

export const sameAs = [
  "https://www.linkedin.com/in/dominik-nagy-841002144/",
  "https://github.com/Xentiles",
  "https://x.com/Xentiles1",
];

function person(lang: Lang) {
  return {
    "@type": "Person",
    "@id": personId,
    name: "Dominik Nagy",
    alternateName: "Nagy Dominik",
    givenName: "Dominik",
    familyName: "Nagy",
    url: `${SITE}/`,
    image: { "@type": "ImageObject", url: `${SITE}/img/dominik-nagy.webp`, width: 1024, height: 1536, caption: strings[lang].portraitAlt },
    jobTitle: jobTitle[lang],
    description: strings[lang].description,
    address: { "@type": "PostalAddress", addressLocality: lang === "sv" ? "Göteborg" : "Gothenburg", addressCountry: "SE" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Halmstad University", sameAs: "https://www.hh.se/" },
    knowsAbout: knowsAbout[lang],
    knowsLanguage: ["en", "sv", "hu"],
    sameAs,
  };
}

function website() {
  return { "@type": "WebSite", "@id": websiteId, url: `${SITE}/`, name: "Dominik Nagy", alternateName: "Nagy Dominik", inLanguage: ["en", "sv", "hu"], publisher: { "@id": personId } };
}

// Home pages: a profile page about one person (Google's ProfilePage), plus the site itself.
export function homeSchema(lang: Lang, modified: string) {
  const url = `${SITE}${homePath[lang]}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", "@id": `${url}#page`, url, name: strings[lang].title, inLanguage: inLanguage[lang], isPartOf: { "@id": websiteId },
        dateCreated: "2026-11-25T00:00:00+01:00", dateModified: modified, mainEntity: person(lang) },
      website(),
    ],
  };
}

// Case studies: a piece of work by that person, with a breadcrumb back to the home page.
// Only what the page already says publicly goes in here.
export function caseSchema(lang: Lang, study: CaseStudy, path: string, modified: string) {
  const url = `${SITE}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#page`, url, name: study.title, description: study.summary, inLanguage: inLanguage[lang],
        isPartOf: { "@id": websiteId }, dateModified: modified, mainEntity: { "@id": `${url}#work` },
        breadcrumb: { "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: strings[lang].name, item: `${SITE}${homePath[lang]}` },
          { "@type": "ListItem", position: 2, name: study.title, item: url },
        ] } },
      { "@type": "CreativeWork", "@id": `${url}#work`, name: study.title, headline: study.title, abstract: study.summary,
        inLanguage: inLanguage[lang], url, author: { "@id": personId }, creator: { "@id": personId } },
      { "@type": "Person", "@id": personId, name: "Dominik Nagy", url: `${SITE}/` },
    ],
  };
}
