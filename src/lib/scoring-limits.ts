export const MAX_SCORED_DURATION_SECONDS = 90 * 60;

export function isTooLongForScoring(durationSeconds: number | null | undefined): boolean {
  return durationSeconds != null && durationSeconds > MAX_SCORED_DURATION_SECONDS;
}

export function formatScoringDurationLimit(): string {
  return `${MAX_SCORED_DURATION_SECONDS / 60} minutes`;
}
