import React, { useEffect, useState, useRef } from 'react';
import ReactFlow,  { useReactFlow, ReactFlowProvider, Background,addEdge, Position ,useEdgesState,useNodesState,Panel} from 'reactflow';
import CustomNode from './Flow/CustomNode';
import { Button, Input, position } from "@chakra-ui/react";
import styles from './Flow/Flow.module.css';
import 'reactflow/dist/style.css';
import { BeatLoader } from "react-spinners";




const nodeTypes = {
    custom: CustomNode,
};


async function fetchApiInfoGPT35Functions(item) {
    try {
        const response = await fetch('/api/openAIGpt35Function', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item: item })
        });

        const AIResponse = await response.json();
        console.log ('AIResponse',AIResponse)
        return AIResponse
    } catch (error) {
        return false;
    }
}








export  function FlowChartComponent() {
    
    const [loadFlow, setLoadFlow] = useState(false);
    const [combinedNodes, setCombinedNodes,onNodesChange] = useNodesState([])
    const [combinedEdges, setCombinedEdges,onEdgesChange] = useEdgesState([])
    
    const [query, setQuery] = useState('');
    const [search, setSearch] = useState('');
      // 1 for right, -1 for left
  


   
    
   // const { setViewport, zoomIn, zoomOut } = useReactFlow();
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










    





    return (
       
        <>
         
                   
                    <div>
                <Input placeholder="Search..." size="xl" onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div>
                <Button colorScheme="blue" size="md" ml={2} onClick={() => setQuery(search)}>
                   Run
                </Button>
            </div>
  



   



                    <div style={{ width: '100%', height: 800 }}>
                        <ReactFlow
                            nodes={combinedNodes}
                            edges={combinedEdges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            nodeTypes={nodeTypes}
                            snapToGrid={true}
                            fitView
                        >
                       
     
      </ReactFlow>
                    </div>
                   
                </>
            )}
     
        


