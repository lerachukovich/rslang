import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { SettingContext } from '../../context/SettingContext';
import { SoundHandler } from '../../helper/Sound.helper';

const GameResult = ({ value }) => {
  const setting = useContext(SettingContext);
  const {answers, score } = value;

  return (
    <div className={'sprint'}>
      <h2 className={'savanna__final-screen__title sprint__result-score'}> Ваш счет {score} очков!</h2>

        <b>Я знаю <span className={'savanna__final-screen__count correct'}>{answers.correct.length}</span></b>
        <ul>
          {
            answers.correct.map(el => {
              return <li className={'savanna-final-screen__word'}><button className={'btn'} onClick={() => SoundHandler(el.audio)}><i
                className={'material-icons'}>surround_sound</i></button>{el.word}{setting.showTranslate && (<span> - {el.wordTranslate}</span>)}</li>;
            })
          }
        </ul>
        <b>Я не знаю <span className={'savanna__final-screen__count uncorrect'}>{answers.unCorrect.length}</span></b>
        <ul>
          {
            answers.unCorrect.map(el => {
              return <li className={'savanna-final-screen__word'}>
                <button
                        wordid={el.id}
                        className={'btn'}
                        onClick={() => SoundHandler(el.audio)}><i
                  className={'material-icons'}>surround_sound</i>
                </button>
                {el.word}{setting.showTranslate && (<span> - {el.wordTranslate}</span>)}
                {value.isFromTextBook && <button className={'savanna__final-screen__word-list__btn--gohard'}
                        onClick={value.setHardDif}
                        wordid={el.id} title={'Переместить в сложные'}>Сложное слово
                  word</button>}
              </li>;
            })
          }
        </ul>

      <NavLink to='/games'>
        <button className="btn waves-effect waves-light final-btn" type="submit" name="action">Вернуться к играм
          <i className="material-icons left">arrow_back</i>
        </button>
      </NavLink>
    </div>
  );
};

export default GameResult;
