import React from 'react';

const GameLevel = ({value}) => {

  return (
    <div className={"savanna__game-level__wrapper"}>
      <h1 className={"savanna__game-level__title"}>Выберите сложность:</h1>
      <div className={"savanna__game-level__button-container"}>
      {new Array(6).fill().map((it, ind) => (
        <button className={"level-btn waves-light btn-large waves-effect waves-light"} key={ind} onClick={value.getLevel} datalevel={ind + 1}>Уровень: {ind + 1}</button>
      ))}
      </div>
    </div>
  )
}

export default GameLevel;
