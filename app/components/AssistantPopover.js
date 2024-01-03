'use client'
import React, { useState, useEffect, useRef} from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Box, Text, Textarea, Button, useColorMode, Popover, PopoverTrigger, PopoverContent, IconButton, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Portal
} from '@chakra-ui/react';
import { ChatIcon, DeleteIcon } from '@chakra-ui/icons';
import Typewriter from './Typewriter'
// Componente Popover para el asistente
const AssistantPopover = () => {
  const [prompt, setPrompt] = useState('');
  const [responseOpenAI, setResponseOpenAI] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode } = useColorMode();
  const [showHistory, setShowHistory] = useState(true);
  const [conversationHistory, setConversationHistory] = useState([]);
  const textareaRef = useRef(null);
  const [threadId, setThreadId] = useState('');
  const [runId, setRunId] = useState('');
  const assitantId = 'asst_VnXbM4b2rQaFj7xsGJn3LtT9'
  const bgColor = { light: 'gray.100', dark: 'gray.800' };
  const color = { light: 'gray.800', dark: 'gray.100' };
  const secondaryColor = { light: 'white', dark: 'gray.700' };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();


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
    
      setThreadId(data.id)
     
    };
 
  
    const initAssistant = async () => {
      try {
        await createThread();
       // await firstRunAssistant(threadId);
      } catch (err) {
        console.error('Error al inicializar el asistente:', err);
      }
    };
  
    initAssistant();
  }, []);

  useEffect(() => {
    clearHistory();
  }, [onOpen]);

  const clearHistory = () => {
    localStorage.removeItem('conversationHistory'); // Borra el historial de Local Storage
    setConversationHistory([]); // Actualiza el estado para reflejar el cambio en la interfaz de usuario
  };
  const saveHistory = (openaiResponse, userQuestion) => {
   
     const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
     history.push({ userQuestion, openaiResponse });
     localStorage.setItem('conversationHistory', JSON.stringify(history));
   
     setConversationHistory(history);
 
   };

  const handleGoClick = async () => {
    setIsLoading(true);
    saveHistory( prompt,'user: ');
    setResponseOpenAI('');
  

    await fetch ('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ threadId: threadId, content : prompt })
        })
        .then(res => res.json())
        .then(data => {
         console.log('New message');
        })
        .catch(err => {
            console.log('err', err);
        });

    let run_Id
            const data = await fetch('/api/assistant/run', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ threadId: threadId, assistantId: assitantId, instructions: 'Asistente Bacocat'})
              
            }).then(res => res.json())
            .then(data => {
             console.log('First run');
             console.log('Assistant run:', data.id);
             setRunId(data.id)
                run_Id = data.id
            })
            .catch(err => {
                console.log('err', err);
            });
            //console.log('Assistant run:', data);
              
          

   let runStatus 

    await fetch ('/api/thread/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ threadId: threadId, runId: run_Id})
        })
        .then(res => res.json())
        .then(data => {
            console.log('Run OK');
            runStatus = data;
            console.log(runStatus);
        })
        .catch(err => {
            console.log('err', err);
        });
        
        let lastMessageForRun

        while (runStatus.status !== "completed") {
             await new Promise((resolve) => setTimeout(resolve, 1000));
            // runStatus = await openai.beta.threads.runs.retrieve(threadId, run_Id);
          await fetch ('/api/thread/run', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ threadId: threadId, runId: run_Id})
                })
                .then(res => res.json())
                .then(data => {
                    console.log('Run continued');
                    runStatus = data;
                })
                .catch(err => {
                    console.log('err', err);
                });             //console.log(runStatus);
           }
        
       let messages
           await fetch (`/api/messages?threadId=${threadId}`, { // Get messages

            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            })
            .then(res => res.json())
            .then(data => {
                console.log('Messages OK');
                messages=data.messages.data;
            })
            .catch(err => {
                console.log('err', err);
            });
           
            console.log(messages);

           lastMessageForRun = messages
    .filter(
      (message) => message.run_id === run_Id && message.role === "assistant"
    )
    console.log(lastMessageForRun[0].content[0].text.value);
    //setResponseOpenAI(responseOpenAI+'\n user: '+ prompt +'\n'+ 'AI: '+lastMessageForRun[0].content[0].text.value);

    if (lastMessageForRun) setResponseOpenAI(lastMessageForRun[0].content[0].text.value);
      //const openaiResponse = await openaiTest(prompt);
    

     saveHistory(lastMessageForRun[0].content[0].text.value,'Baco: '); // Guardar en el historial

      //console.log('currentInput', currentInput);
    
  
    setIsLoading(false);
    setPrompt('');
  };
    // Aquí iría la lógica para procesar la solicitud...
  

  const handleChange = (event) => {
    setPrompt(event.target.value);
  };
  return (
    <>
      <IconButton
        ref={btnRef}
        icon={<ChatIcon />}
        aria-label='Asistente'
        variant="solid"
        colorScheme="teal"
        position="fixed"
        bottom="1rem"
        right="1rem"
        zIndex='1000'
        onClick={onOpen}
      />

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent color={color[colorMode]} bg={bgColor[colorMode]}>
          <DrawerCloseButton />
          <DrawerHeader>Assistant Bacocat</DrawerHeader>

          <DrawerBody>
            {/* Contenido del drawer */}
            <Box>
              {showHistory && (
                <Box bg={secondaryColor[colorMode]} p={4} boxShadow="md" borderRadius="md">
                  <Text fontSize="md" fontWeight="bold">Messages:
                    <IconButton icon={<DeleteIcon />} onClick={clearHistory} colorScheme="blue" size="xs" ml={2} />
                  </Text>
                  {conversationHistory.map((entry, index) => (
                    <Box key={index} mt={2} bg={bgColor[colorMode]} p={2} borderRadius="sm" color={color[colorMode]}>
                      <Text> {entry.userQuestion}</Text>
                      {entry.userQuestion === 'user: ' ? (
                        <Text>{entry.openaiResponse}</Text>
                      ) : (
                        <Typewriter text={entry.openaiResponse} />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
              <Textarea
                placeholder="Escribe tu prompt aquí"
                value={prompt}
                isDisabled={isLoading}
                onChange={handleChange}
                minHeight="unset"
                overflow="hidden"
                resize="none"
                bg={bgColor[colorMode]}
                color={color[colorMode]}
                mt={1}
              />
              <Button onClick={handleGoClick} colorScheme="blue" isLoading={isLoading} width="full" my={2}>
                Enviar
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
export default AssistantPopover;