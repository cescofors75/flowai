import React, { useEffect, useRef } from 'react';
import { Textarea, Box } from '@chakra-ui/react';

const StaticContentTextarea = ({ entry }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        // Ajustar la altura inicialmente basada en el contenido
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }, [entry]); // Dependencias para reajustar si el contenido de 'entry' cambia

    return (
        <Box>
        <Textarea
            backgroundColor='transparent'
            fontSize="sm"
            value={`${entry.source}: ${entry.response}`}
            ref={textareaRef}
            minHeight="unset"
            overflow="hidden"
            resize="none"
            isReadOnly // Si solo es para mostrar el contenido y no para editar
        />
        </Box>
    );
};

export default StaticContentTextarea;
