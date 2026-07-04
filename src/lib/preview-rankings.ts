import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

import { sourcePaths } from "./paths.js";
import type { IndexPayload, RankedVideo, RankingsPayload } from "./types.js";

export function buildEmptyRankingsPayload(sourceId: string): RankingsPayload {
  return {
    source_id: sourceId,
    video_count: 0,
    scored_count: 0,
    ranked_count: 0,
    rankings: [],
    other: [],
  };
}
export function buildPreviewRankingsPayload(
  sourceId: string,
  index: IndexPayload,
): RankingsPayload {
  const videos = (index.videos ?? []).filter((video) => video.transcript_status === "ok");

  const other: RankedVideo[] = videos.map((video) => ({
    id: video.id,
    title: video.title,
    url: video.url,
    upload_date: video.upload_date ?? null,
    duration_seconds: video.duration_seconds ?? null,
    speakers: video.channel ?? undefined,
    status: "pending",
  }));

  return {
    source_id: sourceId,
    video_count: videos.length,
    scored_count: 0,
    ranked_count: 0,
    rankings: [],
    other,
  };
}

export function readRankingsPayloadForSource(sourceId: string): RankingsPayload | null {
  const paths = sourcePaths(sourceId);

  if (existsSync(paths.publicRankingsPath)) {
    return JSON.parse(readFileSync(paths.publicRankingsPath, "utf8")) as RankingsPayload;
  }

  if (existsSync(paths.rankingsPath)) {
    return JSON.parse(readFileSync(paths.rankingsPath, "utf8")) as RankingsPayload;
  }

  if (!existsSync(paths.indexPath)) {
    return buildEmptyRankingsPayload(sourceId);
  }

  const index = JSON.parse(readFileSync(paths.indexPath, "utf8")) as IndexPayload;
  return buildPreviewRankingsPayload(sourceId, index);
}

export function writePublicRankingsPayload(sourceId: string, payload: RankingsPayload): void {
  const paths = sourcePaths(sourceId);
  mkdirSync(join(paths.publicRankingsPath, ".."), { recursive: true });
  writeFileSync(paths.publicRankingsPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export function writePreviewRankingsIfMissing(sourceId: string): boolean {
  const paths = sourcePaths(sourceId);

  if (existsSync(paths.publicRankingsPath)) {
    return false;
  }

  if (existsSync(paths.rankingsPath)) {
    return false;
  }

  if (!existsSync(paths.indexPath)) {
    writePublicRankingsPayload(sourceId, buildEmptyRankingsPayload(sourceId));
    return true;
  }

  const index = JSON.parse(readFileSync(paths.indexPath, "utf8")) as IndexPayload;
  const payload = buildPreviewRankingsPayload(sourceId, index);
  writePublicRankingsPayload(sourceId, payload);
  return true;
}
