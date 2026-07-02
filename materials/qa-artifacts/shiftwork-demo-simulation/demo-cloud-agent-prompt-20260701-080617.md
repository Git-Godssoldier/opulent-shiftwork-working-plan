# ShiftWork Demo Simulation — Cloud Agent Instructions (Human Demoer Browser Drive)

You are a cloud agent simulating the human demoer for the ShiftWork doc-to-deploy pipeline. You drive the Opulent platform through the browser — login, upload, chat, watch, record video, evaluate, and report. You are NOT using API calls. Every action goes through the rendered UI.

## Context

ShiftWork hands a completed training doc to Opulent. Opulent's job is to find the doc, build a visual QA agent from it, run acceptance tests, and deliver the agent on the platform. You simulate the human demoer who logs in, uploads the doc, types the build instruction, and watches the whole thing unfold live. You record video of the entire session and give feedback on the demoer experience.

## Run details

- Run stamp: 20260701-080617
- Marker: SHIFTWORK_DEMO_SIMULATION_TOKEN_20260701-080617
- Completion marker: SHIFTWORK_DEMO_SIMULATION_COMPLETE
- Target: staging
- Timeout: 45 minutes
- Target site: https://shiftworkstudio.ai (fallback: https://example.com)
- Platform URL: ${OPULENT_PLATFORM_URL:-https://platform.opulentia.ai}

## Demo credentials

You need demo credentials to log in. Check these env vars:
- OPULENT_DEMO_EMAIL (or DEMO_EMAIL)
- OPULENT_DEMO_PASSWORD (or DEMO_PASSWORD)
- OPULENT_PLATFORM_URL (default: https://platform.opulentia.ai)

If credentials are not in env vars, ASK THE USER to provide them before starting. Do not proceed without credentials.

## Fixture

The training doc fixture is at:
/Users/jeremyalston/Perfect/opulent-os-heavy/frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/training-doc.post-call.json

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
  frontend/qa/artifacts/shiftwork-demo-simulation/recordings/demo-session-20260701-080617.mp4

If on macOS, also enable cua-driver trajectory recording:
  cua-driver recording start frontend/qa/artifacts/shiftwork-demo-simulation/recordings/trajectory-20260701-080617

The video must capture the full session from login to completion. See .agent/skills/cua-driver/RECORDING.md and .agent/skills/monitor/SKILL.md for the recording pattern.

If ffmpeg is not available, use cua-driver screenshot capture at every step as fallback.

### Step 3: Navigate to Opulent platform
Open a browser and navigate to the platform URL. Wait for the login page to fully load. Take a screenshot:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-03-login-page-20260701-080617.png

### Step 4: Log in with demo credentials
Enter the demo email and password into the login form. Click the login/submit button. Wait for the dashboard to load. Take a screenshot:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-04-dashboard-20260701-080617.png

If React #185 crash appears, record it as a MUST-PASS failure.

### Step 5: Create demo workspace
Create a new workspace named "ShiftWork Demo Simulation 20260701-080617" through the UI. Use the workspace creation button or menu. Wait for it to appear. Take a screenshot:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-05-workspace-20260701-080617.png

### Step 6: Upload training doc to workspace
Upload the training doc fixture to the workspace through the UI file upload feature. The file is at:
  /Users/jeremyalston/Perfect/opulent-os-heavy/frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/training-doc.post-call.json

After upload, verify the file appears in the workspace file list. Take a screenshot:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-06-upload-20260701-080617.png

### Step 7: Open a new thread and type the build instruction
Open a new chat thread in the workspace. Type the full build instruction into the chat composer (the unified chat input). Take a screenshot of the typed prompt BEFORE sending:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-07a-prompt-typed-20260701-080617.png

Then press Enter or click Send. Take a screenshot AFTER sending:
  frontend/qa/artifacts/shiftwork-demo-simulation/screenshots/step-07b-prompt-sent-20260701-080617.png

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

STEP I: Call autos_done with summary including: what was built, schedule ID, acceptance result, artifact locations, and marker SHIFTWORK_DEMO_SIMULATION_TOKEN_20260701-080617.
---

### Step 8: Watch the build agent work in real-time
Monitor the thread as the build agent works. Watch for:
- Streaming text responses appearing in the transcript
- Tool call chips appearing (skill_manage, list_files, read_file, document_create, cron_manage, write_file)
- Document panel showing the Verified Automation Report
- Screenshot artifacts appearing in workspace
- Any error messages or crashes

Take screenshots at each key moment:
  step-08a-build-started-20260701-080617.png
  step-08b-modeler-running-20260701-080617.png
  step-08c-automation-report-20260701-080617.png
  step-08d-cron-created-20260701-080617.png
  step-08e-screenshots-appearing-20260701-080617.png
  step-08f-acceptance-result-20260701-080617.png
  step-08g-how-to-guide-20260701-080617.png
  step-08h-autos-done-20260701-080617.png

Note any UX issues: slow rendering, missing tool chips, broken streaming, layout issues, React #185 crash. Wait up to 30 minutes for the build agent to complete (autos_done call).

### Step 9: Verify workspace artifacts through the UI
Navigate to the workspace file list. Verify: training doc, Verified Automation Report, screenshots (>=4), run report, how-to guide. Open each to confirm readable. Take a screenshot:
  step-09-workspace-artifacts-20260701-080617.png

### Step 10: Verify cron schedule through the UI
Navigate to the agent's schedule or trigger management UI. Verify the cron schedule (weekday 8 AM Central) is visible and active. Check manual on-demand trigger. Take a screenshot:
  step-10-cron-schedule-ui-20260701-080617.png

### Step 11: Evaluate against pass/fail criteria
Read the pass/fail criteria from:
  /Users/jeremyalston/Perfect/opulent-os-heavy/frontend/qa/artifacts/shiftwork-demo-simulation/demo-pass-fail-criteria.json

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
  /Users/jeremyalston/Perfect/opulent-os-heavy/frontend/qa/artifacts/shiftwork-demo-simulation/demo-findings-template.json

Fill in all fields including: overall verdict, per-criterion results, workspace artifacts, demoer feedback, video evidence, screenshot evidence, errors, timing, recommendations. Write it to:
  /Users/jeremyalston/Perfect/opulent-os-heavy/frontend/qa/artifacts/shiftwork-demo-simulation/demo-findings-20260701-080617.json

### Step 14: Stop video recording
Stop ffmpeg screen capture. Verify the video file exists and is playable:
  ffprobe -v error -show_streams frontend/qa/artifacts/shiftwork-demo-simulation/recordings/demo-session-20260701-080617.mp4

If cua-driver trajectory recording was enabled, stop it:
  cua-driver recording stop

### Step 15: Call autos_done with completion marker
Call autos_done with result including SHIFTWORK_DEMO_SIMULATION_COMPLETE and a summary of the findings, including the video path and overall verdict.

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
