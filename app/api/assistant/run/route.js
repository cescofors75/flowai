import { NextResponse } from "next/server";
import { runCheck, runAssistant } from "../../../utils/OpenAI";


//export const runtime ='edge'
//run the assistant
export async function POST(req) {
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
