import { NextResponse } from "next/server";

import { OpenAI } from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const createMessage = async ({ threadId, content }) => {
  const messages = await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });
  return messages;
};
const getMessages = async (threadId) => {
  const messages = await openai.beta.threads.messages.list(threadId);
  return messages;
};
//create new messag
export async function POST(req) {
  const { threadId, content } = await req.json();
  //console.log(threadId, content);
  try {
   /* const formData = await req.formData();
    let threadId = formData.get("threadId");
    let content = formData.get("content");*/

    if (!threadId || !content) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    let newMessage = await createMessage({ threadId, content });

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


//get all message using thread id
export async function GET(req) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("threadId");

    //error if missing
    if (!query) {
      return NextResponse.json({ error: "Missing Query" }, { status: 400 });
    }

    let messages = await getMessages(query);

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
