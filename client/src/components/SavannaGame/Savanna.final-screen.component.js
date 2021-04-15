import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingContext } from '../../context/SettingContext';

const FinalScreen = ({ value }) => {
  const setting = useContext(SettingContext);

  return (
    <div className={'savanna__final-screen-wrapper'}>
      <h2 className={'savanna__final-screen__title'}>Статистика игры</h2>
      <div className="savanna__final-screen__word-list">
        <b>Я знаю <span className={'savanna__final-screen__count correct'}>{value.answers.correct.length}</span></b>
        <ul>
          {value.answers.correct.length === 0 &&
          <p className={'savanna_final-screen__quote'}>Блин, я ничего не знаю :(</p>}
          {value.answers.correct.map((it, ind) => (
            <li className={'savanna-final-screen__word'} key={ind}>
              <button className={'btn'} onClick={() => value.soundHandler(it.audio)}><i
                className={'material-icons'}>surround_sound</i></button>
              {it.word}{setting.showTranslate && <span>- {it.wordTranslate}</span>}</li>
          ))}
        </ul>
        <b>Я не знаю <span
          className={'savanna__final-screen__count uncorrect'}>{value.answers.unCorrect.length}</span></b>
        <ul>
          {value.answers.correct.length === 10 &&
          <p className={'savanna_final-screen__quote'}>Ох, какой я красавчик :)</p>}
          {value.answers.unCorrect.map((it, ind) => (
            <li className={'savanna-final-screen__word'} key={ind}>
              <button className={'btn'} onClick={() => value.soundHandler(it.audio)}><i
                className={'material-icons'}>surround_sound</i></button>
              {it.word}{setting.showTranslate && <span>- {it.wordTranslate}</span>}
              {value.isFromTextBook &&
              <button className={'savanna__final-screen__word-list__btn--gohard'} onClick={value.setHardDif}
                      wordid={it.id} title={'Переместить в сложные'}>Сложное слово
              </button>}
            </li>
          ))}
        </ul>
      </div>
      {value.isFromTextBook && <Link to="/textbook/0/0" className={'savanna__final-screen__next-button btn'}>Продолжить</Link>}
      {!value.isFromTextBook && <Link to="/games" className={'savanna__final-screen__next-button btn'}>Продолжить</Link>}
    </div>
  );
};

export default FinalScreen;
