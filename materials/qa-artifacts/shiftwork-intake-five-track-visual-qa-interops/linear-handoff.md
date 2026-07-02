# Linear Handoff: ShiftWork Five-Track Intake Visual QA Interops

## Summary

Create five live interops proving that Opulent can build an agent end to end from a ShiftWork intake form. Each scenario uses a simulated Google Drive populated intake answer and a paid Supabase/Vercel-style handoff payload, then verifies that a later reader thread can retrieve the artifact and produce a build-ready visual quality agent plan without relying on the original thread context.

## Scenarios

| Scenario | Track | Questionnaire | Completion marker |
| --- | --- | --- | --- |
| `SHIFTWORK-INTAKE-VQA-MARKETING-01` | Marketing | `01_Marketing_Discovery_Template` | `SHIFTWORK_INTAKE_VQA_MARKETING_COMPLETE` |
| `SHIFTWORK-INTAKE-VQA-SALES-02` | Sales | `02_Sales_Discovery_Template` | `SHIFTWORK_INTAKE_VQA_SALES_COMPLETE` |
| `SHIFTWORK-INTAKE-VQA-FULFILLMENT-03` | Fulfillment | `03_Fulfillment_Discovery_Template` | `SHIFTWORK_INTAKE_VQA_FULFILLMENT_COMPLETE` |
| `SHIFTWORK-INTAKE-VQA-SERVICE-04` | Service | `04_Service_Discovery_Template` | `SHIFTWORK_INTAKE_VQA_SERVICE_COMPLETE` |
| `SHIFTWORK-INTAKE-VQA-OPS-05` | Ops | `05_Ops_Discovery_Template` | `SHIFTWORK_INTAKE_VQA_OPS_COMPLETE` |

## Artifact Paths

- Spec: `docs/testing/shiftwork-intake-five-track-visual-qa-interops-20260701.md`
- Source summary: `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/source-summary.md`
- Fixtures: `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/fixtures/shiftwork-five-track-intake-fixtures.json`
- Scenario prompts: `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/scenarios/shiftwork_five_track_visual_qa.scenarios.json`
- Report stub: `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/report.json`

## Required Live Evidence

- Model lock: `openrouter/poolside/laguna-m.1:free`.
- Workspace ID per scenario.
- Writer and reader thread IDs per scenario.
- Drive file ID per scenario.
- Read-before and read-after marker verification.
- Selected questionnaire exactly matches the scenario track.
- Build-critical answers are `owner_confirmed`.
- Research-only answers stay `draft_from_research_unconfirmed`.
- Visual QA request contains routes, desktop/mobile viewports, checks, inconsistency criteria, alert recipients, schedule, and five acceptance inputs.
- Build plan is generated from retrieved intake only.
- Sentry before/after query shows no scenario-caused production regression.

## Verdict

PASS all five only if every scenario passes independently. A wrong questionnaire, missing owner confirmation, missing acceptance input, file retrieval failure, live email send without approval, Sentry regression, or model mismatch is a FAIL.
