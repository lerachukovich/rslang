import React, { useEffect, useState, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import useHttp from '../../hooks/http.hook';
import MathHelper from '../../helper/Math.helper';
import { UpdateUserWord, CreateUserWord }from '../../helper/database.helper/UserWord.helper';
import {GetUserWords} from '../../helper/database.helper/getUserWords.helper';
import useStatistic from '../../hooks/statistic.hook.js';
import Spinner from '../Spinner/Spinner';
import Word from './Savanna.word.component';
import WordControl from './Savanna.word-control.component';
import Heart from './Savanna.heart.component';
import SuccessCristal from './Savanna.succes-cristall.component';
import FinalScreen from './Savanna.final-screen.component';
import useSound from 'use-sound';
import errorSound from '../../assets/audio/error.mp3';
import correct from '../../assets/audio/correct.mp3';
import bg1 from '../../assets/savanna-bg/savannabg-1.jpg';
import bg2 from '../../assets/savanna-bg/savannabg-2.jpg';
import bg3 from '../../assets/savanna-bg/savannabg-3.jpg';
import bg4 from '../../assets/savanna-bg/savannabg-4.jpg';
import './savanna.scss';
import GameLevel from './Savanna.level.component';
import Error from '../Error/Error';
import { SettingContext } from '../../context/SettingContext';
import useMessage from '../../hooks/message.hook';

const SavannaPlay = () => {
  //Settings
  const setting = useContext(SettingContext);

  const GAME_CONFIG = {
    attempts: setting.wordsCount,
    lives: setting.life,
    wordCards: 4
  };
  const WORDS_LIMIT = {
    maxPages: 29,
    maxGroup: 5,
    maxWordAmount: 19
  };

  const message = useMessage();
  const { token, userId, isAuthenticated } = useContext(AuthContext);
  const props = useHistory();
  const data = props.location.data;
  const page = props.location.page;
  const group = props.location.group;
  const isFromTextBook = props.location.fromTextBook;


  const [isGameBegin, setIsGameBegin] = useState(props.location.fromTextBook || false);
  const [level, setLevel] = useState('');
  let [lives, setLives] = useState(GAME_CONFIG.lives);
  const hearts = [];
  const backgrounds = [bg1, bg2, bg3, bg4];
  const [wordCollection, setWordCollection] = useState( data || null);
  const { loading, request, error } = useHttp();
  const [currentWord, setCurrentWord] = useState(null);
  const [currentFourWord, setCurrentFourWord] = useState(null);
  const [isEnd, setEnd] = useState(false);
  const [backgroundPosition, setBackGroundPosition] = useState(100);
  const [btnColorClass, setBtnColorClass] = useState('waves-light btn-large  cyan darken-3');
  const [choiceFromKey, setChoiceFromKey] = useState('');
  const [cristalSize, setCristalSize] = useState(10);
  let [currentStep, setCurrentStep] = useState(0);
  const [correctSound] = useSound(correct);
  const [playErrorSound] = useSound(errorSound);
  const [answers, setAnswers] = useState({ correct: [], unCorrect: [] });
  const [currentBackground, setCurrentBackground] = useState(backgrounds[MathHelper.getRandomNumber(1, backgrounds.length - 1)]);
  const [isSound, setIsSound] = useState(setting.isSound);
  const [soundBtnClass, setSoundButtonClass] = useState('savanna__sound-control btn');
  const [userWords, setUserWords] = useState(null);

  const {setStatistic} = useStatistic();
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    GetUserWords({ userId }, token, setUserWords);
    if (data) setWordCollection(MathHelper.shuffleArray(data));
  }, [isAuthenticated]);

  for (let i = 0; i < lives; i += 1) {
    hearts.push(<Heart key={i}/>);
  }

  const getWords = useCallback(
    async () => {
      try {
        const data = await request(`/words/?page=${MathHelper.getRandomNumber(0, WORDS_LIMIT.maxPages)}&group=${level}`, 'GET', null);
        setWordCollection(MathHelper.shuffleArray(data));
      } catch (e) {
      }
      ;
    }
  );

  const generateFourWord = (currentStep) => {
    let tmp = [];
    tmp = [...tmp, wordCollection[currentStep]];
    do {
      tmp = [...tmp, wordCollection[MathHelper.getRandomNumber(0, WORDS_LIMIT.maxWordAmount)]];
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

  const refreshFieldHandler = () => {
    setCurrentStep(currentStep += 1);
    if (currentStep === GAME_CONFIG.attempts - 1 || lives < 1) {
      setEnd(true);
      setIsGameBegin(false);
      window.removeEventListener('keydown', keyHandler);
      if (props.location.fromTextBook) {

        answers.correct.map(it => {
          const tmpId = userWords.filter(el => el.wordId === it.id);
          if (tmpId.length) {
            UpdateUserWord({
              userId: userId,
              wordId: it.id,
              word: {
                difficulty: tmpId[0].difficulty, optional: {
                  deleted: tmpId[0].optional.deleted,
                  page: page,
                  group: group,
                  correct: tmpId[0].optional.correct += 1,
                  unCorrect: tmpId[0].optional.unCorrect
                }
              }
            }, token);
          } else {
            CreateUserWord({
              userId: userId,
              wordId: it.id,
              word: {
                difficulty: 'weak', optional: {
                  deleted: false,
                  page: page,
                  group: group,
                  correct: 1,
                  unCorrect: 0,
                }
              }
            }, token);
          }
        });


        answers.unCorrect.map(it => {
          const tmpId = userWords.filter(el => el.wordId === it.id);
          if (tmpId.length) {
            UpdateUserWord({
              userId: userId,
              wordId: it.id,
              word: {
                difficulty: tmpId[0].difficulty, optional: {
                  deleted: tmpId[0].optional.deleted,
                  page: page,
                  group: group,
                  correct: tmpId[0].optional.correct,
                  unCorrect: tmpId[0].optional.unCorrect += 1
                }
              }
            }, token);
          } else {
            CreateUserWord({
              userId: userId,
              wordId: it.id,
              word: {
                difficulty: 'weak', optional: {
                  deleted: false,
                  page: page,
                  group: group,
                  correct: 0,
                  unCorrect: 1
                }
              }
            }, token);
          }
        });
      }
    }

    setCurrentFourWord(generateFourWord(currentStep));
    setCurrentWord(getCurrentWord(currentStep));
  };

  const successTurn = (el) => {
    refreshFieldHandler();
    setBackGroundPosition(prevState => prevState - 5);
    setCristalSize(prevState =>
      prevState + 20
    );
    setAnswers(prevState => ({ ...answers, correct: [...prevState.correct, el] }));
    setStatistic(el, userId || null, token || null);
    if (isSound) correctSound();
  };

  const failureTurn = (el) => {
    setBtnColorClass('btn-large red darken-1');
    healthHandler();
    refreshFieldHandler();
    if (backgroundPosition === 100) {
      setBackGroundPosition(prevState => prevState + 0);
    } else {
      setBackGroundPosition(prevState => prevState + 5);
    }
    setCristalSize(prevState =>
      prevState - 20
    );
    setTimeout(() => {
      setBtnColorClass('waves-light btn-large  cyan darken-3');
    }, 200);
    setAnswers(prevState => ({ ...answers, unCorrect: [...prevState.unCorrect, el] }));
    if (isSound) playErrorSound();
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

  useEffect(() => {
    if (!wordCollection) {
      return;
    } else {
      setCurrentFourWord(generateFourWord(currentStep));
      setCurrentWord(getCurrentWord(currentStep));
    }
  }, [wordCollection]);

  useEffect(() => {
    setIsSound(setting.isSound);
    if (isSound) {
      setSoundButtonClass('savanna__sound-control btn red lighten-2')
    } else {
      setSoundButtonClass('savanna__sound-control btn')
    }

    window.addEventListener('keydown', keyHandler);

    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, []);


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

  const soundHandler = (url) => {
    const audio = new Audio(`/${url}`);
    audio.play();
  };

  const soundControlHandler = () => {
    setIsSound(!isSound);
    if (!isSound) {
      message('Звук включен');
      setSoundButtonClass('savanna__sound-control btn red lighten-2');
    } else {
      message('Звук выключен');
      setSoundButtonClass('savanna__sound-control btn');
    }
  };

  const getLevel = (e) => {
    setLevel(e.target.getAttribute('datalevel'));
  };

  const setHardDif = (e) => {
    UpdateUserWord({
      userId: userId,
      wordId: e.target.getAttribute('wordid'),
      word: { difficulty: 'hard' }
    }, token);
  };

  useEffect(() => {
    if (!level) {
      return;
    }
    getWords(level);
    setIsGameBegin(true);
  }, [level]);

  if (error) {
    return (
      <Error/>
    );
  } else if (isEnd) {
    return (
      <div className={'savanna-wrapper'} style={{
        backgroundPosition: `0 ${backgroundPosition}%`,
        backgroundImage: `url(${currentBackground})`
      }}>
        <FinalScreen value={{ answers, soundHandler, setHardDif, isFromTextBook }}/>
      </div>
    );
  } else if (!isGameBegin) {
    return (
      <div className={'savanna-wrapper'} style={{
        backgroundPosition: `0 ${backgroundPosition}%`,
        backgroundImage: `url(${currentBackground})`
      }}>
        <GameLevel value={{ getLevel }}/>
      </div>
    );
  } else {
    return (
      <div className={'savanna-wrapper'} style={{
        backgroundPosition: `0 ${backgroundPosition}%`,
        backgroundImage: `url(${currentBackground})`
      }}>
        <div className="savanna__hearts-container">
          {hearts}
        </div>
        <button className={soundBtnClass} onClick={soundControlHandler}><i className={'material-icons'}>music_note</i>
        </button>

        {currentWord &&
        <Word value={{ healthHandler, refreshFieldHandler, failureTurn, wordCollection, currentWord, currentStep }}/>}
        {!wordCollection && <Spinner className={'savanna__spinner'}/>}
        {currentFourWord &&
        <WordControl value={{ btnColorClass, wordCollection, currentFourWord, currentStep, chooseHandler }}/>}
        {!loading && <SuccessCristal value={cristalSize}/>}
      </div>
    );
  }
};

export default SavannaPlay;
