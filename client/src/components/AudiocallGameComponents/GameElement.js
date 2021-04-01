import React, {createRef, useEffect, useRef, useState} from 'react';

const GameElement = ({sample, level, handleClick, readyNext}) => {
    const answer = sample[0];
    const [sampleWords, setSampleWords] = useState([]);

    useEffect(() => {
        playSound(answer.audio);
        setSampleWords(shuffle(sample));
    }, [sample])

    const shuffle = arr => {
        const newArr = arr.slice();
        newArr.map(item => item.isMistake = false);
        return newArr.sort(() => Math.random() - 0.5);
    }

    const playSound = url => {
        const audio = new Audio(`/${url}`);
        audio.play();
    }

    return (
        <>
        <div className="card-content">
            <button className="btn-floating btn-large waves-effect" onClick={playSound.bind(null, answer.audio)}>
                <i className="material-icons large">volume_up</i>
            </button>
        </div>
        <div className="card-action">
            {
                sampleWords.map((item, index) => {
                    if (item.wordTranslate === answer.wordTranslate) {
                        return (
                            <button key={index} className={`btn btn-large waves-effect ${readyNext && 'green darken-3'}`} onClick={handleClick.bind(null, true)}>{item.wordTranslate}</button>
                        )
                    } else return (
                        <button key={index} className={`btn btn-large waves-effect ${item.isMistake && 'red'}`} onClick={() => {
                            item.isMistake = true;
                            handleClick(false)
                        }}>{item.wordTranslate}</button>
                        )
                })
            }
        </div> 
        </>
    )
}

export default GameElement;
