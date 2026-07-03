export const MAX_VIDEO_AGE_DAYS = 10;

export function parseUploadDate(uploadDate: string | null | undefined): Date | null {
  if (!uploadDate || String(uploadDate).length !== 8) {
    return null;
  }

  const value = String(uploadDate);
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));
  const date = new Date(year, month, day);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function daysSinceUpload(
  uploadDate: string | null | undefined,
  now = new Date(),
): number | null {
  const date = parseUploadDate(uploadDate);
  if (!date) {
    return null;
  }

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((startOfToday.getTime() - startOfDate.getTime()) / (24 * 60 * 60 * 1000));
}

export function isTooOldForDisplay(
  uploadDate: string | null | undefined,
  maxAgeDays = MAX_VIDEO_AGE_DAYS,
): boolean {
  const ageDays = daysSinceUpload(uploadDate);
  if (ageDays == null) {
    return false;
  }

  return ageDays > maxAgeDays;
}
