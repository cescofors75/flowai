'use client'
import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Text, ChakraProvider, Divider, Textarea, Button
} from '@chakra-ui/react';
import { ThemeSwitch } from '../components/ThemeSwitch';
import { streamMistralChat } from "mistral-edge";
import OpenAI from 'openai';

function Home() {
  const [prompt, setPrompt] = useState('');
  const [responseMistral, setResponseMistral] = useState('');
  const [responseOpenai, setResponseOpenai] = useState('');
  const [performance, setPerformance] = useState({
    mistral: { time: 0, tokens: 0, speed: 0 },
    openai: { time: 0, tokens: 0, speed: 0 },
  });

  const calculateSpeed = (tokens, time) => {
    return time > 0 ? (tokens / time).toFixed(3) : 0;
  };

  useEffect(() => {
    // Removed the direct calls to mistralTest and openaiTest to allow manual triggering
  }, []);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleGoClick = () => {
    mistralTest();
    openaiTest();
  };

  const mistralTest = async () => {
    const startTime = Date.now();
    try {
      const apiKey = process.env.NEXT_PUBLIC_MISTRAL_API_KEY;
      const tokenStream = streamMistralChat(
        [{ role: "user", content: prompt }],
        { model: "mistral-small", temperature: 0.2 },
        {
          apiKey: apiKey,
          apiUrl: "https://corsproxy.io/?https://api.mistral.ai/v1/chat/completions",
        }
      );

      let fullResponse = "";
      for await (const token of tokenStream) {
        fullResponse += token;
        setResponseMistral(fullResponse);
        setPerformance(prev => ({
          ...prev,
          mistral: {
            time: Date.now() - startTime,
            tokens: fullResponse.length,
            speed: calculateSpeed(fullResponse.length, Date.now() - startTime)
          }
        }));
      }

    } catch (error) {
      console.error('An error occurred with Mistral:', error);
    }
  };

  const openaiTest = async () => {
    const startTime = Date.now();
    try {
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, 
        dangerouslyAllowBrowser: true
      });

      const stream = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        stream: true
      });

      let data = '';
      for await (const chunk of stream) {
        const deltaContent = chunk.choices[0]?.delta.content || '';
        data += deltaContent;
        setResponseOpenai(data);
        setPerformance(prev => ({
          ...prev,
          openai: {
            time: Date.now() - startTime,
            tokens: data.length,
            speed: calculateSpeed(data.length, Date.now() - startTime)
          }
        }));
      }

    } catch (error) {
      console.error('Error with OpenAI:', error);
    }
  };

  return (
    <ChakraProvider>
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        minW="100vw"
        position="relative"
      >
        <Text fontSize="2xl" fontWeight="bold" mt={4} position="absolute" top="0" width="100%" textAlign="center">
          Mistral AI vs OpenAI
        </Text>

        <Textarea
          placeholder="Escribe tu prompt aquí"
          value={prompt}
          onChange={handleInputChange}
          my={4}
          size="lg"
        />
        <Button onClick={handleGoClick} colorScheme="blue">Go</Button>

        <Divider my={4}/>

        <Text color='orange'>Mistral AI - Time: {performance.mistral.time} ms / Characters: {performance.mistral.tokens}  / Speed: {performance.mistral.speed} </Text>
        <Text fontSize="xs" mt={4} width="80%" textAlign="left">
          {responseMistral}
        </Text>

        <Divider my={4}/>

        <Text color='green'>OpenAI - Time: {performance.openai.time} ms / Characters: {performance.openai.tokens} / Speed : {performance.openai.speed}</Text>
        <Text fontSize="xs" mt={4} width="80%" textAlign="right">
          {responseOpenai}
        </Text>

        <Box position="absolute" bottom="0" width="100%" textAlign="center">
          <ThemeSwitch />
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default Home;



//<Text color='orange'>Time: {timeMistral} ms  / Characters: {tokensMistral}</Text>
//    <Text color='green'>Time: {timeOpenai} ms  / Characters: {tokensOpenai}</Text>

/*
 const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [textScan, setTextScan] = useState('');
  const [language, setLanguage] = useState('Catala');
  const [years, setYears] = useState('20');
  */

/*
{!imagePreview && (
          <Flex direction="column" align="center" justify="center" alignItems="center">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <IconButton
              icon={<FiCamera color="white.300" />}
              mt={4}
              onClick={onButtonClick}
              aria-label="Upload Image"
              colorScheme="red"
            />
          </Flex>
        )}
        {imagePreview && (
          <Flex direction="column" align="center" justify="center" alignItems="center">
            <HStack style={{ maxWidth: '300px' }} mt={8}>
              <Select
                placeholder="Languages"
                mt={4}
                mb={4}
                onChange={handleChange}
                value={language}
              >
                <option value="Catala">Català</option>
                <option value="Deutsch">Deutsch</option>
                <option value="English">English</option>
                <option value="Español">Español</option>
                <option value="Français">Français</option>
                <option value="Italiano">Italiano</option>
                <option value="Português">Português</option>
                
              </Select>
              <Select
                placeholder="Years"
                mt={4}
                mb={4}
                onChange={handleChangeYears}
                value={years}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="80">80</option>
              </Select>
              <Button colorScheme="red" onClick={analyzeImage} isLoading={loading}>
                GO!
              </Button>
            </HStack>
            {!textScan && <Image mt={1} src={imagePreview} alt="Preview" maxW="300" mb="1" />}
            <Box
              style={{
                backgroundImage: `url(${imagePreview})`,
                maxWidth: '300px',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
              mt={1}
              bgColor="black"
              mb="1"
            >
              <div
                style={{
                  margin: '0 auto',
                  textAlign: 'justify',
                  backgroundColor: 'rgba(77, 77, 77, 0.5)',
                  borderRadius: '6px',
                  color: 'white',
                }}
              >
                {textScan}
              </div>
            </Box>

            {textScan && (
            <Box>
             <AudioPlayer text={textScan} />
                
             <Button mt={4} colorScheme="red" onClick={resetState} textAlign="left">
               Back
           </Button>
              
             </Box>
              )}
           
          </Flex>
        )}
        */


        /*
          const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleChangeYears = (event) => {
    setYears(event.target.value);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64Image = reader.result 
      setImage(base64Image.split(',')[1]);
      setImagePreview(base64Image);
      
    };
  };

  const analyzeImage = async () => {
    setLoading(true);

    let styleResponse;
    if (years === '10') {
      styleResponse = 'Per un nen , simple';
    } else if (years === '20') {
      styleResponse = 'Per un jove, detallada';
    } else if (years === '40') {
      styleResponse = 'Per un adult, comprensible';
    } else if (years === '80') {
      styleResponse = 'Per un vell, clara';
    }

    const api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const payload = {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
             // text: `Analitza la imatge, i explica el seu contingut resumit en 3 frases i en ${language}, per a una persona cega. Estil de la resposta: ${styleResponse}`,
              text: `Analyze the image, and explain its content in a summarized way in 3 sentences and in ${language}, for a visually impaired person. Response style: ${styleResponse}.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
                detail: "low"
              },
            },
          ],
        },
      ],
     max_tokens: 128,
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${api_key}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      setLoading(false);
      setTextScan(data.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetState = () => {
    setTextScan('');
    setImagePreview('');
  };
  */