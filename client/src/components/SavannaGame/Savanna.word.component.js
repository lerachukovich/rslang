import React, { useEffect, useState } from 'react';

const Word = ({ value }) => {
  const [wordPosition, setWordPosition] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [intervalId, setIntervalId] = useState(null);
  const MAX_WORD_POSITION = 500;

  useEffect(() => {
    setCurrentWord(value.currentWord);
    setWordPosition(0);
    const wordInterval = setInterval(() => {
      setWordPosition(prevState => prevState + 0.5);
    }, 1);
    setIntervalId(wordInterval);
    clearInterval(intervalId);
  }, [value.currentWord]);

  useEffect(() => {
    if (wordPosition === MAX_WORD_POSITION) {
      clearInterval(intervalId);
      value.healthHandler();
      value.refreshFieldHandler();
    }
  }, [wordPosition]);

  return (
    <div className={'savanna__word-container'} style={{ transform: `translateY(${wordPosition}%)` }}>
      <b>{currentWord}</b>
    </div>
  );
};

export default Word;