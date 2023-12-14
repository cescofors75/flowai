import { useEffect, useState } from "react";
// Importa un componente spinner, aquí puedes usar cualquier spinner de tu elección
import { Spinner,Box } from '@chakra-ui/react'

function AudioPlayer({ text }) {
  const [textLocale, setTextLocale] = useState("");
  const [audioSrc, setAudioSrc] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Nuevo estado para controlar el spinner

  useEffect(() => {
    if (text) {
      setTextLocale( text);
      handleSubmit();
    }
  }, [text]);

  const handleSubmit = async () => {
    setIsLoading(true); // Activa el spinner al iniciar la carga
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioSrc(url);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false); // Desactiva el spinner después de cargar el audio o si ocurre un error
    }
  };

  return (
    <Box my={2}>
      {isLoading && <Spinner />} {/* Muestra el spinner mientras isLoading sea true */}
      {audioSrc && <audio controls src={audioSrc} ></audio>}
    </Box>
  );
}

export default AudioPlayer;

//autoPlay

