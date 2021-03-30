import React, { useCallback, useEffect, useState } from 'react';
import {NavLink} from 'react-router-dom';
import useHttp from '../../hooks/http.hook';
import GameElement from './GameElement';

const GameAudiocall = () => {
    const [level, setLevel] = useState(0);
    const [data, setData] = useState([]);
    const {request} = useHttp();
    const [currentSample, setCurrentSample] = useState([])

    useEffect(() => {
        getWords();
    }, [])

    useEffect(() => {
        if (Array.isArray(data) && data.length) {
            setCurrentSample(getCurrentWords());
        }
    }, [data])

    useEffect(() => {
        if (level !== 0) setCurrentSample(getCurrentWords())
    }, [level])

    const getCurrentWords = () => {
        const arr = [data[level]];
        while (arr.length !== 5) {
            const item = data[Math.floor(Math.random() * data.length)];
            if (!arr.includes(item)) {
                arr.push(item);
            }
        }
        return arr;
    }

    const getWords = useCallback(
        async () => {
            try {
                const words = await request('/words', 'GET', null, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                })
                setData(words);
            } catch (e) {
                
            }
        },
        [request]
    )

    const handleClick = (isCorrect) => {
        setLevel(prev => prev + 1);
        isCorrect ? console.log('correct') : console.log('not correct')
    }

    return (
        <>
        <div className="row">
            <div className="col s12 m8">
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        {
                            currentSample.length > 0 && (
                            <GameElement 
                                sample={currentSample} 
                                level={level}
                                handleClick={handleClick}/>
                                )
                        }
                    </div>
                    <div className="card-action">
                        <NavLink to='/games/audiocall'>
                            <button className="btn waves-effect waves-light" type="submit" name="action">Выход
                                <i className="material-icons left">arrow_back</i>                                
                            </button>
                        </NavLink>
                        <button className="btn" onClick={() => {
                            handleClick(false);           
                        }}>Я не знаю</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default GameAudiocall;
