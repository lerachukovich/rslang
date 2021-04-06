import React, { useState } from 'react';
import Storage from '../../helper/Storage';
import './Statistic.scss';

const StatisticToday = () => {
    const [words, setWords] = useState(Storage.getStorage('statistic') || []);
    
    const playSound = url => {
        const audio = new Audio(`/${url}`);
        audio.play();
    }

    console.log(words)

    return (
        <div>
            {words.length === 0 ? (
                <h1>Сегодня Вы ещё ничего не изучили</h1>
            ) : (
                <>
                <h3>За сегодня Вы изучили: {words.length} слов</h3>
                <ul className="collection">
                    {
                        words.map((word, idx) => {
                            return (
                                <li className="collection-item" key={idx}>
                                    <i className="small material-icons" onClick={playSound.bind(null, word.audio)}>volume_up</i>
                                    <span>{word.word}</span>
                                    <span>{word.transcription}</span>
                                    <span>{word.wordTranslate}</span>
                                </li>
                            )
                        })
                    }
                </ul>
                </>
            )
            }
        </div>
    )
}

export default StatisticToday;
