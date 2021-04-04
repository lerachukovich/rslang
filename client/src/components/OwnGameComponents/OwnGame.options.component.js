import React, { useEffect, useState } from 'react';

const Options = ({ options, checkAnswer, currentWrongAnswers }) => {

  return (
    <div className="savanna__word-panel">
      {options.map((item, ind) => (
        <button id={item} onClick={checkAnswer} className={`btn-large ${currentWrongAnswers.includes(item) ? 'red-bg' : 'waves-light cyan darken-3'}`} key={ind + 1}
                data={item} dataid={ind + 1}>{ind + 1} : {item}</button>
      ))}
    </div>
  );
};

export default Options;