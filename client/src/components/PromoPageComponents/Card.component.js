import React from "react";
import './Card.component.scss';
import online from '../../assets/online.svg';
import games from '../../assets/games.svg';
import statistic from '../../assets/statistic.svg';
import vocabulary from '../../assets/vocabulary.svg';




const PromoCard = () => {
    const features = [
        {
            title: 'Онлайн обучение',
            text: 'Доступность занятий в любое время и в любом месте.',
            img_source: online
        },
        {
            title: 'Игры',
            text: 'Обучение в игре. Вам доступны 4 увлекательные игры, которые помогут лучше запоминать слова, ' +
                'а также воспринимать английский язык на слух.',
            img_source: games
        },
        {
            title: 'Словарь',
            text: 'Создание словаря пополнит ваш словарный запас, а также нацелит вас на слова которые требуют повторения и большей практики.',
            img_source: vocabulary
        },
        {
            title: 'Статистика',
            text: 'Выпоняйте задания и отслеживайте свой прогресс.',
            img_source: statistic
        }
    ]

    return (
        <div className='cards-container'>
            {
                features.map((card ,ind )=> {
                    return <div className='promo-card' key={ind}>
                        <h4>{card.title}</h4>
                        <img className='top-img' src={card.img_source} alt='card icon'/>
                        <p className='card-text'>{card.text}</p>
                    </div>
                })
            }
        </div>
    )
}

export default PromoCard;
