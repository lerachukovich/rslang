import React from 'react';
import {NavLink} from "react-router-dom";

const GameResult = ({ value, score }) => {
    return (
        <div className={'sprint'}>
            <h2 className={'savanna__final-screen__title sprint__result-score'}> Ваш счет {score} очков!</h2>
            <b>Я знаю <span className={'savanna__final-screen__count correct'}>{value.correct.length}</span></b>
            <ul>
                {
                    value.correct.map(el => {
                        return <li className={'savanna-final-screen__word'}>{el.word} - {el.wordTranslate}</li>
                    })
                }
            </ul>
            <b>Я не знаю <span className={'savanna__final-screen__count uncorrect'}>{value.unCorrect.length}</span></b>
            <ul>
                {
                    value.unCorrect.map(el => {
                        return <li className={'savanna-final-screen__word'}>{el.word} - {el.wordTranslate}</li>
                    })
                }
            </ul>
            <NavLink to='/games'>
                <button className="btn waves-effect waves-light final-btn" type="submit" name="action">Вернуться к играм
                    <i className="material-icons left">arrow_back</i>
                </button>
            </NavLink>
        </div>
    )
}

export default GameResult;
