# ShiftWork Interops And Testing Process - 2026-07-01

## Purpose

These interops test whether Opulent can build an agent end to end from a ShiftWork intake form. The current simulations focus on visual quality agents because they are concrete enough to verify: the intake must produce URLs, route checks, desktop/mobile screenshot requirements, alert rules, storage artifacts, and acceptance inputs.

All current ShiftWork interops are `SPEC_READY_LIVE_RUN_UNTESTED`. The fixtures and scenario prompts are ready, but no live platform run has recorded workspace IDs, reader/writer thread IDs, Drive file IDs, validation IDs, Sentry before/after evidence, or screenshots.

## Source Materials

Dan Cruden / ShiftWork materials were extracted from Outlook into `/Users/jeremyalston/Downloads/outlook-agent-intake/`.

Primary source files:

- `shiftwork-build-pipeline-sow.txt`
- `ShiftWork_Opulent_Pipeline_Notes.txt`
- `ShiftWork_Opulent_Runbook_v2.txt`
- `01_Marketing_Discovery_Template.txt`
- `02_Sales_Discovery_Template.txt`
- `03_Fulfillment_Discovery_Template.txt`
- `04_Service_Discovery_Template.txt`
- `05_Ops_Discovery_Template.txt`
- `Dan Cruden - Shiftwork __ Opulent AI(Morgan Abraham) - 2026_06_12 09_58 EDT - Notes by Gemini.txt`

The visual QA request was adapted from the pasted "Catch Visual Regressions Before Every PR" skill. The adaptation changes repo PR checks into business website monitoring: screenshot public pages on desktop/mobile, detect visual inconsistencies, and draft email alerts.

## Interop Suites

### 1. Drive-Anywhere Visual QA Agent

**Spec:** `docs/testing/shiftwork-intake-drive-anywhere-interop-20260701.md`
**Artifacts:** `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/`
**Status:** `SPEC READY / LIVE RUN UNTESTED`

This is the narrow proof. A single simulated Google Drive intake answer describes a landing-page visual QA agent for Northstar Renovations.

It verifies that a paid ShiftWork intake can preserve:

- Required handoff payload fields.
- Drive-like source identity.
- Owner-confirmed build-critical answers.
- Landing page URL.
- Desktop and mobile viewport requirements.
- Route-specific visual checks.
- Inconsistency criteria.
- Email alert recipients and subject prefix.
- Schedule and manual-run fallback.
- Acceptance test for screenshots and alert draft behavior.

The red loop: a later reader thread must retrieve the same Drive-like artifact and generate a build-ready visual QA agent plan without relying on the original writer thread.

### 2. Five-Track Visual QA Expansion

**Spec:** `docs/testing/shiftwork-intake-five-track-visual-qa-interops-20260701.md`
**Artifacts:** `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/`
**Status:** `SPEC_READY_LIVE_RUN_UNTESTED`

This expands the same proof across all five ShiftWork questionnaire tracks:

| Scenario | Track | Questionnaire | Agent request |
| --- | --- | --- | --- |
| `SHIFTWORK-INTAKE-VQA-MARKETING-01` | Marketing | `01_Marketing_Discovery_Template` | Monitor public marketing landing page for conversion-breaking visual regressions. |
| `SHIFTWORK-INTAKE-VQA-SALES-02` | Sales | `02_Sales_Discovery_Template` | Monitor quote and booking page for form and scheduling regressions. |
| `SHIFTWORK-INTAKE-VQA-FULFILLMENT-03` | Fulfillment | `03_Fulfillment_Discovery_Template` | Monitor customer welcome/status page for document and update regressions. |
| `SHIFTWORK-INTAKE-VQA-SERVICE-04` | Service | `04_Service_Discovery_Template` | Monitor support/contact/FAQ page for customer-help regressions. |
| `SHIFTWORK-INTAKE-VQA-OPS-05` | Ops | `05_Ops_Discovery_Template` | Monitor operations/admin-facing page for crew, invoice, and inbox workflow regressions. |

The five-track suite verifies that questionnaire selection is not a black box. Each scenario must select exactly one questionnaire and that questionnaire must match the requested track.

## Shared ShiftWork Requirements Under Test

- Customer selects use case and agent task before handoff.
- Handoff happens only after a paid `$29` lead.
- Handoff payload is payload-only. No GitHub or codebase access is required.
- Payload includes lead ID, timestamp, name, business, email, domain or no-domain flag, use case, agent task, build request, and paid status.
- Opulent validates the payload before research/build.
- Opulent selects exactly one of five questionnaire tracks.
- Research guesses are prompts only and stay tagged unconfirmed.
- Build-critical answers must be owner-confirmed before build.
- Build plan is generated from retrieved intake only.
- Acceptance test uses five real inputs, including the owner's must-pass case.
- Delivery must account for hosting/runtime payer, customer access, how-to, and ROI follow-up.

## Testing Process

### Fixture Validation

Run this before any live execution:

```bash
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/shiftwork-intake-answer.google-drive-sim.json >/dev/null
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/scenarios/shiftwork_intake_drive_anywhere.scenario.json >/dev/null
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/report.json >/dev/null

python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/fixtures/shiftwork-five-track-intake-fixtures.json >/dev/null
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/scenarios/shiftwork_five_track_visual_qa.scenarios.json >/dev/null
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/report.json >/dev/null
```

### Live Execution Loop

For each scenario:

1. Lock model to `openrouter/poolside/laguna-m.1:free`.
2. Create an isolated workspace named with the scenario ID and run stamp.
3. Create a writer thread.
4. Persist the matching intake fixture to `/opulent/workspace/uploads/drive/<scenarioId>-<runStamp>.json`.
5. Read the file in the writer thread and verify:
   - marker
   - paid handoff payload
   - selected questionnaire
   - owner-confirmed build-critical answers
   - unconfirmed research-only answers
   - visual QA request fields
   - email draft rules
   - acceptance inputs
6. Save/list workspace files and record the file ID.
7. Create a separate reader thread in the same workspace.
8. Retrieve the persisted file by file ID into the reader thread.
9. Read the retrieved file and verify the same marker and build-critical details.
10. Generate the agent build plan from the retrieved intake only.
11. Run `validation_check`.
12. Call `autos_done` with the scenario completion marker.

### Observability

Every live run must record:

- Workspace ID.
- Writer thread ID.
- Reader thread ID.
- Drive/workspace file ID.
- Validation check ID.
- Before and after Sentry query.
- Linear issue/comment or handoff-only closeout.
- Screenshots/video if the live run opens target URLs.
- Email mode, which must remain draft-only unless live send is explicitly approved.

Sentry baseline query:

```text
is:unresolved environment:production
```

The single Drive-anywhere interop also uses a narrower workspace retrieval query:

```text
is:unresolved environment:production "workspace_manage" OR "retrieve_file" OR "drive"
```

## Verdict Rules

PASS requires:

- Exact marker verified before and after retrieval.
- Writer and reader threads are different.
- Reader thread does not rely on original writer context.
- Required payload fields are present.
- `paymentStatus` is `paid`.
- Questionnaire matches track.
- Build-critical answers are `owner_confirmed`.
- Research guesses remain `draft_from_research_unconfirmed`.
- Visual QA request is build-ready.
- Build plan is generated from retrieved intake only.
- Sentry has no new scenario-caused production error.
- Linear/Sentry closeout evidence is written or handed off.

FAIL if any of these happen:

- Required payload field is missing.
- Payment is not paid.
- Wrong questionnaire is selected.
- Owner confirmation is missing on build-critical answer.
- Research guess is promoted to training truth.
- Workspace Drive persistence or retrieval fails.
- Reader thread leaks original writer context.
- Visual QA request lacks URL, viewports, route checks, alert rules, schedule, or acceptance inputs.
- Email is sent live without approval.
- Model lock is wrong.
- Sentry regresses during the run.

BLOCKED if auth, workspace Drive, file retrieval, Sentry, Linear, or model selection cannot be accessed.

UNTESTED means the spec and fixtures exist but no platform run has executed.

## Current Artifact Map

Single-scenario suite:

- `docs/testing/shiftwork-intake-drive-anywhere-interop-20260701.md`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/shiftwork-intake-answer.google-drive-sim.json`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/scenarios/shiftwork_intake_drive_anywhere.scenario.json`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/agent-build-plan-from-intake.md`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/report.json`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/linear-handoff.md`

Five-track suite:

- `docs/testing/shiftwork-intake-five-track-visual-qa-interops-20260701.md`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/source-summary.md`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/fixtures/shiftwork-five-track-intake-fixtures.json`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/scenarios/shiftwork_five_track_visual_qa.scenarios.json`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/report.json`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/linear-handoff.md`

Tracking:

- `frontend/qa/ARTIFACT_PIPELINE_TRACKING.md`

## Next Step

Run the five-track scenario suite on staging or `platform.opulentia.ai`, then update each report result with live workspace IDs, thread IDs, file IDs, validation IDs, Sentry before/after evidence, and final PASS/FAIL/BLOCKED verdicts.
