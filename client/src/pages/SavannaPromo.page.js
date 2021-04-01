import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import '../styles/SavannaPromo.scss';
import bg1 from '../assets/savanna-bg/savannabg-1.jpg';
import bg2 from '../assets/savanna-bg/savannabg-2.jpg';
import bg3 from '../assets/savanna-bg/savannabg-3.jpg';
import bg4 from '../assets/savanna-bg/savannabg-4.jpg';
import MathHelper from '../helper/Math.helper';

const SavannaPromo = () => {
  const backgrounds = [bg1, bg2, bg3, bg4];
  const [currentBackground, setCurrentBackground] = useState(backgrounds[MathHelper.getRandomNumber(0, backgrounds.length - 1)]);

  return (
    <div className={'savanna-promo__wrapper'} style={{backgroundImage: `url(${currentBackground})`}}>
      <h1 className={'savanna-promo__title'}>Саванна🦁🐒🦒</h1>
      <p className={"savanna-promo__depict"}>Мини-игра «Саванна» - это тренировка по переводу пассивного изученного словаря в активную стадию.</p>
      <p className={"savanna-promo__tutorial"}>После запуска игры вы увидите падающее слово на английском (или русском, если режим игры RU-> EN) и четыре
        варианта перевода. Выбрать правильный ответ можно двумя способами:</p>
      <ul className={"savanna-promo__tutorial__rules"}>
        <li>1. Кликните по нему мышью;</li>
        <li>2. Используйте клавиши 1, 2, 3, 4.</li>
      </ul>
      <Link to={'/games/savanna/play'} className={'waves-effect waves-light btn pulse'}>Играть</Link>
    </div>
  );
};

export default SavannaPromo;
