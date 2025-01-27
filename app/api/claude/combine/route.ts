import { Anthropic } from '@anthropic-ai/sdk';

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
      model: 'claude-3-sonnet-20241022',
      max_tokens: 4096,
      system: `You are an expert at combining multiple AI prompts into one coherent super-prompt.
        - Merge related instructions
        - Remove redundancies
        - Maintain consistent style
        - Preserve all important details
        - Structure logically
        - Resolve any contradictions`,
      messages: [{
        role: 'user',
        content: `Combine these prompts into one coherent super-prompt:\n\n${prompts.join("\n\n")}`
      }]
    });

    return Response.json({ 
      success: true, 
      combinedPrompt: response.content[0].text 
    });
  } catch (error) {
    console.error('Claude combine error:', error);
    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
} 
