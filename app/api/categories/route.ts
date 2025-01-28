import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { PromptCategory } from "@/types/prompts";

export const dynamic = "force-dynamic";

// Add timeout handling to fetch
const fetchWithTimeout = async (url: string, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "https://cursor.directory",
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export async function GET() {
  try {
    const response = await fetchWithTimeout("https://cursor.directory");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const categories: PromptCategory[] = [];

    // Find all category buttons
    $("button.inline-flex").each((_, element) => {
      const $element = $(element);
      const name = $element.clone().children().remove().end().text().trim(); // Get text without the count
      const countText = $element.find("span").text();
      const count = parseInt(countText) || 0;

      if (count > 4) {
        categories.push({
          id: name.toLowerCase(),
          name,
          count,
        });
      }
    });

    return NextResponse.json({
      categories: categories.sort((a, b) => b.count - a.count),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories", message: String(error) },
      { status: 500 }
    );
  }
}
