import React, { useCallback, useContext, useEffect, useState } from 'react';
import useHttp from '../../hooks/http.hook';
import useSound from 'use-sound';
import { NavLink, useHistory } from 'react-router-dom';
import useStatistic from '../../hooks/statistic.hook.js';
import './Sprint.scss';
import error from '../../assets/audio/error.mp3';
import correct from '../../assets/audio/correct.mp3';
import GameResult from './Result';
import bg1 from '../../assets/own-game-bg/own-game-bg-1.jpg';
import bg2 from '../../assets/own-game-bg/own-game-bg-2.jpg';
import bg3 from '../../assets/own-game-bg/own-game-bg-3.jpg';
import bg4 from '../../assets/own-game-bg/own-game-bg-4.jpg';
import MathHelper from '../../helper/Math.helper';
import { AuthContext } from '../../context/AuthContext';
import { GetUserWords } from '../../helper/database.helper/getUserWords.helper';
import { CreateUserWord, UpdateUserWord } from '../../helper/database.helper/UserWord.helper';
import { SettingContext } from '../../context/SettingContext';

const GameField = () => {
  const setting = useContext(SettingContext);

  // Connect to vocabulary
  const { token, userId, isAuthenticated } = useContext(AuthContext);
  const props = useHistory();
  const dataFromTextBook = props.location.data;
  const page = props.location.page;
  const group = props.location.group;
  const isFromTextBook = props.location.fromTextBook;
  const [userWords, setUserWords] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  // Connect to vocabulary

  // Add statistic
  const {setStatistic} = useStatistic();
  // Add statistic
  const background = [bg1, bg2, bg3, bg4];
  const [currentBackground, setCurrentBackground] = useState(background[MathHelper.getRandomNumber(0, background.length - 1)]);
  const { request } = useHttp();
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(dataFromTextBook || null);
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [currentTranslate, setCurrentTranslate] = useState('');
  const [score, setScore] = useState(0);
  const [gameTimer, setGameTimer] = useState(60);
  const [endGame, setEndGame] = useState(false);

  const [isSound, setIsSound] = useState(setting.isSound);

  const [answers, setAnswers] = useState({
    correct: [],
    unCorrect: []
  });

  const [correctSound] = useSound(correct);
  const [errorSound] = useSound(error);


  useEffect(() => {
    if (!isFromTextBook) {
      getWords();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    GetUserWords({ userId }, token, setUserWords);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!data) {
      return;
    }
    if (index === data.length - 1) {
      setEndGame(true)
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
    };
  }, [index]);

  useEffect(() => {
      if (Array.isArray(data) && data.length) {
        let result = [[], []];
        data.map(el => {
          result[0].push(el.word);
          result[1].push(el.wordTranslate);
        });
        setWords(result);
      }
    }
    , [data]);

  const getWords = useCallback(
    async () => {
      try {
        const words = await request('/words?page=2&group=2', 'GET', null, {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        });
        setData(words);
      } catch (e) {
      }
    },
    [request]
  );

  const showWord = () => {
    if (Date.now() % 2) {
      setCurrentWord(words[0][index]);
      setCurrentTranslate(words[1][index]);
    } else {
      setCurrentWord(words[0][index]);
      setCurrentTranslate(words[1][index + 1]);
    }
  };

  const handleClick = (userAnswer, e) => {
    const currentWordObj = data.filter(it => it.word ===  e.target.getAttribute('worddata'))
    showWord();
    isCorrect(userAnswer, currentWordObj[0]);
  };

  const isCorrect = (answer, obj) => {
    if (words[1][words[0].indexOf(currentWord)] === currentTranslate && answer) {
      setScore(score + 10);
      if (isSound) correctSound();
      setAnswers({ ...answers, correct: [...answers.correct, obj] });
      setStatistic(obj, userId || null, token || null);
    } else if (words[1][words[0].indexOf(currentWord)] !== currentTranslate && !answer) {
      setScore(score + 10);
      if (isSound) correctSound();
      setAnswers({ ...answers, correct: [...answers.correct, obj] });
      setStatistic(obj, userId || null, token || null);
    } else {
      if (isSound) errorSound();
      setAnswers({ ...answers, unCorrect: [...answers.unCorrect, obj] });
    }
  };


  const tick = () => {
    setInterval(() => {
      setGameTimer(prev => prev > 0 ? prev - 1 : setEndGame(true));
    }, 1000);
  };

  const setHardDif = (e) => {
    UpdateUserWord({
      userId: userId,
      wordId: e.target.getAttribute('wordid'),
      word: { difficulty: 'hard' }
    }, token);
  };

  if (endGame) {
    return (
      <GameResult value={{answers, score, setHardDif, isFromTextBook}}/>
    );
  } else {
    return (
      <div className='sprint-container' style={{ backgroundImage: `url(${currentBackground})` }}>
        <div className='game-card'>
          <div className='card-content-sprint'>
            <NavLink to='/games'>
              <button className="btn waves-effect waves-light exit" type="submit" name="action">Выход
                <i className="material-icons left">arrow_back</i>
              </button>
            </NavLink>
            <button onClick={() => {
              tick();
              showWord();
              setIndex(prev => prev + 1);
              setShowButtons(true);
            }} className="btn waves-effect waves-light" type="submit" name="action">Старт
              <i className="material-icons right">exit_to_app</i>
            </button>
          </div>
        </div>
        <div className='game-container'>
          <h3 className='score'>Твой счет: {score}</h3>
          <h3 className='timer'>{gameTimer}</h3>
          <p className='word'>{currentWord}</p>
          <p className='word'>{currentTranslate} </p>

          {showButtons && (
              <div className="buttons">
                <button onClick={(e) => {
                  handleClick(true, e);
                  setIndex(prev => ++prev);
                }} className='btn btn-large waves-effect correct-btn'
                        worddata={currentWord}>Правильно
                </button>
                <button onClick={(e) => {
                  handleClick(false, e);
                  setIndex(prev => ++prev);
                }} className='btn btn-large waves-effect wrong-btn'
                        worddata={currentWord}>Не правильно
                </button>
              </div>
          )}

        </div>
        <div className={'empty'}>.</div>
        <button className={`audiocall__sound-btn btn ${!isSound && 'red lighten-2'}`} onClick={() => setIsSound(!isSound)}>
            <i className="material-icons">music_note</i>
        </button>
      </div>
    );
  }


};

export default GameField;
