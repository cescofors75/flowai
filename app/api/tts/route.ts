// pages/api/tts.js
import OpenAI from "openai";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req :NextRequest ) {
  const { text } = await req.json();

  // Handling the case where no text is provided
  if (!text) {
    return new NextResponse(JSON.stringify({ error: "No text provided" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      input: text,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Creating and returning a NextResponse with the audio data
    return new NextResponse(buffer, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    //console.error(error);
    return new NextResponse(JSON.stringify({ error: "Error generating speech" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}





