# Opulent ShiftWork Working Plan Deck

This repository packages the Opulent x ShiftWork working-plan deck.

## Contents

- `outputs/opulent-shiftwork-working-plan-deck.pptx` - final PowerPoint deck
- `renders/opulent-shiftwork-working-plan-deck-montage.png` - rendered QA montage
- `source/shiftwork-working-plan-deck-page.tsx` - React source used to render the deck route
- `assets/opulent-customer-assets/` - customer cover assets used to remap the ShiftWork-specific slide imagery
- `materials/outlook-agent-intake/` - ShiftWork SOW, pipeline notes, runbook, meeting notes, and discovery templates
- `materials/opulent-docs/` - Opulent PRD, interop specs, testing summary, rerun instructions, and ShiftWork narrative docs
- `materials/qa-artifacts/` - ShiftWork demo simulations, visual QA interop fixtures, reports, screenshots, and runner scripts

## Deck Scope

The deck keeps the opening Opulent overview slides from the investor deck, then adds the ShiftWork pre-kickoff working plan, including:

- Agent Factory framing
- Agent Factory operating process
- Shared ShiftWork and Opulent delivery model
- ShiftWork SOW summary
- Build loop and workflow map
- Simulation and validation overview
- Annotated simulation timeline
- Verification artifacts and continual learning loop
- Operating cost model
- Demo plan
- Pricing structure

## Image Remap

The ShiftWork-specific slides use varied customer cover assets instead of repeated runtime placeholder images. The layout, crops, frames, and component structure are preserved from the source deck. Header, logo, favicon, and icon assets are excluded from the remap.

## Validation

The deck was rendered to slide images and checked with the presentation overflow test before packaging.
