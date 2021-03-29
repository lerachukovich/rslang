import React from "react";
import './Card.component.scss'
import lera from '../../assets/lera.png';
import alex from '../../assets/alex.png';
import olga from '../../assets/olga.png';
import oleg from '../../assets/oleg.png';


const DeveloperCard = () => {
    const developers = [
        {
            name: 'Алексей',
            text: 'Бэкэнд, игра Аудиовызов, авторизация',
            img_source: alex
        },
        {
            name: 'Лера',
            text: 'Игра Спринт, настройка первоначального стэйта проекта, дизайн',
            img_source: lera
        },
        {
            name: 'Олег',
            text: 'Роутинг, Игра Саванна',
            img_source: oleg
        },
        {
            name: 'Ольга',
            text: 'Учебник, своя игра',
            img_source: olga
        }
    ]
    return (
        <div className='dev-container'>
            {
                developers.map(dev => {
                    return <div className='dev-card'>
                        <img className='dev-img' src={dev.img_source} alt="developer"/>
                        <h3>{dev.name}</h3>
                        <p>{dev.text}</p>
                    </div>
                })
            }
        </div>
    )
}

export default DeveloperCard;
