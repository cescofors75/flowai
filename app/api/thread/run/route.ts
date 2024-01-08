import { NextResponse, NextRequest } from "next/server";

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
//run the assistant
const runCheck = async ({ threadId, runId }) => {
  const check = await openai.beta.threads.runs.retrieve(threadId, runId);
  return check;
};
export async function POST(req: NextRequest ) {
  try {
    let { runId, threadId } = await req.json();

    //check if the fields are empty
    if (!runId || !threadId) {
      return NextResponse.json(
        { message: "fields are required" },
        { status: 400 }
      );
    }

    let assistant = await runCheck({
      runId,
      threadId,
    });

    return NextResponse.json(assistant);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


