import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useHttp from '../../hooks/http.hook';
import useMessage from '../../hooks/message.hook';
import Spinner from '../../components/Spinner/Spinner';
import '../../styles/TextBook.page.scss';

const TextBook = () => {
  const [group, setGroup] = useState(0);
  const [page, setPage] = useState(0);
  const [currentCollection, setCurrentCollection] = useState(null);
  const { loading, request, error } = useHttp();
  const [isSoundPlay, setIsSoundPlay] = useState(false);
  const message = useMessage();

  const getWords = useCallback(
    async () => {
      try {
        const data = await request(`/words/?page=${page}&group=${group}`, 'GET', null);
        setCurrentCollection(data);
      } catch (e) {
      }
      ;
    }
  );

  useEffect(() => {
    if (loading) {
      return;
    }
    getWords();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }
    getWords();
  }, [page, group]);

  const nextPageHandler = () => {
    if (page >= 29) {
      return;
    }
    setPage(prevState => prevState + 1);
  };

  const prevPageHandler = () => {
    if (page <= 0) {
      return;
    }
    setPage(prevState => prevState - 1);
  };

  const chooseGroupHandler = (e) => {
    setGroup(e.target.getAttribute('datalevel'));
  };


  function play(audio, callback) {
    audio.play();
    if (callback) {
      audio.onended = callback;
    }
  }

  const soundHandler = (sounds) => {
    if (!isSoundPlay) {
      setIsSoundPlay(true);
      let index = 0;

      function recursive_play() {
        if (index + 1 === sounds.length) {
          play(sounds[index], null);
          setIsSoundPlay(false);
        } else {
          play(sounds[index], function() {
            index++;
            recursive_play();
          });
        }
      }

      recursive_play();
    }
  };



    return (
      <div className={"text-book__wrapper"}>


        <h1 className={"text-book__title"}>Учебник 📕</h1>


        <div className="text-book__button-container">
        {new Array(5).fill().map((it, ind) => (
            <button
              key={ind}
              className={'level-btn waves-light btn-large'}
              onClick={chooseGroupHandler}
              datalevel={ind}>
              Сложность: {ind + 1}
            </button>
          )
        )}
      </div>



        {loading && <Spinner />}
        {!loading && <div className="text-book__words-list">
          {/*{loading && <Spinner/>}*/}
          <ul>
            {currentCollection && currentCollection.map((it, ind) => (
                <li key={ind}>
                  <div className="text__book__words-list__word-img">
                    <img src={`../` + it.image} alt={it.wordTranslate}/>
                  </div>
                  <div className="text-book__words-list__word-translate">
                    {!isSoundPlay && <button
                      className={'btn'}
                      onClick={() => soundHandler([new Audio(it.audio),
                        new Audio(it.audioExample),
                        new Audio(it.audioMeaning)])}>
                      Sound
                    </button>}
                    {isSoundPlay && <button
                      className={'btn disabled'}
                      disabled>
                      Sound
                    </button>}
                    {ind + 1} : {it.word} - {it.wordTranslate} - {it.transcription}
                  </div>
                  <div>{`${it.textMeaning}`} - {it.textMeaningTranslate}</div>
                  <div>{it.textExample} - {it.textExampleTranslate}</div>
                </li>
              )
            )}


          </ul>
          <div className="text-book_game-container">
            <Link to={'/games/audiocall/playing'}>
              Аудио-вызов
            </Link>
            <Link to={'/games/sprint/playing'}>
              Спринт
            </Link>

            <Link to={'/games/savanna/play'}>
              Саванна
            </Link>
            <Link to={'/'}>
              Какая-то загадочная игра
            </Link>
          </div>
        </div>}


        <div className={'text-book__pagination-container'}>
          {!loading && <button className="text-book__pagination-btn btn"
                               onClick={prevPageHandler}>
            Назад
          </button>}
          {loading && <button className="text-book__pagination-btn btn disabled"
          >
            Назад
          </button>}
          {!loading && <button className="text-book__pagination-btn btn"
                               onClick={nextPageHandler}>
            Вперед
          </button>}
          {loading && <button className="text-book__pagination-btn btn disabled"
          >
            Вперед
          </button>}
        </div>
      </div>
    );
};

export default TextBook;
