import React, {useCallback, useEffect, useState} from "react";
import useHttp from "../../hooks/http.hook";
import useSound from "use-sound";
import {NavLink} from "react-router-dom";
import './Sprint.scss';
import error from '../../assets/audio/error.mp3';
import correct from '../../assets/audio/correct.mp3';
import GameResult from "./Result";
import bg1 from '../../assets/own-game-bg/own-game-bg-1.jpg';
import bg2 from '../../assets/own-game-bg/own-game-bg-2.jpg';
import bg3 from '../../assets/own-game-bg/own-game-bg-3.jpg';
import bg4 from '../../assets/own-game-bg/own-game-bg-4.jpg';
import MathHelper from "../../helper/Math.helper";

const GameField = () => {
    const background = [bg1, bg2, bg3, bg4];
    const [currentBackground, setCurrentBackground] = useState(background[MathHelper.getRandomNumber(0, background.length - 1)]);
    const {request} = useHttp();
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const [words, setWords] = useState([])
    const [currentWord, setCurrentWord] = useState('');
    const [currentTranslate, setCurrentTranslate] = useState('');
    const [score, setScore] = useState(0);
    const [gameTimer, setGameTimer] = useState(60);
    const [endGame, setEndGame] = useState(false);

    const [answers, setAnswers] = useState({
        correct: [],
        wrong: []
    })

    const [correctSound] = useSound(correct);
    const [errorSound] = useSound(error);


    useEffect(() => {
        console.log(data);
        getWords();
    }, [])

    useEffect(() => {
        if (index === data.length - 1) setEndGame(true);
    }, [index]);

    useEffect(() => {
            if (Array.isArray(data) && data.length) {
                let result = [[], []];
                data.map(el => {
                    result[0].push(el.word);
                    result[1].push(el.wordTranslate);
                })
                setWords(result)
            }
        }
        , [data])

    const getWords = useCallback(
        async () => {
            try {
                const words = await request('/words?page=2&group=2', 'GET', null, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                })
                setData(words);
            } catch (e) {
                console.log(e)
            }
        },
        [request]
    )

    const showWord = () => {
        if (Date.now() % 2) {
            setCurrentWord(words[0][index]);
            setCurrentTranslate(words[1][index]);
        } else {
            setCurrentWord(words[0][index])
            setCurrentTranslate(words[1][index + 1]);
        }
        console.log("foo", words)
    }

    const handleClick = (userAnswer) => {
        showWord();
        isCorrect(userAnswer);
    }

    const isCorrect = (answer) => {
        if (words[1][words[0].indexOf(currentWord)] === currentTranslate && answer) {
            setScore(score + 10);
            correctSound();
            setAnswers({...answers, correct: [...answers.correct, [currentWord, currentTranslate]]})
        } else if (words[1][words[0].indexOf(currentWord)] !== currentTranslate && !answer) {
            setScore(score + 10);
            correctSound();
            setAnswers({...answers, correct: [...answers.correct, [currentWord, currentTranslate]]})
        } else {
            errorSound();
            setAnswers({...answers, wrong: [...answers.wrong, [currentWord, currentTranslate]]})
        }
    }


    const tick = () => {
        setInterval(() => {
            setGameTimer(prev => prev > 0 ? prev - 1 : setEndGame(true));
        }, 1000)
    }

    if (endGame) {
        return (
            <GameResult score={score} value={answers}/>
        )
    } else {
        return (
            <div className='sprint-container' style={{backgroundImage: `url(${currentBackground})`}}>
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
                            setIndex(prev => prev + 1)
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

                    <div className="buttons">
                        <button onClick={() => {
                            handleClick(true);
                            setIndex(prev => ++prev);
                        }} className='btn btn-large waves-effect correct-btn'>Правильно
                        </button>
                        <button onClick={() => {
                            handleClick(false);
                            setIndex(prev => ++prev);
                        }} className='btn btn-large waves-effect wrong-btn'>Не правильно
                        </button>
                    </div>
                </div>
                <div className={'empty'}>.</div>
            </div>
        )
    }


}

export default GameField;
