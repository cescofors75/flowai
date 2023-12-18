// pages/api/tts.js
//import OpenAI from "openai";
import { NextResponse, NextRequest } from "next/server";
import MistralClient from '@mistralai/mistralai'
export async function POST(req ) {
  const { apiKey, model, messages} = await req.json();
//console.log(model, messages);
  // Handling the case where no text is provided
  if (!apiKey) {
    return new NextResponse(JSON.stringify({ error: "No ApiKey" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = new MistralClient(apiKey);
try{
  const chatResponse = await client.chat({
    model: model,
    messages: messages,
    temperature: 0.2,
    //safe_mode:true
  });
 

   // console.log('Chat:', chatResponse.choices[0].message.content);
    // Creating and returning a NextResponse
    return new NextResponse(JSON.stringify({ responseMistral: chatResponse.choices[0].message.content }), {
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





