import React from 'react';
import '../styles/Credits.page.scss';
import DeveloperCard from "../components/CreditsPageComponents/Card.component";

const CreditsPage = () => {
  return(
    <div className='developers'>
      <h1 className='dev-title'>Наши разработчики</h1>
        <DeveloperCard />
    </div>
  )
}

export default CreditsPage;
