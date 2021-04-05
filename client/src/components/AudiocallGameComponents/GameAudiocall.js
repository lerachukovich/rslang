import React, { useCallback, useEffect, useState } from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import useHttp from '../../hooks/http.hook';
import GameElement from './GameElement';
import FinalScreen from './FinalScreen';
import MathHelper from '../../helper/Math.helper';
import Storage from '../../helper/Storage';
import useSound from 'use-sound';
import error from '../../assets/audio/error.mp3';
import correct from '../../assets/audio/correct.mp3';

import Flip from 'react-reveal/Flip';
import Roll from 'react-reveal/Roll';

import bg1 from '../../assets/audiocall/bg-call-1.jpg';
import bg2 from '../../assets/audiocall/bg-call-2.jpg';
import bg3 from '../../assets/audiocall/bg-call-3.jpg';

const GameAudiocall = () => {

    const WORDS_LIMIT = {
        maxPages: 29,
        maxGroup: 5,
        maxWordAmount: 19
    };

    const background = [bg1, bg2, bg3]

    const props = useHistory();
    const {state, wordsCollection} = props.location;
    const [level, setLevel] = useState(0);
    const [data, setData] = useState(wordsCollection || []);
    const {request} = useHttp();
    const [currentSample, setCurrentSample] = useState([]);
    const history = useHistory();
    const [answers, setAnswers] = useState({
        correct: [],
        mistake: []
    });
    const [readyNext, setReadyNext] = useState(false);
    const [show, setShow] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [getLevel, setGetLevel] = useState(state || 0);

    const [currentBackground, setCurrentBackground] = useState(background[MathHelper.getRandomNumber(0, background.length - 1)]);

    const [correctSound] = useSound(correct);
    const [errorSound] = useSound(error);
    const [isSound, setIsSound] = useState(true);

    useEffect(() => {
        if (data.length === 0) getWords();
    }, [])

    useEffect(() => {
        if (Array.isArray(data) && data.length) {
            setCurrentSample(getCurrentWords());
        }
    }, [data])

    useEffect(() => {
        if (level !== 0) setCurrentSample(getCurrentWords())
        // if (level === 20) return history.push('/games/audiocall/statistic', answers);
        if (level === 10) setIsEnd(true);
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

            Storage.setSettingStorage(currentSample[0]);
        } else {
            if (isSound) errorSound();
            setAnswers({...answers, mistake: [...answers.mistake, currentSample[0]]});
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

    if (isEnd) {
        return (
            <div className={'audiocall-promo__wrapper'} style={{backgroundImage: `url(${currentBackground})`}}>
                <FinalScreen value={answers}/>
            </div>
        )
    } else {
        return (
            <div className='audiocall-promo__wrapper' style={{backgroundImage: `url(${currentBackground})`}}>
                <Roll right>
                    <Flip left when={show}>
                        <div className="row audiocall-wrapper">
                            <div className="col s12 m12 card-main-audiocall">
                                <div className="card blue-grey darken-1">
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
                                            <button className="btn waves-effect waves-light red lighten-2" type="submit" name="action">Выход
                                                <i className="material-icons left">arrow_back</i>                                
                                            </button>
                                        </NavLink>
                                        {
                                            readyNext ? (
                                                <button className="btn" onClick={goNext}>
                                                    <i className="material-icons">forward</i>
                                                </button>
                                            ) : (
                                                <button className="btn" onClick={() => {
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
                <button className={`savanna__sound-control btn ${!isSound && 'red lighten-2'}`} onClick={() => setIsSound(!isSound)}>
                    <i className="material-icons">music_note</i>
                </button>
            </div>
        )
    }
}

export default GameAudiocall;
