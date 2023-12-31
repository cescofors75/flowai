// pages/api/tts.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";
 const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
  }
)
export const maxDuration = 25
//export const runtime = 'edge';



const fetchData = async () => {
  const { data } = await supabase
    .from('bussines')
    .select('id, name, city')

  return data
}

export async function GET() {
  
 
  try {
    const response = await  fetchData()
 
 // aqui response es un array y quiero devolverlo como json
  const jsonData = JSON.stringify(response)
    // Creating and returning a NextResponse with the audio data
    return new NextResponse(jsonData, {
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







