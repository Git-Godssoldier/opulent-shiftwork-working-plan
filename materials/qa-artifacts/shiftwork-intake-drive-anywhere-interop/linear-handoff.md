# Linear Handoff: SHIFTWORK-INTAKE-DRIVE-ANYWHERE-INTEROP-01

## Summary

Create a live interop to verify that a populated ShiftWork intake answer, shaped like it originated in Google Drive, can be persisted to Opulent workspace Drive, retrieved from a later thread without relying on the original chat context, and converted into a build-ready landing-page visual QA agent request.

## Model

`openrouter/poolside/laguna-m.1:free`

## Artifact Paths

- Spec: `docs/testing/shiftwork-intake-drive-anywhere-interop-20260701.md`
- Fixture: `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/shiftwork-intake-answer.google-drive-sim.json`
- Scenario prompt: `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/scenarios/shiftwork_intake_drive_anywhere.scenario.json`
- Report stub: `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/report.json`
- Build plan from intake: `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/agent-build-plan-from-intake.md`

## Assertions

| ID | Expected Evidence |
| --- | --- |
| SW-DRIVE-A1 | Drive-like identity and `anyone_with_link` share mode in fixture |
| SW-DRIVE-A2 | Complete ShiftWork handoff payload |
| SW-DRIVE-A3 | Owner-confirmed tags on all build-critical visual QA answers |
| SW-DRIVE-A4 | Writer thread snapshot/list_files returns real file ID |
| SW-DRIVE-A5 | Reader thread retrieve_file/read_file verifies exact marker |
| SW-DRIVE-A6 | Reader thread differs from writer thread and does not depend on original chat context |
| SW-DRIVE-A7 | Retrieved intake includes landing page URL, desktop/mobile screenshot requirements, route checks, inconsistency criteria, email recipients, schedule, and acceptance test |

## Sentry

Before and after query:

```text
is:unresolved environment:production "workspace_manage" OR "retrieve_file" OR "drive"
```

PASS requires no new scenario-caused production errors during the run window.

## Cleanup

Archive test threads, remove disposable workspace files, keep email live-send disabled unless explicitly approved, and revoke any real Google Drive share link if a future live run replaces the fixture with an OAuth-backed file.
