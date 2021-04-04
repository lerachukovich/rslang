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

  if (error) {
    return (
      <div className={'text-book__wrapper'}>
        <div className="text-book_spinner-wrapper">
          <span className={"text-book__error"}>😬 Ой, кажется что-то пошло не так, попробуйте обновить позже...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={'text-book__wrapper'}>
      <h1 className={'text-book__title'}>Учебник 📕</h1>
      <div className="text-book__button-container">
        {new Array(5).fill().map((it, ind) => (
            <button
              key={ind}
              className={'level-btn waves-light btn'}
              onClick={chooseGroupHandler}
              datalevel={ind}>
              Сложность: {ind + 1}
            </button>
          )
        )}
      </div>

      {loading &&
      <div className={"text-book_spinner-wrapper"}>
        <Spinner className={"text-book__spinner"}/>
      </div>
      }
      {!loading &&
      <div className="text-book__words-list">
        <ul>
          {currentCollection && currentCollection.map((it, ind) => (
              <li key={ind} className={'text-book__word-container'}>
                <div className="text__book__words-list__word-img">
                  <img src={`../` + it.image} alt={it.wordTranslate}/>
                </div>

                <div className="text-book__words-list__word-translate">
                  {ind + 1} : {it.word} - {it.wordTranslate} - {it.transcription}
                </div>

                <div className={'text-book__words-list__word-meaning'}>
                  <span dangerouslySetInnerHTML={{ __html: it.textMeaningTranslate }}/>

                  <span dangerouslySetInnerHTML={{ __html: it.textMeaning }}/>
                </div>

                <div className={'text-book__words-list__word-example'}>
                  <span dangerouslySetInnerHTML={{ __html: it.textExample }}/>

                  <span dangerouslySetInnerHTML={{ __html: it.textExampleTranslate }}/>
                </div>
                {!isSoundPlay && <button
                  className={'btn'}
                  onClick={() => soundHandler([new Audio(it.audio),
                    new Audio(it.audioExample),
                    new Audio(it.audioMeaning)])}
                  title={'Listen'}>
                  <i className={'material-icons'}>surround_sound</i>
                </button>}
                {isSoundPlay && <button
                  className={'btn disabled'}
                  disabled>
                  <i className={'material-icons'}>surround_sound</i>
                </button>}
              </li>
            )
          )}
        </ul>
      </div>}

      <div className={'text-book__bottom-controls'}>
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

        <div className="text-book_game-container">
          <Link className={'text-book__game__item'} to={'/games/audiocall/playing'}>
            Аудио
          </Link>
          <Link className={'text-book__game__item'} to={'/games/sprint/playing'}>
            Спринт
          </Link>

          <Link className={'text-book__game__item'} to={'/games/savanna/play'}>
            Саванна
          </Link>
          <Link className={'text-book__game__item'} to={'/'}>
            ??????
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TextBook;
