import { NextResponse, NextRequest } from "next/server";

import { OpenAI } from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runAssistant = async ({ assistantId, threadId, instructions }) => {
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    instructions: instructions,
  });
  return run;
};
//export const runtime ='edge'
//run the assistant
export async function POST(req: NextRequest ) {
  try {
    const {threadId,assistantId , instructions } = await req.json();
    console.log(threadId, assistantId , instructions)


    /*let threadId = formData.get("threadId");
    let assistantId = formData.get("assistantId");
    let instructions = formData.get("instructions");*/

    //check if the fields are empty
    if (!assistantId || !threadId ) {
      return NextResponse.json(
        { message: "fields are required" },
        { status: 400 }
      );
    }

    let assistant = await runAssistant({
      assistantId,
      threadId,
      instructions,
    });

    return NextResponse.json(assistant);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
