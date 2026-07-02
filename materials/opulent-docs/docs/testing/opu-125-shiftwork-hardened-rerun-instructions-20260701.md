# OPU-125 ShiftWork Hardened Rerun Instructions

**Issue:** OPU-125 — OPULENT-BE React error #185 regression  
**Target:** `https://platform.opulentia.ai`  
**Convex:** `prod:confident-sheep-333`  
**Fix commit:** `1a45e97fe` — fixed replay/zero-length delta streaming loop after hardened rerun still reproduced React #185
**Production deploy:** `https://frontend-kl12b3m7g-opulents-projects.vercel.app` aliased to `https://platform.opulentia.ai`
**Runner:** `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/run-all-shiftwork-interops.mjs`

## Preconditions

1. Deploy the `@convex-dev/agent` streaming patch that treats cursor `0` as settled, skips no-op cursor writes, and only treats deltas as new when `lastDelta.end > cursor`.
2. Confirm the deploy applied the patched installed runtime, not only the patch file:

```bash
cd frontend
npm test -- src/hooks/native-messages/__tests__/convex-agent-stream-error-patch.contract.test.ts
```

Expected:

- `node_modules/@convex-dev/agent/dist/react/useDeltaStreams.js` contains `function cursorsEqual`, `!cursorsEqual(cursors, newCursors)`, `oldCursor !== undefined`, and `oldCursor === undefined || oldCursor === delta.start`
- `node_modules/@convex-dev/agent/dist/react/useStreamingUIMessages.js` contains `cursor === undefined`, `lastDelta.end > cursor`, and `Failed to derive streaming UI messages`

3. Confirm Vercel deploy proof:

- Build used `--force` / no remote cache.
- Remote install logged `patch-package` and `@convex-dev/agent@0.6.1 ✔`.
- `https://platform.opulentia.ai` returns `200` after auth redirect.

4. Confirm Sentry production unresolved baseline:

```bash
# Sentry query
is:unresolved environment:production
```

Expected baseline before rerun: no unresolved OPULENT-BE React #185 events after the deploy timestamp.
Current post-deploy check: OPULENT-BE is `resolved`; unresolved production search, direct OPULENT-BE search, and React error #185 search returned no matching production issues.

## Rerun

```bash
cd frontend
node qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/run-all-shiftwork-interops.mjs
```

## Required Success Evidence

Each of the five scenarios must record:

- `verdict: PASS`
- `markerOccurrencesAfterPrompt > 0`
- `autosDoneOccurrencesAfterPrompt > 0`
- no `Minified React error #185` in page text or screenshots
- populated `prompt-baseline-text.txt` and `page-text-retest.txt`
- screenshots bound to the scenario directory
- required terms present: `workspace`, `writer thread`, `reader thread`, `fileid`, `owner_confirmed`, `draft_from_research_unconfirmed`, `visual qa`, `acceptance inputs`, `build plan`, `validation_check`
- evidence brief terms present: `claim checked`, `data/tool source`, `artifact`, `blockers`, `next action`

Additional production proof required before closing OPU-125:

- Reload each generated thread URL after completion and confirm no error boundary appears.
- Capture browser console/unhandled rejection output; no `Maximum update depth exceeded`, no `Minified React error #185`, and no repeated stream-derivation warning storm.
- Verify final assistant content is complete after prompt-baseline subtraction, not only non-crashing.
- Query Sentry again after the rerun for `is:unresolved environment:production`, `OPULENT-BE environment:production`, and `React error #185 environment:production`.

## Closeout

1. Update `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/report.json`.
2. Query Sentry after the run with `is:unresolved environment:production`.
3. Add a Linear OPU-125 comment with:
   - deploy URL or commit
   - Sentry before/after
   - 5-row scenario verdict table
   - combined results artifact path
4. Mark OPU-125 Done only if all five scenarios pass and Sentry has no OPULENT-BE regression.
