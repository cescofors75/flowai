import { StreamingTextResponse} from 'ai';
import { streamMistralChat } from "mistral-edge";
const apiKey = process.env.MISTRAL_API_KEY;
export const maxDuration = 25

export async function POST(req: Request) { //
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();
 
  const stream = streamMistralChat(
    [{ role: "user", content: prompt }],
    { model: "mistral-small", temperature: 0.2 },
    {
      apiKey: apiKey,
      apiUrl: "https://corsproxy.io/?https://api.mistral.ai/v1/chat/completions",
    }
  );
 
  
 
  // Extract the text response from the Cohere stream
 
 
  // Respond with the stream
  return new StreamingTextResponse(new ReadableStream<string>({
    start(controller) {
      (async () => {
        for await (const chunk of stream) {
          controller.enqueue(chunk);
        }
        controller.close();
      })();
    }
  }));
}