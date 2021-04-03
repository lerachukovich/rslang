import React from 'react';
import { NavLink } from 'react-router-dom';
import './Audiocall.scss';

const Audiocall = () => {
    return (
        <div className="row audiocall-wrapper">
            <div className="col s12 m12 card-main-audiocall">
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Аудиовызов</span>
                        <p>В этой игре будут звучать английские слова. Кликните на правильный перевод прозвучавшего слова. Чтобы услышать слово ещё раз, нажмите на изображение рупора.</p>
                        <p>Так же для выбора слова из списка используйте клавиши 1, 2, 3, 4</p>
                        <p>Кликните "Я не знаю" для отображения правильного ответа</p>
                    </div>
                    <div className="card-get_level">
                        <div className="card-content">
                            <span className="card-title">Выберите сложность:</span>    
                        </div>                      
                        <div className="card-action">
                            {new Array(6).fill().map((_, idx) => (
                                <NavLink to={{pathname: "/games/audiocall/playing", state: idx}} key={idx}>
                                    <button className="btn waves-effect waves-light" type="submit" name="action">Уровень: {idx + 1}
                                        <i className="material-icons right">exit_to_app</i>
                                    </button>
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Audiocall;
