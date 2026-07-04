const MONTH_TO_NUMBER: Record<string, string> = {
  january: "01",
  jan: "01",
  february: "02",
  feb: "02",
  march: "03",
  mar: "03",
  april: "04",
  apr: "04",
  may: "05",
  june: "06",
  jun: "06",
  july: "07",
  jul: "07",
  august: "08",
  aug: "08",
  september: "09",
  sep: "09",
  sept: "09",
  october: "10",
  oct: "10",
  november: "11",
  nov: "11",
  december: "12",
  dec: "12",
};

/** Parse "6/29/26" or "12/1/25" into YYYYMMDD. */
export function parseShortUsDate(text: string): string | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/.exec(text.trim());
  if (!match) {
    return null;
  }

  const month = String(Number(match[1])).padStart(2, "0");
  const day = String(Number(match[2])).padStart(2, "0");
  const year = 2000 + Number(match[3]);
  return `${year}${month}${day}`;
}

/** Parse "July 2023", "Apr 23, 2026", or ISO dates into YYYYMMDD. */
export function parseFlexibleDate(text: string): string | null {
  const iso = /(\d{4})-(\d{2})-(\d{2})/.exec(text);
  if (iso) {
    return `${iso[1]}${iso[2]}${iso[3]}`;
  }

  const full = /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{1,2}),?\s+(\d{4})/i.exec(
    text,
  );
  if (full) {
    const month = MONTH_TO_NUMBER[full[1].toLowerCase().replace(".", "")];
    if (month) {
      const day = String(Number(full[2])).padStart(2, "0");
      return `${full[3]}${month}${day}`;
    }
  }

  const monthYear =
    /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+(\d{4})/i.exec(
      text,
    );
  if (monthYear) {
    const month = MONTH_TO_NUMBER[monthYear[1].toLowerCase().replace(".", "")];
    if (month) {
      return `${monthYear[2]}${month}01`;
    }
  }

  return null;
}

export function rssPubDateToUploadDate(pubDate: string | undefined): string | null {
  if (!pubDate) {
    return null;
  }

  const parsed = new Date(pubDate);
  if (Number.isNaN(parsed.getTime())) {
    return parseFlexibleDate(pubDate);
  }

  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const day = String(parsed.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

export function uploadDateFromUrlPath(url: string): string | null {
  const match = /\/(\d{4})\/(\d{2})\/(\d{2})\//.exec(url);
  if (match) {
    return `${match[1]}${match[2]}${match[3]}`;
  }

  const gwernMatch = /\/blog\/(\d{4})\/[^/]+/.exec(url);
  if (gwernMatch) {
    return `${gwernMatch[1]}0101`;
  }

  const simonMatch = /\/(\d{4})\/([A-Za-z]{3})\/(\d{1,2})\//.exec(url);
  if (simonMatch) {
    const month = MONTH_TO_NUMBER[simonMatch[2].toLowerCase()];
    if (month) {
      const day = String(Number(simonMatch[3])).padStart(2, "0");
      return `${simonMatch[1]}${month}${day}`;
    }
  }

  return null;
}

/** Find a publication date in HTML (meta tags, JSON-LD, or visible text). */
export function findPublicationDateInHtml(html: string): string | null {
  const metaPatterns = [
    /property="article:published_time"\s+content="(\d{4}-\d{2}-\d{2})/i,
    /name="date"\s+content="(\d{4}-\d{2}-\d{2})/i,
    /"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/i,
    /datetime="(\d{4}-\d{2}-\d{2})/i,
  ];

  for (const pattern of metaPatterns) {
    const match = pattern.exec(html);
    if (match) {
      const parsed = parseFlexibleDate(match[1]);
      if (parsed) {
        return parsed;
      }
    }
  }

  const textDate =
    /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2},?\s+\d{4}/i.exec(
      html,
    );
  if (textDate) {
    return parseFlexibleDate(textDate[0]);
  }

  return parseFlexibleDate(html.slice(0, 8000));
}
