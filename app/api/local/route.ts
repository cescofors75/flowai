
import { NextResponse, NextRequest } from "next/server";

export  async function POST(req: NextRequest) {
 // const { apiKey } = await req.json();

  // Verificar si se proporcionó una clave de API
  /*if (!apiKey) {
    return new NextResponse(
      JSON.stringify({ error: "No se proporcionó una clave de API" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }*/
//console.log('APIIIII')
  try {
    // Realizar la solicitud a la API de Mistral
    const mistralResponse = await fetch("http://localhost:1234/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Sommelier " },
          { role: "user", content: "Que vino marida con Pizza" },
        ],
        temperature: 0.2,
        max_tokens: 40,
        stream: false,
      }),
    });

    if (!mistralResponse.ok) {
      throw new Error("Error en la solicitud a Mistral");
    }

    const responseData = await mistralResponse.json();

    // Retornar la respuesta de Mistral
    return new NextResponse(
      JSON.stringify({ responseMistral: responseData.choices[0].message.content }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error al generar el discurso" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}






