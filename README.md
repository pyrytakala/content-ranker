# content-ranker

Rank conference talks by transcript quality. Fetches YouTube transcripts, scores them with Fireworks, and serves a rankings frontend.

Built with **TypeScript**, **Vite**, and deployable to **Vercel**.

Supported transcript providers:

- [TranscriptAPI](https://transcriptapi.com/) (`transcriptapi`, default when `TRANSCRIPTAPI_API_KEY` is set)
- [Supadata](https://supadata.ai/) (`supadata`)

## Setup

```bash
npm install
cp .env.example .env
# fill in API keys in .env
```

## Usage

```bash
# Fetch transcripts from a YouTube channel (default: past 2 months)
npm run fetch

# Score transcripts and write rankings (uses .cache/ to avoid repeat API calls)
npm run score

# Rebuild rankings from existing score files without calling APIs
npm run score -- --reparse

# Publish enriched rankings for the static site
npm run publish

# Full cache-first pipeline (retry transcripts + reparse + publish)
npm run pipeline -- --reparse-only

# Local dev server with live /api/rankings
npm run dev

# Production build
npm run build
```

The published site reads `public/data/rankings.json`. Local pipeline output (`transcripts/`, `scores/`, `.cache/`) stays gitignored.

## Deployment

**Live site:** https://pyrytakala.github.io/content-ranker/

Deployed via free GitHub Pages on push to `main` (`.github/workflows/pages.yml`).

### Vercel (optional)

The key in `.env` as `VERCEL_API_KEY` is a **Vercel AI Gateway** key (`vck_…`), not a deploy token. For CLI/Actions deploys, create a **personal access token** (`vcp_…`) at https://vercel.com/account/tokens and add it as GitHub secret `VERCEL_TOKEN` (plus `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` after `vercel link`).

Alternatively, import the repo at https://vercel.com/new — no token needed, Vercel builds from GitHub directly.

### GitHub secrets (optional pipeline refresh)

- `FIREWORKS_API_KEY`, `TRANSCRIPTAPI_API_KEY`, `SUPADATA_API_KEY` — for re-scoring on merge (uses `.cache/` when available)
- `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` — for Vercel deploy workflow

## Project layout

```
src/           shared TS library + frontend entry
scripts/       CLI entrypoints (fetch, score, publish, pipeline)
public/data/   published rankings JSON for production
api/           optional Vercel serverless handlers
```
