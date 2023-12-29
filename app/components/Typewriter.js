import React, { useEffect, useState } from 'react';

const Typewriter = ({ text }) => {
  const [printedText, setPrintedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setPrintedText((oldText) => oldText + text.charAt(index));
        setIndex((oldIndex) => oldIndex + 1);
      }, 70); // Ajusta la velocidad aquí

      return () => clearTimeout(timer);
    }
  }, [text, index]);

  return (
    <div className="typewriter">
      {printedText}
      <style jsx>{`
        .typewriter {
          font-family: 'Courier New', monospace;
          white-space: pre-wrap;
          overflow: hidden;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default Typewriter;

