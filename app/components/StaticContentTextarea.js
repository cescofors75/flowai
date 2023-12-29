import React, { useEffect, useRef } from 'react';
import { Textarea, Box } from '@chakra-ui/react';

const StaticContentTextarea = ({ entry }) => {
    const textareaRef = useRef(null);
console.log(entry);
    useEffect(() => {
        // Ajustar la altura inicialmente basada en el contenido
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        }
    }, [entry]); // Dependencias para reajustar si el contenido de 'entry' cambia

    return (
        
        <Textarea
            backgroundColor='transparent'
            fontSize="sm"
            value={`${entry.userQuestion}: ${entry.openaiResponse}`}
            ref={textareaRef}
            minHeight="unset"
            overflow="hidden"
            resize="none"
            isReadOnly // Si solo es para mostrar el contenido y no para editar
        />
        
    );
};

export default StaticContentTextarea;
