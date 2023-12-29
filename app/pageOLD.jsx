'use client'
import React, { useState, useRef } from 'react';
import {
  Box,  Text, Textarea, Button, Spinner, Grid, GridItem, HStack
} from '@chakra-ui/react';
import { ThemeSwitch } from './components/ThemeSwitch';

import { streamMistralChat } from "mistral-edge";
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

  const saveHistory = (openaiResponse, mistralResponse) => {
    const history = JSON.parse(localStorage.getItem('conversationHistory')) || [];
    history.push({ openaiResponse, mistralResponse });
    localStorage.setItem('conversationHistory', JSON.stringify(history));
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

  const mistralTest = async (input) => {
    setResponseMistral('');
    setIsLoadingMistral(true);
  
    let response = '';
    try {
      const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
      const tokenStream = streamMistralChat(
        [{ role: "system", content:  'Respond in Spanish, professionally, within a maximum of three lines. The response may agree or disagree with the input provided. Continue with the current topic or smoothly transition to a new topic as needed.' },
          { role: "user", content: input  }],
        { model: "mistral-small", temperature: 0.2 },
        {
          apiKey: apiKey,
          apiUrl: "https://corsproxy.io/?https://api.mistral.ai/v1/chat/completions",
        }
      );

      for await (const token of tokenStream) {
        setResponseMistral(prev => prev + token);
        response += token;
        setLastResponse(prev => prev + token);
      }
      updateHistory(response, 'Mistral');
    } catch (error) {
      console.error('An error occurred with Mistral:', error);
      setResponseMistral('Error with Mistral');
    }
    setIsLoadingMistral(false);
    return response;
  };

  const handleGoClick = async () => {
    setIsLoading(true);
    setResponseOpenAI('');
    setResponseMistral('');
    let currentInput = prompt;
  //console.log('prompt', prompt);
 // console.log('currentInput', currentInput);
    for (let i = 0; i < 10; i++) {
      const openaiResponse = await openaiTest(currentInput);
    //  console.log('openaiResponse', openaiResponse);
      const mistralResponse = await mistralTest(openaiResponse);
   //     console.log('mistralResponse', mistralResponse);
      currentInput = mistralResponse;
      saveHistory(openaiResponse, mistralResponse); // Guardar en el historial

      //console.log('currentInput', currentInput);
    }
  
    setIsLoading(false);
  };

  return (
    <>
    <Box position="absolute" top="0" width="100%" textAlign="center" p={2}>
<HStack>
        <Text width="100%" fontSize="2xl" fontWeight="bold" mt={4} textAlign="center">
          Mistral AI vs OpenAI - Conversation Demo
        </Text>
        <ThemeSwitch />
        </HStack>
    </Box>
    <Box position="absolute" top="100" width="100%" textAlign="center" mb={4}>
    <Grid
        templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      gap={4}
      align="center"
      justify="center"
      minH="100vh"
      minW="100vw"
     
    >
    
  
      <GridItem colSpan={3}>
      <Box overflowY="auto" maxHeight="300px" border="2px solid gray">
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
        />
        <Button onClick={handleGoClick} colorScheme="blue" isDisabled={isLoading}>Go</Button>
        </Box>
      </GridItem>
  
      <GridItem colSpan={3}>
        <Box overflowY="auto" maxHeight="300px"  border="2px solid gray">
          <Text color='green' fontSize="md">OpenAI Response:</Text>
          {isLoadingOpenai && <Spinner size="xs" color="green.500" ml={2} />}
          <Text fontSize="xs" mt={2} mb={4} textAlign="left">
            {responseOpenAI}
          </Text>
        </Box>
      </GridItem>
  
      <GridItem colSpan={3}>
        <Box overflowY="auto" maxHeight="300px" border="2px solid gray">
          <Text color='orange' fontSize="md">Mistral AI Response:</Text>
          {isLoadingMistral && <Spinner size="xs" color="orange.500" ml={2} />}
          <Text fontSize="xs" mt={2} mb={4} textAlign="left">
            {responseMistral}
          </Text>
        </Box>
      </GridItem>
     
   
      <GridItem colSpan={3}>
    
  
      {showHistory && (
        
          
          <Box overflowY="auto" maxHeight="300px" border="1px solid gray" p={4}>
            <Text fontSize="md" fontWeight="bold">Historial de Conversación:</Text>
            {conversationHistory.map((entry, index) => (
              <Box key={index} mt={2}>
                
                <StaticContentTextarea entry={entry} />
              </Box>
            ))}
          
         
        </Box>
          
         
      )}
  </GridItem>
  <GridItem colSpan={3}>
  <HStack mt={2}> 
          <Button onClick={toggleHistory} colorScheme="teal" mb={4}>
            {showHistory ? 'Cerrar Historial' : 'Ver Historial'}
          </Button>
          <Button onClick={clearHistory} colorScheme="red" mb={4}>
            Borrar Historial
          </Button>
          </HStack>
          </GridItem>
 </Grid>
    </Box>
     
    
    
    </>
  
  
  );
}

export default Home;
/*
<Text fontSize="sm">OpenAI: {entry.openaiResponse}</Text>
              <Text fontSize="sm">Mistral: {entry.mistralResponse}</Text>
              */

