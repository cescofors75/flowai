
'use client'
import React from 'react';
import {
  Box,  Text,  HStack, useColorMode
} from '@chakra-ui/react';
import { ThemeSwitch } from './components/ThemeSwitch';
import { AssistantPopover } from './components/AssistantPopover';




export default function RootPage() {
 
  const { colorMode } = useColorMode();
  const bgColor = { light: 'gray.100', dark: 'gray.800' };
  const color = { light: 'gray.800', dark: 'gray.100' };
  //const secondaryColor = { light: 'white', dark: 'gray.700' };

  return (
    <>
      <Box
        position="absolute"
        top="0"
        width="100vw"
        textAlign="center"
        p={1}
        bg={bgColor[colorMode]}
        color={color[colorMode]}
      >
        <HStack>
          <Text  fontSize="xl" fontWeight="bold">
          Assitant  Bacocat
          </Text>
          <ThemeSwitch />
        </HStack>
      </Box>

      <Box
        position="absolute"
        top="20"
        width="100vw"
        p={1}
        textAlign="center"
        bg={bgColor[colorMode]}
        color={color[colorMode]}
      >
    
       <AssistantPopover/>
      </Box>
     
    </>
  );
  
  
  
  
  
            }



/*
 const [prompt, setPrompt] = useState('');
  const [responseOpenAI, setResponseOpenAI] = useState('');  
  const [isLoading, setIsLoading] = useState(false); 
  const [showHistory, setShowHistory] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const textareaRef = useRef(null);
  const [threadId, setThreadId] = useState('');
  const [runId, setRunId] = useState('');
  const assitantId = 'asst_VnXbM4b2rQaFj7xsGJn3LtT9'



  

  useEffect(() => {
    const apiUrl = '/api';
  
    const postRequest = async (url, body) => {
      const response = await fetch(`${apiUrl}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    };
  
    const createThread = async () => {
      const data = await postRequest('/thread', {});
    //  console.log('Thread created:', data);
      setThreadId(data.id)
     // return data.id;
    };
  
   /* const firstRunAssistant = async (threadId) => {
      const data = await postRequest('/assistant/run', {
        threadId,
        assistantId: assitantId, // Asegúrate de que 'assistantId' esté definido en algún lugar
        instructions: 'Hola',
      });
      console.log('Assistant run:', data);
        setRunId(data.id)
    };*/
  
   

