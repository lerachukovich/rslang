import React, {useState} from "react";

const GameTimer = () => {
    const [gameTimer, setGameTimer] = useState(60);

    const timerOn = () => {
        setGameTimer(gameTimer > 0 ? gameTimer - 1 : gameTimer)
    }

    // setTimeout(timerOn, 1000);

    return (
        <h1>{gameTimer}</h1>
    )
}

export default GameTimer;
