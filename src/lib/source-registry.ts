/**
 * Dev-only catalog of which content sources are included or deliberately excluded.
 * Not surfaced in the UI — update this when adding or declining a source.
 *
 * Runtime config lives in `sources-config.ts`; this file is the decision log.
 */

export type IncludedSourceEntry = {
  status: "included";
  id: string;
  note?: string;
};

export type ExcludedSourceEntry = {
  status: "excluded";
  id: string;
  label: string;
  reason: string;
  channelHandle?: string;
};

export type SourceRegistryEntry = IncludedSourceEntry | ExcludedSourceEntry;

/** Inclusion/exclusion decisions for AI starred sources. */
export const SOURCE_REGISTRY: SourceRegistryEntry[] = [
  {
    status: "included",
    id: "ai-engineer-worlds-fair-2026",
    note: "Conference; 10-day display window after upload.",
  },
  {
    status: "included",
    id: "latent-space-pod-q2-2026",
  },
  {
    status: "included",
    id: "no-priors-pod-q2-2026",
  },
  {
    status: "included",
    id: "twiml-ai-pod-q2-2026",
  },
  {
    status: "included",
    id: "cognitive-revolution-pod-q2-2026",
  },
  {
    status: "included",
    id: "nvidia-q2-2026",
    note: "YouTube channel; scored with talk prompt.",
  },
  {
    status: "included",
    id: "a16z-q2-2026",
  },
  {
    status: "included",
    id: "ml-street-talk-q2-2026",
    note: "H1 2026 (Q2 had <10 episodes).",
  },
  {
    status: "included",
    id: "paul-graham-essays-2020s",
    note: "Essay fetch via paulgraham.com HTML extractor.",
  },
  {
    status: "included",
    id: "huberman-lab-h1-2026",
    note: "H1 2026 (~49 episodes; Q2 alone had 26).",
  },
  { status: "included", id: "swyx-io-2026", note: "Blog via RSS + Readability." },
  { status: "included", id: "gwern-blog-2025-2026", note: "Gwern blog index parser." },
  { status: "included", id: "simon-willison-h1-2026" },
  { status: "included", id: "anthropic-engineering-h1-2026" },
  { status: "included", id: "openai-developer-blog-h1-2026" },
  { status: "included", id: "stratechery-h1-2026" },
  { status: "included", id: "import-ai-h1-2026" },
  { status: "included", id: "hamel-dev-h1-2026" },
  { status: "included", id: "machine-theory-journal-h1-2026" },
  { status: "included", id: "semianalysis-q2-2026", note: "Archives scraper; paywalled posts may be missing." },
  { status: "included", id: "bens-bites-q2-2026" },
  { status: "included", id: "pragmatic-engineer-2026" },
  { status: "included", id: "construction-physics-q2-2026" },
  { status: "included", id: "asterisk-issue-14-latest", note: "Latest 5 from issue 14 via RSS." },
  { status: "included", id: "odd-lots-q2-2026", note: "YouTube playlist." },
  { status: "included", id: "yc-startup-pod-q2-2026" },
  { status: "included", id: "my-first-million-q2-2026" },
  { status: "included", id: "pmf-show-q2-2026" },
  { status: "included", id: "how-i-built-this-q2-2026", note: "Podcast RSS show notes (no recent YouTube uploads)." },
  { status: "included", id: "lennys-podcast-q2-2026" },
  { status: "included", id: "nateliason-q2-2026" },
  { status: "included", id: "founders-podcast-q2-2026" },
  { status: "included", id: "peter-attia-q2-2026" },
  { status: "included", id: "modern-wisdom-q2-2026", note: "Chris Williamson channel (by ID)." },
  { status: "included", id: "greg-isenberg-q2-2026" },
  { status: "included", id: "iltb-podcast-q2-2026" },
  { status: "included", id: "nateliason-q2-2026", note: "No 2026 YouTube uploads (channel inactive since 2023)." },
  {
    status: "excluded",
    id: "lex-fridman-pod",
    label: "Lex Fridman Podcast",
    channelHandle: "lexfridman",
    reason:
      "Will not add — most episodes exceed the 3h scoring limit (see scoring-limits.ts).",
  },
];

export function listIncludedSourceIds(): string[] {
  return SOURCE_REGISTRY.filter((entry) => entry.status === "included").map(
    (entry) => entry.id,
  );
}

export function listExcludedSources(): ExcludedSourceEntry[] {
  return SOURCE_REGISTRY.filter(
    (entry): entry is ExcludedSourceEntry => entry.status === "excluded",
  );
}
