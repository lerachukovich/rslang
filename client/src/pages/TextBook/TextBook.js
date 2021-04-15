import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useHttp from '../../hooks/http.hook';
import useMessage from '../../hooks/message.hook';
import Spinner from '../../components/Spinner/Spinner';
import Error from '../../components/Error/Error';
import {AuthContext} from '../../context/AuthContext';
import '../../styles/TextBook.page.scss';

const TextBook = () => {
  let {groupPar, pagePar} = useParams();
  const auth = useContext(AuthContext);
  const [group, setGroup] = useState(Number(groupPar));
  let [page, setPage] = useState(Number(pagePar));
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
    setGroup(Number(e.target.getAttribute('datalevel')));
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
      <Error />
    )
  }

  const increaseGroup = () => {
    if (group >= 4) return
    setGroup(prevState => prevState + 1);
  }

  const decreaseGroup = () => {
    if (group <= 0) return
    setGroup(prevState => prevState - 1);
  }

  return (
    <div className={'text-book__wrapper'}>
      <h1 className={'text-book__title'}>Учебник 📕</h1>
      <div className={'text-book__button-container'}>
        <span>Сложность:</span>
        <Link className="level-btn waves-light btn"
              onClick={decreaseGroup}
              to={`/textbook/${group}/0}`}>
          -
        </Link>
        <Link className="level-btn waves-light red darken-2 btn"
              onClick={increaseGroup}
              to={`/textbook/${group + 1}/0`}>
          +
        </Link>
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
                  <img src={`../../` + it.image} alt={it.wordTranslate}/>
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
          {!loading && <Link className="text-book__pagination-btn btn"
                 onClick={prevPageHandler}
                 to={`/textbook/${group}/${page - 1}`}>Назад
          </Link>}
          {loading && <Link className="text-book__pagination-btn btn disabled"
                            >Назад
          </Link>}

          {!loading && <Link className="text-book__pagination-btn btn"
                 onClick={nextPageHandler}
                 to={`/textbook/${group}/${page + 1}`}
          >Вперед
          </Link>}
          {loading && <Link className="text-book__pagination-btn btn disabled"
          >Вперед
          </Link>}
        </div>

        <div className={'text-book__info-container'}>
          <span className={"text-book__info__item"} title={'Сложность'}>{group + 1}</span>
          <span className={"text-book__info__item"} title={'Страница'}>{page}</span>
        </div>

        {auth.isAuthenticated && (
          <div className="text-book_game-container">
            <Link className={'text-book__game__item'}
                  to={{pathname: '/games/audiocall/playing', wordsCollection: currentCollection, fromTextBook: true, page: page, group: group}}>
              Аудиовызов
            </Link>
            <Link className={'text-book__game__item'}
                  to={{pathname: '/games/sprint/playing', data: currentCollection, fromTextBook: true, page: page, group: group}}>
              Спринт
            </Link>
            <Link className={'text-book__game__item'}
                  to={{pathname: '/games/savanna/play', data: currentCollection, fromTextBook: true, page: page, group: group}}>
              Саванна
            </Link>
            <Link className={'text-book__game__item'} to={{pathname: '/games/owngame/play', data: currentCollection, fromTextBook: true, page: page, group: group}}>
              Расставь слова
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextBook;
