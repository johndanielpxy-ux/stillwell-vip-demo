# Stillwell live AI upgrade

User authorised moving beyond the UI demo using OpenAI and Render. Preserve the existing six-area interface and fallback; implement in this repository without another scope checkpoint.

- Node 22 server serves an explicit public asset allowlist and `/api/status`, `/api/chat`, `/api/extract`.
- Server-only `OPENAI_API_KEY`, configurable model (default `gpt-4.1-mini`), required `DEMO_ACCESS_CODE` for live requests. Client submits a separate demo access code, never an OpenAI key.
- Live Responses API with strict structured output and `store:false`. Validate model output again locally. Enforce request/file bounds, timeout, per-code request limit and no sensitive error logging.
- Select records by query overlap; include recent journal entries and deterministic comparisons. Validate citation IDs and quoted passages against selected source text. No claim that matching text proves a medical conclusion.
- Document input accepts text/PDF/images up to 2 MB. Show editable extraction before saving. Original file available only for the current browser session; retained extracted record remains labelled as AI-extracted and user-reviewed.
- Frontend runtime status, code entry, explicit live/fallback selection, live source buttons, extraction review, and failure/retry state. No silent fallback after provider errors.
- Tests: no credentials exposed as assets; missing/wrong access code; overlarge request; model refusal/bad JSON; fabricated source IDs/quotes; corrected context; extraction route; safe timeout/error response.
- Render Node web-service configuration with health check and environment placeholders; GitHub Pages remains prepared fallback only.

Sources checked: LAWFLO `api/_lib/openaiProvider.ts` and `server/renderApp.ts`; official OpenAI structured outputs and file-input guides, 13 September 2026. Public API docs searched (search blocked), then direct official guides opened and read.
