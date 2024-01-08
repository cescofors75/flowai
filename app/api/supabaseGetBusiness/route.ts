// pages/api/tts.js
import { createClient } from '@supabase/supabase-js';
import { NextResponse, NextRequest } from "next/server";
 const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false },
  }
)
export const maxDuration = 25
//export const runtime = 'edge';


async function fetchData(id:string) {
  const { data } = await supabase
    .from('bussines')
    .select('id, name, city,products,mail')
    .eq('name_no_space', id.toLowerCase())
    console.log("data", data)
  return data
}



export async function POST(req:NextRequest) {
  const { id } = await req.json();
  console.log("id", id)
  
  try {
    const response = await  fetchData(id)
 
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





