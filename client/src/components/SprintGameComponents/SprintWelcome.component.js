import React, {useState} from "react";
import {NavLink} from "react-router-dom";
import bg1 from '../../assets/own-game-bg/own-game-bg-1.jpg';
import bg2 from '../../assets/own-game-bg/own-game-bg-2.jpg';
import bg3 from '../../assets/own-game-bg/own-game-bg-3.jpg';
import bg4 from '../../assets/own-game-bg/own-game-bg-4.jpg';
import MathHelper from "../../helper/Math.helper";

const SprintWelcome = () => {
    const background = [bg1, bg2, bg3, bg4];

    const [currentBackground, setCurrentBackground] = useState(background[MathHelper.getRandomNumber(0, background.length - 1)]);


    return (
        <div className={'sprint-welcome-wrapper'} style={{backgroundImage: `url(${currentBackground})`}}>
            <div className='game-card'>
                <div className='card-content'>
                    <h1 className={'card-title'}>Игра Спринт</h1>
                    <p className='game-text'>Спринт - это игра, в которой вам нужно сравнить слово и его перевод, и решить совпадают ли они.
                        Это позволит вам освежить свои знания и понять, какие слова стоит повторить.
                        У вас есть 20 слов и ровно одна минута. Угадывайте перевод слов и зарабатывай очки!</p>
                    <p className={'game-instructions'}>После запуска игры, нажмите на кнопку "старт", и отсчет времени начнется.
                        Ваша задача - успеть перевести все 20 слов за одну минуту.</p>
                </div>
                <div className='card-action'>
                    <NavLink to='/games'>
                        <button className="word-btn btn waves-effect waves-light" type="submit" name="action">Выход
                            <i className="material-icons left">arrow_back</i>
                        </button>
                    </NavLink>
                    <NavLink to='/games/sprint/playing'>
                        <button className="word-btn btn waves-effect waves-light pulse" type="submit" name="action">Начать игру
                            <i className="material-icons start-icon right">exit_to_app</i>
                        </button>
                    </NavLink>

                </div>
            </div>
        </div>

    )
}

export default SprintWelcome;
