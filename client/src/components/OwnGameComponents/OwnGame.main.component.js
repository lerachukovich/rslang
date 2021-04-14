import React, {useState, useEffect, useCallback, useContext} from 'react';
import GameLevels from './OwnGame.levels.component';
import Sentence from './OwnGame.sentence.component';
import Options from './OwnGame.options.component';
import MathHelper from '../../helper/Math.helper';
import useHttp from '../../hooks/http.hook';
import Spinner from '../Spinner/Spinner';
import bg1 from '../../assets/own-game-bg/own-game-bg-1.jpg';
import bg2 from '../../assets/own-game-bg/own-game-bg-2.jpg';
import bg3 from '../../assets/own-game-bg/own-game-bg-3.jpg';
import bg4 from '../../assets/own-game-bg/own-game-bg-4.jpg';
import Heart from './OwnGame.heart.component';
import FinalScreen from './OwnGame.results.component';
import error from '../../assets/audio/error.mp3';
import correct from '../../assets/audio/correct.mp3';
import useSound from 'use-sound';
import { useHistory } from 'react-router';
import useStatistic from '../../hooks/statistic.hook';
import { CreateUserWord, UpdateUserWord } from '../../helper/database.helper/UserWord.helper';
import {AuthContext} from '../../context/AuthContext';
import { GetUserWords } from '../../helper/database.helper/getUserWords.helper';

const OwnGameMain = () => {

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

    const backgrounds = [bg1, bg2, bg3, bg4];

    const props = useHistory();
    const { data, page, group } = props.location;
    const {setStatistic} = useStatistic();    
    const auth = useContext(AuthContext);
    const { isAuthenticated, userId, token } = useContext(AuthContext);

    const [currentBackground, setCurrentBackground] = useState(backgrounds[MathHelper.getRandomNumber(0, backgrounds.length - 1)]);
    const [level, setLevel] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [wordCollection, setWordCollection] = useState(data || null);
    const { loading, request } = useHttp();
    const [currentStep, setCurrentStep] = useState(0);
    const [options, setOptions] = useState([]);
    const [currentSentence, setCurrentSentence] = useState('');
    const [currentRightAnswer, setCurrentRightAnswer] = useState('');
    const [translationIsOpened, setTranslationIsOpened] = useState(false);
    const [translation, setTranslation] = useState('');
    const [gameIsFinished, setGameIsFinished] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [currentWrongAnswers, setCurrentWrongAnswers] = useState([]);
    const [livesCount, setLivesCount] = useState(new Array(GAME_CONFIG.lives).fill('live'));
    const [correctSound] = useSound(correct);
    const [errorSound] = useSound(error);
    const [isSound, setIsSound] = useState(false);
    
    const [answers, setAnswers] = useState({
        correct: [],
        unCorrect: []
    });
    const [userWords, setUserWords] = useState(null);
    
    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        GetUserWords({ userId }, token, setUserWords);
    }, [isAuthenticated]);

    const getLevel = (e) => {
        setLevel(e.target.getAttribute('datalevel'));
    };

    const getWords = useCallback(
        async () => {
          try {
            const data = await request(`/words/?page=${MathHelper.getRandomNumber(0, WORDS_LIMIT.maxPages)}&group=${level}`, 'GET', null);
            setWordCollection(MathHelper.shuffleArray(data));
          } catch (e) {
          };
        }
    );

    useEffect(() => {
        if (Array.isArray(wordCollection) && wordCollection.length > 0) {
            setIsGameStarted(true);
            return;
        }
        if (!level) {
          return;
        }
        getWords(level);
        setIsGameStarted(true);
    }, [level]);

    const getCurrentSentence = (currentStep) => {
        if(wordCollection) {
            setCurrentRightAnswer(wordCollection[currentStep].word);
            setTranslation(wordCollection[currentStep].textExampleTranslate);
            return wordCollection[currentStep].textExample;
        }
    };

    const generateFourOptions = (currentStep) => {
        const options = [];
        options.push(wordCollection[currentStep].word);
        for(let i = 1; options.length <=3; i++) {
            let num  = MathHelper.getRandomNumber(0, WORDS_LIMIT.maxWordAmount);
            if(!options.includes(wordCollection[num].word)) {
                options.push(wordCollection[num].word);
            }
        }

        MathHelper.shuffleArray(options);
        return options;
    };

    useEffect(() => {
        if (!wordCollection) {
          return;
        } else {
            setOptions(generateFourOptions(currentStep));
            setCurrentSentence(getCurrentSentence(currentStep));
        }
      }, [wordCollection]);

    const getObj = (arr, finder) => {
        return arr.find(item => item.word === finder);
    }

    const checkAnswer = (e) => {
        if(e.target.id === currentRightAnswer) {
            if(isSound) {
                correctSound();
            }
            setCurrentStep((currentStep)=>currentStep + 1);
            if(!wrongAnswers.includes(currentRightAnswer)) {
                setCorrectAnswers((correctAnswers)=> [...correctAnswers, e.target.id])
                setAnswers({...answers, correct: [...answers.correct, getObj(wordCollection, e.target.id)]});
                setStatistic(getObj(wordCollection, e.target.id), auth.userId || null, auth.token || null);
            }
            setCurrentWrongAnswers([]);
        } else {
            if(isSound) {
                errorSound();
            }
            if(!wrongAnswers.includes(currentRightAnswer)) {
                setAnswers({...answers, unCorrect: [...answers.unCorrect, getObj(wordCollection, currentRightAnswer)]});
                setWrongAnswers((wrongAnswers)=> [...wrongAnswers, currentRightAnswer])
            }
            if(livesCount.length >= 1) {
                setLivesCount((livesCount)=> {
                    const cutLife = livesCount.slice(0, livesCount.length - 1);
                    return cutLife;
                }) 
            }
            if(livesCount.length === 0) {
                setGameIsFinished(true);
            }
            setCurrentWrongAnswers(()=> [...currentWrongAnswers, e.target.id] )
        }
    }

    useEffect(() => {
        if(currentStep !== 0 && currentStep <= WORDS_LIMIT.maxWordAmount) {
            setOptions(generateFourOptions(currentStep));
            setCurrentSentence(getCurrentSentence(currentStep));
        } else if(currentStep > WORDS_LIMIT.maxWordAmount) {
            if (props.location.fromTextBook) {

                answers.correct.map(it => {
                    const tmpId = userWords.filter(el => el.wordId === it.id);
                    if (tmpId.length) {
                        UpdateUserWord({
                            userId: auth.userId,
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
                        }, auth.token);
                    } else {
                        CreateUserWord({
                            userId: auth.userId,
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
                        }, auth.token);
                    }
                });


                answers.unCorrect.map(it => {
                    const tmpId = userWords.filter(el => el.wordId === it.id);
                    if (tmpId.length) {
                        UpdateUserWord({
                            userId: auth.userId,
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
                        }, auth.token);
                    } else {
                        CreateUserWord({
                            userId: auth.userId,
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
                        }, auth.token);
                    }
                });
            }
            setGameIsFinished(true);
        };

    }, [currentStep] )

    const soundHandler = (url) => {
        const audio = new Audio(`/${url}`);
        audio.play();
      };

    if (!isGameStarted) {
        return (
        <div className={'savanna-promo__wrapper'} style={{backgroundImage: `url(${currentBackground})`}}>
            <GameLevels chooseLevel={getLevel}/>
        </div>)
        
    } else if (isGameStarted && !gameIsFinished) {
        return (
            <div className={'savanna-promo__wrapper own-game-play'} style={{backgroundImage: `url(${currentBackground})`}}>
                <div className="settings-buttons">
                    <button className={`btn ${isSound ? 'savanna__sound-control red lighten-2' : 'savanna__sound-control'} `} onClick={()=>setIsSound(!isSound)}><i className={'material-icons'}>music_note</i>
                    </button>
                    <button className={`btn ${translationIsOpened ? 'savanna__sound-control red lighten-2' : 'savanna__sound-control'} `} onClick={()=>setTranslationIsOpened(!translationIsOpened)} ><i className={'material-icons'}>help</i>
                    </button>                
                </div>
                <div className="savanna__hearts-container own-game-lives">
                    {livesCount.map((item, id) => <Heart key={id}/>)}
                </div>

                <div className="own-game_title ">Complete the sentence below:</div>
                <Sentence sentence={currentSentence}/>
                <Options options={options} checkAnswer={checkAnswer} currentWrongAnswers={currentWrongAnswers}/>
                <div className="translation"><span>Перевод: </span>{translationIsOpened ? translation : 'Если Вы хотите посмотреть перевод, нажмите на кнопку "Посмотреть перевод"'}</div>
            </div>
        );
    } else if(gameIsFinished) {
        return (
            <div className={'savanna-promo__wrapper'} style={{backgroundImage: `url(${currentBackground})`}}>
                <FinalScreen
                    correctAnswers={correctAnswers}
                    wrongAnswers={wrongAnswers}
                    wordCollection={wordCollection}
                    soundHandler={soundHandler}
                />            
            </div>
        )
    }
}

export default OwnGameMain;
