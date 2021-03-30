import React from 'react';
import { NavLink } from 'react-router-dom';
import './Audiocall.scss';

const Audiocall = () => {
    return (
        <div className="row">
            <div className="col s12 m8">
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Аудиовызов</span>
                        <p>В этой игре будут звучать английские слова. Кликните на правильный перевод прозвучавшего слова. Чтобы услышать слово ещё раз, нажмите на изображение рупора.</p>
                    </div>
                    <div className="card-action">
                        <NavLink to='/games'>
                            <button className="btn waves-effect waves-light" type="submit" name="action">Назад
                                <i className="material-icons left">arrow_back</i>                                
                            </button>
                        </NavLink>
                        <NavLink to="/games/audiocall/playing">
                            <button className="btn waves-effect waves-light" type="submit" name="action">Начать игру
                                <i className="material-icons right">exit_to_app</i>
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Audiocall;
