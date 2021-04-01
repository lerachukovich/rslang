import React, { useEffect, useState, useCallback } from 'react';
import useHttp from '../../hooks/http.hook';
import MathHelper from '../../helper/Math.helper';
import Spinner from '../Spinner/Spinner';
import Word from './Savanna.word.component';
import WordControl from './Savanna.word-control.component';
import Heart from './Savanna.heart.component';
import SuccessCristal from './Savanna.succes-cristall.component';
import FinalScreen from './Savanna.final-screen';
import './savanna.scss';

const SavannaPlay = () => {
  const GAME_CONFIG = {
    attempts: 10,
    lives: 5,
    wordCards: 4
  };
  const WORDS_LIMIT = {
    maxPages: 29,
    maxGroup: 5,
    maxWordAmount: 19
  };
  let [lives, setLives] = useState(GAME_CONFIG.lives);
  const hearts = [];
  const [wordCollection, setWordCollection] = useState(null);
  const { loading, request } = useHttp();
  const [currentWord, setCurrentWord] = useState(null);
  const [currentFourWord, setCurrentFourWord] = useState(null);
  const [isEnd, setEnd] = useState(false);
  const [backgroundPosition, setBackGroundPosition] = useState(100);
  const [btnColorClass, setBtnColorClass] = useState('waves-light btn-large  cyan darken-3');
  const [choiceFromKey, setChoiceFromKey] = useState('');
  const [cristalSize, setCristalSize] = useState(10);
  let [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({ correct: [], unCorrect: [] });

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
    }
  );

  useEffect(() => {
    getWords();
  }, []);

  const generateFourWord = (currentStep) => {
    let tmp = [];
    tmp = [...tmp, wordCollection[currentStep]];
    do {
      tmp = [...tmp, wordCollection[MathHelper.getRandomNumber(currentStep + 1, WORDS_LIMIT.maxWordAmount)]];
      tmp = new Set(tmp);
      tmp = [...tmp];
    } while (tmp.length < GAME_CONFIG.wordCards);
    const res = MathHelper.shuffleArray(tmp);
    setCurrentFourWord(res);
    return res;
  };

  const getCurrentWord = (currentStep) => {
    setCurrentWord(wordCollection[currentStep].word);
    return wordCollection[currentStep].word;
  };

  useEffect(() => {
    if (!wordCollection) {
      return;
    } else {
      setCurrentFourWord(generateFourWord(currentStep));
      setCurrentWord(getCurrentWord(currentStep));
    }
  }, [wordCollection]);

  useEffect(() => {

    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, []);

  const refreshFieldHandler = () => {
    setCurrentStep(currentStep += 1);
    if (currentStep === GAME_CONFIG.attempts || lives < 1) {
      setEnd(true);
      window.removeEventListener('keydown', keyHandler);
    }
    setCurrentFourWord(generateFourWord(currentStep));
    setCurrentWord(getCurrentWord(currentStep));
  };

  const successTurn = (el) => {
    refreshFieldHandler();
    setBackGroundPosition(prevState => prevState - 10);
    setCristalSize(prevState =>
      prevState + 20
    );
    setAnswers(prevState => ({ ...answers, correct: [...prevState.correct, el] }));
    console.log(answers);
  };

  const failureTurn = (el) => {
    setBtnColorClass('btn-large red darken-1');
    healthHandler();
    refreshFieldHandler();
    if (backgroundPosition === 100) {
      setBackGroundPosition(prevState => prevState + 0);
    } else {
      setBackGroundPosition(prevState => prevState + 10);
    }
    setCristalSize(prevState =>
      prevState - 20
    );
    setTimeout(() => {
      setBtnColorClass('waves-light btn-large  cyan darken-3');
    }, 200);
    setAnswers(prevState => ({ ...answers, unCorrect: [...prevState.unCorrect, el] }));
    console.log(answers);
  };

  const chooseHandler = (e, key) => {
    const id1 = wordCollection.filter(it => it.word === currentWord);
    let id2;
    if (!e) {
      const buttonCollection = [...document.querySelectorAll('.btn-large')];
      if (!isEnd) {
        const wordTranslate = buttonCollection.filter(it => it.getAttribute('dataId') === key)[0].getAttribute('data');
        id2 = wordCollection.filter(it => it.wordTranslate === wordTranslate);
      } else {
        return;
      }
    } else {
      id2 = wordCollection.filter(it => it.wordTranslate === e.target.getAttribute('data'));
    }
    if (id1[0].id === id2[0].id) {
      successTurn(id1[0]);
    } else {
      failureTurn(id1[0]);
    }
    setChoiceFromKey('');
  };

  const keyHandler = useCallback((e) => {
    if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
      setChoiceFromKey(e.key);
    } else {
      return;
    }
  }, [currentStep]);

  useEffect(() => {
    if (!wordCollection || !choiceFromKey) {
      return;
    }
    chooseHandler(null, choiceFromKey);
  }, [choiceFromKey]);

  useEffect(() => {
    for (let i = 0; i < lives; i += 1) {
      hearts.push(<Heart/>);
    }
  }, [lives]);

  const healthHandler = () => {
    setLives(prevState => prevState - 1);
  };

  if (isEnd) {
    return (
      <div className={'savanna-wrapper'} style={{ backgroundPosition: `0 ${backgroundPosition}%` }}>
        <FinalScreen value={{answers}}/>
      </div>
    );
  } else {
    return (
      <div className={'savanna-wrapper'} style={{ backgroundPosition: `0 ${backgroundPosition}%` }}>
        <div className="savanna__hearts-container">
          {hearts}
        </div>

        {currentWord &&
        <Word value={{ healthHandler, refreshFieldHandler, wordCollection, currentWord, currentStep }}/>}
        {!wordCollection && <Spinner className={'savanna__spinner'}/>}
        {currentFourWord &&
        <WordControl value={{ btnColorClass, wordCollection, currentFourWord, currentStep, chooseHandler }}/>}
        {!loading && <SuccessCristal value={cristalSize}/>}
      </div>
    );
  }
};

export default SavannaPlay;
