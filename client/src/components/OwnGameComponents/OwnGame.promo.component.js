import React, {useState} from 'react';
import './own-game.scss';
import {Link} from 'react-router-dom';
import bg1 from '../../assets/own-game-bg/own-game-bg-1.jpg';
import bg2 from '../../assets/own-game-bg/own-game-bg-2.jpg';
import bg3 from '../../assets/own-game-bg/own-game-bg-3.jpg';
import bg4 from '../../assets/own-game-bg/own-game-bg-4.jpg';
import MathHelper from '../../helper/Math.helper';

const OwnGamePromo = () => {
    const backgrounds = [bg1, bg2, bg3, bg4];
    const [currentBackground, setCurrentBackground] = useState(backgrounds[MathHelper.getRandomNumber(0, backgrounds.length - 1)]);
    return (
        <div>
            <div className={'savanna-promo__wrapper'} style={{backgroundImage: `url(${currentBackground})`}}>
            <h1 className={'savanna-promo__title'}>Расставь слова</h1>
            <p className={"savanna-promo__depict"}>Расставь слова - игра, в которой вам нужно будет вставить в пропущенное в предложении место нужное слово – причем варианты могут быть созвучны и похожи. Это позволит вам осваивать новую лексику и не путаться в похожих фразах, если они встречаются в языке.</p>
            <p className={"savanna-promo__tutorial"}>После запуска игры вы увидите предложение с пропущенным словом на английском языке, а также 4 варианта ответа. Ваша задача - внимательно прочитать предложение и из предложенных вариантов слов выбрать наиболеее подходящее по смыслу для того, чтобы завершить предложение. </p>
            <ul className={"savanna-promo__tutorial__rules"}>
            <li>1. Кликните по нему мышью;</li>
            <li>2. Используйте клавиши 1, 2, 3, 4.</li>
            </ul>
            <Link to={'/games/owngame/play'} className={'waves-effect waves-light btn pulse'}>Играть</Link>
        </div>
        </div>

    )

}

export default OwnGamePromo;
