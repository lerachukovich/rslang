import React, { useCallback, useEffect, useState, useContext } from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import useHttp from '../../hooks/http.hook';
import GameElement from './GameElement';
import FinalScreen from './FinalScreen';
import MathHelper from '../../helper/Math.helper';
import useSound from 'use-sound';
import {AuthContext} from '../../context/AuthContext';

import error from '../../assets/audio/error.mp3';
import correct from '../../assets/audio/correct.mp3';

import Flip from 'react-reveal/Flip';
import Roll from 'react-reveal/Roll';

import bg1 from '../../assets/audiocall/bg-call-1.jpg';
import bg2 from '../../assets/audiocall/bg-call-2.jpg';
import bg3 from '../../assets/audiocall/bg-call-3.jpg';

import useStatistic from '../../hooks/statistic.hook.js';
import { CreateUserWord, UpdateUserWord } from '../../helper/database.helper/UserWord.helper';
import { GetUserWords } from '../../helper/database.helper/getUserWords.helper';
import { SettingContext } from '../../context/SettingContext';

const GameAudiocall = () => {
    const setting = useContext(SettingContext);

    const WORDS_LIMIT = {
        maxPages: 29,
        maxGroup: 5,
        maxWordAmount: setting.wordsCount
    };

    const background = [bg1, bg2, bg3]

    const props = useHistory();
    const {state, wordsCollection} = props.location;
    const isFromTextBook = props.location.fromTextBook;

    const auth = useContext(AuthContext);
    const { isAuthenticated, userId, token } = useContext(AuthContext);
    const {request} = useHttp();
    const {setStatistic} = useStatistic();

    const [level, setLevel] = useState(0);
    const [data, setData] = useState(wordsCollection || []);
    const [currentSample, setCurrentSample] = useState([]);
    const [answers, setAnswers] = useState({
        correct: [],
        unCorrect: []
    });
    const [readyNext, setReadyNext] = useState(false);
    const [show, setShow] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [getLevel, setGetLevel] = useState(state || 0);

    const [currentBackground, setCurrentBackground] = useState(background[MathHelper.getRandomNumber(0, background.length - 1)]);

    const [correctSound] = useSound(correct);
    const [errorSound] = useSound(error);
    const [isSound, setIsSound] = useState(setting.isSound);

    // Connect with vocabulary
    const [userWords, setUserWords] = useState(null);
    const page = props.location.page;
    const group = props.location.group;

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }
        GetUserWords({ userId }, token, setUserWords);
    }, [isAuthenticated]);

    // Connect with vocabulary

    useEffect(() => {
        if (data.length === 0) getWords();
    }, [])

    useEffect(() => {
        if (Array.isArray(data) && data.length) {
            setCurrentSample(getCurrentWords());
        }
    }, [data])

    useEffect(() => {
        if (level !== 0) setCurrentSample(getCurrentWords());
        if (level === WORDS_LIMIT.maxWordAmount) {
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
            setIsEnd(true);
        }
    }, [level])

    const getCurrentWords = () => {
        const arr = [data[level]];
        while (arr.length !== 4) {
            const item = data[Math.floor(Math.random() * data.length)];
            if (!arr.includes(item)) {
                arr.push(item);
            }
        }
        return arr;
    }

    const getWords = useCallback(
        async () => {
            try {
                const words = await request(`/words/?page=${MathHelper.getRandomNumber(0, WORDS_LIMIT.maxPages)}&group=${getLevel}`, 'GET', null, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                })
                setData(words);
            } catch (e) {

            }
        },
        [request]
    )

    const handleClick = (isCorrect) => {
        if (readyNext) return;
        if (isCorrect) {
            if (isSound) correctSound();
            setAnswers({...answers, correct: [...answers.correct, currentSample[0]]});

            setStatistic(currentSample[0], auth.userId || null, auth.token || null);
        } else {
            if (isSound) errorSound();
            setAnswers({...answers, unCorrect: [...answers.unCorrect, currentSample[0]]});
        }

        setReadyNext(true);
    }

    const goNext = () => {
        setShow(false);
        setTimeout(() => {
            setLevel(prev => prev + 1);
            setReadyNext(false);
            setShow(true);
        }, 500)
    }

    const setHardDif = (e) => {
        UpdateUserWord({
            userId: userId,
            wordId: e.target.getAttribute('wordid'),
            word: { difficulty: 'hard' }
        }, token);
    };

    if (isEnd) {
        return (
            <div className={'audiocall-promo__wrapper'} style={{backgroundImage: `url(${currentBackground})`}}>
                <FinalScreen value={{answers, setHardDif, isFromTextBook}}/>
            </div>
        )
    } else {
        return (
            <div className='audiocall-promo__wrapper' style={{backgroundImage: `url(${currentBackground})`}}>
                <Roll right>
                    <Flip left when={show}>
                        <div className="row audiocall-wrapper">
                            <div className="col s12 m12 card-main-audiocall">
                                <div className="card darken-1">
                                    <div className="card-content white-text">
                                        {
                                            currentSample.length > 0 && (
                                            <GameElement
                                                sample={currentSample}
                                                level={level}
                                                handleClick={handleClick}
                                                readyNext={readyNext}/>
                                                )
                                        }
                                    </div>
                                    <div className="card-action">
                                        <NavLink to='/games/audiocall'>
                                            <button className="word-btn btn waves-effect waves-light red lighten-2" type="submit" name="action">Выход
                                                <i className="material-icons left">arrow_back</i>
                                            </button>
                                        </NavLink>
                                        {
                                            readyNext ? (
                                                <button className="btn word-btn" onClick={goNext}>
                                                    <i className="material-icons">forward</i>
                                                </button>
                                            ) : (
                                                <button className="btn word-btn" onClick={() => {
                                                    handleClick(false);
                                                }}>Я не знаю</button>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Flip>
                </Roll>
                <button className={`audiocall__sound-btn btn ${!isSound && 'red lighten-2'}`} onClick={() => setIsSound(!isSound)}>
                    <i className="material-icons">music_note</i>
                </button>
            </div>
        )
    }
}

export default GameAudiocall;
