'use client'
// Assuming you have a types.ts or types.d.ts file for type declarations
import { FC, useState, useCallback, useEffect } from 'react';
import ReactFlow, { Position, useEdgesState, useNodesState, Node, Edge } from 'reactflow';
import styles from './Flow/Flow.module.css';
import CustomNode from './Flow/CustomNode';
import 'reactflow/dist/style.css';
import { BeatLoader } from "react-spinners";
import { transformJSONewFunction, fetchApiInfoGPT35 , fetchApiInfoGPT35Functions} from './fetchapi';
import React from 'react';

interface CombinedNode extends Node {
    // Add specific properties if any
}

type CombinedEdge = Edge & {
    // Add specific properties if any
  };
  


type CustomNodeProps = {
    data: {
        label: string;
    };
};

const nodeTypes = {
    custom: CustomNode,
};



      function createNodes(data: Array<CombinedNode>): CombinedNode[] {
        // console.log (data)
         return data.map((item, index) => ({
           id: item.id.toString(),
           type: 'custom',
           className: styles.customNode,
           data: {  
           type: 'xxx',
           label: item.data.label,
           image: `https://fwhlcijbnqstdjgowqvm.supabase.co/storage/v1/object/public/images/Image2.jpg`
         },
           style: {
            backgroundSize: 'cover',
             
             fontWeight: 'bold',
             border: '1px solid #222138',
             borderRadius: '5px',
             height: '75px',
           },
           position: { x: item.position.x, y: item.position.y },
           sourcePosition: Position.Right,
           targetPosition: Position.Left,
         }));
       }

const Home: FC = () => {
    const [combinedNodes, setCombinedNodes] = useNodesState<CombinedNode[]>([]);
    const [combinedEdges, setCombinedEdges] = useEdgesState<CombinedEdge[]>([]);
  const [loadFlow, setLoadFlow] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [time, setTime] = useState<number>(0);
  const [query, setQuery] = useState<string>('');

 

   /* const textApiFlow = useCallback(async () => {
      const startTime: number = Date.now();
      setLoadFlow(true);

      // Ensure that search is an object or value that can be stringified
      const response: string = await transformJSONewFunction(JSON.stringify(search));
      
      const { nodes, edges } = JSON.parse(response);
      setCombinedNodes(createNodes(nodes));
      setCombinedEdges(edges);

      setLoadFlow(false);
      const endTime: number = Date.now();
      setTime(endTime - startTime);
    }, [search, createNodes]);




  useEffect(() => {
    textApiFlow();
  }, [textApiFlow]);*/



  
    useEffect(() => {
      let nodes = [];
      let edges = [];
      setCombinedEdges([])
      setCombinedNodes([])
      async function getDataFromOpenAI(question :string,nodeFirts='root') {
          setLoadFlow(true);
              const data = await fetchApiInfoGPT35(question);
              
              //corregir el json con las comillas y corchetes faltantes 
              //Primero hay que corregir el json, con las comillas y corchetes faltantes
              const jsonData = JSON.parse(data)
              //console.log(jsonData);
              
              

              function processNode(id :string, obj: JSON, yPos:number, level:number, nodeFirts='root') {

                  for (let key in obj) {
                  
                      const nodeId = `${id}-${key}`;
                      
                      nodes.push({
                          id: nodeId,
                          data: { label: `${key}: ${typeof obj[key] === 'object' ? '' : obj[key]}` },
                          position: { x: 250 + level * 300, y: yPos },
                          
                      });
                      edges.push({
                          id: `${id}-${nodeId}`,
                          source: id,
                          target: nodeId,
                          animated: true,
                         // label: key
                      });

                      if (typeof obj[key] === 'object') {
                          yPos =  processNode(nodeId, obj[key], yPos, level + 1);
                      } else {
                          yPos += 100;
                      }
                  }
                  return yPos;
              }
         
              
              nodes.push({
                  id: 'root',
                  data: { label: nodeFirts},
                  position: { x: 250, y: 0 }
              });

              processNode('root', jsonData, 0, 1,search);






          
      const nodesTransform = createNodes(nodes);
   
      setCombinedNodes([...nodesTransform]);
      setCombinedEdges([...edges]);
      setLoadFlow(false);
      }

    
  if (query !='')    getDataFromOpenAI("Provide a complex JSON structure that represents a "+ search,search );
  }, [query]);
/*
  useEffect(() => {

    async function transformJSONewFunction(item) {
        const scaleFactor =1;
        setLoadFlow(true);
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

        setCombinedNodes(nodes);
        setCombinedEdges(edges);
        
        setLoadFlow(false);
        //return null

        return {
            
            nodes,
            edges
        };
    }


     transformJSONewFunction(search)
  

}, [query]);*/


  return (
    <main style={{ padding: '20px' }}>
      <div>
        <ul>
          {/* ... (same list items) */}
        </ul>
      </div>

      {loadFlow ? (
        <div>
          <h1>AI To Flow Chart</h1>
          <BeatLoader color={'#36D7B7'} loading={true} size={20} />
        </div>
      ) : (
        <>
          <div>
            <input
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div>
              <button onClick={() => setQuery(search)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Search
              </button>
            </div>
          <div style={{ width: '800', height: '80vh' }}>
            <ReactFlow
              nodes={combinedNodes}
              edges={combinedEdges}
              nodeTypes={nodeTypes}
              snapToGrid={true}
              fitView
            />
          </div>
          </div>
        </>
      )}
    </main>
  );
}
export default Home;
