import React from 'react';
import '../styles/Credits.page.scss';
import lera from '../assets/lera.jpeg';
import alex from '../assets/alex.png';
import olga from '../assets/olga.png';
import oleg from '../assets/oleg.png';

const CreditsPage = () => {
    const developers = [
        {
            name: 'Алексей',
            text: 'Бэкэнд, игра Аудиовызов, авторизация, статистика, настройки',
            img_source: alex
        },
        {
            name: 'Лера',
            text: 'Игра Спринт, настройка первоначального стэйта проекта, дизайн',
            img_source: lera
        },
        {
            name: 'Олег',
            text: 'Роутинг, Игра Саванна, учебник, словарь, дизайн UI элементов',
            img_source: oleg
        },
        {
            name: 'Ольга',
            text: 'Своя игра',
            img_source: olga
        }
    ]
  return(
    <div className='developers'>
      <h1 className='dev-title'>Наши разработчики</h1>
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
    </div>
  )
}

export default CreditsPage;
