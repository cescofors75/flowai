import { StreamingTextResponse, CohereStream } from 'ai';
export const maxDuration = 25
export async function POST(req: Request) { //
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();
 
  const body = JSON.stringify({
   
    prompt:  prompt ,
    model: 'command-light',
    //max_tokens: 300,
    //stop_sequences: [],
    temperature: 0.2,
    //return_likelihoods: 'NONE',
    stream: true,
  });
 
  const response = await fetch('https://api.cohere.ai/v1/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    },
    body,
  });
 
  // Check for errors
  if (!response.ok) {
    return new Response(await response.text(), {
      status: response.status,
    });
  }
 
  // Extract the text response from the Cohere stream
  const stream = CohereStream(response);
 
  // Respond with the stream
  return new StreamingTextResponse(stream);
}