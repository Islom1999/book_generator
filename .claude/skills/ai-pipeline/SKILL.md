---
name: ai-pipeline
description: Build or change the AI generation pipeline in backend/apps/worker (photo inspection, child description, face swap / image edit, upscaling, cost logging), porting proven logic from legacy/api. Use for any generation, trial or print-file work.
---

# AI pipeline (worker)

The MVP's working pipeline is in `legacy/api/src/` (read-only reference):

| Legacy file | What to reuse |
| --- | --- |
| `openrouter/openrouter.service.ts` | `inspectPhoto` (quality check), `describeChild`, `generateStory`, image edit via chat models |
| `replicate/replicate.service.ts` | `cropPhoto`, face swap (`runKontext`, `runInswapper`), retry + concurrency queue, size matching |
| `replicate/face-crop.ts` | face crop helper |
| `personalizations/personalizations.service.ts` | orchestration order of the steps |
| `personalizations/pdf.service.ts` | page layout → PDF (basis for print-PDF) |
| `templates/*.template.ts` | example template/page data shape |

Copy and adapt logic; never import from `legacy/`.

## Target design

- API never calls AI providers directly. It creates DB rows and enqueues a BullMQ
  job (`Queues.GENERATION` from `@app/queues`); `apps/worker` processes it.
- Providers behind interfaces (`ImageEditProvider`, `VisionProvider`, …) so
  OpenRouter/Replicate can be swapped; keys from env (`OPENROUTER_API_KEY`,
  `REPLICATE_API_TOKEN`), validated at worker start.
- Job payload carries IDs only (no images). Worker loads files from storage, writes
  results back to storage, stores a new `generated_pages` version.
- Every provider call writes `generation_logs`: provider, model, duration, cost (USD),
  status, error. Trial budget check reads today's sum (`docs/BUSINESS_LOGIC.md` §5).
- Jobs are idempotent and retry with backoff; a failed trial doesn't consume the limit.
- Outputs: full-res private original + watermarked low-res preview (§11).
- Print stage (after APPROVED): upscale, 300 DPI, bleed, CMYK, print-PDF; parameters
  from `book_formats`, not constants.

## Testing

Unit-test prompt building and orchestration with fake providers. Don't call paid
APIs in tests; for a manual end-to-end run ask the owner first (it costs money).
