import { Anthropic } from '@anthropic-ai/sdk';

if (!process.env.NEXT_PUBLIC_CLAUDE_API_KEY) {
  throw new Error('Missing CLAUDE_API_KEY environment variable');
}

const anthropic = new Anthropic({
  apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
});

export async function combinePrompts(prompts: string[]): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
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

    // Get the content value safely
    const content = 
      response.content[0].type === "text" ? response.content[0].text : "";

    return content;
  } catch (error) {
    console.error('Error combining prompts:', error);
    throw error;
  }
} 
