import React from 'react';
import { Link } from 'react-router-dom';

const FinalScreen = ({ correctAnswers, wrongAnswers, wordCollection, soundHandler }) => {
    const getWordTranslation = (word) => {
        const wordInfo = wordCollection.find(item => item.word === word );
        return wordInfo.wordTranslate;
    };

    const getWordAudio = (word) => {
        const wordInfo = wordCollection.find(item => item.word === word );
        return wordInfo.audio;
    };

  return (
    <div className={'savanna__final-screen-wrapper'}>
      <h2 className={'savanna__final-screen__title'}>Статистика игры</h2>
      <b>Я знаю <span className={'savanna__final-screen__count correct'}>{correctAnswers.length}</span></b>
      <ul>
        {correctAnswers.length === 0 &&
        <p className={'savanna_final-screen__quote'}>Блин, я ничего не знаю :(</p>}
        {correctAnswers.map((item, ind) => (
          <li className={'savanna-final-screen__word'} key={ind}>
            <button className={'btn'} onClick={() => soundHandler(getWordAudio(item))}><i className={'material-icons'}>surround_sound</i></button>
            {item} - {getWordTranslation(item)}</li>
        ))}
      </ul>
      <b>Я не знаю <span
        className={'savanna__final-screen__count uncorrect'}>{wrongAnswers.length}</span></b>
      <ul>
        {correctAnswers.length === 20 && <p>Ох, какой я красавчик :)</p>}
        {wrongAnswers.map((item, ind) => (
          <li className={'savanna-final-screen__word'} key={ind}>
            <button className={'btn'} onClick={() => soundHandler(getWordAudio(item))}><i className={'material-icons'}>surround_sound</i></button>
            {item} - {getWordTranslation(item)}</li>
        ))}
      </ul>
      <Link to="/games" className={'savanna__final-screen__next-button btn'}>Продолжить</Link>
    </div>
  );
};

export default FinalScreen;