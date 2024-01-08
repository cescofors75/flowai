import { NextResponse, NextRequest } from "next/server";
import { OpenAI } from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const createAssistant = async ({ name, instructions, fileId }) => {
  const assistant = await openai.beta.assistants.create({
    name: name,
    instructions: instructions,
    tools: [{ type: "code_interpreter" }],
    model: "gpt-4-1106-preview",
    file_ids: fileId && [fileId],
  });

  return assistant;

};

const getAssistant = async (assistantId: string) => {
  const assistant = await openai.beta.assistants.retrieve(assistantId);
  return assistant;
};
const deleteAssistant = async (assistantId: string) => {
  const response = await openai.beta.assistants.del(assistantId);
  return response;
};



//api to hande creation of simple assistant
//or assistnt with files id 
export async function POST(req:NextRequest ) {
  try {
    const formData = await req.formData();

    let name = formData.get("name");
    let instructions = formData.get("instructions");
    let fileId = formData.get("fileId");

    //check if the fields are empty
    if (!name || !instructions) {
      return NextResponse.json(
        { message: "fields are required" },
        { status: 400 }
      );
    }

    let newAssistantData = { name: name, instructions: instructions, fileId: undefined };
    if (fileId) newAssistantData.fileId = fileId;

    let newAssistant = await createAssistant(newAssistantData);

    return NextResponse.json({ newAssistant });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

//get assistant
export async function GET(req:NextRequest ) {
  try {
    const assistantId = req.nextUrl.searchParams.get("assistantId");

    console.log(assistantId);
    //error if missing
    if (!assistantId) {
      return NextResponse.json({ error: "Missing Query" }, { status: 400 });
    }

    let assistant = await getAssistant(assistantId);

    return NextResponse.json({ assistant });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}



//delete assistant
export async function DELETE(req:NextRequest ) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const assistantId = searchParams.get("assistantId");

    //error if missing
    if (!assistantId) {
      return NextResponse.json({ error: "Missing Query" }, { status: 400 });
    }
    let delAssistant = await deleteAssistant(assistantId);

    return NextResponse.json({ delAssistant });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
