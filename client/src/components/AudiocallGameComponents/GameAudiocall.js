import React, { useCallback, useEffect, useState } from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import useHttp from '../../hooks/http.hook';
import GameElement from './GameElement';
import FinalScreen from './FinalScreen';
import MathHelper from '../../helper/Math.helper';
import Storage from '../../helper/Storage';
import Flip from 'react-reveal/Flip';
import Roll from 'react-reveal/Roll';


const WORDS_LIMIT = {
    maxPages: 29,
    maxGroup: 5,
    maxWordAmount: 19
  };

const GameAudiocall = () => {
    const props = useHistory();
    const {state} = props.location;
    const [level, setLevel] = useState(0);
    const [data, setData] = useState([]);
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

    useEffect(() => {
        getWords();
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

    // const unique = (arr, item) => {
    //     for (let i of arr) {
    //         if (i.word === item.word) return arr
    //     }
    //     return [...arr, item]
    // }

    const handleClick = (isCorrect) => {
        if (readyNext) return;
        if (isCorrect) {
            setAnswers({...answers, correct: [...answers.correct, currentSample[0]]});

            // Storage.setStorage('statistic', unique(Storage.getStorage('statistic'), currentSample[0]));
            Storage.setSettingStorage(currentSample[0]);
        } else {
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
            <div className={'savanna-wrapper'}>
                <FinalScreen value={answers}/>
            </div>
        )
    } else {
        return (
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
        )
    }
}

export default GameAudiocall;
