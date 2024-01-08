import { NextRequest, NextResponse  } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const createThread = async () => {
  const thread = await openai.beta.threads.create();
  return thread;
};

//get thread
const getThread = async (threadId: string) => {
  const thread = await openai.beta.threads.retrieve(threadId);
  return thread;
};

//delete thread
const deleteThread = async (threadId: string) => {
  const response = await openai.beta.threads.del(threadId);
  return response;
};
//create new thread
export async function POST() {
  try {
    let newThread = await createThread();

    return NextResponse.json(newThread);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}



//get thread
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const threadId = searchParams.get("threadId");

    //check if query is empty
    if (!threadId) {
      return NextResponse.json(
        { message: "threadId is required" },
        { status: 400 }
      );
    }

    let thread = await getThread(threadId);

    return NextResponse.json(thread);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}



//delete thread
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const threadId = searchParams.get("threadId");

    //check if query is empty
    if (!threadId) {
      return NextResponse.json(
        { message: "threadId is required" },
        { status: 400 }
      );
    }

    let delThread = await deleteThread(threadId);

    return NextResponse.json(delThread);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
