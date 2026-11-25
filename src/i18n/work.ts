// Case studies, English and Swedish side by side. Each page uses the same parts so readers always
// know where the proof is. Building inspection is confidential and shows how the work is done instead.
import type { Lang } from "./strings";

type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "flow"; items: string[] }
  | { type: "cards"; items: [string, string][] }
  | { type: "figure"; src: string; alt: string; caption: string };
export type Section = { title: string; blocks: Block[] };
export type CaseStudy = {
  key: "inspection" | "feedback" | "notchq";
  kind: string;
  title: string;
  lead: string;
  notice?: string;
  sections: Section[];
  links?: [string, string][];
  media?: { mp4: string; webm: string; poster: string; alt: string; caption: string };
  limits: { title: string; text: string };
  closing?: string;
};

const en: CaseStudy[] = [
  {
    key: "inspection",
    kind: "Now building · TakScan · Confidential pilot",
    title: "AI-assisted building inspection",
    lead: "TakScan documents buildings with drones, detects damage and points out deviations with position, size and priority, so owners can act early and prevent bigger problems. I'm building the AI system that supports experts inspecting that aerial imagery. The AI assists and the expert decides.",
    notice: "This is a confidential pilot. What follows is how I work on it, not what is built. Further detail can be discussed in person where confidentiality allows.",
    sections: [
      { title: "The project", blocks: [{ type: "p", text: "The work covers the full chain, from handling sensitive imagery responsibly to the software experts use every day, and it is moving into a structured verification phase. I build it together with Alex Weibull at TakScan (Riventify AB)." }] },
      { title: "Five principles", blocks: [{ type: "cards", items: [
        ["Human in the loop", "The AI assists, the expert decides. Nothing the system suggests counts until a person has confirmed it."],
        ["Evidence over assumptions", "Tools and approaches are chosen by testing alternatives side by side, not by reputation or hype."],
        ["Transparency about uncertainty", "The system shows how sure it is instead of hiding doubt behind a single answer."],
        ["Privacy by design", "Sensitive imagery and client information stay in controlled, local environments and are never stored alongside code."],
        ["Build less, reuse more", "Proven open-source parts come before custom infrastructure, so effort goes into what is actually new."],
      ] }] },
      { title: "How I organise the work", blocks: [{ type: "list", items: [
        "Every larger change starts as a written, dated plan: the goal, the options, the risks and what it affects. Nothing changes until the plan is approved.",
        "The system is split into well-defined parts with clear rules about what belongs where, so each part can be tested and replaced on its own.",
        "Nothing is permanently deleted. Retired work is archived, every removal is logged, and any earlier state can be recovered.",
        "Documentation is a deliverable: guides, quick starts, handoff notes and decision records, so anyone can pick up where work stopped.",
        "When work pauses, the verified state and the next steps are written down first.",
        "Decisions are recorded with their reasons, so later changes are informed rather than accidental.",
        "Anything that costs money, touches shared resources or can't be undone needs an explicit go-ahead.",
      ] }] },
      { title: "Spending wisely", blocks: [{ type: "list", items: [
        "Paid services are a budget, used only where they make a real difference. Everything else runs locally.",
        "Nothing paid for is thrown away. Outputs are kept and made reusable.",
        "Daily work stays light enough for a laptop; heavy jobs can move to stronger hardware without requiring it.",
        "Every comparison weighs time and cost next to accuracy, so trade-offs are visible.",
      ] }] },
      { title: "Quality standards", blocks: [{ type: "list", items: [
        "Every result can be traced to the exact versions of the software, rules and data that produced it.",
        "Code, definitions, rules and reviewed records are all versioned, and earlier versions are kept.",
        "Machine suggestions and human-confirmed facts are never mixed.",
        "Automated tests cover the parts that handle data and records, where mistakes are hardest to find later.",
        "Important records are backed up before any write, and incoming material is checked and logged on arrival.",
        "Third-party parts are checked for licences that allow commercial use before they are adopted.",
        "I ask for my own ideas to be challenged and change course when the evidence says so.",
      ] }] },
      { title: "Directing AI agents as a team", blocks: [{ type: "p", text: "I direct AI coding agents like a development team, under standing rules on privacy, deletions, approvals and documentation. That lets one person run a project of this size while keeping control of every decision." }] },
    ],
    limits: { title: "What stays private", text: "The technical design, the data, the methods and the results. This page describes the way of working only." },
    closing: "The same rules built the site you're reading: decisions written down with their reasons, reuse before reinvention, and honesty about what isn't proven.",
  },
  {
    key: "feedback",
    kind: "Featured · v0.2.0",
    title: "Feedback Intelligence",
    lead: "Customer feedback piles up in reviews and comments faster than a team can read it, and an AI summary is hard to trust when you can't see why it says what it says. Feedback Intelligence classifies feedback and keeps every decision traceable to its evidence.",
    sections: [
      { title: "What I built", blocks: [{ type: "list", items: [
        "A local workbench that imports reviews and comments.",
        "Classification with keyword rules or a connected AI model, chosen per run.",
        "Every decision stored with its provenance, so any result can be traced back to the text that caused it.",
      ] }, { type: "figure", src: "/img/fi/fi-overview.webp", alt: "The Feedback Intelligence overview in the Orbital Clarity Charcoal theme: a decision-source switch between a local open model, a rules baseline and an AI reference, the current dataset and version, and filters.", caption: "The overview. Pick which method's decisions to look at, then filter. Synthetic showcase data." }] },
      { title: "How it works", blocks: [{ type: "flow", items: ["Import", "Rules or AI", "Decisions with provenance", "Analytics", "Review interface"] }, { type: "figure", src: "/img/fi/fi-signal.webp", alt: "A signal page with the delivery-delay rate over time as an orange line against a dashed average, with latest, average and range above it.", caption: "A signal over time. Every point opens the records behind it." }] },
      { title: "What I decided and why", blocks: [{ type: "list", items: [
        "Durable jobs and an outbox, so a restart never loses work or sends an export twice.",
        "Consent before any external AI call, so no feedback leaves the machine without a clear choice.",
      ] }] },
      { title: "Proof", blocks: [{ type: "p", text: "A 10,000-record run survived a worker restart with every export counted. The release review, tests and walkthrough are in the repository." }, { type: "figure", src: "/img/fi/fi-evaluation.webp", alt: "An evaluation table comparing a local open model, a general-purpose LLM and a rules baseline on run status, successful records, errors, topic accuracy and macro-F1, marked as AI reference, not human gold.", caption: "The model comparison, labelled honestly: measured against an AI reference, not human-labelled truth." }] },
    ],
    links: [["Repository on GitHub", "https://github.com/Xentiles/feedback-intelligence"]],
    limits: { title: "What this does not prove yet", text: "AI accuracy on real customer data. Tests so far use synthetic data, and there is no measured business impact yet." },
  },
  {
    key: "notchq",
    kind: "Native macOS · Beta",
    title: "NotchQ",
    lead: "When you work with AI coding tools, running out of allowance in the middle of a task breaks your flow, and checking how much is left means leaving what you're doing. NotchQ keeps it in view.",
    sections: [
      { title: "What I built", blocks: [{ type: "list", items: [
        "A native Swift and AppKit utility that sits beside the Mac's camera notch.",
        "Remaining Codex and Claude allowance, with the time each one resets.",
        "How fresh each reading is, so you never act on a stale number.",
      ] }] },
      { title: "How it works", blocks: [{ type: "flow", items: ["Read usage", "Track resets", "Show freshness", "Notch display"] }] },
      { title: "What I decided and why", blocks: [{ type: "list", items: [
        "A native app instead of a web wrapper, so it can live by the notch and stay light.",
        "Signed in-app updates, so beta testers get fixes without reinstalling.",
        "Recovery after sleep and wake, because a laptop utility spends half its life asleep.",
      ] }] },
      { title: "Proof", blocks: [{ type: "p", text: "Signed in-app updates, sleep and wake recovery, and fixture tests for the parsing." }] },
    ],
    links: [["Repository on GitHub", "https://github.com/Xentiles/NotchQ"]],
    media: { mp4: "/media/notchq-demo.mp4", webm: "/media/notchq-demo.webm", poster: "/media/notchq-poster.jpg", alt: "NotchQ on a MacBook: two small percentages beside the notch for Codex and Claude Code, a menu with reset times, and the settings window.", caption: "The NotchQ launch clip. Readings are illustrative." },
    limits: { title: "What this does not prove yet", text: "Behaviour on Intel Macs and older macOS versions, which haven't been verified." },
  },
];

const sv: CaseStudy[] = [
  {
    key: "inspection",
    kind: "Bygger just nu · TakScan · Konfidentiellt pilotprojekt",
    title: "AI-stödd byggnadsinspektion",
    lead: "TakScan dokumenterar byggnader med drönare, upptäcker skador och pekar ut avvikelser med position, mått och prioritet, så att fastighetsägare kan agera i tid och förebygga större problem. Jag bygger AI-systemet som stöttar experter när de granskar flygbilderna. AI:n hjälper till och experten bestämmer.",
    notice: "Det här är ett konfidentiellt pilotprojekt. Det som följer beskriver hur jag arbetar, inte vad som byggs. Mer kan berättas personligen där sekretessen tillåter.",
    sections: [
      { title: "Projektet", blocks: [{ type: "p", text: "Arbetet täcker hela kedjan, från ansvarsfull hantering av känsliga bilder till programvaran som experterna använder varje dag, och går nu in i en strukturerad verifieringsfas. Jag bygger det tillsammans med Alex Weibull på TakScan (Riventify AB)." }] },
      { title: "Fem principer", blocks: [{ type: "cards", items: [
        ["Människan bestämmer", "AI:n hjälper till, experten bestämmer. Inget som systemet föreslår gäller förrän en människa har bekräftat det."],
        ["Belägg före antaganden", "Verktyg och metoder väljs genom att jämföra alternativ sida vid sida, inte efter rykte eller hype."],
        ["Öppen med osäkerhet", "Systemet visar hur säkert det är, i stället för att gömma tvivel bakom ett enda svar."],
        ["Integritet från start", "Känsliga bilder och kunduppgifter stannar i kontrollerade, lokala miljöer och lagras aldrig tillsammans med kod."],
        ["Bygg mindre, återanvänd mer", "Beprövade öppna komponenter går före egenbyggd infrastruktur, så att kraften läggs på det som faktiskt är nytt."],
      ] }] },
      { title: "Så organiserar jag arbetet", blocks: [{ type: "list", items: [
        "Varje större ändring börjar som en skriftlig, daterad plan: målet, alternativen, riskerna och vad den påverkar. Inget ändras förrän planen är godkänd.",
        "Systemet är uppdelat i tydliga delar med klara regler för vad som hör hemma var, så att varje del kan testas och bytas ut för sig.",
        "Inget raderas permanent. Avslutat arbete arkiveras, varje borttagning loggas och varje tidigare läge kan återställas.",
        "Dokumentation är en leverans: guider, snabbstarter, överlämningar och beslutsloggar, så att vem som helst kan fortsätta där arbetet stannade.",
        "När arbetet pausas skrivs det verifierade läget och nästa steg ner först.",
        "Beslut dokumenteras med sina skäl, så att senare ändringar blir medvetna i stället för oavsiktliga.",
        "Allt som kostar pengar, rör delade resurser eller inte kan ångras kräver ett uttryckligt klartecken.",
      ] }] },
      { title: "Att använda resurser klokt", blocks: [{ type: "list", items: [
        "Betaltjänster behandlas som en budget och används bara där de gör verklig skillnad. Allt annat körs lokalt.",
        "Inget som betalats för slängs. Resultat sparas och görs återanvändbara.",
        "Det dagliga arbetet är lätt nog för en laptop; tunga jobb kan flyttas till kraftfullare hårdvara utan att det krävs.",
        "Varje jämförelse väger tid och kostnad mot träffsäkerhet, så att avvägningarna syns.",
      ] }] },
      { title: "Kvalitetskrav", blocks: [{ type: "list", items: [
        "Varje resultat kan spåras till exakt de versioner av programvara, regler och data som tog fram det.",
        "Kod, definitioner, regler och granskade poster versionshanteras, och tidigare versioner sparas.",
        "Maskinens förslag och fakta som en människa bekräftat blandas aldrig.",
        "Automatiska tester täcker de delar som hanterar data och poster, där fel är svårast att hitta i efterhand.",
        "Viktiga poster säkerhetskopieras före varje skrivning, och inkommande material kontrolleras och loggas när det tas emot.",
        "Komponenter från tredje part kontrolleras för licenser som tillåter kommersiell användning innan de tas in.",
        "Jag ber om att få mina idéer ifrågasatta och byter riktning när beläggen säger det.",
      ] }] },
      { title: "AI-agenter som ett team", blocks: [{ type: "p", text: "Jag leder AI-kodagenter som ett utvecklingsteam, med fasta regler för integritet, radering, godkännanden och dokumentation. Det gör att en person kan driva ett projekt av den här storleken och ändå ha kontroll över varje beslut." }] },
    ],
    limits: { title: "Det som förblir privat", text: "Den tekniska designen, datan, metoderna och resultaten. Sidan beskriver bara arbetssättet." },
    closing: "Samma regler byggde sajten du läser: beslut nedskrivna med sina skäl, återanvändning före nyuppfinnande och ärlighet om det som inte är bevisat.",
  },
  {
    key: "feedback",
    kind: "Utvalt · v0.2.0",
    title: "Feedback Intelligence",
    lead: "Kundfeedback samlas i recensioner och kommentarer snabbare än ett team hinner läsa, och en AI-sammanfattning är svår att lita på när man inte ser varför den säger det den säger. Feedback Intelligence klassificerar feedback och gör varje beslut spårbart till sitt underlag.",
    sections: [
      { title: "Vad jag byggde", blocks: [{ type: "list", items: [
        "En lokal arbetsyta som importerar recensioner och kommentarer.",
        "Klassificering med nyckelordsregler eller en ansluten AI-modell, vald per körning.",
        "Varje beslut sparas med sitt ursprung, så att alla resultat kan spåras tillbaka till texten som gav upphov till dem.",
      ] }, { type: "figure", src: "/img/fi/fi-overview.webp", alt: "Översikten i Feedback Intelligence i Orbital Clarity-temat Charcoal: ett val mellan en lokal öppen modell, en regelbaslinje och en AI-referens, aktuell datamängd och version samt filter.", caption: "Översikten. Välj vilken metods beslut du vill se och filtrera sedan. Syntetisk demodata." }] },
      { title: "Hur det fungerar", blocks: [{ type: "flow", items: ["Import", "Regler eller AI", "Beslut med ursprung", "Analys", "Granskningsvy"] }, { type: "figure", src: "/img/fi/fi-signal.webp", alt: "En signalsida där andelen leveransförseningar över tid visas som en orange linje mot ett streckat medelvärde, med senaste värde, medelvärde och spann ovanför.", caption: "En signal över tid. Varje punkt öppnar posterna bakom den." }] },
      { title: "Vad jag beslutade och varför", blocks: [{ type: "list", items: [
        "Beständiga jobb och en utkorg, så att en omstart aldrig tappar arbete eller skickar en export två gånger.",
        "Samtycke före varje anrop till extern AI, så att ingen feedback lämnar datorn utan ett tydligt val.",
      ] }] },
      { title: "Belägg", blocks: [{ type: "p", text: "En körning med 10 000 poster klarade en omstart av arbetsprocessen, med varje export räknad. Releasegranskning, tester och genomgång finns i kodförrådet." }, { type: "figure", src: "/img/fi/fi-evaluation.webp", alt: "En utvärderingstabell som jämför en lokal öppen modell, en allmän språkmodell och en regelbaslinje på körstatus, lyckade poster, fel, ämnesträffsäkerhet och makro-F1, märkt som AI-referens och inte mänskligt facit.", caption: "Modelljämförelsen, ärligt märkt: mätt mot en AI-referens, inte mot mänskligt märkt facit." }] },
    ],
    links: [["Kodförråd på GitHub", "https://github.com/Xentiles/feedback-intelligence"]],
    limits: { title: "Det här är inte bevisat än", text: "AI:ns träffsäkerhet på riktig kunddata. Testerna hittills använder syntetisk data, och det finns ingen uppmätt affärsnytta än." },
  },
  {
    key: "notchq",
    kind: "Inbyggd macOS-app · Beta",
    title: "NotchQ",
    lead: "När du arbetar med AI-kodverktyg bryts flödet om användningen tar slut mitt i en uppgift, och att kolla hur mycket som finns kvar betyder att du måste lämna det du gör. NotchQ håller det i synfältet.",
    sections: [
      { title: "Vad jag byggde", blocks: [{ type: "list", items: [
        "Ett inbyggt verktyg i Swift och AppKit som sitter bredvid kamerahacket på din Mac.",
        "Kvarvarande Codex- och Claude-användning, med tiden då var och en återställs.",
        "Hur färsk varje avläsning är, så att du aldrig agerar på en gammal siffra.",
      ] }] },
      { title: "Hur det fungerar", blocks: [{ type: "flow", items: ["Läs av användning", "Följ återställningar", "Visa färskhet", "Visning vid hacket"] }] },
      { title: "Vad jag beslutade och varför", blocks: [{ type: "list", items: [
        "En inbyggd app i stället för ett webbskal, så att den kan sitta vid hacket och vara lätt.",
        "Signerade uppdateringar i appen, så att betatestare får rättningar utan att installera om.",
        "Återhämtning efter vila, eftersom ett verktyg på en laptop tillbringar halva sitt liv i viloläge.",
      ] }] },
      { title: "Belägg", blocks: [{ type: "p", text: "Signerade uppdateringar i appen, återhämtning efter vila och fixturtester för tolkningen av data." }] },
    ],
    links: [["Kodförråd på GitHub", "https://github.com/Xentiles/NotchQ"]],
    media: { mp4: "/media/notchq-demo.mp4", webm: "/media/notchq-demo.webm", poster: "/media/notchq-poster.jpg", alt: "NotchQ på en MacBook: två små procenttal bredvid kameraskåran för Codex och Claude Code, en meny med återställningstider och inställningsfönstret.", caption: "NotchQ:s lanseringsklipp. Värdena är exempel." },
    limits: { title: "Det här är inte bevisat än", text: "Beteendet på Intel-Macar och äldre macOS-versioner, som inte har verifierats." },
  },
];

export const work: Record<Lang, CaseStudy[]> = { en, sv };
export const workUi = {
  en: { back: "Back to all work", next: "Next project", label: "Case study" },
  sv: { back: "Tillbaka till alla projekt", next: "Nästa projekt", label: "Fallstudie" },
} as const;
