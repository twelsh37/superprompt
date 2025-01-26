interface CursorPrompt {
  title: string;
  content: string;
}

/**
 * Fetches and parses prompts from cursor.directory via our API route
 * @returns Promise<CursorPrompt[]>
 */
export const fetchCursorPrompts = async (): Promise<CursorPrompt[]> => {
  try {
    const response = await fetch("/api/prompts");
    if (!response.ok) {
      throw new Error("Failed to fetch prompts");
    }

    const data = await response.json();
    return data.prompts;
  } catch (error) {
    console.error("Error fetching cursor prompts:", error);
    return [];
  }
}; 
