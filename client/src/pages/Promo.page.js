import React from 'react'
import '../styles/Promo.page.scss'
import top from '../assets/top.png'

const PromoPage = () => {
  return(
    <div className='promo'>
      <div className='top'>
          <div>
              <h1>RS Lang</h1>
              <p>Бесплатный онлайн сервис для изучения английского языка</p>
          </div>
          <img className='top-img' src={top} alt="image"/>
      </div>
    </div>
  )
}

export default PromoPage;
