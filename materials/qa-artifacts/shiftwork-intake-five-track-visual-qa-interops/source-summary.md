# Source Summary

Source materials were extracted from Outlook into `/Users/jeremyalston/Downloads/outlook-agent-intake/`.

## Files Read

- `shiftwork-build-pipeline-sow.txt`
- `ShiftWork_Opulent_Pipeline_Notes.txt`
- `ShiftWork_Opulent_Runbook_v2.txt`
- `01_Marketing_Discovery_Template.txt`
- `02_Sales_Discovery_Template.txt`
- `03_Fulfillment_Discovery_Template.txt`
- `04_Service_Discovery_Template.txt`
- `05_Ops_Discovery_Template.txt`
- `Dan Cruden - Shiftwork __ Opulent AI(Morgan Abraham) - 2026_06_12 09_58 EDT - Notes by Gemini.txt`

## Requirements Captured

- ShiftWork owns intake: customer selects use case/task, enters contact/business info, and pays $29.
- Handoff to Opulent is payload-only from Supabase/Vercel webhook. No GitHub/codebase access is required.
- Payload must include lead ID, timestamp, name, business, email, domain or no-domain flag, use case, agent task, build request, and paid status.
- Opulent validates payload, researches the lead, selects exactly one of five questionnaire tracks, drafts Q&A, prepares a call script, supports onboarding call/fallback, reviews gaps, and builds the first agent.
- Draft answers from research must be tagged unconfirmed prompts. They cannot become training truth unless owner-confirmed.
- Build should not start from guesses. Every build-critical answer needs owner confirmation.
- First build targets the owner's top felt problem; use one agent if enough, or manager plus task agents if orchestration is needed.
- Acceptance test uses five real inputs and the owner's most important case is mandatory.
- Delivery requires a hosting/runtime payer, customer access, short how-to, and ROI follow-up at day 14.
