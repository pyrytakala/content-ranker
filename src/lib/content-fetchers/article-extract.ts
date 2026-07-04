import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

import { fetchText } from "./http.js";

export interface ExtractedArticle {
  title: string;
  text: string;
}

const MIN_ARTICLE_CHARS = 400;

export function extractArticleFromHtml(html: string, url: string): ExtractedArticle | null {
  const dom = new JSDOM(html, { url });
  const article = new Readability(dom.window.document).parse();
  if (!article?.textContent?.trim()) {
    return null;
  }

  return {
    title: article.title?.trim() || "",
    text: article.textContent.trim(),
  };
}

export function isArticleLongEnough(text: string | null | undefined): boolean {
  return Boolean(text && text.length >= MIN_ARTICLE_CHARS);
}

export async function fetchAndExtractArticle(url: string): Promise<ExtractedArticle> {
  const html = await fetchText(url);
  const article = extractArticleFromHtml(html, url);
  if (!isArticleLongEnough(article?.text)) {
    throw new Error("article body too short or missing");
  }
  return article!;
}

export { MIN_ARTICLE_CHARS };
