'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Box, Grid, Textarea, Button, Text, HStack, GridItem , Image, Divider, Spinner, Avatar} from '@chakra-ui/react';
import { ThemeSwitch } from '../components/ThemeSwitch';


function Home() {
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState({
    coherewebsearch: '',
    localstream: '',
    mistral: '',
    openai: '',
    cohere: '',
    dalee: ''
  });
 
  const [imageDalee, setImageDalee] = useState('');
  const [imageStability, setImageStability] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const [isLoadingDalee, setIsLoadingDalee] = useState(false);
  const [isLoadingStability, setIsLoadingStability] = useState(false);
  

  const [performance, setPerformance] = useState({
    mistral: { time: 0, tokens: 0, speed: 0 },
    openai: { time: 0, tokens: 0, speed: 0 },
    cohere: { time: 0, tokens: 0, speed: 0 },
    localstream: { time: 0, tokens: 0, speed: 0 },
    coherewebsearch: { time: 0, tokens: 0, speed: 0 },
  });

  const calculateSpeed = useCallback((tokens, time) => {
    return time > 0 ? (tokens / time).toFixed(3) : 0;
  }, []);
 
 


  
  
  const testAPI = async (apiName, endpoint) => {
    const startTime = Date.now();
    setIsLoading(true);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const reader = response.body.getReader();
      let responseText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        // Aquí procesas cada chunk (que es un Uint8Array)
        responseText += new TextDecoder().decode(value);
      
        setResponses(prev => ({ ...prev, [apiName]: responseText }));
        setPerformance(prev => ({
          ...prev,
          [apiName]: {
            time: Date.now() - startTime,
            tokens: responseText.length,
            speed: calculateSpeed(responseText.length, Date.now() - startTime),
          },
        }));
      }
     




    } catch (error) {
      console.error(`${apiName} Fetch error:`, error);
      setResponses(prev => ({ ...prev, [apiName]: `Error: ${error.message}` }));
    } finally {
      setIsLoading(false);
    }
  };





  const handleGoClick = async() => {
    setImageDalee('');
    setImageStability('');
    setResponses({
      coherewebsearch: '',
      localstream: '',
      mistral: '',
      openai: '',
      cohere: '',
      dalee: ''
    });
   // testAPI('localstream', '/api/localstream');
    testAPI('mistral', '/api/mistral');
    testAPI('openai', '/api/openai');
    testAPI('cohere', '/api/cohere');
    testAPI('coherewebsearch', '/api/coherewebsearch');
  // testAPI('dalee', '/api/dalee'); 
  dalee();
  stability();
  }
   
const dalee = async () => {
    setIsLoadingDalee(true);
    const response =  await fetch('/api/dalee', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: prompt}),
    });

    
      //console.log("Success");
     
      const data = await response.json();
      //console.log(data);
      const b64 = data.imageURL;
      setImageDalee(b64);
      setIsLoadingDalee(false);
   
  }
  const stability = async () => {
    setIsLoadingStability(true);
    const response =  await fetch('/api/stability', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: prompt}),
    });

    
      //console.log("Success");
     
      const data = await response.json();
      //console.log(data);
      const b64 = data.imageURL;
      setImageStability(b64);
      setIsLoadingStability(false);
   
  }



  const handleChange = (event) => {
    setPrompt(event.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <>
     
      <Box position="absolute" top="0" width="100%" textAlign="center" mb={4}>
        <HStack>
      <Text fontSize="2xl" fontWeight="bold" mt={4}  width="100%" textAlign="center">
          Test Speed v.0.2
        </Text>
        <ThemeSwitch />
        </HStack>
      </Box>
    
<Box position="absolute" top="100" width="100%" textAlign="center" mb={4}>
      <Grid
    templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }}
    direction="column"
    align="center"
    justify="center"
    minH="100vh"
    minW="100vw"
    position="relative"
  >
        
        <GridItem >
        <Textarea
          placeholder="Escribe tu prompt aquí"
          value={prompt}
         
          my={4}
          size="lg"
          
         
          onChange={handleChange}
          ref={textareaRef}
          minHeight="unset"
          overflow="hidden"
          resize="none"
        />
         <Button onClick={handleGoClick} colorScheme="blue" isDisabled={isLoading} mb={2}>
        Go
      </Button>
      
        
        </GridItem>
       
        <GridItem >
        <Avatar
              size="sm"
              src={`./france.png`}
             
              mr={3}
            />
        <Text fontSize="sm" as='b' color='orange'>Mistral AI - Time: {performance.mistral.time} ms / Characters: {performance.mistral.tokens}  / Speed: {performance.mistral.speed} </Text>
        <Text fontSize="xs" mt={4} width="80%" textAlign="left" style={{whiteSpace: 'pre-wrap'}}>
          {responses.mistral}
        </Text>
        </GridItem>
       
        <GridItem >
        <Avatar
              size="sm"
              src={`./usa.png`}
             
              mr={3}
            />
        <Text fontSize="sm" as='b' color='green'>OpenAI - Time: {performance.openai.time} ms / Characters: {performance.openai.tokens} / Speed : {performance.openai.speed}</Text>
        <Text fontSize="xs" mt={4} width="80%" textAlign="right" style={{whiteSpace: 'pre-wrap'}}>
          {responses.openai}
        </Text>
        </GridItem>
        <GridItem >
        <Avatar
              size="sm"
              src={`./canada.png`}
             
              mr={3}
            />
        <Text fontSize="sm" as='b' color='violet'>Cohere AI - Time: {performance.cohere.time} ms / Characters: {performance.cohere.tokens} / Speed : {performance.cohere.speed}</Text>
        <Text fontSize="xs" mt={4} width="80%" textAlign="left" style={{whiteSpace: 'pre-wrap'}}>
        
        {responses.cohere}
        </Text>
        </GridItem>
        <GridItem >
        <Avatar
              size="sm"
              src={`./canada.png`}
             
              mr={3}
            />
        <Text fontSize="sm" as='b' color='violet'>Cohere AI  WEB SEARCH- Time: {performance.coherewebsearch.time} ms / Characters: {performance.coherewebsearch.tokens} / Speed : {performance.coherewebsearch.speed}</Text>
        <Text fontSize="xs" mt={4} width="80%" textAlign="left" style={{whiteSpace: 'pre-wrap'}}>
        
        {responses.coherewebsearch}
        </Text>
        </GridItem>
        <GridItem >
        <Avatar
              size="sm"
              src={``}
             
              mr={3}
            />
        <Text fontSize="sm" as='b' color='green'>Local- Time: {performance.localstream.time} ms / Characters: {performance.localstream.tokens} / Speed : {performance.localstream.speed}</Text>
        <Text fontSize="xs" mt={4} width="80%" textAlign="right" style={{whiteSpace: 'pre-wrap'}}>
          {responses.localstream}
        </Text>
        </GridItem>
        <GridItem >
        <Avatar
              size="sm"
              src={`./usa.png`}
             
              mr={3}
            />
        <br/><Text fontSize="sm" as='b' color='red.500'>Dale.e 3 - </Text>
        {isLoadingDalee &&
        <Spinner size="xs" color="red.500" ml={2} />
        
        }
        {imageDalee &&
        
        <Image src={`data:image/jpeg;base64,${imageDalee}`} alt="Preview" maxW="300" mb="1" />
       
        
        }
        </GridItem>
        <GridItem >
        <Avatar
              size="sm"
              src={`./india.png`}
             
              mr={3}
            />
        <Text fontSize="sm" as='b' color='red.500'>Stability AI XL - </Text>
        {isLoadingStability && <Spinner size="xs" color="red.500" ml={2} />}
        {imageStability &&
        
        <Image src={`data:image/jpeg;base64,${imageStability}`} alt="Preview" maxW="300" mb="1" />
       
        
        }
        
          
        
        
        </GridItem>
        </Grid>
        
        </Box>
     
    </>
  );
}

export default Home;
//




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