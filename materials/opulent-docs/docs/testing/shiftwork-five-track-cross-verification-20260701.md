# ShiftWork Five-Track Cross Verification - 2026-07-01

## Verdict

The committed `60fddc1ba` ShiftWork run reported `5/5 PASS`, but cross-verification downgrades the run to:

**0 verified PASS, 5 INCONCLUSIVE, rerun required.**

The Sentry no-regression claim is still useful. The agent-workflow completion claim is not sufficiently proven.

## Finding

The ShiftWork runner used the same marker-only pattern that was already rejected for the Opulent live interops runner:

- Each scenario prompt includes its completion marker.
- The runner searched the full page body for that marker.
- The final screenshots show prompt/checklist marker text while the agent is still early in tool execution.
- `judge-result.json` files record `screenshots: []`, so the JSON verdict is not bound to the PNG evidence.
- No `promptBaselineTextPath`, `pageTextPath`, or `verification` object exists in the legacy results.

## Visual Artifact Review

| Scenario | Screenshot reviewed | Result |
| --- | --- | --- |
| `SHIFTWORK-INTAKE-VQA-MARKETING-01` | `SW-VQA-MARKETING-01-final.png` | Shows prompt marker and early `find /opulent/workspace` work; no completed writer/reader/file/build-plan/validation evidence. |
| `SHIFTWORK-INTAKE-VQA-SALES-02` | `SW-VQA-SALES-02-final.png` | Shows prompt/checklist marker and early `Searching Code` / `LightReading Code`; no completed workflow evidence. |
| `SHIFTWORK-INTAKE-VQA-FULFILLMENT-03` | `SW-VQA-FULFILLMENT-03-final.png` | Existing snippet is prompt-adjacent marker text; no bound verification fields. |
| `SHIFTWORK-INTAKE-VQA-SERVICE-04` | `SW-VQA-SERVICE-04-final.png` | Existing snippet is prompt-adjacent marker text; no bound verification fields. |
| `SHIFTWORK-INTAKE-VQA-OPS-05` | `SW-VQA-OPS-05-final.png` | Existing snippet is prompt-adjacent marker text; no bound verification fields. |

## Source Log Review

### Sentry

Sentry event search over the last 2 hours still shows historical production events for `OPULENT-BE`, last seen `2026-07-01T02:12:07Z`, before the ShiftWork run window (`2026-07-01T03:23Z` to `03:30Z`). No later recurrence attributable to the ShiftWork run was found.

### Convex Prod Logs

Convex prod was checked through the required `frontend/.env.deploy` target:

```bash
cd frontend
npx convex logs --env-file .env.deploy --history 200
```

`frontend/.env.deploy` points at `prod:confident-sheep-333`.

The sampled logs showed warning classes that must be included in future closeout:

- `tools.intent.missing_or_invalid`
- `tools.args.sanitized`
- deprecated `document_append` invocation
- `tools/daytona:runCommand` dangling mutation warning

These do not by themselves prove the ShiftWork interops failed, but the legacy report omitted them.

## Runner Hardening Applied

`frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/run-all-shiftwork-interops.mjs` now requires:

- Prompt baseline capture before submit.
- Completion marker after the prompt, not in the prompt echo.
- Full page text artifact.
- Screenshot paths stored in `judge-result.json`.
- Structured evidence brief: `claim checked`, `data/tool source`, `artifact`, `blockers`, `next action`.
- Required intake terms after prompt: `workspace`, `writer thread`, `reader thread`, `fileId`, `owner_confirmed`, `draft_from_research_unconfirmed`, `visual QA`, `acceptance inputs`, `build plan`, `validation_check`.
- Connector/auth/runtime blockers force FAIL.

## Rerun Command

```bash
cd frontend
node qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/run-all-shiftwork-interops.mjs
```

Only mark PASS after all five `judge-result.json` files contain:

- `verification.markerOccurrencesAfterPrompt > 0`
- `verification.missingRequiredTerms: []`
- `verification.missingEvidenceBriefTerms: []`
- `verification.blockerMatches: []`
- non-empty `screenshots`
- `promptBaselineTextPath`
- `pageTextPath`
- Sentry after query
- Convex log review
