import OpenAI from 'openai';

import { NextResponse } from 'next/server';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
/*export const config = {

  api: {
    responseLimit: false,
  },
};*/
export const runtime = 'edge';
export const maxDuration = 25

export  async function POST(req:Request) {
    const { name } = await req.json();
  //console.log(prompt)
    try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      //prompt: 'Imagen fotorealista de un restaurante (que hablan '+req.body.locale+')con su atmosfera'+req.body.atmos +'con el nombre: ' +req.body.name|| 'restaurante chino', // Usa un valor por defecto si no se proporciona uno
      prompt: 'Imagen fotorealista '+name, //+req.body.name, // Usa un valor por defecto si no se proporciona uno

      n: 1,
      size: '1024x1024',
      response_format: 'b64_json',
      style:'vivid'
    });

    if (!response.data) throw new Error('No image data found');
//console.log(response.data[0].b64_json)
return NextResponse.json({ imageURL: response.data[0].b64_json });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error generating image' });
  }
}