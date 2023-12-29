import { StreamingTextResponse, OpenAIStream } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import { m } from 'framer-motion';


export const runtime = 'nodejs';
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const fetchData = async () => {
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: 20,
  });

 // console.log(myAssistants.data);
const file = await openai.files.create({
    file: fs.createReadStream("./public/wines.csv"),
    purpose: "assistants",
  });
  const assistant = await openai.beta.assistants.create({
    name: "Sommelier  assistant",
    instructions:`Busca el mejor vino para cada ocasión.`,
    description: "Actua como un Sommelier profesional ",
    model: "gpt-3.5-turbo-1106",
    tools: [{"type": "code_interpreter"}],
    file_ids: [file.id]
  });
  //console.log(assistant);
  const thread = await openai.beta.threads.create();

 
  await openai.beta.threads.messages.create(thread.id,{
    
      role: "user",
      content: "Que vino de la lista marida mejor con una paella?"
      }
    );
 // console.log(thread);
  
  const run = await openai.beta.threads.runs.create(
    thread.id,
    { assistant_id: assistant.id}//assistant.id},
    
    
    
    );
  //console.log(run);

  let runStatus = await openai.beta.threads.runs.retrieve(
    thread.id,
    run.id
  );

  // Polling mechanism to see if runStatus is completed
  // This should be made more robust.
 //console.log(runStatus);

  while (runStatus.status !== "completed") {
   // await new Promise((resolve) => setTimeout(resolve, 1000));
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    //console.log(runStatus);
  }

  // Get the last assistant message from the messages array
  const messages = await openai.beta.threads.messages.list(thread.id);
  //console.log(messages.data);

 
 
  //Find the all messages for the current thread



  
 
  //console.log(allMessagesForRun);

/*
  const lastMessageForRun = messages.data
    .filter(
      (message) => message.run_id === run.id && message.role === "assistant"
    )
    .pop();

  // If an assistant message is found, console.log() it
  if (lastMessageForRun) {
    console.log(lastMessageForRun);
    if ("text" in lastMessageForRun.content[0]) {
     //console.log(`${lastMessageForRun.content[0].text.value} \n`);
      return (lastMessageForRun.content[0].text.value + "\n");
    }
  }*/
  return (messages.data);

}

  
 
  export async function POST(req: Request) {
    // Extract the `prompt` from the body of the request
    const runResponse = await fetchData();
  
 
   
    return NextResponse.json({ message: runResponse });
  }
