# Stillwell — VIP@SoC concept demo

A demonstration frontend for a personal chronic-illness health companion. All supplied patient information is synthetic. Working title: Stillwell.

## Run

No dependencies or API keys required. With Python 3:

```sh
python3 -m http.server 4173
```

Open http://localhost:4173. To test the shared data model, use Node 20+:

```sh
node --test model.test.mjs
```

## Working frontend

- Overview plus companion, records, journal, insights, appointments and family circle.
- Reviewable symptom capture from a small set of supported demonstration phrases.
- Shared journal state: add, edit and delete observations; charts and brief update.
- Search and open sample records; genuinely import a plain-text file.
- Simulated report extraction with editable confirmation.
- Deterministic comparisons from synthetic journal data; unknown values stay unknown.
- Add, order and remove appointment questions; export text, print/save PDF and export JSON.
- In-app reminder schedule and medication-note controls.
- Family viewing permissions and revocation as a local UI simulation.
- Browser-local persistence, responsive layouts and a repeatable reset.

## Simulation boundary

No live LLM, clinical advice, OCR, production accounts, access-control backend, wearable connections, HealthHub access, notification delivery or external sharing. The companion uses scripted responses with calculations from local state. The family view is a preview, not another authenticated user. Do not upload real patient information. No clinical outcomes or production readiness are claimed.

## Three-minute filming path

1. Reset using the top-right circular arrow. Open Overview to introduce the whole-person workspace.
2. Health records → Add a record → Try sample report extraction → review → confirm. Mention that this import illustrates the intended extraction workflow.
3. Companion → Log how I’m feeling → Review & save. Correct a detail, save and show its appearance in Daily journal.
4. Patterns & insights → inspect the paired journal chart and grouped averages → save the question.
5. Appointments → move the added question up → show the current brief → Preview & print PDF.
6. Family circle → select which areas are shared → preview Emma’s view → revoke and preview again.
7. End on Overview with the updated profile. Explain that the demo connects the experience; production integrations are future work.

Use a 1440×1000 desktop viewport for filming. Keep the synthetic-demo disclosure visible. The example date is fixed to 13 September 2026 for repeatability.

## Deployment

This directory is a standalone static site. `render.yaml` defines a Render Static Site: no server or environment variables required. GitHub Pages can also serve the repository root. Keep hash routing so direct navigation works on static hosting.

## Reference basis

Functional reference patterns come from Guava (records, tracking, insights, visit preparation and family sharing) and Juno (ongoing chronic-illness conversation and symptom capture). Branding, code, icons and synthetic records here are original. This project is not affiliated with either company.

- https://guavahealth.com/article/guava-ultimate-guide
- https://guavahealth.com/prepare-for-visits
- https://junocompanion.com/

## Limitations

This is a demonstration, not a healthcare service. Local storage is not a production health-record database. Imported text is limited to 2 MB per file and 50,000 displayed characters. Simulated captures support headaches/fatigue, explicit intensity out of five and explicit sleep hours. Report PDFs/images are previewed by filename only. All patterns describe self-reported synthetic observations, not medical conclusions.
