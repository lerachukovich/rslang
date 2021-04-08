import React, { useState, useContext, useEffect, useCallback } from 'react';
import Storage from '../../helper/Storage';
import './Statistic.scss';
import {AuthContext} from '../../context/AuthContext';

const StatisticToday = () => {
    const auth = useContext(AuthContext);
    const [words, setWords] = useState([]);
    
    const playSound = url => {
        const audio = new Audio(`/${url}`);
        audio.play();
    }

    useEffect(() => {
        auth.isAuthenticated ? getWords() : setWords(Storage.getStorage('statistic'));
    }, [])

    const getWords = useCallback(
        async () => {
            try {
                const response = await fetch(`/users/${auth.userId}/statistics`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                // setWords(response)
                const today = new Date().toString();
                const content = await response.json();
                setWords(content.learnedWords.map(item => {
                    if (item.date.slice(0, 15) === today.slice(0, 15)) return item.word
                }));
                // console.log(content.learnedWords)
            } catch (e) {
                
            }
        }, []
    )

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
