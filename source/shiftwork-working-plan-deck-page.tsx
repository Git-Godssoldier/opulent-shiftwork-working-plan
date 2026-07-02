"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

type Theme = "light" | "dark";

type HeroSlideData = {
  type: "hero";
  page: number;
  label: string;
  title: ReactNode;
  body?: string;
  kicker?: string;
  image?: string;
  theme?: Theme;
  sideWord?: string;
  lightGraphic?: boolean;
};

type StatsSlideData = {
  type: "stats";
  page: number;
  label: string;
  title: string;
  body?: string;
  stats: { value: string; description: string }[];
};

type PortfolioSlideData = {
  type: "portfolio";
  page: number;
  label: string;
  intro: string;
  items: { title: string; body: string; image: string }[];
};

type StoriesSlideData = {
  type: "stories";
  page: number;
  label: string;
  title: string;
  intro: string;
  items: { title: string; body: string; tags: string[]; image: string }[];
};

type CaseSlideData = {
  type: "case";
  page: number;
  label: string;
  title: string;
  body: string[];
  image: string;
  theme?: Theme;
  chips?: string[];
  reverse?: boolean;
  lightGraphic?: boolean;
};

type ProcessSlideData = {
  type: "process";
  page: number;
  label: string;
  title: string;
  intro: string;
  steps: { name: string; body: string }[];
  details: { title: string; body: string }[];
  outputs: string[];
};

type SlideData = HeroSlideData | StatsSlideData | PortfolioSlideData | StoriesSlideData | CaseSlideData | ProcessSlideData;

const img = (name: string) => `/opulent-investor-assets/${name}`;
const customer = (name: string) => `/opulent-customer-assets/${name}`;

const slides: SlideData[] = [
  {
    type: "hero",
    page: 1,
    label: "Investor Deck",
    kicker: "Opulent cloud agents",
    title: "Opulent, the first autonomous knowledge worker",
    theme: "light",
    sideWord: "OPULENT",
  },
  {
    type: "hero",
    page: 2,
    label: "Introducing Opulent",
    kicker: "Autonomous knowledge work",
    title: "Introducing Opulent",
    body: "Opulent is an autonomous knowledge worker for ambitious teams. It automates, improves, and designs the complex business processes that run across tools, teams, approvals, and institutional context.",
    theme: "light",
    sideWord: "OPULENT",
  },
  {
    type: "hero",
    page: 3,
    label: "The Bet",
    kicker: "Company thesis",
    title: "Opulent is a bet on how knowledge work looks in the future.",
    body: "People will state outcomes. Cloud agents will gather context, use tools, create artifacts, show proof, and learn from review.",
    theme: "light",
    sideWord: "FUTURE",
  },
  {
    type: "case",
    page: 4,
    label: "Problem And Failure Modes",
    title: "Work is moving from chat to delegated execution.",
    body: [
      "Local assistants stop when the tab closes. Point automations see only one slice of the workflow. Unmanaged AI tools create sprawl, duplicate work, and weak review.",
      "The answer is a durable cloud environment where work can run, use tools, keep state, and return with proof.",
    ],
    image: img("cloud-agent-runtime.png"),
    theme: "light",
    lightGraphic: true,
    chips: ["Cloud runtime", "Async work", "Tools", "Review", "Trace"],
  },
  {
    type: "hero",
    page: 5,
    label: "Agent Factory",
    kicker: "Opulent agent factory",
    title: "Agent Factory",
    body: "From natural language to production ready frontier agents.",
    theme: "light",
    sideWord: "FACTORY",
  },
  {
    type: "process",
    page: 6,
    label: "Background Triage",
    title: "Background Triage turns a market question into scored company intelligence.",
    intro:
      "Opulent uses Background Triage when a team needs to understand a company, discover who matches a target market, score fit, and produce a clean research packet for sales, diligence, or partnership work.",
    steps: [
      { name: "Profile", body: "Research the user's company, product, customers, competitors, and use cases." },
      { name: "Confirm", body: "Lock target segments, company stage, geography, depth, and scoring priorities." },
      { name: "Discover", body: "Generate diverse searches across industry, stage, stack, competitor adjacency, and pain." },
      { name: "Research", body: "Run Plan, Research, Synthesize loops for each candidate with evidence and confidence." },
      { name: "Score", body: "Rank ICP fit, explain the reasoning, and cap weak evidence instead of guessing." },
    ],
    details: [
      {
        title: "Evidence discipline",
        body: "Product descriptions, industries, and target audiences come from readable source text, not design cues or pattern matching.",
      },
      {
        title: "Depth control",
        body: "Quick, deep, and deeper modes trade scale for intelligence so a team can scan a market or build a high confidence target list.",
      },
      {
        title: "Parallel execution",
        body: "Discovery and enrichment run in batches, with deduplication, homepage filtering, and one structured file per researched company.",
      },
      {
        title: "Sales output",
        body: "The deliverable is a scored report, CSV, fit reasoning, product summary, and clear approach angle for top accounts.",
      },
    ],
    outputs: ["Company profile", "Target segments", "Discovery queries", "Scored account list", "HTML report", "CSV export"],
  },
  {
    type: "process",
    page: 7,
    label: "Event Prospecting",
    title: "Event Prospecting turns an event page into a ranked meeting list.",
    intro:
      "Opulent uses Event Prospecting when a team needs to decide who to meet at a conference, speaker page, sponsor list, or exhibitor directory before an account team spends time on outreach.",
    steps: [
      { name: "Recon", body: "Detect the event platform and choose the right extraction route for speaker or sponsor data." },
      { name: "Extract", body: "Capture people, roles, companies, sessions, public links, and deduped seed companies." },
      { name: "Triage", body: "Score every company against the ICP with a fast one-pass fit check." },
      { name: "Research", body: "Deep research only the ICP-fit companies and enrich the people attached to them." },
      { name: "Activate", body: "Compile person-first cards with why-talk rationale, public links, and message openers." },
    ],
    details: [
      {
        title: "Person first output",
        body: "Each card answers why an AE should talk to this person, not merely why the company might fit.",
      },
      {
        title: "ICP filter",
        body: "Companies below the threshold stay as triage stubs while strong fits receive deeper research and speaker enrichment.",
      },
      {
        title: "Signal quality",
        body: "Hooks use concrete public signals such as talk titles, podcasts, posts, GitHub work, or event context when no recent signal exists.",
      },
      {
        title: "Outbound ready",
        body: "The output includes grouped HTML views, filterable people and company pages, and CSV rows ready for CRM or cold outbound.",
      },
    ],
    outputs: ["Speaker extraction", "Company grouping", "ICP triage", "Deep research", "DM openers", "CSV export"],
  },
  {
    type: "case",
    page: 8,
    label: "ShiftWork Scope",
    title: "The statement of work is a controlled path from paid intake to first agent.",
    body: [
      "ShiftWork captures the customer request, selected use case, agent task, business context, and owner confirmed answers that make the build possible.",
      "Opulent starts when the completed training document lands. From there, Opulent owns the build, workspace execution, validation evidence, schedule, artifacts, and delivery proof.",
    ],
    image: customer("002_case-studies-hippo-cover.webp"),
    chips: ["Paid intake", "Training document", "Agent build", "Delivery proof"],
  },
  {
    type: "stats",
    page: 9,
    label: "Big Goal",
    title: "The first milestone is a repeatable build loop, not a one off demo.",
    body: "The first agent is the proof vehicle for the handoff, build path, evidence model, and customer delivery motion.",
    stats: [
      { value: "Intake", description: "ShiftWork creates the source of truth through a completed training document." },
      { value: "Build", description: "Opulent converts that document into a runnable agent and workspace." },
      { value: "Prove", description: "Acceptance produces screenshots, reports, logs, schedule evidence, and a how to path." },
      { value: "Learn", description: "Review findings update runbooks, acceptance checks, and future build guidance." },
    ],
  },
  {
    type: "stories",
    page: 10,
    label: "Our Read",
    title: "ShiftWork owns the front of the funnel and Opulent owns the build proof.",
    intro: "The handoff works when each team owns the part it controls and the training document carries enough truth to build without guessing.",
    items: [
      { title: "Customer request", body: "ShiftWork captures the use case, agent task, contact details, and payment trigger.", tags: ["ShiftWork"], image: customer("003_case-studies-ahead-ogimage.jpg") },
      { title: "Owner confirmation", body: "Build critical answers need customer confirmation before Opulent starts.", tags: ["Shared"], image: customer("004_case-studies-angellist-cover.webp") },
      { title: "Training document", body: "The completed document becomes the handoff record and build source.", tags: ["Shared"], image: customer("005_case-studies-evinova-cover.webp") },
      { title: "Agent build", body: "Opulent turns the document into a runnable agent with workspace evidence.", tags: ["Opulent"], image: customer("006_case-studies-mercedes-cover.webp") },
      { title: "Acceptance", body: "The build is checked against visible outputs and pass or fail evidence.", tags: ["Opulent"], image: customer("007_case-studies-rvtech-cover.webp") },
      { title: "Walkthrough", body: "ShiftWork schedules the customer moment and Opulent provides the proof.", tags: ["Shared"], image: customer("008_case-studies-cognizant-cover.webp") },
    ],
  },
  {
    type: "stories",
    page: 11,
    label: "Preparation",
    title: "We converted the source material into a project ready operating view.",
    intro: "The internal work turned Dan's documents, the draft SOW, the questionnaire tracks, and the demo requirements into a testable build path.",
    items: [
      { title: "SOW review", body: "Mapped the customer led intake path, handoff, and eleven step build pipeline.", tags: ["Scope"], image: customer("009_case-studies-fefundinfo-cover.webp") },
      { title: "Questionnaire tracks", body: "Reviewed the five discovery templates and how they support different requests.", tags: ["Intake"], image: customer("010_case-studies-infosys-cover.webp") },
      { title: "Training rules", body: "Separated owner confirmed answers from research prompts.", tags: ["Control"], image: customer("011_case-studies-itau-cover.webp") },
      { title: "Workflow specs", body: "Documented how intake becomes a build request, validation path, and packet.", tags: ["Process"], image: customer("012_case-studies-thecitationgroup-cover.webp") },
      { title: "Simulation fixtures", body: "Prepared visual quality scenarios that test retrieval, planning, and acceptance.", tags: ["Testing"], image: customer("013_case-studies-litera-cover.webp") },
      { title: "Demo framing", body: "Selected visual QA because it produces outputs everyone can inspect quickly.", tags: ["Demo"], image: customer("014_case-studies-hamming-hamming-vertical.png") },
    ],
  },
  {
    type: "case",
    page: 12,
    label: "Workflow",
    title: "The working path is intake, document, build, validation, delivery.",
    body: [
      "The customer starts in ShiftWork. The output of that motion is a completed training document with the request, acceptance inputs, and customer confirmed details.",
      "Opulent uses that document to create the build plan, execute the work in a workspace, collect proof, and hand back an agent that can be reviewed and run again.",
    ],
    image: customer("015_case-studies-bilt-cover.webp"),
    chips: ["Receive", "Model", "Run", "Check", "Hand off"],
  },
  {
    type: "stats",
    page: 13,
    label: "Validation",
    title: "The simulations test whether the handoff survives outside the original conversation.",
    body: "The core question is whether a later build context can retrieve the same intake record and create the right agent plan without relying on the earlier writer thread.",
    stats: [
      { value: "1", description: "A populated intake answer is stored as if it came from a shared workspace source." },
      { value: "5", description: "Marketing, sales, fulfillment, service, and operations tracks are covered." },
      { value: "2", description: "One context writes the artifact and another retrieves it to prove durability." },
      { value: "Pass", description: "Verdicts require required fields, owner confirmed answers, artifacts, and acceptance evidence." },
    ],
  },
  {
    type: "case",
    page: 14,
    label: "Demo",
    title: "The demo agent makes the build path easy to judge.",
    body: [
      "The first demonstration is a visual quality agent. It starts from a completed intake, screenshots provided URLs, checks for visible inconsistencies, writes a report, and prepares alert copy for review.",
      "This is a good first proof because the evidence is concrete. The team can see the screenshot, finding, report, schedule, and draft alert without needing to inspect code.",
    ],
    image: customer("019_case-studies-ramp-cover.webp"),
    chips: ["Screenshots", "Report", "Alert draft", "Schedule"],
  },
  {
    type: "stats",
    page: 15,
    label: "Start Conditions",
    title: "The remaining decisions are practical project start items.",
    body: "The path is ready to discuss as a working plan. The open items affect launch responsibility, customer handling, and the first delivery sequence.",
    stats: [
      { value: "Scope", description: "Confirm the visual QA agent as the first proof and lock the URLs and customer context." },
      { value: "Owners", description: "Lock responsibility for intake, call handling, training document completion, walkthrough scheduling, and delivery review." },
      { value: "Evidence", description: "Confirm the screenshots, report, schedule, run log, and how to guide required before walkthrough." },
      { value: "Launch", description: "Approve the source document, close the decisions, and run the first build path against agreed inputs." },
    ],
  },
];

function DeckMark({ dark }: { dark: boolean }) {
  return (
    <div className="grid h-4 w-4 grid-cols-2 gap-[2px]" aria-hidden="true">
      {[0, 1, 2, 3].map((item) => (
        <span key={item} className={dark ? "bg-white" : "bg-black"} />
      ))}
    </div>
  );
}

function SlideFrame({
  children,
  page,
  label,
  theme = "light",
  source,
}: {
  children: ReactNode;
  page: number;
  label: string;
  theme?: Theme;
  source: string;
}) {
  const dark = theme === "dark";
  return (
    <section
      className={`deck-slide relative h-[576px] w-[1024px] overflow-hidden font-sans ${
        dark ? "bg-[#111312] text-white" : "bg-white text-black"
      }`}
      data-source={source}
      data-template={source}
      data-slide-index={page - 1}
    >
      <div
        className={`absolute left-[28px] right-[28px] top-[18px] z-30 flex items-center justify-between text-[8px] font-medium ${
          dark ? "text-white/55" : "text-black/45"
        }`}
      >
        <div className="flex items-center gap-[92px]">
          <span>{String(page).padStart(2, "0")}</span>
          <span>{label}</span>
        </div>
        <DeckMark dark={dark} />
      </div>
      {children}
      <div className={`absolute bottom-[18px] left-[28px] z-30 text-[8px] font-medium ${dark ? "text-white/34" : "text-black/35"}`}>
        Opulent.ai
      </div>
      <div className={`absolute bottom-[18px] right-[28px] z-30 text-[8px] font-medium ${dark ? "text-white/30" : "text-black/32"}`}>
        ShiftWork Working Plan&nbsp;&nbsp;|&nbsp;&nbsp;Page {String(page).padStart(2, "0")}
      </div>
    </section>
  );
}

function HeroSection({ slide }: { slide: HeroSlideData }) {
  const dark = slide.theme === "dark";
  const lightGraphicClass = slide.lightGraphic
    ? "brightness-[1.08] contrast-[0.9] saturate-[0.75] invert hue-rotate-180"
    : "";
  return (
    <SlideFrame page={slide.page} label={slide.label} theme={slide.theme} source="HeroSection">
      {slide.image ? (
        dark ? (
          <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
        ) : (
          <div className="absolute right-0 top-0 h-full w-[47%] overflow-hidden">
            <img src={slide.image} alt="" className={`h-full w-full object-cover opacity-88 ${lightGraphicClass}`} />
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-white/0" />
          </div>
        )
      ) : null}
      {dark ? <div className="absolute inset-0 bg-[#111312]/70" /> : null}
      <div className={`absolute inset-0 pointer-events-none ${dark ? "opacity-[0.07]" : "opacity-[0.03]"}`} aria-hidden="true">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_20%_20%,#000_0%,transparent_50%)]" />
      </div>
      <div className="relative z-10 flex h-full flex-col justify-center px-[56px] py-[72px]">
        <div className="max-w-[760px] space-y-9">
          <div className="flex items-center gap-4">
            <span className={`h-px w-8 ${dark ? "bg-white/22" : "bg-black/20"}`} />
            <span className={`text-[9px] font-medium uppercase tracking-[0.2em] ${dark ? "text-white/50" : "text-black/50"}`}>
              {slide.kicker}
            </span>
          </div>
          <h1
            className="text-[48px] font-light leading-[1.08]"
            style={{ fontFamily: 'HelveticaNow, "Helvetica Neue", Arial, sans-serif' }}
          >
            {slide.title}
          </h1>
          {slide.body ? (
            <p className={`max-w-[560px] text-[17px] font-light leading-[1.35] ${dark ? "text-white/62" : "text-black/62"}`}>
              {slide.body}
            </p>
          ) : null}
          <div className="pt-3">
            <span className={`inline-flex items-center gap-3 border-b pb-1 text-[13px] font-medium ${dark ? "border-white/16 text-white/72" : "border-black/12 text-black/72"}`}>
              Investor narrative <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
      {slide.sideWord ? (
        <div className={`absolute bottom-8 right-0 select-none text-[106px] font-bold leading-none opacity-10 ${dark ? "text-white" : "text-black"}`}>
          {slide.sideWord}
        </div>
      ) : null}
    </SlideFrame>
  );
}

function StatsSection({ slide }: { slide: StatsSlideData }) {
  return (
    <SlideFrame page={slide.page} label={slide.label} source="StatsSection">
      <div className="flex h-full flex-col justify-center px-[56px] py-[68px]">
        <div className="mb-8 max-w-[720px]">
          <h2 className="text-[34px] font-light leading-[1.08]" style={{ fontFamily: 'HelveticaNow, "Helvetica Neue", Arial, sans-serif' }}>
            {slide.title}
          </h2>
          {slide.body ? <p className="mt-5 max-w-[650px] text-[13px] font-light leading-[1.38] text-black/58">{slide.body}</p> : null}
        </div>
        <div className="flex flex-col gap-6">
          {slide.stats.map((stat) => (
            <div
              key={stat.value}
              className="group grid w-full grid-cols-[260px_1fr] items-end gap-16 border-t border-black/8 pt-4"
            >
              <div>
                <h3 className="text-[58px] font-extralight leading-[0.88] transition-transform duration-700 group-hover:translate-x-2">
                  {stat.value}
                </h3>
              </div>
              <p className="max-w-[520px] pb-1 text-[17px] font-light leading-[1.22] text-black/78">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function VisualContent({ item, isActive }: { item: PortfolioSlideData["items"][number]; isActive: boolean }) {
  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden rounded-[20px] bg-neutral-100"
      style={{ opacity: isActive ? 1 : 0, transition: "opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1)" }}
    >
      <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/18" />
      <div className="absolute bottom-7 left-7 right-7 text-white">
        <p className="text-[28px] font-light leading-none">{item.title}</p>
        <p className="mt-4 max-w-[370px] text-[12px] font-light leading-[1.35] text-white/72">{item.body}</p>
      </div>
    </div>
  );
}

function InteractivePortfolioList({ slide }: { slide: PortfolioSlideData }) {
  const [activeId, setActiveId] = useState(slide.items[0].title);
  const activeItem = slide.items.find((item) => item.title === activeId) ?? slide.items[0];
  return (
    <SlideFrame page={slide.page} label={slide.label} source="InteractivePortfolioList">
      <div className="grid h-full grid-cols-[500px_1fr] gap-9 px-[56px] pb-[56px] pt-[74px]">
        <div className="flex flex-col">
          <div className="mb-6">
            <p className="max-w-[430px] text-[20px] font-light leading-[1.2] text-neutral-900">{slide.intro}</p>
          </div>
          <nav className="mb-6 grid grid-cols-2 gap-x-6 gap-y-3">
            {slide.items.map((item) => (
              <button
                key={item.title}
                onMouseEnter={() => setActiveId(item.title)}
                className={`group relative border-t pt-3 text-left transition-colors duration-500 ${
                  activeItem.title === item.title ? "text-[#4600FF]" : "text-neutral-900 hover:text-[#4600FF]"
                }`}
              >
                <span className="block text-[21px] font-light leading-tight">{item.title}</span>
                <span className={`mt-2 block text-[10.5px] font-light leading-[1.28] ${activeItem.title === item.title ? "text-[#4600FF]/70" : "text-black/48"}`}>
                  {item.body}
                </span>
              </button>
            ))}
          </nav>
          <span className="inline-block text-[20px] font-light text-[#4600FF]">See the loops</span>
        </div>
        <div className="relative h-[396px] w-full">
          <div className="relative h-full w-full overflow-hidden rounded-[20px] shadow-2xl shadow-black/5">
            {slide.items.map((item) => (
              <VisualContent key={item.title} item={item} isActive={activeItem.title === item.title} />
            ))}
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

function CustomerCaseStudies({ slide }: { slide: StoriesSlideData }) {
  return (
    <SlideFrame page={slide.page} label={slide.label} source="CustomerCaseStudies">
      <div className="h-full px-[56px] pb-[48px] pt-[68px]">
        <div className="mb-5 grid grid-cols-[390px_1fr] gap-10">
          <h2 className="text-[31px] font-light leading-[1.06]">{slide.title}</h2>
          <p className="max-w-[500px] text-[13px] font-light leading-[1.32] text-black/58">{slide.intro}</p>
        </div>
        <div className="grid grid-cols-3 gap-x-5 gap-y-4">
          {slide.items.map((item) => (
            <div key={item.title} className="group">
              <div className="relative mb-2 h-[104px] overflow-hidden rounded-[14px] border border-black/5 bg-gray-50">
                <img src={item.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/82 px-1.5 py-0.5 text-[7px] font-medium text-black/62">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-black">{item.title}</h3>
              <p className="mt-1 text-[9.5px] font-light leading-[1.28] text-black/56">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}

function ProcessMapSection({ slide }: { slide: ProcessSlideData }) {
  return (
    <SlideFrame page={slide.page} label={slide.label} source="ProcessMapSection">
      <div className="h-full px-[56px] pb-[48px] pt-[68px]">
        <div className="grid grid-cols-[390px_1fr] gap-10">
          <div>
            <h2 className="text-[31px] font-light leading-[1.06]">{slide.title}</h2>
            <p className="mt-5 text-[13px] font-light leading-[1.34] text-black/58">{slide.intro}</p>
          </div>
          <div className="pt-1">
            <div className="grid grid-cols-5 gap-2">
              {slide.steps.map((step, index) => (
                <div key={step.name} className="relative border-t border-black/18 pt-3">
                  {index < slide.steps.length - 1 ? (
                    <div className="absolute right-[-10px] top-[-4px] h-px w-4 bg-black/18" />
                  ) : null}
                  <div className="mb-2 text-[19px] font-light leading-none text-black/82">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-black">{step.name}</h3>
                  <p className="mt-2 text-[9.5px] font-light leading-[1.25] text-black/55">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-[1fr_230px] gap-8">
          <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            {slide.details.map((detail) => (
              <div key={detail.title} className="border-t border-black/10 pt-3">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-black">{detail.title}</h3>
                <p className="mt-2 text-[10.5px] font-light leading-[1.32] text-black/58">{detail.body}</p>
              </div>
            ))}
          </div>
          <div className="rounded-[18px] border border-black/8 bg-black/[0.025] p-4">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-black/45">Outputs</div>
            <div className="flex flex-wrap gap-2">
              {slide.outputs.map((output) => (
                <span key={output} className="rounded-full border border-black/10 bg-white/70 px-2.5 py-1.5 text-[9px] font-medium text-black/58">
                  {output}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}

function CaseStudyRowSection({ slide }: { slide: CaseSlideData }) {
  const dark = slide.theme === "dark";
  const lightGraphicClass = slide.lightGraphic
    ? "brightness-[1.08] contrast-[0.9] saturate-[0.75] invert hue-rotate-180"
    : "";
  const media = (
    <div className="relative aspect-square w-full overflow-hidden rounded-[20px] bg-[#0000000a]">
      <img src={slide.image} alt="" className={`h-full w-full object-cover transition-transform duration-[1500ms] hover:scale-105 ${lightGraphicClass}`} />
      {dark ? <div className="absolute inset-0 bg-black/18" /> : null}
    </div>
  );
  const copy = (
    <div className="mt-1">
      <h2 className={`text-[35px] font-light leading-[1.08] ${dark ? "text-white" : "text-black"}`}>{slide.title}</h2>
      <div className={`mt-7 space-y-5 text-[16px] font-light leading-[1.38] ${dark ? "text-white/58" : "text-black/62"}`}>
        {slide.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {slide.chips ? (
        <div className="mt-8 flex flex-wrap gap-2">
          {slide.chips.map((chip) => (
            <span key={chip} className={`rounded-full border px-3 py-2 text-[10px] font-medium ${dark ? "border-white/12 text-white/55" : "border-black/10 text-black/52"}`}>
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
  return (
    <SlideFrame page={slide.page} label={slide.label} theme={slide.theme} source="CaseStudyRowSection">
      <div className={`grid h-full grid-cols-12 gap-10 px-[56px] pb-[58px] pt-[74px] ${slide.reverse ? "[&>.copy]:order-1 [&>.media]:order-2" : ""}`}>
        <div className="media col-span-7 flex flex-col justify-start">{media}</div>
        <div className="copy col-span-5 flex flex-col justify-start">{copy}</div>
      </div>
    </SlideFrame>
  );
}

function RenderSlide({ slide }: { slide: SlideData }) {
  if (slide.type === "hero") return <HeroSection slide={slide} />;
  if (slide.type === "stats") return <StatsSection slide={slide} />;
  if (slide.type === "portfolio") return <InteractivePortfolioList slide={slide} />;
  if (slide.type === "stories") return <CustomerCaseStudies slide={slide} />;
  if (slide.type === "process") return <ProcessMapSection slide={slide} />;
  return <CaseStudyRowSection slide={slide} />;
}

export default function ShiftWorkWorkingPlanDeck() {
  return (
    <>
      <style jsx global>{`
        body:has(.shiftwork-deck-route) header,
        body:has(.shiftwork-deck-route) .fixed {
          display: none !important;
        }
      `}</style>
      <main className="shiftwork-deck-route min-h-screen bg-[#1f1f1f] py-8">
        <div className="mx-auto flex w-[1024px] flex-col gap-8">
          {slides.map((slide) => (
            <RenderSlide key={`${slide.type}-${slide.page}`} slide={slide} />
          ))}
        </div>
      </main>
    </>
  );
}
