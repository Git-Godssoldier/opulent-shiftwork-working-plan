#!/usr/bin/env node
/**
 * ShiftWork Demo Simulation Runner — v2 (human demoer browser drive)
 *
 * Generates the full instruction set for a cloud agent that simulates the
 * human demoer: logs into the Opulent platform through the browser, uploads
 * the training doc via the UI, types the build instruction into the chat
 * composer, watches the full build run live, records video, and returns
 * findings with PASS/PARTIAL/FAIL.
 *
 * Usage:
 *   node demo-runner.mjs                          # generate handoff
 *   node demo-runner.mjs --dry-run                # print the plan without writing
 *   node demo-runner.mjs --target=staging         # set target environment
 *   node demo-runner.mjs --timeout=45             # override timeout (minutes)
 *
 * Output:
 *   - demo-handoff-{{RUN_STAMP}}.json (combined handoff for cloud agent)
 *   - demo-cloud-agent-prompt-{{RUN_STAMP}}.md (standalone prompt)
 *   - demo-execution-plan-{{RUN_STAMP}}.json (step-by-step plan)
 *   - training-doc.stamped-{{RUN_STAMP}}.json (stamped fixture for upload)
 *   Exit code 0 = handoff generated
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Parse args ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const targetArg = args.find((a) => a.startsWith("--target="));
const dryRun = args.includes("--dry-run");
const timeoutArg = args.find((a) => a.startsWith("--timeout="));

const TARGET = targetArg ? targetArg.split("=")[1] : "staging";
const TIMEOUT_MINUTES = timeoutArg ? parseInt(timeoutArg.split("=")[1], 10) : 45;

// ─── Generate run stamp ───────────────────────────────────────────────────────

const now = new Date();
const RUN_STAMP = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

// ─── Load scenario files ──────────────────────────────────────────────────────

const scenarioPath = join(__dirname, "demo-scenario.json");
const criteriaPath = join(__dirname, "demo-pass-fail-criteria.json");
const findingsTemplatePath = join(__dirname, "demo-findings-template.json");
const fixturePath = join(__dirname, "..", "shiftwork-intake-drive-anywhere-interop", "fixtures", "training-doc.post-call.json");

for (const [label, path] of [["scenario", scenarioPath], ["criteria", criteriaPath], ["fixture", fixturePath]]) {
  if (!existsSync(path)) {
    console.error(`FATAL: ${label} not found at ${path}`);
    process.exit(2);
  }
}

const scenario = JSON.parse(readFileSync(scenarioPath, "utf-8"));
const criteria = JSON.parse(readFileSync(criteriaPath, "utf-8"));
const findingsTemplate = JSON.parse(readFileSync(findingsTemplatePath, "utf-8"));
const fixture = JSON.parse(readFileSync(fixturePath, "utf-8"));

// ─── Replace template variables ───────────────────────────────────────────────

function stamp(obj) {
  const json = JSON.stringify(obj);
  return JSON.parse(
    json
      .replace(/\{\{RUN_STAMP\}\}/g, RUN_STAMP)
      .replace(/\{\{TIMESTAMP\}\}/g, now.toISOString())
      .replace(/\{\{MODEL_LABEL\}\}/g, process.env.MODEL_LABEL || "default")
  );
}

const stampedScenario = stamp(scenario);
const stampedFixture = stamp(fixture);
const marker = stampedScenario.marker;

// ─── Cloud agent prompt (browser-driven human demoer) ─────────────────────────

const cloudAgentPrompt = `# ShiftWork Demo Simulation — Cloud Agent Instructions (Human Demoer Browser Drive)

You are a cloud agent simulating the human demoer for the ShiftWork doc-to-deploy pipeline. You drive the Opulent platform through the browser — login, upload, chat, watch, record video, evaluate, and report. You are NOT using API calls. Every action goes through the rendered UI.

## Context

ShiftWork hands a completed training doc to Opulent. Opulent's job is to find the doc, build a visual QA agent from it, run acceptance tests, and deliver the agent on the platform. You simulate the human demoer who logs in, uploads the doc, types the build instruction, and watches the whole thing unfold live. You record video of the entire session and give feedback on the demoer experience.

## Run details

- Run stamp: ${RUN_STAMP}
- Marker: ${marker}
- Completion marker: ${stampedScenario.completionMarker}
- Target: ${TARGET}
- Timeout: ${TIMEOUT_MINUTES} minutes
- Target site: https://shiftworkstudio.ai (fallback: https://example.com)
- Platform URL: \${OPULENT_PLATFORM_URL:-https://platform.opulentia.ai}

## Demo credentials

You need demo credentials to log in. Check these env vars:
- OPULENT_DEMO_EMAIL (or DEMO_EMAIL)
- OPULENT_DEMO_PASSWORD (or DEMO_PASSWORD)
- OPULENT_PLATFORM_URL (default: https://platform.opulentia.ai)

If credentials are not in env vars, ASK THE USER to provide them before starting. Do not proceed without credentials.

## Fixture

The training doc fixture is at:
${fixturePath}

It contains:
- Business: ShiftWork Studio (Dan Cruden)
- Target URL: https://shiftworkstudio.ai
- Build target: Visual quality monitoring agent for the public landing page
- 8 build-critical answers (OP09, VQ01-VQ07) all owner_confirmed
- R01 (email connector) unconfirmed — draft-only email mode
- Gap review completed by shiftwork_crew
- Pipeline state: steps 5-11 completed_by_shiftwork, steps 12-14 not_started_opulent_owns

## Steps to execute

### Step 1: Load Ostack discipline
Call skill_manage action=invoke for opulentia-engineering-discipline. This is mandatory. Also load the monitor skill pattern from .agent/skills/monitor/SKILL.md for video capture guidance.

### Step 2: Start video recording
Start ffmpeg screen capture of the browser viewport BEFORE navigating to the platform. Record at 30fps, H.264/AAC MP4, yuv420p, +faststart. Output to:
  frontend/qa/artifacts/shiftwork-demo-simulation/recordings/demo-session-${RUN_STAMP}.mp4

If on macOS, also enable cua-driver trajectory recording:
  cua-driver recording start frontend/qa/artifacts/shiftwork-demo-simulation/recordings/trajectory-${RUN_STAMP}

The video must capture the full session from login to completion. See .agent/skills/cua-driver/RECORDING.md and .agent/skills/monitor/SKILL.md for the recording pattern.

If ffmpeg is not available, use cua-driver screenshot capture at every step as fallback.

### Step 3: Navigate to Opulent platform
Open a browser and navigate to the platform URL. Wait for the login page to fully load. Take a screenshot:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-03-login-page-${RUN_STAMP}.png

### Step 4: Log in with demo credentials
Enter the demo email and password into the login form. Click the login/submit button. Wait for the dashboard to load. Take a screenshot:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-04-dashboard-${RUN_STAMP}.png

If React #185 crash appears, record it as a MUST-PASS failure.

### Step 5: Create demo workspace
Create a new workspace named "ShiftWork Demo Simulation ${RUN_STAMP}" through the UI. Use the workspace creation button or menu. Wait for it to appear. Take a screenshot:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-05-workspace-${RUN_STAMP}.png

### Step 6: Upload training doc to workspace
Upload the training doc fixture to the workspace through the UI file upload feature. The file is at:
  ${fixturePath}

After upload, verify the file appears in the workspace file list. Take a screenshot:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-06-upload-${RUN_STAMP}.png

### Step 7: Open a new thread and type the build instruction
Open a new chat thread in the workspace. Type the full build instruction into the chat composer (the unified chat input). Take a screenshot of the typed prompt BEFORE sending:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-07a-prompt-typed-${RUN_STAMP}.png

Then press Enter or click Send. Take a screenshot AFTER sending:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-07b-prompt-sent-${RUN_STAMP}.png

The build instruction to type is:

---
You are a build agent in the Opulent platform. A ShiftWork training doc has been placed in your workspace. Your job is to find it, validate it, build a visual QA agent from it, create a cron schedule, and run acceptance tests.

STEP A: Find the training doc. Search the workspace for a file with schema marker "opulent.shiftwork.training_doc.v1" and leadId "SW-20260701-001". Use list_files and read_file.

STEP B: Validate the doc minimally. Check: (1) buildTarget is present and non-empty, (2) VQ07 answer exists, (3) VQ01 has targetUrl. If any missing, stop and report "cannot build: missing required fields".

STEP C: Run the automation modeler flow. Call skill_manage action=invoke for opulentia-automation-modeler. Follow the intake flow and produce a Verified Automation Report. The automation: "Screenshot https://shiftworkstudio.ai at desktop 1280x900 and mobile 390x844 on a weekday schedule at 8 AM Central, compare against baseline, draft an email alert if a visual issue is found." Use the training doc answers as the spec. If the site is down, use https://example.com as fallback.

STEP D: Build the visual QA agent from the report. The agent: (1) screenshots the target URL at desktop 1280x900 and mobile 390x844, (2) compares against baseline, (3) if issue found, drafts an alert email with subject prefix VISUAL QA ALERT containing screenshots, URL, viewport, severity, issue description, fix suggestion, (4) stores screenshots and a run report in the workspace. Draft-only — do not send emails.

STEP E: Create the cron schedule. Call cron_manage action=create with cron="0 8 * * 1-5", timezone="America/Chicago", prompt describing the visual QA run, recurring=true. Record the schedule ID.

STEP F: Run the agent against 5 random pages on the target site. For each: screenshot at desktop and mobile, store in workspace, produce a report entry. All 5 must complete without crashing. If any crash, auto-fix up to 3 tries. After 3 failed fixes, stop and report.

STEP G: Run the acceptance test. Check: (1) at least 4 of 5 pages screenshotted successfully, (2) screenshots stored in workspace, (3) report produced. Must-pass: at least one screenshot + report produced. If 4/5 with must-pass OK, mark PASS. Otherwise FAIL.

STEP H: If acceptance passes, produce a how-to guide as markdown in the workspace. Title: "How to use your Visual QA Agent". Cover: login, see agent, read alerts, trigger manual run, understand schedule. 1-2 pages.

STEP I: Call autos_done with summary including: what was built, schedule ID, acceptance result, artifact locations, and marker ${marker}.
---

### Step 8: Watch the build agent work in real-time
Monitor the thread as the build agent works. Watch for:
- Streaming text responses appearing in the transcript
- Tool call chips appearing (skill_manage, list_files, read_file, document_create, cron_manage, write_file)
- Document panel showing the Verified Automation Report
- Screenshot artifacts appearing in workspace
- Any error messages or crashes

Take screenshots at each key moment:
  step-08a-build-started-${RUN_STAMP}.png
  step-08b-modeler-running-${RUN_STAMP}.png
  step-08c-automation-report-${RUN_STAMP}.png
  step-08d-cron-created-${RUN_STAMP}.png
  step-08e-screenshots-appearing-${RUN_STAMP}.png
  step-08f-acceptance-result-${RUN_STAMP}.png
  step-08g-how-to-guide-${RUN_STAMP}.png
  step-08h-autos-done-${RUN_STAMP}.png

Note any UX issues: slow rendering, missing tool chips, broken streaming, layout issues, React #185 crash. Wait up to 30 minutes for the build agent to complete (autos_done call).

### Step 9: Verify workspace artifacts through the UI
Navigate to the workspace file list. Verify: training doc, Verified Automation Report, screenshots (>=4), run report, how-to guide. Open each to confirm readable. Take a screenshot:
  step-09-workspace-artifacts-${RUN_STAMP}.png

### Step 10: Verify cron schedule through the UI
Navigate to the agent's schedule or trigger management UI. Verify the cron schedule (weekday 8 AM Central) is visible and active. Check manual on-demand trigger. Take a screenshot:
  step-10-cron-schedule-ui-${RUN_STAMP}.png

### Step 11: Evaluate against pass/fail criteria
Read the pass/fail criteria from:
  ${criteriaPath}

For each of the 26 criteria, mark PASS, FAIL, PARTIAL, or SKIP with evidence (screenshots, video timestamps, transcript excerpts). Pay special attention to demoer-experience criteria: UI responsiveness, streaming quality, tool chip visibility, document panel rendering, crashes.

### Step 12: Write demoer feedback
Write a feedback section covering:
1. What worked well in the UI
2. What was confusing or broken
3. Any performance issues (slow rendering, streaming gaps)
4. Any crashes (React #185 or other)
5. Suggestions for improving the demo experience

This is qualitative feedback from the perspective of someone watching the demo live.

### Step 13: Produce findings report
Generate a findings report using the template at:
  ${findingsTemplatePath}

Fill in all fields including: overall verdict, per-criterion results, workspace artifacts, demoer feedback, video evidence, screenshot evidence, errors, timing, recommendations. Write it to:
  ${join(__dirname, "demo-findings-" + RUN_STAMP + ".json")}

### Step 14: Stop video recording
Stop ffmpeg screen capture. Verify the video file exists and is playable:
  ffprobe -v error -show_streams frontend/qa/artifacts/shiftwork-demo-simulation/recordings/demo-session-${RUN_STAMP}.mp4

If cua-driver trajectory recording was enabled, stop it:
  cua-driver recording stop

### Step 15: Call autos_done with completion marker
Call autos_done with result including ${stampedScenario.completionMarker} and a summary of the findings, including the video path and overall verdict.

## Pass/Fail rules

- PASS: All 14 MUST-PASS criteria pass AND at least 21 of 26 total criteria pass
- PARTIAL: All 14 MUST-PASS criteria pass AND 16-20 of 26 pass
- FAIL: Any MUST-PASS fails OR fewer than 16 pass

## Must-pass criteria (14)

C01: Ostack discipline loaded
C02: Video recording started
C03: Platform login page loaded
C04: Logged in with demo credentials
C05: Demo workspace created through UI
C06: Training doc uploaded through UI
C07: Build instruction typed into chat composer
C08: Build agent streaming visible in transcript
C10: Automation modeler skill invocation visible
C11: Verified Automation Report visible in document panel
C13: Screenshots appearing in workspace during acceptance
C14: Run report visible in workspace
C15: autos_done visible in thread
C18: No React #185 crash during session
C22: Video recording valid and complete
C23: Findings report produced with verdict
C25: Completion marker emitted

## What to return

Return the findings report JSON. Include:
1. Overall verdict (PASS/PARTIAL/FAIL)
2. Per-criterion results with evidence and screenshot paths
3. Workspace artifact list (with visibleInUI flags)
4. Demoer feedback (5 areas)
5. Video file path and ffprobe validation
6. Screenshot paths
7. Errors encountered with video timestamps
8. Recommendations

## Key constraints

- Target site: https://shiftworkstudio.ai (fallback: https://example.com if down)
- Viewports: desktop 1280x900, mobile 390x844
- Cron: 0 8 * * 1-5 in America/Chicago (weekday 8 AM Central)
- Email: draft-only, do not send (R01 unconfirmed)
- No codebase access, no DOM access, screenshots only
- Daytona sandbox with secrets management
- Build agent: strong model (Opus or Sonnet). Running agent: cheap model (Haiku or open-source)
- No React #185 crash allowed (must-pass criterion C18)
- Acceptance: 5 random pages, 4/5 pass with must-pass (at least one screenshot + report)
- Video must capture the full session from login to completion
`;

// ─── Dry run ──────────────────────────────────────────────────────────────────

if (dryRun) {
  console.log("=== DRY RUN ===");
  console.log("Run stamp:", RUN_STAMP);
  console.log("Marker:", marker);
  console.log("Target:", TARGET);
  console.log("Timeout:", TIMEOUT_MINUTES, "minutes");
  console.log("Mode: browser-driven human demoer with video recording");
  console.log("Fixture:", fixturePath);
  console.log("Scenario:", scenarioPath);
  console.log("Criteria:", criteriaPath);
  console.log("Findings template:", findingsTemplatePath);
  console.log("Output:", join(__dirname, "demo-findings-" + RUN_STAMP + ".json"));
  console.log("\n=== CLOUD AGENT PROMPT ===\n");
  console.log(cloudAgentPrompt);
  console.log("\n=== END DRY RUN ===");
  process.exit(0);
}

// ─── Execute ──────────────────────────────────────────────────────────────────

console.log("=== ShiftWork Demo Simulation (v2 — Human Demoer Browser Drive) ===");
console.log("Run stamp:", RUN_STAMP);
console.log("Marker:", marker);
console.log("Target:", TARGET);
console.log("Timeout:", TIMEOUT_MINUTES, "minutes");
console.log("Mode: browser-driven human demoer with video recording");
console.log("");

// Create output directories
mkdirSync(join(__dirname, "recordings"), { recursive: true });
mkdirSync(join(__dirname, "screenshots"), { recursive: true });

// Write the cloud agent prompt
const promptPath = join(__dirname, "demo-cloud-agent-prompt-" + RUN_STAMP + ".md");
writeFileSync(promptPath, cloudAgentPrompt, "utf-8");
console.log("Cloud agent prompt written to:", promptPath);

// Write the stamped fixture
const stampedFixturePath = join(__dirname, "training-doc.stamped-" + RUN_STAMP + ".json");
writeFileSync(stampedFixturePath, JSON.stringify(stampedFixture, null, 2), "utf-8");
console.log("Stamped fixture written to:", stampedFixturePath);

// Write the execution plan
const executionPlan = {
  runStamp: RUN_STAMP,
  marker,
  target: TARGET,
  timeoutMinutes: TIMEOUT_MINUTES,
  startTime: now.toISOString(),
  mode: "browser-driven-human-demoer",
  scenario: stampedScenario,
  criteria: criteria,
  fixturePath: stampedFixturePath,
  promptPath: promptPath,
  outputPath: join(__dirname, "demo-findings-" + RUN_STAMP + ".json"),
  videoPath: join(__dirname, "recordings", "demo-session-" + RUN_STAMP + ".mp4"),
  screenshotDir: join(__dirname, "screenshots"),
  steps: stampedScenario.instructionSet.steps.map((s) => ({
    step: s.step,
    name: s.name,
    tool: s.tool,
    passCriteria: s.passCriteria,
    status: "pending",
  })),
};

const planPath = join(__dirname, "demo-execution-plan-" + RUN_STAMP + ".json");
writeFileSync(planPath, JSON.stringify(executionPlan, null, 2), "utf-8");
console.log("Execution plan written to:", planPath);

// Write combined handoff
const handoff = {
  schema: "opulent.shiftwork.demo_handoff.v1",
  runStamp: RUN_STAMP,
  marker,
  completionMarker: stampedScenario.completionMarker,
  target: TARGET,
  timeoutMinutes: TIMEOUT_MINUTES,
  mode: "browser-driven-human-demoer",
  startTime: now.toISOString(),
  prompt: cloudAgentPrompt,
  scenario: stampedScenario,
  criteria: criteria,
  fixture: stampedFixture,
  findingsTemplate: findingsTemplate,
  outputPath: join(__dirname, "demo-findings-" + RUN_STAMP + ".json"),
  videoPath: join(__dirname, "recordings", "demo-session-" + RUN_STAMP + ".mp4"),
  screenshotDir: join(__dirname, "screenshots"),
};

const handoffPath = join(__dirname, "demo-handoff-" + RUN_STAMP + ".json");
writeFileSync(handoffPath, JSON.stringify(handoff, null, 2), "utf-8");
console.log("Combined handoff written to:", handoffPath);
console.log("");

console.log("=== READY FOR CLOUD AGENT ===");
console.log("");
console.log("The cloud agent prompt is at:");
console.log("  " + promptPath);
console.log("");
console.log("The combined handoff (everything in one file) is at:");
console.log("  " + handoffPath);
console.log("");
console.log("The cloud agent will:");
console.log("  1. Load Ostack discipline + monitor skill");
console.log("  2. Start ffmpeg video recording");
console.log("  3. Navigate to the Opulent platform in a browser");
console.log("  4. Log in with demo credentials");
console.log("  5. Create a demo workspace through the UI");
console.log("  6. Upload the training doc through the UI");
console.log("  7. Type the build instruction into the chat composer and send");
console.log("  8. Watch the build agent work in real-time (streaming, tool chips, document panel)");
console.log("  9. Verify workspace artifacts through the UI");
console.log("  10. Verify cron schedule through the UI");
console.log("  11. Evaluate against 26 pass/fail criteria (14 must-pass)");
console.log("  12. Write demoer feedback (5 areas)");
console.log("  13. Produce findings report JSON");
console.log("  14. Stop video recording and validate with ffprobe");
console.log("  15. Call autos_done with completion marker");
console.log("");
console.log("Output: " + join(__dirname, "demo-findings-" + RUN_STAMP + ".json"));
console.log("Video:  " + join(__dirname, "recordings", "demo-session-" + RUN_STAMP + ".mp4"));
console.log("");
