import React, { useState, useEffect, useCallback, useContext } from 'react';
import {SettingContext} from '../../context/SettingContext';
import './Statistic.scss';

const StatisticToday = (props) => {
    const [words, setWords] = useState([]);
    const setting = useContext(SettingContext)

    const playSound = url => {
        const audio = new Audio(`/${url}`);
        audio.play();
    }

    useEffect(() => {
        setWords(props.words)
    }, [props.words])

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
                                    <i className="small material-icons audio-icon" onClick={playSound.bind(null, word.audio)}>volume_up</i>
                                    <span>{word.word} -</span><span>{word.transcription}</span>{setting.showTranslate && (
                                        <span> - {word.wordTranslate}</span>
                                    )}
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
