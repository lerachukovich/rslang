import React, {useEffect} from 'react';

const GameElement = (props) => {
    const {sample, level, handleClick} = props;
    const answer = sample[0];

    useEffect(() => {
        playSound(answer.audio);
    }, [sample])

    const shuffle = arr => {
        const newArr = arr.slice();
        return newArr.sort(() => Math.random() - 0.5);
    }

    const playSound = url => {
        const audio = new Audio(`/${url}`);
        audio.play();
    }

    return (
        <>
        <div className="card-content">
            <button className="btn-floating btn-large waves-effect" onClick={() => playSound(answer.audio)}>
                <i className="material-icons large">volume_up</i>
            </button>
            <div>Level: {level + 1}</div>
            {answer && <div>{answer.wordTranslate}</div>}
        </div>
        <div className="card-action">
            {
                shuffle(sample).map((item, index) => {
                    if (item.wordTranslate === answer.wordTranslate) {
                        return (
                            <button key={index} className="btn btn-large waves-effect red" onClick={handleClick.bind(null, true)}>{item.wordTranslate}</button>
                        )
                    } else return (
                        <button key={index} className="btn btn-large waves-effect" onClick={handleClick.bind(null, false)}>{item.wordTranslate}</button>
                        )                    
                })
            }
        </div> 
        </>
    )
}

export default GameElement;
