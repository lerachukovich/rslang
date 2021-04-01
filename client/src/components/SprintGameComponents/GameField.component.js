import React, {useCallback, useEffect, useState} from "react";
import GameTimer from "./GameTimer.component";
import useHttp from "../../hooks/http.hook";
import {NavLink} from "react-router-dom";

const GameField = () => {
    const {request} = useHttp();

    const [data, setData] = useState([]);
    const [word, setWord] = useState('');
    const [translate, setTranslate] = useState('');
    const [img, setImg] = useState(null);

    useEffect(() => {
        console.log(data);
        getWords();
    }, [])


    const getWords = useCallback(
        async () => {
            try {
                const words = await request('/words?page=2&group=2', 'GET', null, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                })
                setData(words);
                setWord(words[0].word);
                setTranslate(words[0].wordTranslate);
                setImg(words[0].image);
            } catch (e) {
                console.log(e)
            }
        },
        [request]
    )



    return (
        <div className='game-container'>
            <GameTimer />

            <p>{word}{translate}</p>

            <div className="buttons">
                <NavLink to='/games/sprint'>
                    <button className="btn btn-large waves-effect waves-light" type="submit" name="action">Выход
                        <i className="material-icons left">arrow_back</i>
                    </button>
                </NavLink>
                <button className='btn btn-large waves-effect green'>Правильно</button>
                <button className='btn btn-large waves-effect red'>Не правильно</button>
            </div>
        </div>
    )
}

export default GameField;
