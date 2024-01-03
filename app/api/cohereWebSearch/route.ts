import { CohereClient } from 'cohere-ai';
import { NextRequest, NextResponse } from 'next/server';
import { StreamingTextResponse} from 'ai';
const cohere = new CohereClient({
  token: process.env.NEXT_PUBLIC_COHERE_API_KEY, // Make sure this is a server-side variable only!
});
export const runtime = 'edge';

export async function POST(req: NextRequest) {
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
          let searchResults = []; // Para almacenar URLs de los resultados de búsqueda
          for await (const chunk of stream) {
            if (chunk.eventType === "text-generation") {
              controller.enqueue(JSON.stringify({
                type: 'text-generation',
                data: chunk.text
              }));
             // console.log(chunk.text);
            }
           /* if (chunk.eventType === "search-results") {
              chunk.documents.forEach((doc) => {
                searchResults.push(doc.url); // Guarda la URL en el arreglo
              });
            }*/
          }
          // Enqueue todos los resultados de búsqueda al final
         /* if(searchResults.length > 0){
            controller.enqueue(JSON.stringify({
              type: 'search-results',
              data: searchResults
            }));
          }*/
          controller.close(); // Asegúrate de cerrar el controlador al final
        })().catch(error => {
          // Manejo de errores
          console.error('Stream processing failed:', error);
          controller.error(error);
        });
      }
    }));
    
    
}
