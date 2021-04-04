import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import useHttp from "../../hooks/http.hook";
import {NavLink} from "react-router-dom";
import './Sprint.scss'

const GameField = () => {
    const {request} = useHttp();
    const [index, setIndex] = useState(0);
    const [data, setData] = useState([]);
    const [words, setWords] = useState([])
    const [currentWord, setCurrentWord] = useState('');
    const [currentTranslate, setCurrentTranslate] = useState('');
    const [score, setScore] = useState(0);
    const [endGame, setEndGame] = useState(false);
    const [gameTimer, setGameTimer] = useState(60);


    useEffect(() => {
        console.log(data);
        getWords();
    }, [])

    useEffect(() => {
        if(index === data.length - 1) setEndGame(true);
    }, [index]);

    useEffect( () =>{
           if (Array.isArray(data) && data.length){
               let result = [[],[]];
               data.map(el => {
                   result[0].push(el.word);
                   result[1].push(el.wordTranslate);
               })
               // console.log('result', result, "data", data);
               setWords(result)
           }
        }
    ,[data])

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
        if(Date.now() % 2) {
            setCurrentWord(words[0][index]);
            setCurrentTranslate(words[1][index]);
        } else {
            setCurrentWord(words[0][index])
            setCurrentTranslate(words[1][index]);
        }
        console.log("foo",words)
    }

    const handleClick = (userAnswer) => {
        showWord();
        isCorrect(userAnswer);
    }

    const isCorrect = (answer) => {
        if (words[1][words[0].indexOf(currentWord)] === currentTranslate && answer){
            setScore(prev => prev + 10);
        } else if (words[1][words[0].indexOf(currentWord)] !== currentTranslate && !answer) {
            setScore(prev => prev + 10);
        }
    }


    const tick = () => {
        setInterval(() => {
            setGameTimer(prev => prev > 0 ? prev - 1 : setEndGame(true));
        }, 1000)
    }

    if(endGame) {
        return (
            <div>
                <p>END GAME</p>
                <p> Ты набрал {score} очков!</p>
                <NavLink to='/games'>
                    <button className="btn waves-effect waves-light" type="submit" name="action">Вернуться к играм
                        <i className="material-icons left">arrow_back</i>
                    </button>
                </NavLink>
            </div>
        )
    } else {
        return (
            <div className='sprint-container'>
            <div className='game-card'>
                <div className='card-content'>
                    <h4>Игра Спринт</h4>
                    <p className='game-text'>У тебя есть ровно одна минута, чтобы проверить свои знания. Угадывай перевод слов и зарабатывай очки!</p>
                </div>
                <div className='card-action'>
                    <NavLink to='/games'>
                        <button className="btn waves-effect waves-light" type="submit" name="action">Выход
                            <i className="material-icons left">arrow_back</i>
                        </button>
                    </NavLink>
                        <button onClick={() => {
                            tick();
                            showWord();
                        }} className="btn waves-effect waves-light" type="submit" name="action">Начать игру
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
                    }} className='btn btn-large waves-effect green'>Правильно</button>
                    <button onClick={() => {
                        handleClick(false);
                        setIndex(prev => ++prev);
                    }} className='btn btn-large waves-effect red'>Не правильно</button>
                </div>
            </div>
                </div>
        )
    }


}

export default GameField;
