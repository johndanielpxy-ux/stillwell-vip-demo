# Track 1 Demo Implementation Plan

**Goal:** A polished, connected frontend demonstration for the Friday application video.

**Architecture:** Standalone browser application with one versioned synthetic state store. Scripted companion responses, import preview and family permissions are explicitly simulations; chart calculations, edits, navigation and exports work locally.

**Tech stack:** HTML, CSS, ES modules, SVG charts, browser storage; Python static server. No paid API, backend or external runtime dependency.

**Spec:** ../track-1-definition/04 - Expanded Product Source Audit and Adversarial Review.md, narrowed by the user's latest explicit demo-only authorisation. Production authentication, real medical extraction, live AI, wearable sync and actual family sharing are outside this demo.

## Design

Palette: ink #193b37, teal #2c7666, mint #e4eee8, canvas #f6f8f7, paper #ffffff, ochre #b38339. Typography: system humanist sans, with Georgia for warm greeting display. Sidebar and contextual rail frame a broad content workspace. Charts and timelines provide the visual identity, not decorative scorecards. Every route uses patient-specific content. Synthetic-demo disclosure stays visible.

## Tasks

- [ ] State and fixtures (`model.mjs`, `model.test.mjs`): source observations generate trends; accepted chat entries, edits and deletes use the same list. Node tests check correction, deletion, missingness, reset and exports.
- [ ] Application (`index.html`, `app.mjs`, `styles.css`): overview plus six product areas; responsive sidebar, route transitions, record drawer, chart comparison, companion capture, tracker, visit agenda and family-access preview.
- [ ] Demo controls: load sample record through a reviewed simulated extraction; import plain-text notes genuinely; export visit brief and data; keyboard dialogs; reset data; seeded/scripted response disclosure.
- [ ] Browser QA: inspect desktop and mobile screenshots; walk through capture→correction→chart→brief, record review, reminder preview and caregiver preview/revocation. Check console and reload persistence. Fix visible defects.
- [ ] Handoff: README with run command, filming sequence and precise functional/simulated boundaries. Open local app for the user.

## Acceptance

No production claims or real-patient data. No nonfunctional primary controls. Charts show actual sample counts and unlogged dates. Changes must update the timeline and brief. Unknown conversation prompts must not receive fabricated clinical answers. Reminder controls schedule only an in-app demo state; no external notification promise. Family preview must never be described as secure authentication. No medical dose changes or automatic care-plan instructions.
