// Words for the home page sections, English and Swedish side by side.
import type { Lang } from "./strings";

export const workSlugs = {
  en: { inspection: "/work/building-inspection/", feedback: "/work/feedback-intelligence/", notchq: "/work/notchq/" },
  sv: { inspection: "/sv/arbete/byggnadsinspektion/", feedback: "/sv/arbete/feedback-intelligence/", notchq: "/sv/arbete/notchq/" },
} as const;

export const home = {
  en: {
    nav: { work: "Work", method: "How I build", research: "Research", path: "Path", workshop: "Workshop", talk: "Contact" },
    work: {
      eyebrow: "Selected work",
      title: "From open problems to results you can inspect.",
      lead: "What I'm building now, and two projects built end to end, with their limits written down.",
      now: {
        kind: "Now building · TakScan · Confidential pilot",
        title: "AI-assisted building inspection",
        text: "TakScan documents buildings with drones, detects damage and points out deviations with position, size and priority, so owners can act early. I'm building the AI system that helps experts inspect that imagery, with a person confirming every conclusion.",
        principles: ["Human in the loop", "Evidence over assumptions", "Transparency about uncertainty", "Privacy by design", "Build less, reuse more"],
        cta: "How I work on it",
      },
      cards: [
        { key: "feedback", kind: "Featured · v0.2.0", title: "Feedback Intelligence", text: "A local workbench that imports reviews and comments, classifies them with keyword rules or connected AI, and keeps every decision traceable to its evidence.", proof: "A 10,000-record run survived a worker restart with every export counted.", cta: "Read the case study" },
        { key: "notchq", kind: "Native macOS · Beta", title: "NotchQ", text: "A Swift and AppKit utility that shows your remaining Codex and Claude allowance beside the Mac's camera notch, with reset times and how fresh each reading is.", proof: "Signed in-app updates, sleep and wake recovery, fixture tests.", cta: "Read the case study" },
      ],
    },
    method: {
      eyebrow: "How I build",
      title: "Scope, plan, interfaces and tests, build, verify.",
      lead: "I use Codex, Claude and local models to explore and speed up the work. I stay hands-on: I direct the tasks, read every change, debug the failures and own the decisions. Generated code is a draft until the tests and I agree.",
      steps: [
        ["Scope", "Understand the problem and what a correct result looks like."],
        ["Plan", "Break it down and sketch the screens."],
        ["Interfaces and tests", "Agree the contracts before the code."],
        ["Build", "Implement in small, reviewable steps."],
        ["Verify", "Test the failure paths and write down the limits."],
      ],
    },
    research: {
      eyebrow: "Research",
      title: "Context-Based Image Learning",
      text: "My bachelor's thesis, co-authored and published by Halmstad University. We built a traceable computer-vision pipeline that learns a library of visual concepts and reuses them.",
      stats: [["79,721", "observations evaluated"], ["95.54%", "of the time, an existing descriptor was reused"]],
      grade: "Graded 5 out of 5.",
      link: ["Read the thesis in DiVA", "https://urn.kb.se/resolve?urn=urn:nbn:se:hh:diva-59395"],
      tools: "PyTorch · binary autoencoder · SQLite · Hamming-distance matching",
    },
    path: {
      eyebrow: "Path",
      title: "How I got here.",
      lead: "I started with hardware and networks, learned to teach, studied applied AI, and kept a job where things have to work on time.",
      items: [
        ["Now", "TakScan", "Building AI for drone-based building inspection, with Alex Weibull"],
        ["2025–2026", "Gaddr, AI Ambassador", "Built workflow and agent prototypes, and taught teams to use generative AI responsibly"],
        ["2025", "HighFive Innovationsarena", "A sprint-based data-mining project, from cleaning to recommendations"],
        ["2023–2026", "Halmstad University", "Data Science, Applied AI: machine learning, deep learning, distributed AI, databases"],
        ["2024–2026", "Hotel Tylösand", "Logistics in summer, banquet service all year. Things that must work on time"],
        ["2023", "Gothia Cup and Partille Cup", "Kept live camera feeds online across tournament fields"],
        ["2022–2024", "Fryshuset", "Taught young people creative coding and AI image tools"],
        ["2020–2023", "Thoren Innovation School", "IT programme: programming, web, 3D games, hardware, networks"],
      ],
    },
    workshop: {
      eyebrow: "Workshop",
      title: "Things I build because I'm curious.",
      items: [
        ["OSFR", "Rendering research in Unity, testing shader ideas with measurements."],
        ["Mining Turtle", "Lua automation for a Minecraft robot, with path planning and remote status."],
        ["Orbital Clarity", "My own design style, gathered into one package: the principles, the ink, the orbit and the motion on this page. The typeface is Libron by Nico Verbruggen."],
      ],
    },
    talk: {
      eyebrow: "Contact",
      title: "Let's build something understandable.",
      text: "I'm looking for a team that values curiosity, clear communication and work that can be inspected and improved. I speak Swedish, Hungarian and English.",
    },
  },
  sv: {
    nav: { work: "Projekt", method: "Hur jag bygger", research: "Forskning", path: "Bakgrund", workshop: "Verkstad", talk: "Kontakt" },
    work: {
      eyebrow: "Utvalda projekt",
      title: "Från öppna problem till resultat du kan granska.",
      lead: "Det jag bygger just nu, och två projekt byggda från början till slut, med sina begränsningar nedskrivna.",
      now: {
        kind: "Bygger just nu · TakScan · Konfidentiellt pilotprojekt",
        title: "AI-stödd byggnadsinspektion",
        text: "TakScan dokumenterar byggnader med drönare, upptäcker skador och pekar ut avvikelser med position, mått och prioritet, så att fastighetsägare kan agera i tid. Jag bygger AI-systemet som hjälper experter att granska bilderna, där en människa bekräftar varje slutsats.",
        principles: ["Människan bestämmer", "Belägg före antaganden", "Öppen med osäkerhet", "Integritet från start", "Bygg mindre, återanvänd mer"],
        cta: "Så arbetar jag med det",
      },
      cards: [
        { key: "feedback", kind: "Utvalt · v0.2.0", title: "Feedback Intelligence", text: "En lokal arbetsyta som importerar recensioner och kommentarer, klassificerar dem med nyckelordsregler eller ansluten AI och gör varje beslut spårbart till sitt underlag.", proof: "En körning med 10 000 poster klarade en omstart av arbetsprocessen, med varje export räknad.", cta: "Läs fallstudien" },
        { key: "notchq", kind: "Inbyggd macOS-app · Beta", title: "NotchQ", text: "Ett verktyg i Swift och AppKit som visar hur mycket Codex- och Claude-användning du har kvar, bredvid kamerahacket på din Mac, med återställningstider och hur färsk varje avläsning är.", proof: "Signerade uppdateringar i appen, återhämtning efter vila, fixturtester.", cta: "Läs fallstudien" },
      ],
    },
    method: {
      eyebrow: "Hur jag bygger",
      title: "Avgränsa, planera, gränssnitt och tester, bygg, verifiera.",
      lead: "Jag använder Codex, Claude och lokala modeller för att utforska och snabba upp arbetet. Jag är själv med hela vägen: jag styr uppgifterna, läser varje ändring, felsöker och står för besluten. Genererad kod är ett utkast tills testerna och jag är överens.",
      steps: [
        ["Avgränsa", "Förstå problemet och hur ett korrekt resultat ser ut."],
        ["Planera", "Dela upp arbetet och skissa skärmarna."],
        ["Gränssnitt och tester", "Kom överens om kontrakten före koden."],
        ["Bygg", "Implementera i små steg som går att granska."],
        ["Verifiera", "Testa felvägarna och skriv ner begränsningarna."],
      ],
    },
    research: {
      eyebrow: "Forskning",
      title: "Context-Based Image Learning",
      text: "Mitt examensarbete på kandidatnivå, skrivet tillsammans med en medförfattare och publicerat av Högskolan i Halmstad. Vi byggde en spårbar pipeline för datorseende som lär sig ett bibliotek av visuella begrepp och återanvänder dem.",
      stats: [["79 721", "observationer utvärderade"], ["95,54 %", "av gångerna återanvändes en befintlig deskriptor"]],
      grade: "Betyg 5 av 5.",
      link: ["Läs uppsatsen i DiVA", "https://urn.kb.se/resolve?urn=urn:nbn:se:hh:diva-59395"],
      tools: "PyTorch · binär autoencoder · SQLite · matchning med Hammingavstånd",
    },
    path: {
      eyebrow: "Bakgrund",
      title: "Hur jag kom hit.",
      lead: "Jag började med hårdvara och nätverk, lärde mig att undervisa, studerade tillämpad AI och hade samtidigt ett jobb där saker måste fungera i tid.",
      items: [
        ["Nu", "TakScan", "Bygger AI för drönarbaserad byggnadsinspektion, tillsammans med Alex Weibull"],
        ["2025–2026", "Gaddr, AI-ambassadör", "Byggde prototyper för arbetsflöden och agenter, och lärde team att använda generativ AI ansvarsfullt"],
        ["2025", "HighFive Innovationsarena", "Ett sprintbaserat datautvinningsprojekt, från datatvätt till rekommendationer"],
        ["2023–2026", "Högskolan i Halmstad", "Data Science, tillämpad AI: maskininlärning, djupinlärning, distribuerad AI, databaser"],
        ["2024–2026", "Hotel Tylösand", "Logistik på sommaren, bankett året runt. Saker som måste fungera i tid"],
        ["2023", "Gothia Cup och Partille Cup", "Höll liveströmmar från kameror igång över turneringsplanerna"],
        ["2022–2024", "Fryshuset", "Lärde unga kreativ programmering och AI-bildverktyg"],
        ["2020–2023", "Thoren Innovation School", "IT-programmet: programmering, webb, 3D-spel, hårdvara, nätverk"],
      ],
    },
    workshop: {
      eyebrow: "Verkstad",
      title: "Saker jag bygger för att jag är nyfiken.",
      items: [
        ["OSFR", "Renderingsforskning i Unity, där jag testar shaderidéer med mätningar."],
        ["Mining Turtle", "Lua-automation för en Minecraft-robot, med vägplanering och fjärrstatus."],
        ["Orbital Clarity", "Min egen designstil, samlad i ett paket: principerna, bläcket, omloppsbanan och rörelserna på den här sidan. Typsnittet är Libron av Nico Verbruggen."],
      ],
    },
    talk: {
      eyebrow: "Kontakt",
      title: "Låt oss bygga något begripligt.",
      text: "Jag söker ett team som värdesätter nyfikenhet, tydlig kommunikation och arbete som går att granska och förbättra. Jag talar svenska, ungerska och engelska.",
    },
  },
} satisfies Record<Lang, unknown>;
