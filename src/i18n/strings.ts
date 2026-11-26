// All visible words live here, English, Swedish and Hungarian side by side, so the versions never drift apart.
export const languages = { en: "English", sv: "Svenska", hu: "Magyar" } as const;
export type Lang = keyof typeof languages;
export const langs = ["en", "sv", "hu"] as const satisfies readonly Lang[];
export const homePath: Record<Lang, string> = { en: "/", sv: "/sv/", hu: "/hu/" };
export const ogLocale: Record<Lang, string> = { en: "en_GB", sv: "sv_SE", hu: "hu_HU" };

export const strings = {
  en: {
    name: "Dominik Nagy",
    title: "Dominik Nagy · Applied AI Developer",
    description: "Dominik Nagy turns complex problems into understandable systems. Applied AI, software and data systems, based in Gothenburg, Sweden.",
    skip: "Skip to content",
    role: "Applied AI developer in Gothenburg",
    thesis: "Complex problems. Understandable systems.",
    portraitAlt: "Portrait of Dominik Nagy in profile, wearing glasses and a navy suit",
    hubLabel: "Find me elsewhere",
    contact: "Contact",
    copyEmail: "Copy email address",
    open: "Open to full-time roles in applied AI, automation and software.",
    built: "Built with Orbital Clarity",
    typeCredit: "Type: Libron by Nico Verbruggen",
    langLabel: "Language",
    js: { copied: "Copied: ", toCharcoal: "Switch to the Carbon theme", toPaper: "Switch to the Magnesium theme", charcoal: "Carbon", paper: "Magnesium", pause: "Pause motion", resume: "Resume motion" },
  },
  sv: {
    name: "Dominik Nagy",
    title: "Dominik Nagy · Utvecklare inom tillämpad AI",
    description: "Dominik Nagy gör komplexa problem till begripliga system. Tillämpad AI, mjukvara och datasystem, baserad i Göteborg.",
    skip: "Hoppa till innehållet",
    role: "Utvecklare inom tillämpad AI i Göteborg",
    thesis: "Komplexa problem. Begripliga system.",
    portraitAlt: "Porträtt av Dominik Nagy i profil, med glasögon och marinblå kostym",
    hubLabel: "Hitta mig på andra ställen",
    contact: "Kontakt",
    copyEmail: "Kopiera e‑postadress",
    open: "Öppen för heltidsroller inom tillämpad AI, automation och mjukvaruutveckling.",
    built: "Byggd med Orbital Clarity",
    typeCredit: "Typsnitt: Libron av Nico Verbruggen",
    langLabel: "Språk",
    js: { copied: "Kopierad: ", toCharcoal: "Byt till temat Kol", toPaper: "Byt till temat Magnesium", charcoal: "Kol", paper: "Magnesium", pause: "Pausa rörelse", resume: "Återuppta rörelse" },
  },
  hu: {
    name: "Nagy Dominik",
    title: "Nagy Dominik · Alkalmazott MI-fejlesztő",
    description: "Nagy Dominik összetett problémákból érthető rendszereket épít. Alkalmazott mesterséges intelligencia, szoftver- és adatrendszerek, Göteborgból.",
    skip: "Ugrás a tartalomra",
    role: "Alkalmazott MI-fejlesztő, Göteborg",
    thesis: "Összetett problémák. Érthető rendszerek.",
    portraitAlt: "Nagy Dominik profilportréja, szemüvegben és sötétkék öltönyben",
    hubLabel: "Máshol is megtalálsz",
    contact: "Kapcsolat",
    copyEmail: "E-mail-cím másolása",
    open: "Teljes munkaidős pozíciót keresek alkalmazott MI, automatizálás és szoftverfejlesztés terén.",
    built: "Orbital Clarity stílusban készült",
    typeCredit: "Betűtípus: Libron, Nico Verbruggen",
    langLabel: "Nyelv",
    js: { copied: "Kimásolva: ", toCharcoal: "Váltás Szén témára", toPaper: "Váltás Magnézium témára", charcoal: "Szén", paper: "Magnézium", pause: "Mozgás szüneteltetése", resume: "Mozgás folytatása" },
  },
} as const;
