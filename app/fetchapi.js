import  OpenAI  from 'openai'
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

export async function fetchApiInfoGPT35(question) {

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

export  async function fetchApiInfoGPT35Functions(item) {
        
   // console.log('item',item)
 
  
    const messages = [{"role": "user", "content":" Provide a complex JSON structure that represents a "+item+". This structure should include nodes (id,x,y), where each node defines a position with x and y coordinates, as well as edges connecting these nodes."}]
          const functions =[
  
              {
                  
                      "name": "generates_nodes_and_edges",
                     // "description": "Generates a nodes with positon x and y coordinates and label,  and edges. as well as edges connecting these nodes. maximun x ,y coordinates are 500.",
                     "description":"This function will create nodes and edges for the provided " + item + ". Each node will have a unique ID and x, y coordinates to indicate its position. The maximum values for x and y coordinates are set at 500. Edges will be generated to connect these nodes, visually representing the " + item + ".",
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
                                              "description": "id of the source node"
                                          },
                                          "target": {
                                              "type": "string",
                                              "description": "id of the target node"
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
   //console.log(response.choices[0].message)
    return(`${response.choices[0].message.function_call.arguments}` )
  }

  export async function transformJSONewFunction(item) {
    const scaleFactor =1;
    
    console.log ('item',item)
    const response = await fetchApiInfoGPT35Functions(item);
    console.log ('response',response)
    
    const input = JSON.parse(response);

   
    console.log('input',input)
    // Transform nodes
    
    const nodes = input.nodes.map(({ id, x, y }, index) => {
        let sourcePosition, targetPosition;
   
    
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
    const edges = input.edges.map(({ source, target }) => ({
        id: `e${source}-${target}`,
        source: source.toString(),
        target: target.toString(),
        animated: true,
    }));

    

    return {
        
        nodes,
        edges
    };
}
