import { Anthropic } from '@anthropic-ai/sdk';

export async function GET() {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 100,
      messages: [{
        role: 'user',
        content: 'Say hello!'
      }]
    });

    return Response.json({ success: true, message: response.content[0].text });
  } catch (error) {
    console.error('Claude API test error:', error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
} 
