// pages/api/tts.js
//import OpenAI from "openai";
import { NextResponse, NextRequest } from "next/server";
import MistralClient from '@mistralai/mistralai'
export async function POST(req :NextRequest ) {
 //const { apiKey} = await req.json();
 const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
  // Handling the case where no text is provided
  

  const client = new MistralClient(apiKey);
  try {
    // Realizar la solicitud a la API de Mistral
    const mistralResponse = await fetch("https://api.mistral.ai/v1/models", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
   
    });
    const responseData = await mistralResponse.json();
    console.log('Chat:', responseData.data);
    // Creating and returning a NextResponse with the audio data
    return new NextResponse(JSON.stringify({ responseMistral: responseData.data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    //console.error(error);
    return new NextResponse(JSON.stringify({ error: "Error generating speech" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}





