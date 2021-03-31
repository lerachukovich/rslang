import React, { useEffect, useState } from 'react';

const WordControl = ({ value }) => {
  const [currentSet, setCurrentSet] = useState([]);
  const [btnColor, setBtnColor] = useState(value.btnColorClass);

  useEffect(() => {
    setCurrentSet(value.currentFourWord);
  }, [value.currentFourWord]);

  useEffect(() => {
    setBtnColor(value.btnColorClass);
  }, [value.btnColorClass]);

  return (
    <div className="savanna__word-panel">
      {currentSet.map((it, ind) => (
        <button onClick={value.chooseHandler} className={btnColor} key={ind + 1}
                data={it.wordTranslate} dataid={ind + 1}>{ind + 1} : {it.wordTranslate}</button>
      ))}
    </div>
  );
};

export default WordControl;
