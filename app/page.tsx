'use client'
import React, { useState, useRef } from 'react';
import {
  Button,
  Image,
  Box,
  Flex,
  IconButton,
  HStack,
  Text,
  ChakraProvider,
  Select,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import { ThemeSwitch } from './components/ThemeSwitch';
import AudioPlayer from './components/AudioPlayer';

function Home() {
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [textScan, setTextScan] = useState('');
  const [language, setLanguage] = useState('Catala');
  const [years, setYears] = useState('20');

  const fileInputRef = useRef(null);

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
      const base64Image = reader.result as string;
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
              text: `Analitza la imatge, i explica el seu contingut en ${language}, per a una persona cega. Estil de la resposta: ${styleResponse}`,
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
      max_tokens: 199,
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
       
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mt={4}
          
          position="absolute"
          top="0"
          width="100%"
          textAlign="center"
        >
          VisionHelper 1.0
        </Text> 
        
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
                <option value="Español">Español</option>
                <option value="Catala">Català</option>
                <option value="English">English</option>
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
                {
             <Button mt={4} colorScheme="red" onClick={resetState}>
               Back
           </Button>
              }
             </Box>
              )}
           
          </Flex>
        )}
      
        <Box position="absolute" bottom="0" width="100%" textAlign="center">
        <ThemeSwitch />
        </Box>
      </Flex>
    </ChakraProvider>
  );
}

export default Home;

