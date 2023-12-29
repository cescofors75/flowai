
'use client'
import React, { useState, useRef, useEffect} from 'react';
import {
  Box,  Text, Textarea, Button, Spinner, Grid, GridItem, HStack
} from '@chakra-ui/react';
import { ThemeSwitch } from './components/ThemeSwitch';

//import { streamMistralChat } from "mistral-edge";
import OpenAI from 'openai';
import StaticContentTextarea from './components/StaticContentTextarea'




function Home() {
  const [prompt, setPrompt] = useState('');
  const [responseOpenAI, setResponseOpenAI] = useState('');
  const [responseMistral, setResponseMistral] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [isLoadingOpenai, setIsLoadingOpenai] = useState(false);
  const [isLoadingMistral, setIsLoadingMistral] = useState(false);   
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
      return data.id;
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
  
    const initAssistant = async () => {
      try {
        const threadId = await createThread();
       // await firstRunAssistant(threadId);
      } catch (err) {
        console.error('Error al inicializar el asistente:', err);
      }
    };
  
    initAssistant();
  }, []); // Asegúrate de definir cualquier dependencia aquí si es necesario
  
  const handleChange = (event) => {
   
    setPrompt(event.target.value)
    // Ajustar automáticamente la altura
    const textarea = textareaRef.current;
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
};
  // Función para cargar el historial desde Local Storage
  const loadHistory = () => {
    const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
    setConversationHistory(history);
  };

  // Función para alternar la visualización del historial
  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      loadHistory();
    }
  };
  const clearHistory = () => {
    localStorage.removeItem('conversationHistory'); // Borra el historial de Local Storage
    setConversationHistory([]); // Actualiza el estado para reflejar el cambio en la interfaz de usuario
  };

  const saveHistory = (openaiResponse, userQuestion) => {
   // console.log('saveHistory');
    //console.log(openaiResponse);
    //console.log(mistralResponse);
    const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
    history.push({ userQuestion, openaiResponse });
    localStorage.setItem('conversationHistory', JSON.stringify(history));
   // console.log(history);
    setConversationHistory(history);

  };

  const updateHistory = (response, source) => {
    setConversationHistory(prevHistory => [
      { source, response },
      ...prevHistory
    ]);
  };

  const openaiTest = async (input) => {
    setResponseOpenAI('');
    setIsLoadingOpenai(true);
    
    let response = '';
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const stream = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: [{ role: "user", content: input },
        { role: "system", content: 'Respond in Spanish, professionally, within a maximum of three lines. The response may agree or disagree with the input provided. Continue with the current topic or smoothly transition to a new topic as needed.' }],
        temperature: 0.2,
        stream: true
      });

      for await (const chunk of stream) {
        const deltaContent = chunk.choices[0]?.delta.content || '';
        setResponseOpenAI(prev => prev + deltaContent);
        
        response += deltaContent;
        
        setLastResponse(prev => prev + deltaContent);
      }
      updateHistory(response, 'OpenAI');
    } catch (error) {
      console.error('Error with OpenAI:', error);
      setResponseOpenAI('Error with OpenAI');
    }
    setIsLoadingOpenai(false);
    return response;
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
                body: JSON.stringify({ threadId: threadId, assistantId: assitantId, instructions: 'Hola'})
              
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
    

     saveHistory(lastMessageForRun[0].content[0].text.value,'Assitant: '); // Guardar en el historial

      //console.log('currentInput', currentInput);
    
  
    setIsLoading(false);
    setPrompt('');
  };

  return (
    <>
    <Box position="absolute" top="0" width="100%" textAlign="center" p={4} bg="gray.800">
      <HStack>
        <Text width="100%" fontSize="3xl" fontWeight="bold" color="teal.300">
          Asistentes OpenAI - Demostración de Conversación
        </Text>
        <ThemeSwitch />
      </HStack>
    </Box>
  
    <Box position="absolute" top="20" width="100%" p={4} textAlign="center" bg="gray.900" color="gray.100">
      <Grid
        templateColumns="repeat(1, 1fr)"
        gap={6}
        align="center"
        justify="center"
      >
        <GridItem>
          <HStack mt={2} spacing={4}>
            <Button onClick={toggleHistory} colorScheme="purple" variant="solid">
              {showHistory ? 'Cerrar Historial' : 'Ver Historial'}
            </Button>
            <Button onClick={clearHistory} colorScheme="orange" variant="outline">
              Borrar Historial
            </Button>
          </HStack>
        </GridItem>
  
        {showHistory && (
          <GridItem>
            <Box bg="gray.700" p={4} boxShadow="inner" borderRadius="md">
              <Text fontSize="md" fontWeight="bold">Historial de Conversación:</Text>
              {conversationHistory.map((entry, index) => (
                <Box key={index} mt={2} bg="gray.600" p={2} borderRadius="sm">
                  <StaticContentTextarea entry={entry} />
                </Box>
              ))}
            </Box>
          </GridItem>
        )}
  
        <GridItem>
          <Box bg="gray.700" p={4} boxShadow="inner" borderRadius="md">
            <Textarea
              placeholder="Escribe tu prompt aquí"
              value={prompt}
              my={4}
              isDisabled={isLoading}
              onChange={handleChange}
              ref={textareaRef}
              minHeight="unset"
              overflow="hidden"
              resize="none"
              bg="gray.600"
              color="gray.200"
            />
            <Button onClick={handleGoClick} colorScheme="blue" isLoading={isLoading}>Enviar</Button>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  </>
  
  
  
  
  );
            }

export default Home;
/*
  <GridItem colSpan={3}>
        <Box >
          <Text color='green' fontSize="md">OpenAI Response:</Text>
          {isLoadingOpenai && <Spinner size="xs" color="green.500" ml={2} />}
          <Text fontSize="xs" mt={2} mb={4} textAlign="left">
            {responseOpenAI}
          </Text>
        </Box>
      </GridItem>*/