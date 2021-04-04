import React, {useState, useEffect, useCallback} from 'react';
import GameLevels from './OwnGame.levels.component';
import Sentence from './OwnGame.sentence.component';
import Options from './OwnGame.options.component';
import MathHelper from '../../helper/Math.helper';
import useHttp from '../../hooks/http.hook';
import Spinner from '../Spinner/Spinner';
import bg1 from '../../assets/own-game-bg/own-game-bg-1.jpg';
import bg2 from '../../assets/own-game-bg/own-game-bg-2.jpg';
import bg3 from '../../assets/own-game-bg/own-game-bg-3.jpg';
import bg4 from '../../assets/own-game-bg/own-game-bg-4.jpg';
import Heart from './OwnGame.heart.component';
import FinalScreen from './OwnGame.results.component';
import error from '../../assets/audio/error.mp3';
import correct from '../../assets/audio/correct.mp3';
import useSound from 'use-sound';

const OwnGameMain = () => {

    const GAME_CONFIG = {
        attempts: 10,
        lives: 5,
        wordCards: 4
      };

    const WORDS_LIMIT = {
        maxPages: 29,
        maxGroup: 5,
        maxWordAmount: 19
    };

    const backgrounds = [bg1, bg2, bg3, bg4];

    const [currentBackground, setCurrentBackground] = useState(backgrounds[MathHelper.getRandomNumber(0, backgrounds.length - 1)]);
    const [level, setLevel] = useState('');
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [wordCollection, setWordCollection] = useState(null);
    const { loading, request } = useHttp();
    const [currentStep, setCurrentStep] = useState(0);
    const [options, setOptions] = useState([]);
    const [currentSentence, setCurrentSentence] = useState('');
    const [currentRightAnswer, setCurrentRightAnswer] = useState('');
    const [translationIsOpened, setTranslationIsOpened] = useState(false);
    const [translation, setTranslation] = useState('');
    const [gameIsFinished, setGameIsFinished] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [wrongAnswers, setWrongAnswers] = useState([]);
    const [currentWrongAnswers, setCurrentWrongAnswers] = useState([]);
    const [livesCount, setLivesCount] = useState(new Array(GAME_CONFIG.lives).fill('live'));
    const [correctSound] = useSound(correct);
    const [errorSound] = useSound(error);
    const [isSound, setIsSound] = useState(false);

    const getLevel = (e) => {
        console.log(e);
        setLevel(e.target.getAttribute('datalevel'));
    };

    const getWords = useCallback(
        async () => {
          try {
            const data = await request(`/words/?page=${MathHelper.getRandomNumber(0, WORDS_LIMIT.maxPages)}&group=${level}`, 'GET', null);
            setWordCollection(MathHelper.shuffleArray(data));
          } catch (e) {
          };
        }
    );

    useEffect(() => {
        if (!level) {
          return;
        }
        getWords(level);
        setIsGameStarted(true);
    }, [level]);

    const getCurrentSentence = (currentStep) => {
        if(wordCollection) {
            console.log(wordCollection[currentStep].textExample);
            setCurrentRightAnswer(wordCollection[currentStep].word);
            setTranslation(wordCollection[currentStep].textExampleTranslate);
            return wordCollection[currentStep].textExample;
        }
    };

    const generateFourOptions = (currentStep) => {
        const options = [];
        options.push(wordCollection[currentStep].word);
        for(let i = 1; options.length <=3; i++) {
            let num  = MathHelper.getRandomNumber(0, WORDS_LIMIT.maxWordAmount);
            if(!options.includes(wordCollection[num].word)) {
                options.push(wordCollection[num].word);
            }
        }

        MathHelper.shuffleArray(options);
        return options;
    };

    useEffect(() => {
        if (!wordCollection) {
          return;
        } else {
            setOptions(generateFourOptions(currentStep));
            setCurrentSentence(getCurrentSentence(currentStep));
        }
      }, [wordCollection]);

    const checkAnswer = (e) => {
        if(e.target.id === currentRightAnswer) {
            if(isSound) {
                correctSound();
            }
            setCurrentStep((currentStep)=>currentStep + 1);
            if(!wrongAnswers.includes(currentRightAnswer)) {
                setCorrectAnswers((correctAnswers)=> [...correctAnswers, e.target.id])
            }
            setCurrentWrongAnswers([]);
        } else {
            if(isSound) {
                errorSound();
            }
            if(!wrongAnswers.includes(currentRightAnswer)) {
                setWrongAnswers((wrongAnswers)=> [...wrongAnswers, currentRightAnswer])
            }
            if(livesCount.length >= 1) {
                setLivesCount((livesCount)=> {
                    const cutLife = livesCount.slice(0, livesCount.length - 1);
                    return cutLife;
                }) 
            }
            if(livesCount.length === 0) {
                setGameIsFinished(true);
            }
            setCurrentWrongAnswers(()=> [...currentWrongAnswers, e.target.id] )
        }
    }

    useEffect(() => {
        if(currentStep !== 0 && currentStep <= WORDS_LIMIT.maxWordAmount) {
            setOptions(generateFourOptions(currentStep));
            setCurrentSentence(getCurrentSentence(currentStep));
        } else if(currentStep > WORDS_LIMIT.maxWordAmount) {
            setGameIsFinished(true);
        };

    }, [currentStep] )

    const soundHandler = (url) => {
        const audio = new Audio(`/${url}`);
        audio.play();
      };

    if (!isGameStarted) {
        return (
        <div className={'savanna-promo__wrapper'} style={{backgroundImage: `url(${currentBackground})`}}>
            <GameLevels chooseLevel={getLevel}/>
        </div>)
        
    } else if (isGameStarted && !gameIsFinished) {
        return (
            <div className={'savanna-promo__wrapper own-game-play'} style={{backgroundImage: `url(${currentBackground})`}}>
                <div className="settings-buttons">
                    <button className={`btn ${isSound ? 'savanna__sound-control red lighten-2' : 'savanna__sound-control'} `} onClick={()=>setIsSound(!isSound)}><i className={'material-icons'}>music_note</i>
                    </button>
                    <button className={`btn ${translationIsOpened ? 'savanna__sound-control red lighten-2' : 'savanna__sound-control'} `} onClick={()=>setTranslationIsOpened(!translationIsOpened)} ><i className={'material-icons'}>help</i>
                    </button>                
                </div>
                <div className="savanna__hearts-container own-game-lives">
                    {livesCount.map((item, id) => <Heart key={id}/>)}
                </div>

                <div className="own-game_title ">Complete the sentence below:</div>
                <Sentence sentence={currentSentence}/>
                <Options options={options} checkAnswer={checkAnswer} currentWrongAnswers={currentWrongAnswers}/>
                <div className="translation"><span>Перевод: </span>{translationIsOpened ? translation : 'Если Вы хотите посмотреть перевод, нажмите на кнопку "Посмотреть перевод"'}</div>
            </div>
        );
    } else if(gameIsFinished) {
        return (
            <div className={'savanna-promo__wrapper'} style={{backgroundImage: `url(${currentBackground})`}}>
                <FinalScreen
                    correctAnswers={correctAnswers}
                    wrongAnswers={wrongAnswers}
                    wordCollection={wordCollection}
                    soundHandler={soundHandler}
                />            
            </div>
        )
    }
}

export default OwnGameMain;