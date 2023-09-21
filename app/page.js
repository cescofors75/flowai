'use client'


import {  useState } from 'react';
import ReactFlow, { Position, useEdgesState,useNodesState }   from 'reactflow';
import styles from './Flow/Flow.module.css';
import CustomNode from './Flow/CustomNode';
import 'reactflow/dist/style.css';
import { BeatLoader } from "react-spinners";
import { fetchApiInfoGPT35, fetchApiInfoGPT35Functions,transformJSONewFunction} from './fetchapi';
import { Nosifer } from 'next/font/google';

    const nodeTypes = {
        custom: CustomNode,
      };
/*
      function createNodes ( data) {
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
       }*/
export default function Home() {
    const [combinedNodes, setCombinedNodes,onNodesChange] = useNodesState([])
    const [combinedEdges, setCombinedEdges,onEdgesChange] = useEdgesState([])
    const [loadFlow, setLoadFlow] = useState(false);
    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');
    const [time, setTime] = useState(0);

/*
    useEffect(() => {
      let nodes = [];
      let edges = [];
      setCombinedEdges([])
      setCombinedNodes([])
      async function getDataFromOpenAI(question,nodeFirts='root') {
          setLoadFlow(true);
              const data = await fetchApiInfoGPT35(question);
              
              //corregir el json con las comillas y corchetes faltantes 
              //Primero hay que corregir el json, con las comillas y corchetes faltantes
              const jsonData = JSON.parse(data)
              console.log(jsonData);
              
              

              function processNode(id, obj, yPos, level, nodeFirts='root') {

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
  }, [query]);*/
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
  

}, [query]);
*/

const textApiFlow = async() => {
  const startTime = new Date().getTime();
  setTime(startTime);
  setLoadFlow(true);
  
  const response = await transformJSONewFunction(search);
  
  setCombinedNodes(response.nodes);
  setCombinedEdges(response.edges);
  
  setLoadFlow(false);
  
  const endTime = new Date().getTime();
  setTime(endTime - startTime);
}


  return (
    <main style={{padding:'20px'}}>
      <div>
<ul>
    <li>Ejemplos:</li>
    <li>europe ten citys and population and Tax</li>
    <li>John es el padre de tres hijos, Laura, Pepe y Luis. Luis tiene 2 hijos más, y Carlos es el padre de John.</li>
    <li>la serie de Fibonacci, solo los valores</li>
    <li>las moléculas del ácido desoxirribonucleico (ADN)</li>
</ul>

</div>

{loadFlow ? (
        <>
          <h1>AI To Flow Chart</h1>
          <BeatLoader color={'#36D7B7'} loading={true} size={20} />
        </>
      ) : (
        <>
      <div>
        <input placeholder="Search..." 
        onChange={(e) => {
         
            setSearch(e.target.value);
        }}
        className="px-4 py-2 border border-gray-300 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        
        />
      {<div style={{color:'red'}}>Time: {time} ms</div>}
</div> 
<br/>
<div>

        <button onClick = {textApiFlow} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Search
        </button>
    </div>
        <div style={{ width:'800' ,height: '80vh' }}>
              <ReactFlow
         nodes={combinedNodes}
         edges={combinedEdges}
         onNodesChange={onNodesChange}
         onEdgesChange={onEdgesChange}
         nodeTypes={nodeTypes}
         snapToGrid={true}
         fitView
        
       />
           
        </div></>)}
     
    </main>
  )
}
