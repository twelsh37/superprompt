import { Anthropic } from '@anthropic-ai/sdk';

export async function GET() {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'Say hello!'
      }]
    });

    // Get the content value safely
    const content = 
      response.content[0].type === "text" ? response.content[0].text : "";

    return Response.json({ success: true, message: content });
  } catch (error) {
    console.error('Claude API test error:', error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
} 
