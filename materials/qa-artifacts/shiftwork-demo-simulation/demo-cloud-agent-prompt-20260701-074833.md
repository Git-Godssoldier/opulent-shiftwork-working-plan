# ShiftWork Demo Simulation — Cloud Agent Instructions

You are a cloud agent testing Opulent's doc-to-deploy pipeline end to end. You have access to the Opulent platform and its tools. Follow these instructions exactly. At the end, produce a findings report and return it.

## Context

ShiftWork hands a completed training doc to Opulent. Opulent's job is to find the doc, build a visual QA agent from it, run acceptance tests, and deliver the agent on the platform. This simulation tests that full flow.

## Run details

- Run stamp: 20260701-074833
- Marker: SHIFTWORK_DEMO_SIMULATION_TOKEN_20260701-074833
- Completion marker: SHIFTWORK_DEMO_SIMULATION_COMPLETE
- Target: staging
- Timeout: 45 minutes
- Target site: https://shiftworkstudio.ai (fallback: https://example.com)

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
Call skill_manage action=invoke for opulentia-engineering-discipline. This is mandatory.

### Step 2: Create demo workspace
Create a workspace named "ShiftWork Demo Simulation 20260701-074833". Record the workspaceId.

### Step 3: Create build agent thread
Create a thread in the demo workspace. Record the threadId. This is the build agent thread.

### Step 4: Upload training doc to workspace
Read the fixture at /Users/jeremyalston/Perfect/opulent-os-heavy/frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/training-doc.post-call.json. Write it to the workspace at /opulent/workspace/uploads/shiftwork-training-doc-SW-20260701-001-20260701-074833.json. Replace the marker value in the JSON with SHIFTWORK_DEMO_SIMULATION_TOKEN_20260701-074833. Preserve all other fields.

### Step 5: Send build instruction to agent thread
Send a message to the build agent thread with this prompt:

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

STEP I: Call autos_done with summary including: what was built, schedule ID, acceptance result, artifact locations, and marker SHIFTWORK_DEMO_SIMULATION_TOKEN_20260701-074833.
---

### Step 6: Monitor build agent
Monitor the build agent thread for completion. Check for:
- skill_manage call for opulentia-automation-modeler
- document_create or write_file for Verified Automation Report
- cron_manage action=create
- screenshot artifacts in workspace
- report artifact in workspace
- autos_done call with marker

Use session_manage action=status to check progress. Wait up to 30 minutes.

### Step 7: Collect workspace artifacts
List all files in the workspace. Read the Verified Automation Report, acceptance test report, and how-to guide if they exist. Count screenshots. Record all paths.

### Step 8: Evaluate against pass/fail criteria
Read the pass/fail criteria from:
/Users/jeremyalston/Perfect/opulent-os-heavy/frontend/qa/artifacts/shiftwork-demo-simulation/demo-pass-fail-criteria.json

For each criterion, mark PASS, FAIL, PARTIAL, or SKIP with evidence.

### Step 9: Produce findings report
Generate a findings report using the template at:
/Users/jeremyalston/Perfect/opulent-os-heavy/frontend/qa/artifacts/shiftwork-demo-simulation/demo-findings-template.json

Fill in all fields. Write the report to:
/Users/jeremyalston/Perfect/opulent-os-heavy/frontend/qa/artifacts/shiftwork-demo-simulation/demo-findings-20260701-074833.json

Also write it to the workspace as a document.

### Step 10: Call autos_done with completion marker
Call autos_done with result including SHIFTWORK_DEMO_SIMULATION_COMPLETE and a summary of findings.

## Pass/Fail rules

- PASS: All 14 MUST-PASS criteria pass AND at least 20 of 24 total criteria pass
- PARTIAL: All 14 MUST-PASS criteria pass AND 15-19 of 24 pass
- FAIL: Any MUST-PASS fails OR fewer than 15 pass

## What to return

Return the findings report JSON. Include:
1. Overall verdict (PASS/PARTIAL/FAIL)
2. Per-criterion results with evidence
3. Workspace artifact list
4. Build agent thread URL
5. Errors encountered
6. Recommendations

## Runbook overrides (already decided, do not change)

- Scope decider: auto-decide (no human gate for single vs orchestrated)
- Steps 5-11: ShiftWork's job (not Opulent)
- VAPI: not handled by Opulent (crew call only)
- Customer login: skip for POC
- Runtime payer enforcement: skip for POC
- Dreams in memory: skip for POC
- Email: draft-only (R01 unconfirmed)

## Model strategy

- Build agent: strong model (Opus or Sonnet)
- Running visual QA agent: cheap model (Haiku or open-source)

## Sandbox

- Daytona sandbox with secrets management
- No codebase access, no DOM access
- Screenshots only
