# ShiftWork Intake Five-Track Visual QA Interops - 2026-07-01

## Source

- Capability/spec: Dan Cruden / ShiftWork agent intake materials exported from Outlook to `/Users/jeremyalston/Downloads/outlook-agent-intake/`.
- Primary sources:
  - `shiftwork-build-pipeline-sow.txt`
  - `ShiftWork_Opulent_Pipeline_Notes.txt`
  - `ShiftWork_Opulent_Runbook_v2.txt`
  - `01_Marketing_Discovery_Template.txt`
  - `02_Sales_Discovery_Template.txt`
  - `03_Fulfillment_Discovery_Template.txt`
  - `04_Service_Discovery_Template.txt`
  - `05_Ops_Discovery_Template.txt`
- Existing base interop copied/adapted from: `docs/testing/shiftwork-intake-drive-anywhere-interop-20260701.md`.
- Tracker mode: handoff-only until live Linear issue creation is explicitly approved.

## Target

- Environment: `platform.opulentia.ai` or staging.
- Convex prod SSOT: `prod:confident-sheep-333`.
- Model lock: `openrouter/poolside/laguna-m.1:free`.
- Artifact dir: `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/`.
- Source handoff mode: simulated Google Drive / Supabase payload fixtures. No real OAuth, email send, or payment capture in this package.

## Red Loop

Each interop must prove that Opulent can take a paid ShiftWork intake payload, select the correct questionnaire track, preserve owner-confirmed build-critical answers, retrieve the populated intake from a Drive-like artifact in a later thread, and produce an end-to-end visual quality agent build plan. The scenario fails if it can pass by prose only, by untagged research guesses, by the wrong questionnaire, by missing visual QA acceptance inputs, or by depending on the original writer thread context.

## Shared ShiftWork Requirements

| Requirement | Source |
| --- | --- |
| Customer selects use case and agent task before handoff. | SOW steps 01-02; Runbook Step 1 |
| Payload-only handoff after $29 paid lead. | SOW handoff contract; Pipeline notes appendix |
| Payload must include lead ID, timestamp, name, business, email, domain/no-domain flag, use case, agent task, build request, and paid status. | Pipeline notes appendix; Runbook Step 4 |
| Opulent researches lead, selects exactly one of five questionnaire tracks, drafts Q&A, prepares call script, and validates gaps before build. | SOW Phase B; Runbook Steps 5-12 |
| Research guesses are prompts only and must be tagged unconfirmed. | Pipeline notes Steps 8-9; Runbook Steps 8-11 |
| Build-critical answers must be owner-confirmed before build. | Runbook Step 11 |
| Acceptance uses five real inputs, including the owner's must-pass case. | Pipeline notes Step 13; Runbook Step 13 |
| Delivery requires hosting/runtime payer, customer access, how-to, and ROI follow-up. | Pipeline notes Steps 14-15; Runbook Steps 14-15 |

## Scenario Index

| Scenario ID | Track | Questionnaire | Visual QA request | Must-pass owner case |
| --- | --- | --- | --- | --- |
| `SHIFTWORK-INTAKE-VQA-MARKETING-01` | Marketing | `01_Marketing_Discovery_Template` | Monitor public marketing landing page for conversion-breaking visual regressions. | Hero, offer, reviews, and primary CTA visible on mobile. |
| `SHIFTWORK-INTAKE-VQA-SALES-02` | Sales | `02_Sales_Discovery_Template` | Monitor quote/booking page for form and scheduling regressions. | Quote form and booking CTA visible and usable on mobile. |
| `SHIFTWORK-INTAKE-VQA-FULFILLMENT-03` | Fulfillment | `03_Fulfillment_Discovery_Template` | Monitor customer welcome/status page for document and project-update regressions. | Welcome checklist, timeline, and document upload links render. |
| `SHIFTWORK-INTAKE-VQA-SERVICE-04` | Service | `04_Service_Discovery_Template` | Monitor support/contact/FAQ page for customer-help regressions. | Phone, contact form, FAQ, and escalation copy render. |
| `SHIFTWORK-INTAKE-VQA-OPS-05` | Ops | `05_Ops_Discovery_Template` | Monitor operations/admin-facing landing page for crew, invoice, and inbox workflow regressions. | Admin CTA, crew schedule, invoice status, and inbox triage blocks render. |

## Shared Assertions

| ID | Assertion | Evidence |
| --- | --- | --- |
| SW5-A1 | Handoff payload contains every required ShiftWork field and `paymentStatus: paid`. | `fixtures/shiftwork-five-track-intake-fixtures.json[].handoffPayload` |
| SW5-A2 | Scenario selects exactly one questionnaire and the selected questionnaire matches the track. | `fixtures/shiftwork-five-track-intake-fixtures.json[].selectedQuestionnaire` |
| SW5-A3 | Every build-critical visual QA answer is tagged `owner_confirmed`; research-only lines stay `draft_from_research_unconfirmed`. | `fixtures/shiftwork-five-track-intake-fixtures.json[].answers` |
| SW5-A4 | Writer thread persists the populated intake answer to workspace Drive and returns a file ID. | `report.json.results[].workspace.driveFileId` |
| SW5-A5 | Reader thread differs from writer thread and retrieves the same marker without original thread context. | `report.json.results[].workspace.writerThreadId`, `readerThreadId`, `retrievedMarker` |
| SW5-A6 | Retrieved intake includes a build-ready visual QA agent request: URL/routes, desktop/mobile viewports, route checks, inconsistency criteria, alert recipients, schedule, artifacts, and five acceptance inputs. | `fixtures/shiftwork-five-track-intake-fixtures.json[].visualQualityAgentRequest` |
| SW5-A7 | Build plan is generated from retrieved intake only and names trigger, screenshot steps, checks, email behavior, storage artifacts, hosting/runtime payer gate, and ROI follow-up. | Live thread transcript and `report.json.results[].buildPlan` |
| SW5-A8 | Sentry before/after checks show no new scenario-caused production error. | `report.json.sentry` |

## Execution

Run each scenario from `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/scenarios/shiftwork_five_track_visual_qa.scenarios.json`.

For each scenario:

1. Create or reuse an isolated test workspace named with the scenario ID and run stamp.
2. Create a writer thread.
3. Write the matching fixture from `fixtures/shiftwork-five-track-intake-fixtures.json` to `/opulent/workspace/uploads/drive/<scenarioId>-<runStamp>.json`.
4. Read it in the writer thread and verify marker, paid payload, selected questionnaire, owner-confirmed build-critical answers, unconfirmed research-only answers, visual QA route checks, email-alert rules, and five acceptance inputs.
5. Save/list workspace files and record the file ID.
6. Create a second reader thread in the same workspace.
7. Retrieve the Drive-like file by file ID into the reader thread.
8. Read it in the reader thread and verify the same marker plus all build-critical details.
9. Produce a build plan from the retrieved intake only.
10. Run `validation_check`.
11. Call `autos_done` with the scenario's completion marker.

## Observability

- Sentry before: `is:unresolved environment:production`.
- Sentry after: same query constrained to the run window.
- Linear update: handoff-only comment in `linear-handoff.md` unless live writes are approved.
- Convex/run IDs: record workspace ID, writer thread ID, reader thread ID, run ID, file ID, validation ID.
- Screenshots/video: required if the live build plan actually opens target URLs; spec-only fixture validation does not require screenshots.
- Email mode: draft-only. Live send is forbidden without explicit approval.

## Verdict Rules

- PASS: all shared assertions pass for all five scenarios, exact markers are verified before and after retrieval, build plans are generated from retrieved intakes, Sentry has no new scenario-caused error, and Linear/Sentry closeout evidence is written or handed off.
- FAIL: required payload field missing, wrong questionnaire selected, build-critical answer lacks `owner_confirmed`, research guess is used as training truth, visual QA request is incomplete, reader thread cannot retrieve the file, model lock is wrong, Sentry regresses, or email is sent live without approval.
- BLOCKED: auth, workspace Drive, file retrieval, Sentry, or model selection cannot be accessed.
- UNTESTED: spec exists but no live run has executed.

## Failure Classes

- `handoff_required_field_missing`
- `payment_not_paid`
- `wrong_questionnaire_track`
- `owner_confirmation_tag_missing`
- `research_guess_promoted_to_truth`
- `drive_persistence_missing`
- `reader_thread_context_leak`
- `visual_agent_request_incomplete`
- `acceptance_inputs_missing`
- `email_live_send_without_approval`
- `sentry_regression`
- `model_lock_mismatch`

## Cleanup

- Archive test workspace threads.
- Remove temporary workspace Drive files when disposable.
- Keep fixture JSON and reports in repo.
- Revoke real Drive links if fixtures are replaced by OAuth-backed files.
- Do not send live emails unless explicitly approved.

## Validation

```bash
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/fixtures/shiftwork-five-track-intake-fixtures.json >/dev/null
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/scenarios/shiftwork_five_track_visual_qa.scenarios.json >/dev/null
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/report.json >/dev/null
```

Live execution status: `LIVE_RUN_REVIEW_FAILED_RERUN_REQUIRED`.

The 2026-07-01 03:23–03:30 UTC run reported `5/5 PASS`, but cross-verification found the legacy runner could pass on completion markers echoed in the submitted prompt. Treat those results as `5 INCONCLUSIVE` until rerun with the hardened runner. See `docs/testing/shiftwork-five-track-cross-verification-20260701.md`.

| Scenario | Track | Fixture | Live status |
| --- | --- | --- | --- |
| `SHIFTWORK-INTAKE-VQA-MARKETING-01` | Marketing | `shiftwork-five-track-intake-fixtures.json` | INCONCLUSIVE — rerun required |
| `SHIFTWORK-INTAKE-VQA-SALES-02` | Sales | `shiftwork-five-track-intake-fixtures.json` | INCONCLUSIVE — rerun required |
| `SHIFTWORK-INTAKE-VQA-FULFILLMENT-03` | Fulfillment | `shiftwork-five-track-intake-fixtures.json` | INCONCLUSIVE — rerun required |
| `SHIFTWORK-INTAKE-VQA-SERVICE-04` | Service | `shiftwork-five-track-intake-fixtures.json` | INCONCLUSIVE — rerun required |
| `SHIFTWORK-INTAKE-VQA-OPS-05` | Ops | `shiftwork-five-track-intake-fixtures.json` | INCONCLUSIVE — rerun required |

Model lock `openrouter/poolside/laguna-m.1:free` was present in all 5 legacy `judge-result.json` files. Sentry did not show a scenario-caused production regression. Completion proof must be rerun because the legacy JSON lacks bound screenshot paths, prompt baseline, full page text, and structured verification evidence.
