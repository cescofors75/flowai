import { CohereClient } from 'cohere-ai';
//import { NextRequest, NextResponse } from 'next/server';
import { StreamingTextResponse } from 'ai';
const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY, // Make sure this is a server-side variable only!
});
//export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { prompt } = await req.json();
 // console.log(prompt);
  
  // Initialize the response variable
  let responseFinal = "";

  // Make a call to Cohere's chatStream API

    const stream = await cohere.chatStream({
      message: prompt,
      model: "command-light",
      promptTruncation: "AUTO",
      citationQuality: "accurate",
      connectors: [{ "id": "web-search" }],
      documents: []
    });

   /* return new StreamingTextResponse(new ReadableStream<string>({
      start(controller) {
        (async () => {
          for await (const chunk of stream) {
            console.log(chunk);
            if (chunk.eventType === "text-generation" ) {
            controller.enqueue(chunk.text.toString());
            }
            if (chunk.eventType === "search-results" ) {
              chunk.documents.forEach((doc) => {
                //controller.enqueue(doc.title);
                controller.enqueue(`${doc.title}\n ${doc.url}\n `);
                //controller.enqueue(doc.snippet);
              });
              
              } // Convertir chunk a cadena antes de pasarlo a controller.enqueue()
          }
          controller.close();
        })();
      }
    }));*/
    return new StreamingTextResponse(new ReadableStream({
      start(controller) {
        (async () => {
          for await (const chunk of stream) {
           // console.log(chunk);
            if ('text' in chunk) {
              controller.enqueue(chunk.text.toString());
            }
          }
        })();
      }
    }))
}