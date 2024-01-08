import { StreamingTextResponse, OpenAIStream } from 'ai';
import OpenAI from 'openai';

// export const runtime = 'edge';
const openai = new OpenAI({
  baseURL: "http://localhost:1234/v1",
  apiKey: '',
});

 
  
 
  export async function POST(req: Request) {
    // Extract the `prompt` from the body of the request
    const { prompt } = await req.json();
   
    // Ask OpenAI for a streaming completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      //max_tokens: 2000,
      stream: true,
      messages: [{ role: "user", content: prompt }]
    });
   
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    //console.log(stream)
   
    // Respond with the stream
    return new StreamingTextResponse(stream);
}