# SHIFTWORK-INTAKE-DRIVE-ANYWHERE-INTEROP-01: Visual QA Agent From Populated Intake

## Source

- Capability/spec: Dan Cruden / ShiftWork intake materials exported from Outlook on 2026-07-01; local source folder `/Users/jeremyalston/Downloads/outlook-agent-intake/`
- Owning code path: workspace file durability surfaces, especially `workspace_manage` create/create_thread/save_snapshot/list_files/retrieve_file plus `read_file` and `validation_check`
- Adapted request source: attached `Catch Visual Regressions Before Every PR` repo-skill text, converted from PR-only repo QA into a small-business landing-page visual monitoring agent
- Tracker: handoff-only until a Linear issue is created

## Target

- Environment: `platform.opulentia.ai` or staging with production-equivalent workspace file persistence
- Model: `openrouter/poolside/laguna-m.1:free`
- Artifact dir: `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/`

## Red Loop

If Opulent cannot turn a populated intake form into a build-ready visual QA agent request, then retrieve that request from a later workspace/thread with the exact marker, owner-confirmed landing-page requirements, screenshot checks, and email-alert rules intact, the scenario must go red. File-write-only proof is not enough; the later reader thread must retrieve the Drive-like artifact and prove it has enough detail to build the agent end to end.

## Setup

- Data: `fixtures/shiftwork-intake-answer.google-drive-sim.json`
- Credentials/OAuth: none for the fixture run; live rerun may replace the fixture with a real Google Drive file or connector file handle
- Fixtures: populated ShiftWork visual quality agent intake answer, Drive-like metadata, share mode `anyone_with_link`, owner-confirmed answer tags, handoff payload, viewport checks, baseline references, schedule, and email-alert rules
- Cleanup: remove temporary workspace, archive test threads, revoke any real Drive share link if a live Google Drive connector is used

## Assertions

| ID | Assertion | Evidence |
| --- | --- | --- |
| SW-DRIVE-A1 | Intake answer fixture has a Drive-like identity and share mode that can be referenced outside the original thread. | `fixtures/shiftwork-intake-answer.google-drive-sim.json.drive` |
| SW-DRIVE-A2 | Handoff payload contains every required ShiftWork field: lead ID, timestamp, name, business, email, domain/no-domain flag, use case, agent task, build request, and paid status. | `fixtures/shiftwork-intake-answer.google-drive-sim.json.handoffPayload`; `agentTask` must be visual quality monitoring |
| SW-DRIVE-A3 | Every build-critical visual QA answer is tagged `owner_confirmed`; research-only guesses remain tagged `draft_from_research_unconfirmed`. | `fixtures/shiftwork-intake-answer.google-drive-sim.json.answers` |
| SW-DRIVE-A4 | Writer thread persists the populated intake answer to workspace Drive and records a real file ID. | `report.json.workspace.writerThreadId`, `report.json.workspace.driveFileId` |
| SW-DRIVE-A5 | Reader thread retrieves the same artifact from workspace Drive and verifies `SHIFTWORK_INTAKE_DRIVE_ANYWHERE_TOKEN_20260701`. | `report.json.assertions[]`, reader transcript, `validation_check` |
| SW-DRIVE-A6 | The retrieved answer is accessible without depending on the original chat context. | reader thread ID differs from writer thread ID; exact marker and lead ID are read after retrieval |
| SW-DRIVE-A7 | The retrieved intake is build-ready for a visual quality agent: landing page URL, desktop/mobile viewports, route-specific checks, inconsistency criteria, email recipients, schedule, and acceptance test are present. | `fixtures/shiftwork-intake-answer.google-drive-sim.json.visualQualityAgentRequest`; `expectedAgent` |

## Execution

1. Create a workspace named `ShiftWork intake drive anywhere 20260701`.
2. Create a writer thread in that workspace.
3. Write the populated fixture to `/opulent/workspace/uploads/drive/shiftwork-intake-answer-SW-20260701-001.json`.
4. Read the file and verify `SHIFTWORK_INTAKE_DRIVE_ANYWHERE_TOKEN_20260701`, `SW-20260701-001`, `paymentStatus: paid`, `agentTask: Website visual quality monitoring and email alerts`, and landing page URL.
5. Save a workspace snapshot.
6. List workspace files and capture the returned Drive/workspace file ID for the populated answer.
7. Create a second reader thread in the same workspace.
8. Retrieve the file by the captured file ID into the reader thread.
9. Read the retrieved file and verify the marker, lead ID, owner-confirmed build target, required handoff fields, visual QA route checks, desktop/mobile viewport requirements, email alert recipients, weekday schedule, and acceptance test.
10. Run `validation_check` with the contract: “A populated ShiftWork intake answer that originated as a Google Drive-like document can be persisted once, retrieved by a later workspace/thread, and used to build a landing-page visual QA agent without original thread context.”
11. Call `autos_done` with `SHIFTWORK_INTAKE_DRIVE_ANYWHERE_COMPLETE`.

## Observability

- Sentry before: query `is:unresolved environment:production "workspace_manage" OR "retrieve_file" OR "drive"` for the scenario window
- Sentry after: same query plus timestamp window from run start to run end; PASS requires no new scenario-caused production error
- Linear update: handoff-only unless a test issue exists; include scenario ID, model, workspace ID, writer/reader thread IDs, file ID, assertion table, Sentry before/after links, and cleanup status
- Convex/run IDs: record workspace ID, writer thread ID, reader thread ID, snapshot result, list_files result, retrieve_file result, validation_check ID, and generated agent/build-plan ID if the live run creates the agent
- Screenshots/video: capture writer completion, workspace file listing, reader retrieval, and final validation result if executed through browser UI

## Verdict Rules

- PASS: all seven assertions pass, reader thread retrieves and reads the same marker from the persisted artifact, the visual QA agent request is build-ready, Sentry has no new scenario-caused errors, and Linear/Sentry closeout evidence is written or handed off.
- FAIL: required handoff field missing, owner-confirmed tag missing from a build-critical answer, missing landing-page URL, missing desktop/mobile screenshots requirement, missing alert recipient, retrieval depends on original thread context, marker mismatch, missing file ID, or new Sentry error caused by the run.
- BLOCKED: workspace file retrieval tool unavailable, auth unavailable, Drive connector unavailable for live replacement, or Sentry/Linear access unavailable when live-write mode is required.
- UNTESTED: spec and fixtures exist but no live workspace execution has run.

## Failure Classes

- `drive_fixture_missing_required_field`
- `owner_confirmation_tag_missing`
- `workspace_snapshot_missing`
- `drive_file_id_missing`
- `cross_thread_retrieval_failed`
- `original_thread_context_dependency`
- `marker_mismatch`
- `visual_agent_request_incomplete`
- `email_alert_rule_missing`
- `tracker_closeout_missing`
- `sentry_regression_detected`

## Validation Command

Fixture validation:

```bash
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/shiftwork-intake-answer.google-drive-sim.json >/dev/null
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/report.json >/dev/null
python3 -m json.tool frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/scenarios/shiftwork_intake_drive_anywhere.scenario.json >/dev/null
```

Live gate:

```bash
cd frontend
set -a && source .env.e2e.local && set +a
# Execute the scenario prompt in frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/scenarios/shiftwork_intake_drive_anywhere.scenario.json
```
