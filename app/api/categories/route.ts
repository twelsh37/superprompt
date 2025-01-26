import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Fetching categories...");
    
    const response = await fetch("https://cursor.directory", {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://cursor.directory',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const categories: { id: string; name: string; count: number }[] = [];
    
    // Find all category buttons
    $('button.inline-flex').each((_, element) => {
      const $element = $(element);
      const name = $element.clone().children().remove().end().text().trim(); // Get text without the count
      const countText = $element.find('span').text();
      const count = parseInt(countText) || 0;
      
      console.log(`Found category: ${name} with ${count} items`);
      
      if (count > 4) {
        categories.push({
          id: name.toLowerCase(),
          name,
          count
        });
      }
    });

    console.log('Found categories:', categories);

    return NextResponse.json({ 
      categories: categories.sort((a, b) => b.count - a.count),
      debug: {
        htmlLength: html.length,
        foundButtons: $('button.inline-flex').length,
        totalCategories: categories.length
      }
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch categories", 
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 
