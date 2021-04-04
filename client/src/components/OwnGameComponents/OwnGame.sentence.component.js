import React from 'react';


const Sentence = ({sentence}) => {
    const regexp = /<b>[a-zA-z]*<\/b>/gm;
    const newSentence = sentence.replace(regexp, '_______');

    return (
    <div className="own-game_sentence">
        {newSentence}
    </div>)
}

export default Sentence;