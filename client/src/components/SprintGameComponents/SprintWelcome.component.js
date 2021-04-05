import React from "react";
import {NavLink} from "react-router-dom";

const SprintWelcome = () => {
    return (
        <div className='game-card'>
            <div className='card-content'>
                <h4>Игра Спринт</h4>
                <p className='game-text'>У тебя есть 20 слов и ровно одна минута, чтобы проверить свои знания.
                    Угадывай перевод слов и зарабатывай очки!</p>
            </div>
            <div className='card-action'>
                <NavLink to='/games'>
                    <button className="btn waves-effect waves-light" type="submit" name="action">Выход
                        <i className="material-icons left">arrow_back</i>
                    </button>
                </NavLink>
                <NavLink to='/games/sprint/playing'>
                    <button className="btn waves-effect waves-light pulse" type="submit" name="action">Начать игру
                        <i className="material-icons right">exit_to_app</i>
                    </button>
                </NavLink>

            </div>
        </div>
    )
}

export default SprintWelcome;
