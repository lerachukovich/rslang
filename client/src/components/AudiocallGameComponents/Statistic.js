import React from 'react';
import { useHistory } from 'react-router';

const Statistic = () => {
    const props = useHistory();
    const {state} = props.location;
    console.log(state);

    const playSound = url => {
        const audio = new Audio(`/${url}`);
        audio.play();
    }

    const correctCollection = (
        state.correct.map((item, idx) => {
            return (
                <li className="collection-item" key={idx}>
                    <a className="btn-floating btn-small" onClick={playSound.bind(null, item.audio)}><i className="material-icons">volume_up</i></a>
                    <span>{item.transcription}</span>
                    <span>{item.wordTranslate}</span>
                </li>
            )
        })
    )

    const mistakeCollection = (
        state.mistake.map((item, idx) => {
            return (
                <li className="collection-item" key={idx}>
                    <a className="btn-floating btn-small" onClick={playSound.bind(null, item.audio)}><i className="material-icons">volume_up</i></a>
                    <span>{item.transcription}</span>
                    <span> {item.wordTranslate}</span>                   
                </li>
            )
        })
    )

    return (
        <>
        <ul className="collection with-header">
            <li className="collection-header"><h4>Я знаю:</h4></li>
            {correctCollection}
        </ul>
        <ul className="collection with-header">
            <li className="collection-header"><h4>Я не знаю:</h4></li>
            {mistakeCollection}
        </ul>
        </>
    )
}

export default Statistic;
