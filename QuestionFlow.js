import { useEffect, useState } from 'react';
import ReactFlow, { addEdge, Position, Background,
    Controls,useEdgesState,useNodesState,updateEdge,ConnectionLineType}   from 'reactflow';

    import CustomNode from './Flow/CustomNode';
import {Button, Input} from "@chakra-ui/react";
    import styles from './Flow/Flow.module.css';
    import 'reactflow/dist/style.css';
    import { BeatLoader } from "react-spinners";


    const nodeTypes = {
        custom: CustomNode,
      };
    
    async function fetchApiInfoGPT35(question) {
        try {
          const response = await fetch('/api/openAIGpt35', {
           
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
             
             item : question
            
            })
          })
      
          const AIResponse = await response.json()
          //console.log(AIResponse.text)
          
          //setFoodDescription(AIResponse.text);
          return AIResponse.text
        } catch (error) {
         // console.error(error)
          return false
        }
      }
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
       }

       

export default function FlowChartComponent() {
    const [elements, setElements] = useState([]);
    const [combinedNodes, setCombinedNodes,onNodesChange] = useNodesState([])
    const [combinedEdges, setCombinedEdges,onEdgesChange] = useEdgesState([])
    const [loadFlow, setLoadFlow] = useState(false);
    const [search, setSearch] = useState('');
    const [query, setQuery] = useState('');
   
    useEffect(() => {
        let nodes = [];
        let edges = [];
        setCombinedEdges([])
        setCombinedNodes([])
        async function getDataFromOpenAI(question,nodeFirts='root') {
            setLoadFlow(true);
                const data = await fetchApiInfoGPT35(question);
                console.log(data);
                // corregir el json con las comillas y corchetes faltantes 
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






            console.log(nodes);
     const nodesTransform = createNodes(nodes);
     console.log(nodesTransform);
     setCombinedNodes([...nodesTransform]);
        setCombinedEdges([...edges]);
        setLoadFlow(false);
        }

      
    if (query !='')    getDataFromOpenAI("Provide a complex JSON structure that represents a "+ search,search );
    }, [query]);

    if (loadFlow) {
        return <div> AI  To Flow Chart
        <BeatLoader color={'#36D7B7'} loading={loadFlow} size={20} />
       
        </div>;
      }   else{

    return (
<>
<div>
<ul>
    <li>Ejemplos:</li>
    <li>europe ten citys and population and Tax</li>
    <li>John es el padre de tres hijos, Laura, Pepe y Luis. Luis tiene 2 hijos más, y Carlos es el padre de John.</li>
    <li>la serie de Fibonacci, solo los valores</li>
    <li>las moléculas del ácido desoxirribonucleico (ADN)</li>
</ul>

</div>
    <div>
        <Input placeholder="Search..." size="xl" 
        onChange={(e) => {
            //console.log(e.target.value);
            setSearch(e.target.value);
        }}
    
        
        />

</div> 
<br/>
<div>

        <Button colorScheme="teal" size="sm" ml={2} onClick ={() => {
            setQuery(search)}
        }
        >
            Search
        </Button>
    </div>
        <div style={{ width:'800' ,height: '80vh' }}>
              <ReactFlow
         
         nodes={combinedNodes}
         edges={combinedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
         //onConnect={onConnect}
         //onInit={onInit}
         nodeTypes={nodeTypes}
         snapToGrid={true}
         fitView
         //onEdgeUpdate={onEdgeUpdate}
         //onEdgeUpdateStart={onEdgeUpdateStart}
        // onEdgeUpdateEnd={onEdgeUpdateEnd}
        // attributionPosition="top-right"
        
       
       />
           
        </div>

        </>
    );
      }
}
