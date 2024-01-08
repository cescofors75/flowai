import { StreamingTextResponse, CohereStream } from 'ai';
import { NextResponse, NextRequest } from "next/server";
export const maxDuration = 25
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    // Extract the `prompt` from the body of the request
    const { prompt } = await req.json();

    const body = JSON.stringify({
      message: prompt,
      model: 'command',
      temperature: 0.2,
      stream: true,
      connectors: [{ id: "web-search" }]
    });

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
      },
      body,
    });

    // Handle non-OK responses
    if (!response.ok) {
      return new NextResponse(JSON.stringify( { status: response.status }));
    }

    const stream = CohereStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    // Handle any other errors
    return new NextResponse(JSON.stringify({ status: 500 }));
  }
}



/*import { CohereClient } from 'cohere-ai';

import { StreamingTextResponse } from 'ai';
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY, // Make sure this is a server-side variable only!
});


export async function POST(req: Request) {
  
  const { prompt } = await req.json();
 

    const stream = await cohere.chatStream({
      message: prompt,
      model: "command-light",
      promptTruncation: "AUTO",
      citationQuality: "accurate",
      connectors: [{ "id": "web-search" }],
      documents: []
    });

   
    return new StreamingTextResponse(new ReadableStream({
      start(controller) {
        (async () => {
          let searchResults = []; // Para almacenar URLs de los resultados de búsqueda
          for await (const chunk of stream) {
            console.log(chunk);
            if (chunk.eventType === "text-generation") {
              controller.enqueue(JSON.stringify({
                type: 'text-generation',
                data: chunk.text.toString()
              }));
            }
            if (chunk.eventType === "search-results") {
              chunk.documents.forEach((doc) => {
                searchResults.push(doc.url); // Guarda la URL en el arreglo
              });
            }
          }
          // Enqueue todos los resultados de búsqueda al final
          if(searchResults.length > 0){
            controller.enqueue(JSON.stringify({
              type: 'search-results',
              data: searchResults
            }));
          }
          controller.close(); // Asegúrate de cerrar el controlador al final
        })().catch(error => {
          // Manejo de errores
          console.error('Stream processing failed:', error);
          controller.error(error);
        });
      }
    }))
  }*/