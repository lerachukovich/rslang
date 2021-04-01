import React from 'react';
import {Link} from 'react-router-dom';

const FinalScreen = ({ value }) => {
  console.log(value);

  const soundHandler = () => {
    console.log('Ghb')
  }

  return (
    <div className={'savanna__final-screen-wrapper'}>
      <h2 className={"savanna__final-screen__title"}>Статистика игры</h2>
      <b>Я знаю <span className={"savanna__final-screen__count correct"}>{value.answers.correct.length}</span></b>
      <ul>
        {value.answers.correct.length === 0 && <p className={"savanna_final-screen__quote"}>Блин, я ничего не знаю :(</p>}
        {value.answers.correct.map((it, ind) => (
          <li className={"savanna-final-screen__word"} key={ind}><button className={"btn"} onClick={soundHandler}><i className={"material-icons"}>surround_sound</i></button>{it.word} - {it.wordTranslate}</li>
        ))}
      </ul>
      <b>Я не знаю <span className={"savanna__final-screen__count uncorrect"}>{value.answers.unCorrect.length}</span></b>
      <ul>
        {value.answers.correct.length === 10 && <p>Ох, какой я красавчик :)</p>}
        {value.answers.unCorrect.map((it, ind) => (
          <li className={"savanna-final-screen__word"} key={ind}><button className={"btn"}><i className={"material-icons"}>surround_sound</i></button>{it.word} - {it.wordTranslate}</li>
        ))}
      </ul>
      <Link to="/games" className={"savanna__final-screen__next-button btn"}>Продолжить</Link>
    </div>
  );
};

export default FinalScreen;
