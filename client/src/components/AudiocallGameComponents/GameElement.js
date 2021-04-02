import React, { useEffect, useState} from 'react';
import Tada from 'react-reveal/Tada';
import Bounce from 'react-reveal/Bounce';
import Wobble from 'react-reveal/Wobble';

const GameElement = ({sample, level, handleClick, readyNext}) => {
    const answer = sample[0];
    const [sampleWords, setSampleWords] = useState([]);
    const [isPlaySound, setIsPlaySound] = useState(false)
    const [isPlaySoundSecond, setIsPlaySoundSecond] = useState(false)

    useEffect(() => {
        playSound(answer.audio);
        setSampleWords(shuffle(sample));
    }, [sample])

    useEffect(() => {
        console.log(answer)
        window.addEventListener('keydown', (e) => boardHandle(e));
        return () => {
            window.removeEventListener('keydown', (e) => boardHandle(e))
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
        const elements = document.querySelector('.card-words') || null;
        if (!elements) return;
        elements.childNodes.forEach(elem => {
            if (elem.id === e.key) elem.click();
        })
    }

    return (
        <>
        <div className="card-content">
            {
                readyNext ? (
                    <Bounce top>
                        <div className="card blue-grey darken-1 card-audiocall">
                            <div className="card-image">
                                <img src={`/${answer.image}`} alt={answer.word}/>
                            </div>
                            <div className="card-content card-audiocall-content">
                                <div className="transcription">
                                    <Wobble spy={isPlaySound}>
                                        <i className="small material-icons" onClick={() => {
                                            playSound(answer.audio);
                                            setIsPlaySound(prev => !prev);
                                        }}>volume_up</i>
                                    </Wobble>
                                    <span>{answer.word}</span>
                                    <span style={{color: 'yellow'}}>{answer.transcription}</span>
                                </div>
                                <div className="example">
                                    <Wobble spy={isPlaySoundSecond}>
                                        <i className="small material-icons" onClick={() => {
                                            playSound(answer.audioExample);
                                            setIsPlaySoundSecond(prev => !prev);
                                        }}>volume_up</i>
                                    </Wobble>
                                    <div>
                                        <span dangerouslySetInnerHTML={{__html: answer.textExample}} />
                                        <span>{answer.textExampleTranslate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Bounce>
                ) : (
                    <Wobble spy={isPlaySound}>
                        <button className="btn-floating btn-large pulse" onClick={() => {
                            playSound(answer.audio);
                            setIsPlaySound(prev => !prev);
                        }}>
                            <i className="material-icons large">volume_up</i>
                        </button>
                    </Wobble>
                )
            }
        </div>
        <div className="card-action card-words">
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
