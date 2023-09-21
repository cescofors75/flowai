//import {  Avatar, background } from '@chakra-ui/react';
import { memo } from 'react';
import { Handle, Position } from 'reactflow';


function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
      let value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
const CustomNode = ({ data}) => {
// console.log ('data:',data)

  if (data.type === 'xxx' ) {
    return (
  <>
    <div style={{ display: 'flex', alignItems: 'stretch', width: '240px'  ,borderRadius: '15px' }}>
    <div style={{
    flex: 1,
    background: stringToColor(data.label),//'#8B00FF',
    paddingLeft: '10px', // Ajusta este valor según tu preferencia
    borderRadius: '5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <strong>{data.label?.substring(0, 40)}</strong>
  </div>
  
      
    </div>
    <Handle
     type="source"
      position={Position.Right}
      isConnectable={true}
    />
    <Handle
     type="target"
      position={Position.Left}
      isConnectable={true}
    />
  </>
  
  
    )
    }

    if (data.type === 'xxx2' ) {
      return (
    <>
      <div >
      <div style={{
      
      background: stringToColor(data.label),//'#8B00FF',
      //paddingLeft: '10px', // Ajusta este valor según tu preferencia
      borderRadius: '50%',
     width: '20px',
      height: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'


      
    }}>
      <strong>{data.label?.replace("node","")}</strong>
    </div>
    
        
      </div>
      <Handle
       type="source"
        position={Position.Right}
        isConnectable={true}
      />
      <Handle
       type="target"
        position={Position.Right}
        isConnectable={true}
      />
    </>
    
    
      )
      }


};

export default memo(CustomNode);


/*

<div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'white', borderRadius: '0 15px 15px 0' }}>
        <Avatar size="md" name={data.label} src={data.image}  />
      </div>

      */