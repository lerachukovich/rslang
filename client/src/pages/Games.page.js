import React from 'react';
import '../styles/Games.page.scss';
import img1 from '../assets/game1.png';
import img2 from '../assets/game2.png';
import img3 from '../assets/game3.png';
import img4 from '../assets/game4.png';
import {NavLink} from "react-router-dom";


const GamesPage = () => {
    const games = [
        {
            name: 'Саванна',
            text: 'Игра “Саванна” – это тренажер по переводу твоего пассивного изученного словаря в активную стадию. ' +
                'Все это происходит за счет вовлечения реакции в процесс перевода. ' +
                'Тренируйся регулярно и сможешь на лету подбирать правильные слова при письме и в процессе говорения.',
            img_source: img1,
            url: '/games/savanna'
        },
        {
            name: 'Аудиовызов',
            text: 'Аудирование для многих, пожалуй, самый сложный навык. ' +
            'Игра "Аудиовызов" делает упор только на восприятие и перевод. ' +
                'С каждым подходом к этой «аудиоштанге» ты будешь все лучше и лучше понимать английскую речь и, не задумываясь, переводить сказанное на родной язык.',
            img_source: img2,
            url: '/games/audiocall'
        },
        {
            name: 'Спринт',
            text: 'Игра "Спринт" помогает взбодриться и вспомнить любые слова из твоего словаря, независимо от стадии их изученности.',
            img_source: img3,
            url: '/games/sprint'
        },
        {
            name: 'Своя игра',
            text: 'Описание своей игры',
            img_source: img4,
            url: ''
        },
    ]


  return(
    <div className='games'>
      <h1 className='games-title'>Наши игры</h1>
        <div className='games-container'>
            {
                games.map(game => {
                    return <div className='game-card'>
                        <NavLink className='game-name' to={game.url}>{game.name}</NavLink>
                        <img className='game-img' src={game.img_source} alt="game image"/>
                        <p>{game.text}</p>
                    </div>
                })
            }
        </div>
    </div>
  )
}

export default GamesPage;
