# Stillwell — healthcare companion demonstration

A connected six-area demonstration for VIP@SoC. All supplied patient data is synthetic. The interface draws on Guava's records/tracking/visit workflows and Juno's continuing companion experience. Original code, branding and assets; no affiliation with either reference company.

## Run the server

Node 22+; no package dependencies.

```sh
cp .env.example .env
# Set OPENAI_API_KEY and a separate DEMO_ACCESS_CODE in .env.
npm start
```

Open http://localhost:4174. Click the mode control and enter the **demo access code**, never the OpenAI key. Missing configuration leaves prepared mode available.

```sh
npm test
```

## Actual technical work

- Server-side OpenAI Responses API, strict structured outputs and `store:false`.
- Retrieval of relevant records plus recent journal observations; deterministic sleep comparisons supplied as a separate calculation source.
- Returned source IDs and quoted passages validated against the supplied context. Citation controls open current evidence and warn if a source changed after the answer.
- User-reviewed conversational symptom extraction: missing severity/sleep remain unknown.
- Live PDF/image/text document extraction into an editable result before saving. Original uploaded file is retained only in browser memory for that session; extracted text persists locally. Quotes from PDFs/images remain model transcriptions requiring user review.
- Trace view shows actual model, latency, selected-source count, context fingerprint and token usage when returned by the provider.
- Server asset allowlist, separate demo access code, request/file limits, timeout, safe errors and in-memory rate/request limits. Limits reset when the process restarts; they are not a billing cap.
- Local journal edits propagate to calculated charts and appointment briefs; same-day observations are averaged and missing days remain gaps.

Matching citation text does not establish medical accuracy. The assistant supports discussing documented information and organising questions; it is not a clinical care service.

## Two modes

**Live:** Requires the Node/Render server, OpenAI key and demo access code. Conversations and document content are sent through the server to OpenAI. No automatic fallback hides provider failures.

**Prepared:** Works on static hosting, including the GitHub Pages backup. Scripted companion, sample extraction, and working local journal/charts/exports. The interface labels this mode.

Family permissions and reminder delivery are still local interface simulations in both modes. There is no production patient authentication, clinician monitoring, HealthHub integration or wearable connector. Do not use real patient information.

## Render

`render.yaml` defines a free Node web service in Singapore. Build: `npm test`; start: `npm start`; health: `/healthz`.

Connect this GitHub repository in Render and supply the two secret environment variables. Keep the OpenAI key only in Render's environment configuration, never in the browser or repository. Model can be changed through OPENAI_MODEL. The model default is a configurable implementation choice, not a claim about the latest or best model.

A configured status means credentials exist; it does not prove a successful provider request. Validate a synthetic conversation and file extraction before recording. Warm a free Render service before filming to avoid a cold start.

## Filming path

1. Reset the fictional profile. Introduce the overview and six areas.
2. Enable live mode on the server. Upload a synthetic report, review the actual extraction and save it.
3. Ask about an exact fact in that report. Open the citation and the answer trace.
4. Report a new symptom, review its extracted fields and save. Show journal and charts updating.
5. Save a pattern question to the appointment brief, reorder priorities and open print/PDF preview.
6. Demonstrate the clearly labelled family-sharing preview. Explain which integrations remain future work.

Use 1440×1000 for recording. The demo calendar is fixed to 1–13 September 2026. Synthetic documents may have other dates. Health-history facts are not independently verified by this prototype.

## Reference evidence

- https://guavahealth.com/article/guava-ultimate-guide
- https://guavahealth.com/prepare-for-visits
- https://junocompanion.com/
- https://developers.openai.com/api/docs/guides/structured-outputs
- https://developers.openai.com/api/docs/guides/pdf-files
