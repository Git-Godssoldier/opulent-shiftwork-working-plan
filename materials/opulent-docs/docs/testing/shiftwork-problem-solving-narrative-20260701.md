# How we solved the ShiftWork intake-to-agent problem

A working record of the testing process, the interops, the simulations, and what each layer proved or did not. Written 2026-07-01. All JSON artifacts validated with `python3 -m json.tool` on 2026-07-01 by the author of this document.

## The problem

Dan Cruden at ShiftWork sells a paid intake that hands a customer to Opulent. The customer pays $29, picks a use case and an agent task, and ShiftWork sends a payload-only handoff. No GitHub access, no codebase, no shared session. Opulent then has to research the lead, pick one of five questionnaire tracks, draft answers, get the owner to confirm the build-critical ones, and produce a build-ready first agent.

The question: can Opulent actually do that end to end? Start from a populated intake form that looks like it came from Google Drive. Persist it. Retrieve it later from a different thread. Turn it into a build-ready agent request without leaning on the original chat context.

That is the red loop. If the intake cannot survive a write, a cross-thread retrieval, and a build-plan generation step with every owner-confirmed answer and every visual QA requirement intact, the scenario goes red. A file-write-only proof does not count.

## Why visual QA agents

We needed a request concrete enough to verify. "Build me an agent" is too soft to test. A landing-page visual quality agent has hard edges: a URL, two viewports, a list of route checks, a list of inconsistency criteria, two email recipients, a subject prefix, a weekday schedule, and an acceptance test with seeded inputs. If any of those are missing after retrieval, the build is not ready and the scenario fails.

The request was adapted from a repo skill called "Catch Visual Regressions Before Every PR." That skill runs visual checks before pull requests. We converted it from repo QA into small-business website monitoring. Screenshot the public landing page on desktop and mobile, detect layout breakage, email the owner when something is wrong. Each fixture documents the adaptation under `sourceSkillAdapted`.

## Source materials

Dan's materials were exported from Outlook into `/Users/jeremyalston/Downloads/outlook-agent-intake/`. We read:

- `shiftwork-build-pipeline-sow.txt`
- `ShiftWork_Opulent_Pipeline_Notes.txt`
- `ShiftWork_Opulent_Runbook_v2.txt`
- `01_Marketing_Discovery_Template.txt` through `05_Ops_Discovery_Template.txt`
- `Dan Cruden - Shiftwork __ Opulent AI(Morgan Abraham) - 2026_06_12 09_58 EDT - Notes by Gemini.txt`

We captured the requirements in `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/source-summary.md`. Payload-only handoff after a paid $29 lead. Exactly one of five questionnaire tracks. Research guesses tagged unconfirmed. Build-critical answers owner-confirmed before build. Acceptance test with five real inputs including the owner's must-pass case. Delivery that accounts for hosting payer, customer access, how-to, and ROI follow-up.

## The two interop suites

### Drive-anywhere visual QA agent

The narrow proof. One simulated Google Drive intake answer for Northstar Renovations, a home renovation contractor. The owner, Mara Ellison, wants an agent that screenshots `https://northstarrenovations.com/` at 1280x900 and 390x844, checks the hero image, CTA visibility, form visibility, horizontal scroll, overlap, blank sections, and console errors, and emails `mara@northstarrenovations.com` with `ops@northstarrenovations.com` on cc when something breaks. Subject prefix `VISUAL QA ALERT`. Schedule weekdays 8 AM Central with manual run fallback.

The fixture at `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/shiftwork-intake-answer.google-drive-sim.json` carries:

- A Drive-like identity block with `shareMode: anyone_with_link` so the artifact can be referenced outside the original thread.
- A complete handoff payload: lead ID, timestamp, name, business, email, domain flag, use case, agent task, build request, paid status, payment amount, source, and host.
- Nine answers. Eight are `owner_confirmed` and `buildCritical: true`. One (R01, the email provider guess) is `draft_from_research_unconfirmed` and `buildCritical: false`. That distinction is the whole point. Research guesses cannot become training truth unless the owner confirms them.
- A `visualQualityAgentRequest` block with the URL, routes, viewports, baseline references, inconsistency criteria, email alert rules, and schedule.
- An `expectedAgent` block with responsibilities, tools needed, must-not-do rules, and an acceptance test.

The spec at `docs/testing/shiftwork-intake-drive-anywhere-interop-20260701.md` declares seven assertions (SW-DRIVE-A1 through A7) before describing execution. The execution is 11 steps: create workspace, create writer thread, write the fixture to workspace Drive, read it back and verify the marker, save snapshot, list files and capture the file ID, create a reader thread, retrieve the file by ID, read it in the reader thread, run `validation_check`, call `autos_done`.

The scenario prompt at `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/scenarios/shiftwork_intake_drive_anywhere.scenario.json` is the executable harness. It locks the model to `openrouter/poolside/laguna-m.1:free`, lists seven required tools, and defines 13 verification signals the runner checks against post-prompt evidence.

The build plan generated from the retrieved intake is at `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/agent-build-plan-from-intake.md`. It opens the URL, captures both screenshots, runs the route-specific checks, runs the failure criteria, saves screenshots and a JSON run report, drafts an alert email only when an issue is found, and records the open confirmation that the email provider is not owner-confirmed.

### Five-track visual QA expansion

The same proof across all five ShiftWork questionnaire tracks. The spec is at `docs/testing/shiftwork-intake-five-track-visual-qa-interops-20260701.md`.

| Scenario | Track | Questionnaire | Agent request |
| --- | --- | --- | --- |
| `SHIFTWORK-INTAKE-VQA-MARKETING-01` | Marketing | `01_Marketing_Discovery_Template` | Monitor public marketing landing page for conversion-breaking visual regressions. |
| `SHIFTWORK-INTAKE-VQA-SALES-02` | Sales | `02_Sales_Discovery_Template` | Monitor quote and booking page for form and scheduling regressions. |
| `SHIFTWORK-INTAKE-VQA-FULFILLMENT-03` | Fulfillment | `03_Fulfillment_Discovery_Template` | Monitor customer welcome/status page for document and update regressions. |
| `SHIFTWORK-INTAKE-VQA-SERVICE-04` | Service | `04_Service_Discovery_Template` | Monitor support/contact/FAQ page for customer-help regressions. |
| `SHIFTWORK-INTAKE-VQA-OPS-05` | Ops | `05_Ops_Discovery_Template` | Monitor operations/admin-facing page for crew, invoice, and inbox workflow regressions. |

The five-track suite verifies that questionnaire selection is not a black box. Each scenario must select exactly one questionnaire and that questionnaire must match the requested track. The shared assertions (SW5-A1 through A8) cover the complete handoff payload, correct questionnaire selection, owner-confirmed tags on build-critical answers, writer thread persistence with a real file ID, reader thread retrieval without original context, build-ready visual QA request, build plan from retrieved intake only, and Sentry no-regression.

## The testing process

### Fixture validation

Before any live execution, every JSON artifact has to pass `python3 -m json.tool`. I ran all seven artifacts on 2026-07-01. All passed. The commands are in the summary doc and in each spec.

### Red loop design

Each interop is designed as a red loop using the `interop-factory-verification` skill. The skill requires a concrete failure signal before execution and a tracker-backed proof path after. We followed its procedure: frame the red loop, pin the source, name the lane, define setup, declare assertions before actions, design execution, require an evidence brief, separate prompt from proof, pair observability, bind artifacts to verdicts, cross-verify visual evidence, treat crashes as verdict evidence, capture deploy/runtime proof, close the tracker loop, add failure taxonomy, define cleanup, and add a validation command.

The rule that mattered most: if the prompt contains the completion marker, the runner must save a prompt baseline before submit and judge only post-prompt evidence. That rule is what caught the false PASS in the first live run.

### Live execution loop

For each scenario: lock the model, create an isolated workspace, create a writer thread, persist the fixture to workspace Drive, read it back and verify every required field, save a snapshot, list files and capture the file ID, create a separate reader thread, retrieve the file by ID, read it in the reader thread and verify the same marker and build-critical details, generate the agent build plan from the retrieved intake only, run `validation_check`, call `autos_done`.

### Observability

Every live run must record workspace ID, writer thread ID, reader thread ID, Drive file ID, validation check ID, Sentry before and after query, Linear issue or handoff-only closeout, screenshots or video if the run opens target URLs, and email mode. Email stays draft-only unless live send is explicitly approved.

The Sentry baseline query is `is:unresolved environment:production`. The Drive-anywhere interop also uses a narrower query: `is:unresolved environment:production "workspace_manage" OR "retrieve_file" OR "drive"`.

### Verdict rules

PASS requires the exact marker verified before and after retrieval, writer and reader threads different, reader thread not relying on original writer context, all required payload fields present, payment paid, questionnaire matching track, build-critical answers owner-confirmed, research guesses still unconfirmed, visual QA request build-ready, build plan from retrieved intake only, Sentry no new scenario-caused error, and Linear/Sentry closeout evidence written or handed off.

FAIL triggers: missing payload field, unpaid, wrong questionnaire, missing owner confirmation, research guess promoted to truth, Drive persistence or retrieval failure, reader thread leaking writer context, incomplete visual QA request, live email without approval, wrong model lock, Sentry regression.

BLOCKED: auth, workspace Drive, file retrieval, Sentry, Linear, or model selection unavailable.

UNTESTED: spec and fixtures exist but no platform run has executed.

## What happened when we ran it

Three live runs. Two were inconclusive. One was a false positive that cross-verification caught. The third run has not happened yet because the platform kept crashing.

### Run 1: false 5/5 PASS

The first five-track live run on 2026-07-01 03:23 to 03:30 UTC reported 5/5 PASS. Cross-verification downgraded all five to INCONCLUSIVE. The finding is documented in `docs/testing/shiftwork-five-track-cross-verification-20260701.md`.

The legacy runner searched the full page body for the completion marker. The prompt itself contained the marker. The final screenshots showed prompt and checklist marker text while the agent was still early in tool execution. The `judge-result.json` files recorded `screenshots: []`, so the JSON verdict was not bound to the PNG evidence. No prompt baseline, no page text artifact, no structured verification object existed in the legacy results.

The cross-verification reviewed the final screenshot for each scenario. Every one showed prompt-adjacent marker text and early tool work, not completed writer/reader/file/build-plan/validation evidence. The Sentry no-regression claim was still useful because no new production error was attributable to the run window, but the agent-workflow completion claim was not proven.

### Runner hardening

We rewrote `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/run-all-shiftwork-interops.mjs` to require:

- Prompt baseline capture before submit.
- Completion marker after the prompt, not in the prompt echo.
- Full page text artifact.
- Screenshot paths stored in `judge-result.json`.
- Structured evidence brief with `claim checked`, `data/tool source`, `artifact`, `blockers`, `next action`.
- Required intake terms after prompt: `workspace`, `writer thread`, `reader thread`, `fileId`, `owner_confirmed`, `draft_from_research_unconfirmed`, `visual QA`, `acceptance inputs`, `build plan`, `validation_check`.
- Connector, auth, and runtime blockers force FAIL.

### Run 2: hardened runner, platform crash

The hardened rerun hit a different wall. The combined judge results at `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/combined-judge-results.json` show all five scenarios as INCONCLUSIVE. This time the cause was not a weak runner. The platform crashed.

Every scenario's console errors include `Error in stream Error: An error occurred.` at `runUpdateMessageJob` and `Minified React error #185`. The page text snippets show the Opulent error boundary: "Something went wrong. Minified React error #185. Reload page. Try again." The marker occurrences after prompt were 0 for every scenario. The autos_done occurrences after prompt were 0. The evidence snippets were just the error boundary text.

This is the OPULENT-BE React #185 regression tracked in Linear issue OPU-125. React error #185 is "Maximum update depth exceeded," which means a component is calling setState in a loop. The agent never got past early tool execution because the streaming UI crashed before it could complete.

### Run 3: post-fix rerun, crash persists

The first fix attempt was commit `1a45e97fe`, which treated cursor 0 as settled in `@convex-dev/agent`'s delta stream logic, skipped no-op cursor writes, and only treated deltas as new when `lastDelta.end > cursor`. The fix was deployed to production with `--force` and no remote cache. Vercel build logs confirmed `patch-package` ran and `@convex-dev/agent@0.6.1` was patched.

The rerun ran only the Marketing scenario. It still crashed. The report at `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/report.json` records the status as `POST_FIX_RERUN_STILL_CRASHING`. Marketing was INCONCLUSIVE. The runner stopped the remaining four scenarios (Sales, Fulfillment, Service, Ops) and marked them UNTESTED because the same crash would reproduce.

The root cause assessment in the report is important. The `@convex-dev/agent` patch was applied but insufficient. The actual infinite re-render originates in the AI SDK's `runUpdateMessageJob` streaming transform, which calls `write()` then `enqueue(structuredClone(message))` in a loop. The patch addressed `@convex-dev/agent`'s delta stream cursor logic, but the infinite loop is in the AI SDK layer that processes the stream parts. The chunk hash `22b8f64a` was identical before and after the patch, confirming the patched code minified into the same chunk.

Sentry showed 0 unresolved production issues, but the client-side crash was not being reported to Sentry. The error boundary appears to catch before the Sentry reporter can fire.

### Fixes after the first failed rerun

Three more fix commits landed after the first failed rerun:

1. `25b26020a` - Fix OPULENT-BE UIMessage replay crash boundary. A second attempt at the streaming crash.
2. `5ba48788f` - Fix Streamdown link text recursion crash. A different recursion path in the Streamdown markdown renderer.
3. `afc09d5b2` - Fix React #185: re-render loop from conditional hooks, cascading setState, missing cleanups. This is the latest commit and addresses a different root cause than the delta cursor logic. The fix touches four files:
   - `ToolCardsLane.tsx`: unconditional hooks, fixing rules-of-hooks violations (21 conditional hook calls reduced to 0).
   - `sync-orchestration.ts`: ref guards on `setIsStreaming` and `setStartupRunGraceActive`.
   - `useAccumulatedRawMessages.ts`: `lastPublishedSnapshotRef` dedup to prevent re-processing the same snapshot.
   - `inline-citation.tsx`, `css-link-normalizer.tsx`, `unified-config-menu.tsx`: effect cleanups to prevent stale callbacks.

The root cause hunt went through four iterations. First we thought it was `@convex-dev/agent`'s delta cursor logic. Then the AI SDK's `runUpdateMessageJob`. Then Streamdown link text recursion. Finally, conditional hooks violating rules-of-hooks, cascading setState without ref guards, and missing effect cleanups. That last one is the kind of bug that produces "Maximum update depth exceeded" because a component calls setState during render or in an effect that re-fires on every state change.

No rerun has verified fixes 2 through 4. The report still says `POST_FIX_RERUN_STILL_CRASHING` from after fix 1.

## What each layer proved

Fixture validation. All seven JSON artifacts pass `python3 -m json.tool`. I ran this myself on 2026-07-01. The fixtures are structurally valid and carry every required field.

Spec readiness. Both interop specs declare assertions before execution, define red loops, list failure classes, pair Sentry and Linear observability, and bind artifacts to verdicts. The Drive-anywhere spec has seven assertions. The five-track spec has eight shared assertions across five scenarios.

Harness hardening. The runner now separates prompt from proof, captures prompt baselines, stores screenshot paths, requires structured evidence briefs, and forces FAIL on connector, auth, and runtime blockers. The first run's false 5/5 PASS should not recur under the hardened runner, though I cannot prove that without a clean live run.

Cross-verification. The first live run was downgraded from 5/5 PASS to 5 INCONCLUSIVE by reviewing screenshots against claimed verdicts. The downgrade was documented with per-scenario visual artifact review and source log review in `docs/testing/shiftwork-five-track-cross-verification-20260701.md`.

Production regression discovery. The hardened rerun surfaced the OPULENT-BE React #185 streaming crash. This is a real production regression, not a test artifact. It blocks every scenario. The root cause was traced through four fix commits, with the latest (`afc09d5b2`) addressing conditional hooks, cascading setState, and missing effect cleanups.

What is not proven. No scenario has a verified PASS. No live run has recorded workspace IDs, writer/reader thread IDs, Drive file IDs, validation check IDs, or Sentry before/after evidence with a clean run. The Drive-anywhere interop has never been run live. The five-track interops have been run twice. The first run was a false positive. The second run crashed. The third run (post-fix) also crashed, but only ran one scenario before stopping. Three subsequent fixes have not been verified by a rerun.

## Current status

| Suite | Spec | Fixtures | Harness | Live runs | Verdict |
| --- | --- | --- | --- | --- | --- |
| Drive-anywhere | READY | READY | READY | 0 | SPEC READY / LIVE RUN UNTESTED |
| Five-track | READY | READY | HARDENED | 2 runs. Run 1: 5/5 false PASS, downgraded to 5 INCONCLUSIVE. Run 2: 1 INCONCLUSIVE, 4 UNTESTED (platform crash). | BLOCKED by OPULENT-BE React #185 |

The latest fix commit `afc09d5b2` addresses the React #185 root cause (conditional hooks, cascading setState, missing cleanups) but has not been deployed and verified with a rerun.

## Next step

Deploy `afc09d5b2` to production with `--force` and no remote cache. Confirm the patched files exist in the installed bundle. Confirm Sentry has no unresolved OPULENT-BE events after deploy. Run the hardened runner. Only mark PASS when all five `judge-result.json` files have `verdict: PASS`, `markerOccurrencesAfterPrompt > 0`, `autosDoneOccurrencesAfterPrompt > 0`, no `Minified React error #185` in page text or screenshots, populated prompt baseline and page text, screenshots bound to the scenario directory, all required terms present, all evidence brief terms present, and no blocker matches.

Additional production proof before closing OPU-125: reload each generated thread URL and confirm no error boundary, capture browser console output with no `Maximum update depth exceeded` and no `Minified React error #185`, verify final assistant content is complete after prompt-baseline subtraction, and query Sentry again after the rerun.

Once the five-track suite passes, run the Drive-anywhere interop live for the first time. I suggest running five-track first because it already has a hardened runner and a deployed test history. The Drive-anywhere interop has neither.

## Open questions

- Does `afc09d5b2` actually fix the crash? The root cause hunt went through four iterations. Each fix addressed a different layer. The latest fix addresses React rules-of-hooks violations and cascading setState, which is the most plausible mechanism for "Maximum update depth exceeded," but it has not been verified in production.
- Is the crash multi-causal? The first fix addressed `@convex-dev/agent` cursor logic. The second addressed UIMessage replay boundaries. The third addressed Streamdown link text recursion. The fourth addressed conditional hooks and effect cleanups. It is possible that more than one of these contributes to the crash, and fixing one layer exposes the next.
- Why is Sentry not capturing the client-side crash? The report says the error boundary may be catching before the Sentry reporter fires. If true, we have a blind spot in production observability for exactly the class of crash that blocks this test.
- Has Dan Cruden been informed of the delay? The narrative is technical, but the commercial relationship exists. The specs and fixtures are ready. The platform is not.

## Service agreements

The commercial and contractual terms from the SOW, Pipeline Notes, and the June 12 meeting between Dan Cruden and Morgan Abraham. None of these are tested by the current interops. They are upstream of the build pipeline and they govern what happens when the pipeline breaks.

### The $29 fee and what it buys

The SOW lists the $29 as a "membership application fee" and "the trigger that closes intake and fires the handoff to Opulent." The Runbook treats it as a gate: "Stripe confirms payment AND Opulent acknowledges the handoff. Payment alone does not clear this step."

The SOW flags an open decision: "The $29 fee. Is it a credit toward the build, or separate from build pricing?" This is unresolved. Our fixtures hardcode `paymentAmountUsd: 29` and `paymentStatus: paid` but never test what the fee applies to, whether it is refundable, or how it relates to build pricing.

The Runbook defines two refund triggers. Step 10b: "After ten business days total with no usable owner input, refund and close. Never leave a paid lead open forever." Step 13: "After two failed rounds, a terminal decision: rebuild with a narrower scope, deliver a partial with a credit, or refund and close." No interop tests either refund path.

### The cost-plus model

From the June 12 meeting notes: "Dan Cruden proposed a cost-plus model, where clients pay for the build-out and ongoing service retainers, while direct API and usage costs are passed through, aligning with an agency-style business structure."

This means the build price, the retainer, and the pass-through API costs are three separate numbers. The Runbook Step 14 enforces this at delivery: "The monthly runtime and hosting cost is assigned to a payer and written on the record. A delivered build with no assigned runtime payer is not done. That is a margin leak." Our five-track fixtures carry `"hostingRuntimePayerGate": "must be assigned before delivery"` as a string field, but no interop verifies that a payer is actually assigned, that the amount is written on the record, or that the margin leak is caught.

### The partnership framework

From the meeting notes: "Morgan and Dan are established as the primary points of contact to draft a formal partnership agreement based on the 'clarity greater than trust' framework." The success criteria for the proof of concept: "the successful deployment of a functioning AI agent for both Dan and Braden." Dan's team focuses on small business blue-collar use cases. Morgan's team engages with larger enterprises. They cross-refer leads based on company size.

No interop tests the partnership boundary. Who owns the lead after handoff? Who owns the refund decision? Who owns the runtime cost if the customer stops paying the retainer? These are commercial questions, not technical ones, but the Runbook treats them as gating: "If no hosting home or payer is decided, delivery is blocked until it is. This is a business decision, not a technical one."

### ROI capture

Runbook Step 15: "A scheduled check-in at day fourteen after delivery. Log labor hours saved per week and new sales attributed, each with its source." The fixtures carry `"roiFollowUp": "day_14"`. No interop tests the check-in, the two numbers, the source attribution, or the deemed-accepted fallback at day 21.

From the meeting notes, Dan's benchmark: "helps customers save $65,000 in labor costs while potentially generating an additional $100,000 in sales, for an initial client cost of $10,000." Those are the numbers the ROI step is designed to capture. The Runbook says: "Where possible, pull usage from the agent's own logs so labor-saved is not pure self-report. Someone typed a number does not count."

### What the service agreements field means for testing

The current interops test the build pipeline from research through agent delivery. They do not test the commercial wrapper around it. A complete test suite would need:

- A webhook interop that simulates Stripe payment and Supabase handoff, including the retry-on-no-ack path and the paid-handoff-pending state.
- A refund interop that simulates the 10-business-day no-owner-input path and the two-failed-rounds acceptance path.
- A delivery interop that verifies a runtime payer is assigned before the agent goes live, and that the assignment is written on the record.
- An ROI interop that simulates the day-14 check-in, logs the two numbers with sources, and tests the deemed-accepted fallback at day 21.

## Client answers

The owner answer collection process. This is the part of the pipeline where the owner's real words replace research guesses. Our interops simulate the answers as already owner-confirmed in the fixture. The actual collection process is untested.

### The onboarding call

Runbook Step 10: "A crew member or VAPI voice agent talks to the owner. It is recorded. The owner's real answers fill the doc." The call has three done-when conditions: the owner is verified as the decision-maker at the start, each draft is confirmed or corrected or marked unanswered in the owner's own words, and the owner states the build target out loud.

The SOW flags call routing as an open decision: "When is the call VAPI versus crew? Proposed: crew for the first 10 builds, VAPI once tuned." No interop tests either path.

The call has a clock: "Call held within five business days of Step 9, or escalate." No interop tests the clock.

### The async fallback

Runbook Step 10b: "If the owner has not booked within three business days, send the eight to ten questions that actually drive the build as a voice-note or form task." The done-when: "The priority questions are answered in the owner's words. The build never starts on agent guesses alone."

This is the path that matters most for testing. If the owner will not get on a call, the pipeline has to get answers another way. The Runbook is explicit: "If the owner ignores the fallback too, the lead moves to stalled and the refund clock starts." After 10 business days total with no usable owner input, refund and close.

No interop tests the async fallback, the priority question selection, the refund clock, or the stalled state.

### Where do the post-call details go?

This is the biggest gap in the source materials. The Runbook and SOW describe the training doc as the output of the call, but neither document says where it lives.

What the source materials say:

- SOW Step 09: "The owner's real answers fill the training document." Output: "Completed training document, call recording." Done when: "The owner's answers are captured in the document and the recording is saved."
- Runbook Step 10: Produces "A completed training doc with each answer tagged, a recording, and a confirmed or corrected build target."
- Runbook Step 11: "The training doc returns from the call or the fallback." Gap agents take "The training doc with tagged answers" and produce "A training doc where every gap is owner-confirmed or clearly marked filled by research, unconfirmed."
- Runbook Step 12: "The training doc passes gap review." Build takes "The validated training doc."

The training doc is the central artifact from call through build. It is the document that carries the owner's real answers, the tagged gaps, the confirmed build target, and the gap review sign-off. The call recording is a separate artifact that has to be saved somewhere. Neither the SOW nor the Runbook nor the Pipeline Notes specify a storage location, a storage medium, or a retrieval path for either one.

What the Opulent platform has:

The platform has two native storage surfaces that could hold the training doc:

1. Native Documents (document_create, document_append, document_read). These are the Workbench Document panel tools. The tool instructions in `frontend/convex/lib/agents/toolInstructions.ts` describe document_create as the scratchpad for long-running, scheduled, automated, delegated, or multi-agent work. The scratchpad mandate says agents must append state at boundaries, blockers, artifacts, joins, validator results, and closeout. A training doc that passes from the call to gap review to build fits this pattern exactly. The call produces answers, those get appended to a document, gap agents read the document and append their review, and the build agent reads the validated document before building.

2. AI Drive (driveFiles, driveChunks in the schema at `frontend/convex/schema.ts`). This is the file storage surface with embeddings for vector search. The call recording, being a binary file, would land here. The training doc could also live here as a JSON or markdown file, similar to how our interop fixtures are stored as Drive-like artifacts.

The platform also has memory blocks (memoryBlocks in the schema) with labels like "persona," "human," "scratchpad." These are for durable facts and working aggregation, not for a structured training doc with tagged answers.

What our interops test:

Our interops test the intake answer persistence to workspace Drive. The intake answer is the pre-call artifact. It carries the research brief, the selected questionnaire, the draft answers, and the visual QA agent request. It does not carry the owner's real answers from the call because the call has not happened yet.

The post-call training doc is a different artifact from the intake answer. The intake answer comes from ShiftWork through the Supabase webhook. The training doc comes from the onboarding call. The intake answer has draft answers tagged `draft_from_research_unconfirmed`. The training doc has those same answers updated to `owner_confirmed` or `corrected_by_owner` or `unanswered`, plus the recording reference, plus the confirmed build target, plus the gap review sign-off.

No interop tests the training doc. Not its creation, not its storage location, not its retrieval by the gap agents, not its retrieval by the build agent, not the recording storage, not the tag updates from draft to confirmed.

The unanswered questions:

- Does the training doc live in native Documents (document_create) or in AI Drive (driveFiles)? The source materials do not say. The platform supports both. The choice affects who can read it, how it is retrieved, and whether it is searchable.
- Does the call recording live in AI Drive, in Convex storage (messageAttachments), or in an external storage like Vapi's own recording storage? The source materials say "the recording is saved" but not where.
- Who writes the owner's answers into the training doc during the call? The Runbook says the call is run by "SHIFTWORK or VAPI, named per build." If VAPI runs the call, does VAPI write directly to the Opulent training doc, or does a ShiftWork crew member transcribe after the call? If crew runs the call, do they write to the doc live or after?
- How does the training doc get from the call to the gap review? The Runbook says "the training doc returns from the call or the fallback." Returns to where? The same workspace? A different thread? A different agent?
- How does the build agent retrieve the validated training doc? The Runbook says build takes "the validated training doc." From where? The same document ID? A new copy?
- What happens to the training doc after the build? Is it archived? Does it become the basis for the acceptance test inputs? Does it feed into the ROI capture at day 14?

These are not edge cases. The training doc is the artifact that drives the build. If it is lost, misrouted, or unreadable by the gap agents or the build agent, the pipeline breaks. Our current interops test the intake answer, which is the pre-call artifact. The post-call artifact is untested and its storage location is unspecified.

### Training doc artifact created

I created a simulated training doc at `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/training-doc.post-call.json`. It represents the post-call, post-gap-review state for the Drive-anywhere scenario (Northstar Renovations, Ops questionnaire).

The artifact contains:

- All 9 questions from `05_Ops_Discovery_Template` (OP01 through OP09), each with the owner's real answer in her own words.
- 7 visual QA specific questions (VQ01 through VQ07) that go beyond the Ops template, covering the landing page URL, viewports, inconsistency criteria, email alert contents, recipients, schedule, and acceptance test.
- 1 research-only question (R01, email connector) that remains `draft_from_research_unconfirmed` because the owner did not confirm connector access.
- 17 total answers. 16 owner-confirmed. 1 unconfirmed. 8 build-critical, all owner-confirmed.
- A tag history on every answer showing the transition from `draft_from_research_unconfirmed` or `open_gap` to `owner_confirmed`.
- The confirmed build target, which changed on the call. Research suggested "Ops admin automation for invoice and inbox triage." The owner stated "visual quality monitoring agent for the public landing page" out loud. The change is logged with a reason.
- The gap review sign-off: all answers tagged, all build-critical answers owner-confirmed, R01 remains a research gap, human sign-off true, no open build-critical gaps.
- The call info: crew call (not VAPI), 42 minutes, owner verified as decision-maker, owner stated build target out loud, recording reference included.
- The pipeline state: steps 5 through 11 completed, step 12 (build) not started.
- The storage location fields, all set to `unspecified_in_source_materials` with the platform options listed.

What the artifact reveals:

The intake answer fixture had 9 answers. The training doc has 17. The intake answer only carried OP09 from the Ops template plus the 7 VQ questions and R01. The training doc fills in OP01 through OP08, which are the questions about invoicing, inbox, scheduling, and hiring. Those questions are not build-critical for the visual QA agent, but the Runbook requires every question in the selected questionnaire to have an answer or a marked gap. The intake answer skipped 8 of 9 Ops questions. The training doc completes them.

The build target changed on the call. The intake answer had `confirmedBuildTarget` set to the visual QA agent, but that was simulated. In the real pipeline, the research brief suggested Ops admin automation. The owner overrode that on the call and chose the visual QA agent. The training doc logs this change with the owner's statement and the reason. This is the kind of detail that gets lost if the training doc is not persisted.

R01 (email connector) has a new answer from the owner. She said she uses Gmail but is not sure about giving the agent access. She asked if the agent can draft the email and she sends it. This is not a confirmation. It is a request for draft-only mode. The gap review caught this and kept R01 tagged `draft_from_research_unconfirmed`. The build can proceed with draft-only email. Live send is a post-build wiring step. This is exactly the kind of research gap that the Runbook says cannot fill a build-critical slot.

The recording reference is `recording://shiftwork-call-SW-20260701-001-20260702`. This is a simulated path. The actual storage location for Vapi or crew call recordings is unspecified in the source materials.

What this artifact does not solve:

The training doc exists as a JSON file in the repo, but the source materials do not say where it should live in the Opulent platform. The `storageLocation` fields are all `unspecified_in_source_materials`. The artifact is a simulation of the content. It is not a simulation of the storage, retrieval, or routing. An interop that tests the training doc would need to:

1. Create the training doc in a specific platform location (native Documents or AI Drive).
2. Have gap agents retrieve it, review it, and append their sign-off.
3. Have the build agent retrieve the gap-reviewed version and generate the build plan from it.
4. Verify that the tag transitions, build target change, and gap review sign-off survive the retrieval.

### Gap review with human spot-check

Runbook Step 11: "No answer is untagged, AND every build-critical question is owner-confirmed. Gap agents may research and propose, but research answers stay tagged unconfirmed and cannot fill a build-critical question. A human signs that the critical questions are owner-confirmed."

Our interops check the tags programmatically. The fixture has eight `owner_confirmed` answers and one `draft_from_research_unconfirmed` answer. That proves the tagging schema works. It does not prove that a human reviewed and signed off, or that gap agents cannot promote a research guess to a build-critical answer.

### What the client answers field means for testing

A complete test suite would need:

- A call interop that simulates the onboarding call, captures the recording, verifies the owner is the decision-maker, and verifies each draft answer is confirmed, corrected, or marked unanswered in the owner's own words.
- An async fallback interop that simulates the 3-business-day no-booking path, sends the priority questions, and verifies the answers come back tagged `owner_confirmed`.
- A refund interop that simulates the 10-business-day no-input path and verifies the lead moves to stalled, then refund-and-close.
- A gap review interop that verifies a research answer cannot fill a build-critical slot, and that a human sign-off is required before build.

### Build customer one exception

Pipeline Notes line 58: "Build customer one is our own sales agent, so steps 1 to 4 do not run for it. We will push one real outside lead through intake and payment on its own, since that is the half the first build skips."

This is a known edge case. The first build for the partnership is ShiftWork's own sales agent. That build skips the intake and handoff steps because there is no external customer paying $29 and filling out a form. Dan's team plans to push one real outside lead through steps 1 to 4 separately to test the half that the first build skips.

What this means: the first real customer lead is a test of the intake and handoff pipeline, not of the build pipeline. The build pipeline gets tested on ShiftWork's own sales agent. The intake pipeline gets tested on a real stranger who pays $29 and fills out the form. If the intake pipeline breaks, the first real customer has a bad experience and the partnership starts with a failure.

No interop addresses this. The current interops all start after the payload has landed. They test the build half. They do not test the intake half that the first build skips.

### Free email and no business domain

Runbook Step 2: "If the email is a free provider (gmail, icloud, outlook, yahoo and the like), the system marks no business domain and asks for the company website. The lead is not complete until a real domain or a confirmed no-website answer is captured."

All our fixtures use business domains. Northstar Renovations uses `northstarrenovations.com`. Every five-track fixture uses the same domain. The no-domain path is untested.

What happens when a plumber named Mike pays $29 with a gmail address and does not have a website? The Runbook says: "set research mode to name and business only, and flag it." Research runs on the person and the business name without a domain to scrape. The questionnaire selection still has to pick one of five tracks. The build target still has to be confirmed. The visual QA agent request has no URL to monitor because there is no website.

This is a real path for blue-collar small businesses. Dan's team targets "small business blue-collar use cases." A lot of plumbers, electricians, and landscapers do not have websites. They have a Google Business listing and a phone number. The current interop fixtures assume a domain. They would break on a no-domain lead, or worse, they would pass by skipping the domain resolution step without flagging it.

A no-domain fixture would need:
- `noDomainFlag: true`
- `businessDomain: null` or empty
- `researchMode: "name_and_business_only"`
- A research brief that works without scraping a website
- A visual QA agent request that either monitors a Google Business listing instead of a website, or flags that the first build target is not a website monitor because there is no website
- A questionnaire selection that accounts for the no-domain constraint

## Fields that trigger further discovery

Every field in the handoff payload and research brief that changes what happens downstream. These are the fields that branch the pipeline. Our fixtures hardcode happy-path values for all of them. None of the branching paths are tested.

### noDomainFlag

Runbook Step 2: "If the email is a free provider (gmail, icloud, outlook, yahoo and the like), the system marks no business domain and asks for the company website."

When `noDomainFlag` is true, three things change downstream:

1. Research mode switches to name and business only. The research agent cannot scrape a website. It has to work from the business name, the owner name, the industry, and whatever public listings exist. The Runbook says "set research mode to name and business only, and flag it." The research brief's `assumedOrUnverified` list grows because more claims are unverified without a website to check against.

2. The research brief auto-routes to the human gate with a warning. Runbook Step 5: "Low confidence, or a lead with no business domain, auto-routes to the human gate with a warning." This is not optional. A no-domain lead always hits the human gate, even if the research agent produces a high-confidence brief. The human gate is Step 6, owned by a named Opulent lead, same business day.

3. The build target may not be a website monitor. If the business has no website, a visual QA agent that screenshots a landing page has nothing to screenshot. The first build target has to pivot to something else: monitor a Google Business listing, monitor a Facebook page, monitor review sites, or flag that the first build should be a different agent type entirely (lead routing, review response, quote automation). The owner has to confirm this pivot on the call.

Who does the research when there is no domain? The same Opulent research agent (Step 5, owner OPULENT, automated), but it works with less data. The Runbook does not assign a different researcher for no-domain leads. It just constrains the research to name and business, flags it, and forces the human gate. The human gate is where a named Opulent person reviews the thinner brief and decides whether to proceed or request more information from the owner before the call.

Our fixtures all set `noDomainFlag: false` and `businessDomain: "northstarrenovations.com"`. The no-domain branch is untested.

### confidence (high, medium, low)

Runbook Step 5: "The brief carries a confidence rating (high, medium, low) AND an explicit assumed-or-unverified list."

When confidence is low, the brief auto-routes to the human gate. When confidence is high or medium, the brief still hits the human gate (Step 6 always requires a human action), but the warning level differs. Low confidence also affects questionnaire selection: Runbook Step 7 says "If the target is low-confidence, the broadest fitting set is chosen so the call can go wide."

Our fixtures all set `confidence: "medium"`. The low-confidence branch, the broadest-questionnaire selection, and the high-confidence path are all untested.

### buildRequest (blank or populated)

Runbook Step 4: "Build request may be blank but is then flagged for the call."

When `buildRequest` is blank, the payload is still accepted (it is not a required field for validation), but it is flagged. The flag means the onboarding call has to surface the build request question. The owner has to state what they want built out loud. This is different from a populated build request, where the research agent can start forming a target before the call.

Our fixtures all carry a populated `buildRequest`. The blank-build-request path is untested.

### paymentStatus (paid vs unpaid vs handoff-pending)

Runbook Step 3: "Stripe confirms payment AND Opulent acknowledges the handoff. Payment alone does not clear this step."

Three states matter:
- `paid` with ack: the payload is accepted and the pipeline proceeds.
- `paid` without ack: the lead sits in a paid, handoff-pending state. ShiftWork retries up to three times over 15 minutes. After three failures, an alert fires to a named on-call owner. The lead is never silent.
- `unpaid`: card declined, the visitor stays on the payment page, no lead is pushed.

Our fixtures all set `paymentStatus: "paid"`. The handoff-pending state and the retry logic are untested.

### useCase and agentTask

SOW open decision: "How does the agent map a use case to one of five questionnaires? Define the rules so it is not a black box."

The `useCase` and `agentTask` fields drive questionnaire selection (Step 7). The mapping logic is an open decision in the SOW. Our five-track fixtures test that each track selects the correct questionnaire, but they hardcode the mapping. They do not test edge cases: a use case that maps to two questionnaires, a use case that does not map to any, or an agent task that conflicts with the use case.

### assumedOrUnverified list

Runbook Step 5: "An explicit assumed-or-unverified list."

Every item in this list is a research guess that has to be confirmed on the call. The list drives the call script (Step 9) and the gap review (Step 11). If an item in this list is a build-critical question, it cannot be filled by research. It has to be owner-confirmed.

Our fixtures carry one unconfirmed item (R01, the email provider guess). The case where the unverified list contains a build-critical item is untested.

### confirmedBuildTarget

Runbook Step 6: "A named person reviews and logs a provisional target. This gate always needs a human action."

The `confirmedBuildTarget` in our fixtures is tagged `owner_confirmed`, but it is simulated. In the real pipeline, the target is provisional until the call (Step 10), where the owner states it out loud. If the call reveals a different target, the pipeline routes back to Step 6 for a re-confirm. Our interops do not test the re-routing path.

## Pipeline timing: webhook to deployment

The full turnaround from Supabase webhook fire to agent delivered and hosting assigned. All clocks from Runbook v2.

### Stage 1: Intake (ShiftWork)

| Step | Owner | Clock |
| --- | --- | --- |
| 1. Select use case and task | ShiftWork, auto | Instant |
| 2. Enter contact, create lead | ShiftWork, auto | Instant |
| 3. Pay $29, fire handoff | ShiftWork, auto | Ack within 15 minutes or alert |

Steps 1 and 2 are instant. Step 3 has a 15-minute clock for Opulent to acknowledge the handoff. If no ack, ShiftWork retries three times over 15 minutes, then alerts a named on-call owner and holds the lead in a paid, handoff-pending state.

### Stage 2: Handoff

| Step | Owner | Clock |
| --- | --- | --- |
| 4. Validate and accept payload | Opulent, auto | 2 minutes from arrival |

Opulent validates every required field and returns an ack only on acceptance. A missing field rejects the payload. ShiftWork retry logic catches the rejection.

### Stage 3: Research and prep (Opulent, before the call)

| Step | Owner | Clock |
| --- | --- | --- |
| 5. Research agent | Opulent, agent | 1 business hour |
| 6. Confirm provisional build target | Human gate, Opulent lead | Same business day |
| 7. Select questionnaire | Opulent, agent | 15 minutes |
| 8. Build Q and A document | Opulent, agent | 15 minutes |
| 9. Prepare call script | Opulent, agent | 15 minutes |

Steps 7 through 9 run in about 45 minutes total, automated. Step 5 is one business hour. Step 6 is same business day, human gate.

Minimum time from webhook to call script ready: about 1 hour 45 minutes of automated work plus however long the human gate takes. In practice, the human gate is the bottleneck. If the webhook fires at 9 AM, research is done by 10 AM, the human gate reviews same day, and the call script is ready by end of day. The call can be booked for the next day.

### Stage 4: The call (the real input)

| Step | Owner | Clock |
| --- | --- | --- |
| 10. Onboarding call | ShiftWork or VAPI | Within 5 business days of Step 9 |
| 10b. Async fallback | ShiftWork, crew | 3 days to respond, 10 business days before refund |

The call is where the owner's real answers replace research guesses. The clock is 5 business days from script ready to call held. If the owner does not book within 3 business days, the async fallback fires. If the owner ignores the fallback too, 10 business days total then refund and close.

### Stage 5: Validate and build (after the call)

| Step | Owner | Clock |
| --- | --- | --- |
| 11. Gap review | Opulent, gap agents plus human spot-check | Same business day the doc returns |
| 12. Build first agent | Opulent, automate engine or named builder | 2 business days |

Gap review is same business day. Build is 2 business days. This is where the agent actually gets built.

### Stage 6: Accept, deliver, measure

| Step | Owner | Clock |
| --- | --- | --- |
| 13. Acceptance test | Human gate, named approver | 1 business day, fix rounds capped at 2 days each |
| 14. Deliver and host | ShiftWork plus Opulent | 3 business days of acceptance |
| 15. ROI capture | ShiftWork, crew | Check-in day 14, deemed accepted day 21 |

Acceptance is 1 business day. If it fails, fix rounds are capped at 2 business days each, up to 2 rounds. After 2 failed rounds, a terminal decision: rebuild narrower, partial with credit, or refund. Delivery is 3 business days. ROI check-in is day 14 after delivery, deemed accepted at day 21.

### Total turnaround

Best case, owner books the call immediately and everything passes on the first try:

- Webhook to call script ready: same business day (1 hour 45 minutes automated plus human gate)
- Call script ready to call held: next business day (owner books immediately, 1 day buffer)
- Call to gap review done: same business day
- Gap review to agent built: 2 business days
- Agent built to acceptance passed: 1 business day
- Acceptance to delivery: 3 business days
- Delivery to ROI check-in: 14 calendar days

Best case webhook to delivery: about 8 business days. Webhook to ROI check-in: about 8 business days plus 14 calendar days, so roughly 4 weeks.

Worst case with async fallback: 10 business days before refund-and-close. The pipeline never exceeds 10 business days of owner non-responsiveness before it terminates.

Worst case with two failed acceptance rounds: 8 business days plus 2 rounds at 2 days each, so about 12 business days to a terminal decision.

### Where builds happen: after VAPI, not between webhook and VAPI

The build happens at Step 12, after the call (Step 10) or the async fallback (Step 10b), and after the gap review (Step 11). The pipeline order is:

1. Webhook fires (Step 3, Stage 1)
2. Payload validated (Step 4, Stage 2)
3. Research (Step 5, Stage 3)
4. Human gate confirms target (Step 6, Stage 3)
5. Questionnaire selected (Step 7, Stage 3)
6. Q and A drafted (Step 8, Stage 3)
7. Call script prepared (Step 9, Stage 3)
8. Onboarding call or async fallback (Step 10 or 10b, Stage 4)
9. Gap review (Step 11, Stage 5)
10. Build the agent (Step 12, Stage 5)
11. Acceptance test (Step 13, Stage 6)
12. Deliver and host (Step 14, Stage 6)
13. ROI capture (Step 15, Stage 6)

Nothing gets built between the webhook and the call. The work between webhook and call is research, target confirmation, questionnaire selection, Q and A drafting, and call script preparation. All of that is prep. The build starts only after the owner's real answers are in the doc and the gap review passes.

This matters for testing. Our current interops simulate the post-call state: answers are already owner-confirmed, the build target is already confirmed, the gap review is implicitly passed. We test the build half of the pipeline. The prep half (webhook through call) and the post-build half (acceptance, delivery, ROI) are untested.

### Who does what when there is no domain

The no-domain path changes who acts and when:

1. ShiftWork intake (Step 2): the system detects a free email provider, marks `noDomainFlag: true`, asks for the company website. If the owner says they have no website, the lead is still created but flagged.

2. Opulent research agent (Step 5): runs in name-and-business-only mode. Same agent, same owner (OPULENT, automated), same 1-hour clock. The output is a thinner brief with more unverified items. The confidence rating is more likely to be low.

3. Human gate (Step 6): a named Opulent person reviews the thinner brief. This gate always fires for no-domain leads, even if confidence is high. The human decides whether to proceed with the thinner brief, request more information from the owner before the call, or hold the target choice for the call.

4. Questionnaire selection (Step 7): if the target is low-confidence (which is likely for no-domain), the broadest fitting questionnaire is chosen so the call goes wide. The call has to cover more ground because the research could not narrow it.

5. Onboarding call (Step 10): the call becomes more important because more questions are open. The owner has to confirm the build target, confirm the business identity details that research could not verify, and answer the questions that the website would have answered.

6. Build (Step 12): the build target may not be a website monitor. If the business has no website, the agent has to target something else. The owner confirms the pivot on the call.

The no-domain path does not change who owns each step. It changes the data available to each step, the likelihood of hitting the human gate, the questionnaire breadth, and the build target. The same people and agents run the same steps. They just have less to work with.

## Artifact map

Drive-anywhere suite:
- `docs/testing/shiftwork-intake-drive-anywhere-interop-20260701.md`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/shiftwork-intake-answer.google-drive-sim.json`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/fixtures/training-doc.post-call.json`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/scenarios/shiftwork_intake_drive_anywhere.scenario.json`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/agent-build-plan-from-intake.md`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/report.json`
- `frontend/qa/artifacts/shiftwork-intake-drive-anywhere-interop/linear-handoff.md`

Five-track suite:
- `docs/testing/shiftwork-intake-five-track-visual-qa-interops-20260701.md`
- `docs/testing/shiftwork-five-track-cross-verification-20260701.md`
- `docs/testing/opu-125-shiftwork-hardened-rerun-instructions-20260701.md`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/source-summary.md`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/fixtures/shiftwork-five-track-intake-fixtures.json`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/scenarios/shiftwork_five_track_visual_qa.scenarios.json`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/run-all-shiftwork-interops.mjs`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/combined-judge-results.json`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/report.json`
- `frontend/qa/artifacts/shiftwork-intake-five-track-visual-qa-interops/linear-handoff.md`

Process and tracking:
- `docs/testing/shiftwork-interops-testing-process-summary-20260701.md`
- `frontend/qa/ARTIFACT_PIPELINE_TRACKING.md`

## Updated assumptions — post-grill, post-SOW PDF

After a line-by-line grill against every client document (SOW PDF, Runbook v2, Pipeline Notes, meeting notes), the scope and demo plan changed. The SOW PDF (`shiftwork-build-pipeline-sow.pdf`) confirms the same 11-step structure as the txt version. The key updates:

### Scope correction

The SOW assigns Steps 5-11 to Opulent. After grilling, the user narrowed Opulent's scope to **doc-to-deploy only**. Steps 5-11 (research, questionnaire selection, Q&A drafting, call script, onboarding call, gap review) are ShiftWork's job. Opulent receives the completed training doc and builds + deploys the agent.

This overrides the SOW and Runbook owner assignments for Steps 5-11. The user's position: "we only care about the process but importantly the doc to agent creation and deployment pipeline. That's all we're responsible for."

### VAPI is not Opulent's problem

The SOW Step 09 says "VAPI agent or crew on Meet." The user confirmed: "we won't handle VAPI." The onboarding call is ShiftWork's responsibility. Crew on Google Meet, recorded. Opulent receives the completed training doc after the call and gap review. The fixture reflects `callType: "crew"` with a note that VAPI is not handled by Opulent.

### Fixture is a valid, believable payload

The training doc fixture (`training-doc.post-call.json`) has been updated to be a believable handoff from ShiftWork:
- Business: ShiftWork Studio (Dan Cruden's actual company)
- Owner: Dan Cruden, dan@shiftworkstudio.ai
- Target URL: https://shiftworkstudio.ai (Dan's actual dummy app from the meeting)
- Call type: crew on Google Meet (not VAPI)
- Gap review reviewer: shiftwork_crew (not Opulent lead)
- Storage: shared_workspace (not unspecified)
- Pipeline state: steps 5-11 marked completed_by_shiftwork, steps 12-14 marked not_started_opulent_owns, step 15 marked not_started_shiftwork_owns

### Demo plan (steps 2-9 core)

The demo shows the Opulent build flow:
1. (Implied) Training doc is already in the shared workspace
2. Build agent finds the doc by schema marker + leadId
3. Build agent validates minimally: build target present, acceptance test inputs present
4. Build agent runs the full automation modeler flow (intake, connected apps, tools, memory, knowledge, workflow, dry-run evals, verified automation report). Strong model (Opus or Sonnet). Daytona sandbox with secrets management. Screenshots only, no codebase access.
5. Build agent builds the visual QA agent: screenshots at desktop (1280x900) and mobile (390x844), compares to baseline, drafts alert email if issue found. Draft-only mode (R01 unconfirmed). Cheap model (Haiku or open-source) for the running agent.
6. Build agent creates the cron schedule: every weekday 8 AM Central. Also supports manual on-demand trigger.
7. Build agent runs the agent against 5 test inputs (5 random pages, screenshots in workspace, report produced). All 5 must pass without crashing. Auto-fixes up to 3 times. 2-business-day budget.
8. Acceptance test runs automatically: 5 easy-to-hit pre-validated test criteria. 4/5 pass with must-pass OK. A named human reviews the score.
9. If acceptance passes: agent is live on the Opulent platform. Schedule is active. How-to markdown is in the workspace.

Fix loops, post-delivery logs, and Braden's agent are mentioned but not demoed live.

### Runbook overrides (flagged to Dan before demo)

| Override | Runbook says | Demo does | Reason |
|----------|-------------|-----------|--------|
| Scope decider (Step 12) | Named human decides single vs orchestrated | Auto-decide from doc | User decision |
| Steps 5-11 ownership | Opulent | ShiftWork | User narrowed scope |
| VAPI (Step 09) | Opulent or VAPI | ShiftWork crew only | User decision |
| Customer login (Step 14) | Customer logs in once | Skip for POC | Deferred |
| Runtime payer enforcement (Step 14) | System blocks delivery without payer | Skip for POC | Deferred |
| Dreams in memory | Promised in meeting | Skip for POC | Deferred |

### Runbook follows (no override)

| Step | Followed |
|------|----------|
| Acceptance approver (Step 13) | Named human reviews the score |
| Terminal decision after 2 fails | Human decides: rebuild, partial, or refund |
| Delivery owner | Opulent owns delivery, ShiftWork schedules + pays |
| ROI | Opulent exposes logs, ShiftWork does check-in |

### Gotchas from client docs (16 identified)

1. The automate command is a skill (`opulentia-automation-modeler`), not a single API. The build is an agent running multiple skills.
2. Dan expects 7-day turnaround. Opulent's portion (6 business days) fits if the clock starts when the doc lands.
3. Two agents required for POC success (Dan + Braden). Sequential builds.
4. Customer must log in to Opulent platform once (Runbook). Deferred for POC.
5. Delivery includes a how-to guide and walkthrough (Runbook). Markdown in workspace for POC.
6. First build (build customer one) skips intake. Not our demo. We demo the real outside lead path.
7. Build agent needs to validate the training doc before building. Minimal validation: build target + acceptance inputs present.
8. Build target can differ from questionnaire track. Build agent reads the target, ignores the track.
9. Braden raised security. Daytona sandbox + secrets management promised.
10. Tiered model strategy promised. Strong model for build, cheap model for running agent.
11. Dreams in memory promised. Deferred for POC.
12. Dan's actual test app is shiftworkstudio.ai, not northstarrenovations.com. Fixture updated.
13. Delivery ownership contradicts between Pipeline Notes (ShiftWork) and Runbook (shared). Resolved: Opulent owns, ShiftWork assists.
14. $29 fee vs $10,000 build pricing undefined. Not mentioned in demo.
15. Runbook requires human for single vs orchestrated decision. Overridden: auto-decide.
16. Runbook requires named approver for acceptance. Followed: human reviews the score.
