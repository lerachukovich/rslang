import React, {useCallback, useEffect, useState} from "react";
import GameTimer from "./GameTimer.component";
import useHttp from "../../hooks/http.hook";
import {NavLink, useHistory} from "react-router-dom";

const GameField = () => {
    const {request} = useHttp();

    const [data, setData] = useState([]);

    useEffect(() => {
        getWords();
        console.log(data);
    }, [])


    const getWords = useCallback(
        async () => {
            try {
                const words = await request('/words', 'GET', null, {
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



    return (
        <div className='game-container'>
            <GameTimer />


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
