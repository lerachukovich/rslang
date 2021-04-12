import React, {useState} from 'react';
import { NavLink } from 'react-router-dom';
import MathHelper from '../../helper/Math.helper';
import './Audiocall.scss';

import bg1 from '../../assets/audiocall/bg-call-1.jpg';
import bg2 from '../../assets/audiocall/bg-call-2.jpg';
import bg3 from '../../assets/audiocall/bg-call-3.jpg';

const Audiocall = () => {
    const background = [bg1, bg2, bg3]

    const [currentBackground, setCurrentBackground] = useState(background[MathHelper.getRandomNumber(0, background.length - 1)])

    return (
        <div className='audiocall-promo__wrapper' style={{backgroundImage: `url(${currentBackground})`}}>
            <div className="row audiocall-wrapper">
                <div className="col s12 m12 card-main-audiocall">
                    <div className="card darken-1">
                        <div className="card-content">
                            <span className="card-title">Аудиовызов</span>
                            <p>В этой игре будут звучать английские слова. Кликните на правильный перевод прозвучавшего слова. Чтобы услышать слово ещё раз, нажмите на изображение рупора.</p>
                            <p>Так же для выбора слова из списка используйте клавиши 1, 2, 3, 4</p>
                            <p>Кликните "Я не знаю" для отображения правильного ответа</p>
                        </div>
                        <div className="card-get_level">
                            <div className="card-content">
                                <span className="card-level">Выберите сложность:</span>
                            </div>
                            <div className="card-action">
                                {new Array(6).fill().map((_, idx) => (
                                    <NavLink to={{pathname: "/games/audiocall/playing", state: idx}} key={idx}>
                                        <button className="btn waves-effect waves-light level-btn" type="submit" name="action">Уровень: {idx + 1}
                                            <i className="material-icons right">exit_to_app</i>
                                        </button>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Audiocall;
