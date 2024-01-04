

import { NextResponse } from 'next/server';


export const runtime = 'edge';
export const maxDuration = 25

export  async function POST(req:Request) {
    const { name } = await req.json();
  console.log(name)
    try {
      const response = await fetch(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: process.env.API_KEY_STABILITY_AI,
          },
          body: JSON.stringify({
            // ... (the rest of the parameters)
      
            width: 1024,
            height: 1024,
            steps: 40,
            seed: 0, // valar por defecto 0
            cfg_scale: 10,
            samples: 1,
            //sampler: sampler,//'K_DPMPP_2M', // no tenia este parameto
            style_preset: "photographic", //"photographic",
            text_prompts: [
              {
                text: name,
                weight: 1,
              },
              {
                text: "b&n",
                weight: -1,
              },
            ],
          }),
        }
      );

    //if (!response.ok) throw new Error('No image data found');
//console.log(response.data[0].b64_json)
const image = await response.json();
//console.log(image)
return NextResponse.json({ imageURL: image.artifacts[0].base64 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error generating image' });
  }
}


