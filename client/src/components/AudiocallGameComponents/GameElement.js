import React, { createRef, useEffect, useState} from 'react';
import Tada from 'react-reveal/Tada';

const GameElement = ({sample, level, handleClick, readyNext}) => {
    const answer = sample[0];
    const [sampleWords, setSampleWords] = useState([]);
    const Ref = createRef();

    useEffect(() => {
        playSound(answer.audio);
        setSampleWords(shuffle(sample));
    }, [sample])

    useEffect(() => {
        window.addEventListener('keydown', (e) => boardHandle(e, Ref));
        return () => {
            window.removeEventListener('keydown', (e) => boardHandle(e, Ref))
        }
    }, [])

    const shuffle = arr => {
        const newArr = arr.slice();
        newArr.map(item => item.isMistake = false);
        return newArr.sort(() => Math.random() - 0.5);
    }

    const playSound = url => {
        const audio = new Audio(`/${url}`);
        audio.play();
    }

    const boardHandle = (e) => {
        const elements = document.querySelector('.card-words').childNodes;
        elements.forEach(elem => {
            if (elem.id === e.key) elem.click();
        })
    }

    return (
        <>
        <div className="card-content">
            <button className="btn-floating btn-large pulse" onClick={playSound.bind(null, answer.audio)}>
                <i className="material-icons large">volume_up</i>
            </button>
        </div>
        <div ref={Ref} className="card-action card-words">
            {
                sampleWords.map((item, index) => {
                    if (item.wordTranslate === answer.wordTranslate) {
                        return (
                            <Tada spy={handleClick}>
                                <button key={index} id={index + 1} className={`btn btn-large waves-effect ${readyNext && 'green darken-3'}`} onClick={() => {
                                    handleClick(true);
                                }}>
                                    {index + 1} {item.wordTranslate}
                                </button>
                            </Tada>
                        )
                    } else return (
                        <button key={index} id={index + 1} className={`btn btn-large waves-effect ${item.isMistake && 'red'}`} onClick={() => {
                            item.isMistake = true;
                            handleClick(false)
                        }}>{index + 1} {item.wordTranslate}</button>
                        )
                })
            }
        </div>
        </>
    )
}

export default GameElement;
