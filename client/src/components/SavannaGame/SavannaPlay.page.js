import React, { useEffect, useState, useCallback } from 'react';
import useHttp from '../../hooks/http.hook';
import MathHelper from '../../helper/Math.helper';
import Spinner from '../Spinner/Spinner';
import './savanna.scss';

const Heart = () => {
  return (
    <div className={'savanna__heart'}>

    </div>
  );
};

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

const WordControl = ({ value }) => {
  const [currentSet, setCurrentSet] = useState([]);

  useEffect(() => {
    setCurrentSet(value.currentFourWord);
  }, [value.currentFourWord])

  return (
    <div className="savanna__word-panel">
      {currentSet.map((it, ind) => (
        <button onClick={value.chooseHandler} className={'waves-light btn-large'} key={ind} data={it.wordTranslate}>{ind + 1} : {it.wordTranslate}</button>
      ))}
    </div>
  );
};

const SavannaPlay = () => {
  const GAME_CONFIG = {
    attempts: 10,
  };
  const WORDS_LIMIT = {
    maxPages: 29,
    maxGroup: 5,
  };
  let [lives, setLives] = useState(5);
  const hearts = [];
  const [wordCollection, setWordCollection] = useState(null);
  const { loading, request } = useHttp();
  const [currentWord, setCurrentWord] = useState(null);
  const [currentFourWord, setCurrentFourWord] = useState(null);
  const [isGameOver, setGameOver] = useState(false);
  const [isEnd, setEnd] = useState(false);
  const [backgroundPosition, setBackGroundPosition] = useState(100)
  let [currentStep, setCurrentStep] = useState(0);

  for (let i = 0; i < lives; i += 1) {
    hearts.push(<Heart key={i}/>);
  }

  const getWords = useCallback(
    async () => {
      try {
        const data = await request(`/words/?page=${MathHelper.getRandomNumber(0, WORDS_LIMIT.maxPages)}&group=${MathHelper.getRandomNumber(0, WORDS_LIMIT.maxGroup)}`, 'GET', null);
        setWordCollection(MathHelper.shuffleArray(data));
      } catch (e) {
      }
      ;
    },
  );

  useEffect(() => {
    getWords();
  }, []);

  const generateFourWord = (currentStep) => {
    const tmp = [];
    tmp.push(wordCollection[currentStep]);
    for (let i = 0; i < 3; i += 1) {
      tmp.push(wordCollection[MathHelper.getRandomNumber(currentStep, 19)])
    }
    const res = MathHelper.shuffleArray(tmp);
    setCurrentFourWord(res);
    console.log(currentFourWord);
    return res;
  }

  const getCurrentWord = (currentStep) => {
    setCurrentWord(wordCollection[currentStep].word);
    return wordCollection[currentStep].word;
  }

  useEffect(() => {
    if (!wordCollection) {
      return
    } else {
      setCurrentFourWord(generateFourWord(currentStep));
      setCurrentWord(getCurrentWord(currentStep));
    }
  }, [wordCollection])


  const refreshFieldHandler = () => {
    setCurrentStep(currentStep += 1);
    if (currentStep === GAME_CONFIG.attempts) {
      setEnd(true);
    }
    setCurrentFourWord(generateFourWord(currentStep));
    setCurrentWord(getCurrentWord(currentStep));
  }

  const chooseHandler = (e) => {
    const id1 = wordCollection.filter(it => it.word === currentWord);
    const id2 = wordCollection.filter(it => it.wordTranslate === e.target.getAttribute('data'));
    if (id1[0].id === id2[0].id) {
      refreshFieldHandler();
      setBackGroundPosition(prevState => prevState - 10);
    } else {
      healthHandler();
      refreshFieldHandler();
    }
  }

  useEffect(() => {
    for (let i = 0; i < lives; i += 1) {
      hearts.push(<Heart/>);
    }
    if (lives === 0) {
      setGameOver(!isGameOver);
    }
  }, [lives]);

  const healthHandler = () => {
    setLives( prevState => prevState - 1);
  };

  if (isGameOver) {
    return (
      <h1>Game Over</h1>
    )
  } else if (isEnd) {
    return (
      <h1>U win</h1>
    )
  }
  else {
    return (
      <div className={'savanna-wrapper'} style={{backgroundPosition: `0 ${backgroundPosition}%`}}>
        <div className="savanna__hearts-container">
          {hearts}
        </div>

        {currentWord && <Word value={{ healthHandler, refreshFieldHandler, wordCollection, currentWord, currentStep }}/>}
        {!wordCollection && <Spinner className={'savanna__spinner'} />}
        {currentFourWord && <WordControl value={{wordCollection, currentFourWord, currentStep, chooseHandler}} />}
      </div>
    );
  }
};

export default SavannaPlay;
