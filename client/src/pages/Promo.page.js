import React from 'react'
import '../styles/Promo.page.scss'
import top from '../assets/top.png'
import PromoCard from "../components/PromoPageComponents/Card.component";

const PromoPage = () => {
    return (
        <div className='promo'>
            <div className='top'>
                <div>
                    <h1>RS Lang</h1>
                    <p className='promo-text'>
                        Готовы начать изучать английский язык или расширить свои языковые навыки? Если так, то RS
                        Lang для тебя! Мы предлагаем инструменты и ресурсы, необходимые для того, чтобы сделать
                        изучение языка легким и увлекательным.
                    </p>
                </div>
                <img className='top-img' src={top} alt="illustration"/>
            </div>
            <div className="features">
                <h2 className='title'>Почему мы?</h2>
                <p className='features-text'>Мы считаем, что изучение английского языка должно быть увлекательным и доступным для всех.</p>
                <PromoCard />
            </div>
            <div className='video'>
                <iframe width={'100%'} height={'500px'} style={{borderRadius: '20px'}}
                        src="https://www.youtube.com/embed/gjbpKBgmnNM">
                </iframe>
            </div>
        </div>
    )
}

export default PromoPage;
