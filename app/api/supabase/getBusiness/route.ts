import { supabase } from '../../../supabase/client'

import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const maxDuration = 25

export  async function POST(req:Request) {
    const { nameNoSpace } = await req.json();
   // console.log(nameNoSpace)
  //console.log(prompt)
    try {
      
        const { data, error } = await supabase
          .from('bussines')
          .select('*')
          .eq('name_no_space', nameNoSpace.toLowerCase())
  
       // console.log(data)
      

    if (error) throw new Error('No image data found');
//console.log(response.data[0].b64_json)
return NextResponse.json({ data});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error generating image' });
  }
}