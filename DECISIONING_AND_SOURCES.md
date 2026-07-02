# Decisioning and Sources

This package is the working record for the Opulent x ShiftWork pre-kickoff deck. The deck is not a generic pitch. It is a project-start artifact built from intake documents, meeting notes, Opulent process docs, simulation evidence, code artifacts, and recorded demo material.

## Decisioning Tree

The deck was created with this decision path:

1. Preserve the strongest Opulent overview.
   The first four slides keep the high-level Opulent framing because they explain the cloud-agent operating layer before the ShiftWork-specific plan begins.

2. Reframe the project around Agent Factory.
   The opening was changed to make Agent Factory the first signal. The project description explains the collaboration as a handoff from ShiftWork intake to Opulent delivery proof.

3. Separate ownership before describing execution.
   The early operating slides distinguish ShiftWork responsibilities from Opulent responsibilities. ShiftWork owns customer intake, confirmation, source documents, and front-of-funnel motion. Opulent owns conversion of the refined intake into a verified agent workflow, execution, validation, schedule, artifacts, and proof.

4. Use the statement of work as the project boundary.
   The SOW and pipeline notes shaped the slides on scope, build loop, delivery model, and first customer motion.

5. Use simulation evidence to describe process, not final judgment.
   The simulation slides describe methodology, timeline, evidence, verification artifacts, and production learning signals. The deck avoids making the simulation a broad verdict on the whole partnership.

6. Keep the demo concrete.
   The visual QA agent remains the demo vehicle because screenshots, reports, schedules, and alert drafts are easy to inspect without requiring codebase or DOM access.

7. Separate operating cost from pricing.
   Cost of operations is framed as infrastructure and run cost. Pricing is framed as Agent Factory workflow development, retainer support, Opulent seats, and customer-borne platform usage.

8. Close with exploration areas.
   The final slide does not declare unresolved items as blockers. It frames final intake process, performance ramp, delivery cost, support needs, contracts, and go-live timelines as areas for joint project design.

## Source Inventory

### Meeting and intake material

- `materials/outlook-agent-intake/Dan Cruden - Shiftwork __ Opulent AI(Morgan Abraham) - 2026_06_12 09_58 EDT - Notes by Gemini.txt`
- `materials/outlook-agent-intake/shiftwork-build-pipeline-sow.txt`
- `materials/outlook-agent-intake/ShiftWork_Opulent_Pipeline_Notes.txt`
- `materials/outlook-agent-intake/ShiftWork_Opulent_Runbook_v2.txt`
- `materials/outlook-agent-intake/01_Marketing_Discovery_Template.txt`
- `materials/outlook-agent-intake/02_Sales_Discovery_Template.txt`
- `materials/outlook-agent-intake/03_Fulfillment_Discovery_Template.txt`
- `materials/outlook-agent-intake/04_Service_Discovery_Template.txt`
- `materials/outlook-agent-intake/05_Ops_Discovery_Template.txt`

These sources established the partnership context, intake tracks, pipeline shape, customer handoff expectations, and practical delivery constraints.

### Opulent product and testing documents

- `materials/opulent-docs/docs/shiftwork-training-doc-to-agent-prd-20260701.md`
- `materials/opulent-docs/docs/testing/shiftwork-interops-testing-process-summary-20260701.md`
- `materials/opulent-docs/docs/testing/shiftwork-intake-drive-anywhere-interop-20260701.md`
- `materials/opulent-docs/docs/testing/shiftwork-intake-five-track-visual-qa-interops-20260701.md`
- `materials/opulent-docs/docs/testing/shiftwork-five-track-cross-verification-20260701.md`
- `materials/opulent-docs/docs/testing/shiftwork-problem-solving-narrative-20260701.md`
- `materials/opulent-docs/docs/testing/opu-125-shiftwork-hardened-rerun-instructions-20260701.md`

These sources established the training-document-to-agent path, ownership split, evidence model, cross-context simulation method, and verification process.

### Simulation and code artifacts

- `materials/qa-artifacts/shiftwork-demo-simulation/`
- `materials/qa-artifacts/shiftwork-intake-drive-anywhere-interop/`
- `materials/qa-artifacts/shiftwork-intake-five-track-visual-qa-interops/`
- `source/shiftwork-working-plan-deck-page.tsx`

These sources shaped the slides on the build loop, simulation timeline, verification artifacts, continual learning, and production monitoring.

### Video reference

The deck references the merged 4x platform demo video added in `heavy-production` PR 460:

- `demos/platform-demo-4x-shiftwork-doc-to-deploy.mp4`

The video sequence was used to ground the annotated simulation timeline: account creation, task submission, training doc creation, validation, modeler report, visual QA agent build, cron schedule, screenshot capture, acceptance, how-to guide, autos_done, and final artifact verification.

### External references

- Matt Pocock skill structure references used as source inspiration for skill and PRD structure.
- Browserbase skill references for company research and event prospecting were reviewed earlier, then reframed into Opulent-owned Agent Factory operations rather than copied as Browserbase capability slides.
- Opulent deck-authoring skill, component system, and prior investor-deck visual language shaped the final slide structure and visual treatment.

## Structural Evolution

The deck evolved through these major revisions:

1. First four Opulent overview slides were retained for context.
2. Agent Factory became the first slide and core framing.
3. The old generic Opulent introduction became a ShiftWork collaboration project description.
4. Background triage and event prospecting slides were replaced with Agent Factory operations and shared delivery process slides.
5. ShiftWork-specific imagery was remapped using the packaged Opulent customer assets.
6. Simulation slides were changed to describe process methodology and evidence instead of failure language.
7. A timeline slide was added to reference the accompanying recorded demo.
8. A cost-of-operations slide was added for simulation and recurring workflow economics.
9. A verification-artifacts slide was added to show how run evidence feeds continual learning and production monitoring.
10. Pricing was separated from cost and framed around workflow development, retainer support, seats, and customer usage.
11. The final slide was changed to exploration areas for agreement, go-live, support, ramp time, and delivery cost.

## How To Use This Record

Use the deck for the project-start discussion with ShiftWork. Use this file as the source trail when explaining why each section exists, what evidence shaped it, and which decisions still need joint planning.
