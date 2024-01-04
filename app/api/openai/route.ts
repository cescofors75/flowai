import { StreamingTextResponse, OpenAIStream } from 'ai';
import OpenAI from 'openai';

export const runtime = 'edge';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

 
  
 
  export async function POST(req: Request) {
    // Extract the `prompt` from the body of the request
    const { prompt } = await req.json();
   
    // Ask OpenAI for a streaming completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-4-1106-preview',
      //max_tokens: 2000,
      stream: true,
      messages: [{ role: "user", content: prompt }]
    });
   
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
   
    // Respond with the stream
    return new StreamingTextResponse(stream);
}
