import { Anthropic } from '@anthropic-ai/sdk';
import { defaultPromptSuffix } from '@/data/defaultSuffix';

export async function POST(request: Request) {
  try {
    const { prompts } = await request.json();

    if (!Array.isArray(prompts) || prompts.length === 0) {
      return Response.json(
        { error: "Invalid prompts array" },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      system: `You are an expert at combining multiple AI prompts into one coherent super-prompt.
        - Merge related instructions
        - Remove redundancies
        - Maintain consistent style
        - Preserve all important details
        - Structure logically
        - Resolve any contradictions
        - Return ONLY the combined prompt text, without any introduction or explanation`,
      messages: [{
        role: 'user',
        content: `Combine these prompts into one coherent super-prompt. Return ONLY the combined prompt text:\n\n${prompts.join("\n\n")}\n\n${defaultPromptSuffix}`
      }]
    });

    // Remove common prefixes that Claude might add
    let combinedPrompt = response.content[0].text
      .replace(/^Here['']s a combined super-prompt that incorporates the key elements from all the provided prompts:\n*/i, '')
      .replace(/^Combined prompt:\n*/i, '')
      .replace(/^Here['']s the combined prompt:\n*/i, '')
      .trim();

    return Response.json({ 
      success: true, 
      combinedPrompt 
    });
  } catch (error) {
    console.error('Claude combine error:', error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
} 
