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
    label: "Agent Factory",
    kicker: "Opulent agent factory",
    title: "Agent Factory",
    body: "From natural language to production ready frontier agents.",
    theme: "light",
    sideWord: "FACTORY",
  },
  {
    type: "hero",
    page: 2,
    label: "Project Description",
    kicker: "ShiftWork collaboration",
    title: "Agent Factory turns ShiftWork intake into deployed agents.",
    body: "ShiftWork captures the customer request, confirms the build target, and hands Opulent a refined training document. Opulent converts that document into a verified agent objective, builds the agent, tests it, and packages the delivery proof.",
    theme: "light",
    sideWord: "DELIVERY",
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
    type: "process",
    page: 5,
    label: "Agent Factory Operations",
    title: "Opulent turns a refined intake document into a verified agent objective.",
    intro:
      "The Agent Factory starts after ShiftWork has completed research, the customer call, and gap review. Opulent uses the training document as the build contract and turns it into a structured agent objective with proof attached.",
    steps: [
      { name: "Retrieve", body: "Find the training document by schema marker, lead ID, and workspace source." },
      { name: "Verify", body: "Confirm build target, owner-confirmed answers, route checks, and acceptance inputs." },
      { name: "Model", body: "Convert the confirmed request into a Verified Automation Report and agent objective." },
      { name: "Create", body: "Configure the agent, schedule, manual trigger, storage paths, and run model." },
      { name: "Report", body: "Return screenshots, run report, alert draft, schedule record, and how-to guide." },
    ],
    details: [
      {
        title: "Source contract",
        body: "The document carries the schema, lead ID, selected questionnaire, build target, call notes, owner-confirmed answers, and gap review sign-off.",
      },
      {
        title: "Objective structure",
        body: "The build target becomes a concrete agent objective with URL, viewports, visual checks, alert contents, recipients, cadence, and acceptance inputs.",
      },
      {
        title: "Verification rhythm",
        body: "Opulent separates the prompt from proof, binds artifacts to verdicts, records run IDs, and reviews the visible evidence before closeout.",
      },
      {
        title: "Escalation route",
        body: "Open connector, URL, access, or scope questions route back to the owning team with the exact field, owner, and next action named.",
      },
    ],
    outputs: ["Training doc", "Verified report", "Agent spec", "Schedule record", "Run evidence", "How-to guide"],
  },
  {
    type: "process",
    page: 6,
    label: "Shared Delivery Model",
    title: "ShiftWork and Opulent share delivery through a clean source of truth.",
    intro:
      "The delivery model works because ShiftWork owns the customer-facing preparation and Opulent owns the build, workspace execution, verification package, schedule, and delivery proof.",
    steps: [
      { name: "Intake", body: "ShiftWork captures the paid lead, use case, agent task, business context, and owner identity." },
      { name: "Confirm", body: "ShiftWork runs the call, confirms the build target, and tags build-critical answers." },
      { name: "Handoff", body: "The completed training document lands in the shared workspace as the source of truth." },
      { name: "Build", body: "Opulent creates the agent, schedule, run artifacts, acceptance package, and workspace guide." },
      { name: "Review", body: "Both teams use the same evidence packet for walkthrough, handoff, and next-step decisions." },
    ],
    details: [
      {
        title: "ShiftWork owns",
        body: "Research, questionnaire selection, answer drafting, the customer call, recording, gap review, walkthrough scheduling, and ROI follow-up.",
      },
      {
        title: "Opulent owns",
        body: "Document retrieval, build validation, automation modeling, agent creation, schedule setup, workspace artifacts, acceptance, and how-to documentation.",
      },
      {
        title: "Shared checks",
        body: "The handoff preserves owner-confirmed answers, visual QA inputs, alert rules, artifact paths, schedule expectations, and review evidence.",
      },
      {
        title: "Customer-ready proof",
        body: "The delivery packet includes the agent, screenshots, report, alert draft, schedule or manual-run path, logs, and a concise workspace guide.",
      },
    ],
    outputs: ["Paid intake", "Confirmed answers", "Shared document", "Built agent", "Evidence packet", "Walkthrough"],
  },
  {
    type: "case",
    page: 7,
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
    page: 8,
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
    page: 9,
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
    page: 10,
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
    page: 11,
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
    page: 12,
    label: "Validation",
    title: "The simulations test whether the handoff survives outside the original conversation.",
    body: "The core question is whether a later build context can retrieve the same intake record and create the right agent plan without relying on the earlier writer thread.",
    stats: [
      { value: "1", description: "A populated intake answer is stored as if it came from a shared workspace source." },
      { value: "5", description: "Marketing, sales, fulfillment, service, and operations tracks are covered." },
      { value: "2", description: "One context writes the artifact and another retrieves it to prove durability." },
      { value: "Proof", description: "The evidence packet binds required fields, owner confirmed answers, artifacts, and acceptance evidence to the simulation record." },
    ],
  },
  {
    type: "process",
    page: 13,
    label: "Simulation Timeline",
    title: "The recorded simulation shows the Agent Factory path completing end to end.",
    intro:
      "The accompanying merged 4x video documents the ShiftWork doc-to-deploy run from account creation through artifact validation. The useful proof is the sequence: training doc, modeler report, agent spec, schedule, screenshots, acceptance, guide, and final evidence review.",
    steps: [
      { name: "Start", body: "0:00 to 2:30 real time. Platform loads, demo account is created, and the doc-to-deploy task is submitted." },
      { name: "Build", body: "3:00 to 7:00. The agent creates the training doc, validates required fields, runs the modeler, builds the visual QA spec, and creates the cron." },
      { name: "Run", body: "5:30 to 7:00. The visual QA agent captures desktop and mobile screenshots across five pages and runs acceptance." },
      { name: "Package", body: "6:30 to 8:00. The how-to guide, autos_done summary, and durable goal completion are produced." },
      { name: "Verify", body: "10:00 to 39:52. The validation contract checks artifacts, retakes true mobile screenshots, and confirms the workspace evidence." },
    ],
    details: [
      {
        title: "Skill execution",
        body: "All nine steps of the ShiftWork doc-to-deploy skill completed: document creation, validation, modeler report, build spec, schedule, run, acceptance, guide, and closeout.",
      },
      {
        title: "Evidence created",
        body: "The run produced screenshots, a visual QA report, schedule record, alert-draft behavior, workspace guide, and validation artifacts.",
      },
      {
        title: "Validation method",
        body: "The tail of the video shows the platform checking the produced artifacts and re-capturing mobile screenshots with the intended 390 by 844 viewport.",
      },
      {
        title: "Video reference",
        body: "Merged 4x demo video: heavy-production PR 460, `demos/platform-demo-4x-shiftwork-doc-to-deploy.mp4`.",
      },
    ],
    outputs: ["4x demo video", "Timeline annotations", "9-step execution", "Artifact validation", "Mobile retest", "Workspace proof"],
  },
  {
    type: "process",
    page: 14,
    label: "Verification Artifacts",
    title: "Every run produces signals Opulent can learn from.",
    intro:
      "During Agent Factory delivery, Opulent records the artifacts that explain what ran, what evidence was created, what changed, and what should improve next. Those signals become production monitoring, runbook updates, memory, and goal-state refinements.",
    steps: [
      { name: "Capture", body: "Record the training document, modeler report, agent spec, schedule, screenshots, reports, alert drafts, and guide." },
      { name: "Bind", body: "Link each claim to a concrete artifact path, workspace object, run ID, prompt baseline, screenshot, or report." },
      { name: "Review", body: "Use the evidence packet to confirm customer objectives, acceptance inputs, and operational readiness." },
      { name: "Learn", body: "Convert observations into runbook updates, memory curation, test harness changes, and next-run guidance." },
      { name: "Monitor", body: "Carry the same signals into production through schedules, logs, alerts, and customer review." },
    ],
    details: [
      {
        title: "Artifact set",
        body: "Training doc, Verified Automation Report, agent-build-spec.yaml, cron-schedule.yaml, screenshot set, run report, alert draft, and how-to guide.",
      },
      {
        title: "Learning loop",
        body: "Accepted work, reviewer corrections, tool traces, artifact gaps, and customer notes update memory, runbooks, evals, and workspace rules.",
      },
      {
        title: "Goal state",
        body: "The target state is a stable agent workflow that runs on schedule, explains its evidence, routes exceptions, and improves between runs.",
      },
      {
        title: "Production monitoring",
        body: "Schedules, logs, run reports, alert drafts, and platform checks show whether the workflow is operating as expected after handoff.",
      },
    ],
    outputs: ["Artifact index", "Run report", "Evidence links", "Runbook updates", "Memory curation", "Production monitor"],
  },
  {
    type: "stats",
    page: 15,
    label: "Operating Cost",
    title: "Simulation and agent operations have low infrastructure COGS relative to managed delivery.",
    body: "The cost model separates model and platform usage from the human operating work around verification, support, reviews, and customer-ready proof.",
    stats: [
      { value: "$15", description: "Estimated monthly infrastructure COGS for a recurring visual QA or marketing agent at 22 scheduled runs per month on DeepSeek V4 Flash." },
      { value: "$46", description: "Estimated monthly infrastructure COGS for a weekly deep analytical or simulation process on GPT-5.5 at roughly 4.33 runs per month." },
      { value: "$399+", description: "Recommended monthly floor for recurring monitored agents because the customer buys verified workflow operation, not only model tokens." },
      { value: "Usage", description: "Runtime, model, browser, storage, and connected-service costs are tracked separately and issued to the customer as platform usage." },
    ],
  },
  {
    type: "case",
    page: 16,
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
    page: 17,
    label: "Pricing",
    title: "Pricing separates Agent Factory delivery, seats, and platform usage.",
    body: "This structure keeps build work, ongoing advisory support, workspace access, and customer-borne runtime costs clear before the first live customer delivery.",
    stats: [
      { value: "$5k", description: "Workflow development fee per Agent Factory delivery. This covers turning the refined intake into a built, verified, customer-ready agent workflow." },
      { value: "Retainer", description: "Ongoing Opulent support for delivery management, review cycles, workflow expansion, and operating improvements after launch." },
      { value: "$40", description: "Opulent license fee per seat. Waived for Dan during the scaling phase so ShiftWork can prove the motion without seat friction." },
      { value: "Usage", description: "Platform usage fees are issued to the customer, including runtime, model, browser, storage, and connected-service costs created by their agent." },
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
