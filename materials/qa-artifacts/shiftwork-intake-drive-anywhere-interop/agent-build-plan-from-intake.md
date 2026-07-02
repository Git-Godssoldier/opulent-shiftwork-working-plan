# Landing Page Visual QA Agent Build Plan

## Intake Source

- Lead ID: `SW-20260701-001`
- Business: Northstar Renovations
- Agent task: Website visual quality monitoring and email alerts
- Source artifact: `fixtures/shiftwork-intake-answer.google-drive-sim.json`
- Marker: `SHIFTWORK_INTAKE_DRIVE_ANYWHERE_TOKEN_20260701`

## Agent Goal

Monitor `https://northstarrenovations.com/` so the owner gets an email when the public landing page has a visual inconsistency that can hurt lead conversion.

## Trigger

- Primary: weekday schedule at `0 8 * * 1-5` in `America/Chicago`
- Secondary: manual on-demand run
- First-build fallback: on-demand only is acceptable if scheduling is not wired yet, but the schedule remains a required next wiring step

## Run Steps

1. Open `https://northstarrenovations.com/`.
2. Capture a desktop screenshot at `1280x900`.
3. Capture a mobile screenshot at `390x844`.
4. Check route-specific expectations:
   - Hero image is visible and not blank.
   - Headline and subheadline do not overlap.
   - `Get a Quote` button is visible and reachable.
   - Lead form fields are visible and usable on mobile.
   - Navigation does not cover content.
   - Phone number and primary CTA remain readable.
5. Check failure criteria:
   - overlapping text
   - missing or blank image
   - hidden primary CTA
   - horizontal scroll
   - unreachable button or link
   - form cut off
   - navigation over content
   - console error
   - blank section
6. Save current screenshots and a JSON run report to workspace storage.
7. If no issue is found, record a pass report and do not email.
8. If an issue is found, draft an alert email.

## Email Behavior

- To: `mara@northstarrenovations.com`
- Cc: `ops@northstarrenovations.com`
- Subject prefix: `VISUAL QA ALERT`
- Include:
  - page URL
  - viewport
  - severity
  - issue description
  - current screenshot
  - baseline screenshot reference
  - suggested fix
- Do not email customers.
- Do not live-send unless the run mode explicitly approves email sending. In default verification, produce a draft/proof artifact.

## Storage Artifacts

- `screenshots/home-desktop-<timestamp>.png`
- `screenshots/home-mobile-<timestamp>.png`
- `reports/visual-qa-run-<timestamp>.json`
- `emails/visual-qa-alert-draft-<timestamp>.txt` when an issue is detected

## Acceptance Test

The first accepted build must prove:

- Desktop screenshot captured.
- Mobile screenshot captured.
- Primary CTA visibility checked.
- Mobile horizontal scroll checked.
- A seeded visual issue produces an email alert draft.
- A clean run does not send or draft an alert.
- The run report includes timestamp, URL, viewport, verdict, screenshot paths, and detected issues.

## Open Confirmation

The email provider is not owner-confirmed. The first build can draft alerts to a local artifact. Live email send requires confirming Outlook/Gmail and explicit send approval.
