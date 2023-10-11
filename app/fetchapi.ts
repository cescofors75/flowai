import  OpenAI  from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat'
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})
import { Node, Edge } from 'reactflow';

export async function fetchApiInfoGPT35(question: string) : Promise<string> {

    const item = question
    
     const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      //model: 'gpt-4',
    
       messages: [{ role: "user", content: item }],
   
       temperature: 0,
      // max_tokens: 1250
     })
    //console.log(response.choices[0].message.content)
    return(`${response.choices[0].message.content}`)
}

export async function fetchApiInfoGPT35Functions(item: string): Promise<string> {
        
   // console.log('item',item)
 
  
    const messages : ChatCompletionMessageParam[] = [{
      role: "user",
      content: "Provide a JSON structure that represents a " + item + ". This structure should incorporate nodes (with id, x, and y coordinates, label ) that define a position, and edges that connect these nodes. "
    }];
          const functions =[
            {
              "name": "generateNodesAndEdges",
              "description": "This function generates nodes with x, y coordinates, and labels ,viewport is the size of the screen. minimum is 0,0 and maximum is 1000,1000. The function returns a JSON structure with nodes and edges. ",
              "parameters": {
                "type": "object",
                "properties": {
                  "nodes": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string"
                        },
                        "x": {
                          "type": "number"
                        },
                        "y": {
                          "type": "number"
                        },
                        "label": {
                          "type": "string"
                        }
                      }
                    }
                  },
                  "edges": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "source": {
                          "type": "string",
                          "description": "ID of the starting node for this edge"
                        },
                        "target": {
                          "type": "string",
                          "description": "ID of the ending node for this edge"
                        }
                      }
                    }
                  }
                },
                "required": ["nodes", "edges"]
              }
            }
          ]
          
          
 
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
        
      
      messages: messages,
      functions: functions,
      function_call: "auto",  // auto is default, but we'll be explicit
  });
   console.log(response.choices[0].message)
    return(`${response.choices[0].message.function_call.arguments}` )
  }

  export async function transformJSONewFunction(item: string) : Promise<string>{
    const scaleFactor =1.8;
    
    console.log ('item',item)
    const response = await fetchApiInfoGPT35Functions(item);
    console.log ('response',response)
    
    const input = JSON.parse(response);

   
    console.log('input',input)
    // Transform nodes
    
    const nodes: Node = input.nodes.map(({ id, x, y }) => {
        let sourcePosition : number, targetPosition: number;
   
    
        return {
            id: id.toString(),
            type:'custom',
            position: {
                x: x * scaleFactor,
                y: y * scaleFactor
            },
            //className: 'circle',
            sourcePosition,
            targetPosition,
            data: {
                label: id,
                type: 'xxx2'
            }
        };
    });
    

    // Transform edges
    const edges: Edge[] = input.edges.map(({ source, target }) => ({
      id: `e${source}-${target}`,
      source: source.toString(),
      target: target.toString(),
      animated: true,
    }));

    const result = {
      nodes,
      edges
    };

    return (JSON.stringify(result));
}

