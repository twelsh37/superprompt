import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = 'force-dynamic'; // Disable fetch caching

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryName = searchParams.get('category');

    if (!categoryName) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const response = await fetch("https://cursor.directory", {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://cursor.directory',
      }
    });
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const prompts: { title: string; content: string }[] = [];
    
    // Find the section by its heading text
    $('h3.text-lg').each((_, heading) => {
      const $heading = $(heading);
      if ($heading.text().trim() === categoryName) {
        // Found the correct section, now get all prompts in this section
        const $section = $heading.parent();
        $section.find('.bg-card code').each((index, element) => {
          const content = $(element).text().trim();
          if (content) {
            prompts.push({
              title: `Prompt ${index + 1}`,
              content,
            });
          }
        });
      }
    });

    console.log(`Found ${prompts.length} prompts for category ${categoryName}`);

    return NextResponse.json({ 
      prompts,
      category: categoryName,
      total: prompts.length
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompts", message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 
