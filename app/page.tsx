'use client'
import React, { useState } from 'react';
import {
  Button,

  Image,
  Box,
  Flex,
  IconButton
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';
import AudioPlayer from './components/AudioPlayer';
import { ChakraProvider } from '@chakra-ui/react';

function Home() {
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [textScan, setTextScan] = useState('');

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
    const api_key = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const payload = {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text:
                //'Analitza la imatge, i explica el seu contingut per a una persona de cinc anys cega.',
                'Analiza la imagen, y explica su contenido para una persona de cinco años ciega.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
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
      // Handle the response data
    } catch (error) {
      console.error('Error analyzing image:', error);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  //console.log(imagePreview);
  return (
    <ChakraProvider>
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100vh"
        position="relative"
        maxW='390px'
      >
        {!imagePreview && (
          <Flex direction="column" align="center" justify="center" alignItems="center">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <IconButton
              icon={<FiCamera color="white.300"  />}
              mt={4}
              onClick={onButtonClick} // Llama a onButtonClick aquí
              aria-label="Upload Image"
              colorScheme="red"
            >
            </IconButton>
          </Flex>
        )}
        {imagePreview && (
          
           <Flex direction="column" align="center" justify="center" alignItems="center">
           
          
           
            
              <Button colorScheme="red" onClick={analyzeImage} isLoading={loading}>
                Analyze Image
              </Button>
              {!textScan &&
              
              <Image mt={4} src={imagePreview} alt="Preview" maxW="350" maxH="100%" mb="4" />}
              {textScan && <AudioPlayer text={textScan} />}
              <Box style={{ backgroundImage: `url(${imagePreview})` , maxWidth: '350px', maxHeight: '100%', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',}}
               
                mt={4}
               bgColor='black'
             
               mb="4" >
                <div style={{
                    margin: '0 auto',
                    padding: '2px',
                    textAlign: 'justify',
                    backgroundColor: 'rgba(77, 77, 77, 0.5)',
                    borderRadius: '6px',
                    color:'white'
                  }}
                  >
              {textScan}
              
              
              </div>
              
              </Box>
              {textScan &&
              <Button mt={4} colorScheme="red" onClick={()=>{setTextScan('');setImagePreview('')}} >
                Volver
              </Button>
}
            </Flex>
        )}
       </Flex>
    </ChakraProvider>
  );
}

export default Home;

