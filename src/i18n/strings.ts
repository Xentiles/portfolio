// All visible words live here, English and Swedish side by side, so the two versions never drift apart.
export const languages = { en: "English", sv: "Svenska" } as const;
export type Lang = keyof typeof languages;

export const strings = {
  en: {
    title: "Dominik Nagy · Applied AI Developer",
    description: "Dominik Nagy turns complex problems into understandable systems. Applied AI, software and data systems, based in Gothenburg, Sweden.",
    skip: "Skip to content",
    role: "Applied AI Developer · Software & Data Systems · Gothenburg, Sweden",
    thesis: "Complex problems. Understandable systems.",
    now: "Now: building AI for drone-based building inspection at TakScan, with Alex Weibull.",
    portraitAlt: "Portrait of Dominik Nagy in profile, wearing glasses and a navy suit",
    hubLabel: "Find me elsewhere",
    contact: "Contact",
    copyEmail: "Copy email address",
    open: "Open to full-time roles in applied AI, automation and software.",
    built: "Built with Orbital Clarity",
    typeCredit: "Type: Libron by Nico Verbruggen",
    otherLang: "Svenska",
    otherLangShort: "SV",
    otherLangLabel: "Läs på svenska",
    js: { copied: "Copied: ", toCharcoal: "Switch to Charcoal theme", toPaper: "Switch to Paper theme", charcoal: "Charcoal", paper: "Paper", pause: "Pause motion", resume: "Resume motion" },
  },
  sv: {
    title: "Dominik Nagy · Utvecklare inom tillämpad AI",
    description: "Dominik Nagy gör komplexa problem till begripliga system. Tillämpad AI, mjukvara och datasystem, baserad i Göteborg.",
    skip: "Hoppa till innehållet",
    role: "Utvecklare inom tillämpad AI · Mjukvara och datasystem · Göteborg",
    thesis: "Komplexa problem. Begripliga system.",
    now: "Just nu: bygger AI för drönarbaserad byggnadsinspektion på TakScan, tillsammans med Alex Weibull.",
    portraitAlt: "Porträtt av Dominik Nagy i profil, med glasögon och marinblå kostym",
    hubLabel: "Hitta mig på andra ställen",
    contact: "Kontakt",
    copyEmail: "Kopiera e‑postadress",
    open: "Öppen för heltidsroller inom tillämpad AI, automation och mjukvaruutveckling.",
    built: "Byggd med Orbital Clarity",
    typeCredit: "Typsnitt: Libron av Nico Verbruggen",
    otherLang: "English",
    otherLangShort: "EN",
    otherLangLabel: "Read in English",
    js: { copied: "Kopierad: ", toCharcoal: "Byt till temat Kol", toPaper: "Byt till temat Papper", charcoal: "Kol", paper: "Papper", pause: "Pausa rörelse", resume: "Återuppta rörelse" },
  },
} as const;
