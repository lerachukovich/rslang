import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { SettingContext } from '../context/SettingContext';
import { Link } from 'react-router-dom';
import { UpdateUserWord } from '../helper/database.helper/UserWord.helper';

const VocabularyPage = () => {
  const setting = useContext(SettingContext);
  const { token, userId, isAuthenticated } = useContext(AuthContext);
  const [group, setGroup] = useState(0);
  const [page, setPage] = useState(0);
  const [wordIdCollection, setWordIdCollection] = useState(null);
  const [wordStack, setWordStack] = useState([]);
  const [hardStack, setHardStack] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [unCorrectAnswer, setUnCorrectAnswer] = useState(0);
  const [coefficient, setCoefficient] = useState(0);
  const [showDeleted, setShowDeleted] = useState(true);

  const getWord = async ({ wordId }) => {
    try {
      const rawResponse = await fetch(`/words/${wordId}`, {
        method: 'GET',
        withCredentials: true,
        headers: {
          'Accept': 'application/json'
        }
      });
      const word = await rawResponse.json();
      setWordStack(prevState => [...prevState, word]);
    } catch (e) {
    }
    ;
  };

  const getHardWords = async ({ userId }) => {
    const rawResponse = await fetch(`/users/${userId}/words/`, {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const content = await rawResponse.json();
    setWordIdCollection(content.filter(it => it.difficulty === 'hard'));
  };

  const getDeletedWords = async ({ userId }) => {
    const rawResponse = await fetch(`/users/${userId}/words/`, {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const content = await rawResponse.json();
    setWordIdCollection(content.filter(it => it.optional.deleted === true));
  };

  const getUserWords = async ({ userId }) => {
    const rawResponse = await fetch(`/users/${userId}/words/`, {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const content = await rawResponse.json();
    setWordIdCollection(content.filter(it => it.optional.group === group)
      .filter(el => el.optional.page === page)
      .filter(x => x.optional.deleted === false));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    getUserWords({ userId });
  }, [isAuthenticated]);

  useEffect(() => {
    if (!wordIdCollection) {
      return;
    }

    setWordStack([]);
    wordIdCollection.map((it, ind) => {
      const { wordId } = it;
      getWord({ wordId });
    });

    setCorrectAnswer(wordIdCollection.reduce((acc, curr) => acc + curr.optional.correct, 0));
    setUnCorrectAnswer(wordIdCollection.reduce((acc, curr) => acc + curr.optional.unCorrect, 0));
  }, [wordIdCollection]);

  const chooseGroupHandler = (e) => {
    setGroup(Number(e.target.getAttribute('datalevel')));
    setPage(0);
  };

  useEffect(() => {
    setShowDeleted(false);
    getUserWords({ userId });
  }, [page, group]);

  const showHardWords = () => {
    setShowDeleted(false);
    getHardWords({ userId });
  };

  const showDeletedWords = () => {
    setShowDeleted(true);
    getDeletedWords({ userId });
  };

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

  const setHardDif = (e) => {
    UpdateUserWord({
      userId: userId,
      wordId: e.target.getAttribute('wordid'),
      word: { difficulty: 'hard' }
    }, token);
    e.target.closest('li').classList.add('hard');
  };

  const setDelete = (e) => {
    const tmp = wordIdCollection.filter(it => it.wordId === e.target.getAttribute('wordid'));
    UpdateUserWord({
      userId: userId,
      wordId: e.target.getAttribute('wordid'),
      word: {
        difficulty: 'weak',
        optional: {
          page: tmp[0].optional.page,
          group: tmp[0].optional.group,
          correct: tmp[0].optional.correct,
          unCorrect: tmp[0].optional.unCorrect,
          deleted: true
        }
      }
    }, token);
    e.target.closest('li').classList.add('deleted');
  };

  return (
    <div className={'vocabulary__wrapper'}>
      <h1 className={'text-book__title'}>Словарь 📓</h1>
      <div className="text-book__button-container">
        <div className={'text-book__button-container__categories'}>
          <span>Сложность:</span>
        {new Array(5).fill().map((it, ind) => (
            <button
              key={ind}
              className={'level-btn waves-light btn'}
              onClick={chooseGroupHandler}
              datalevel={ind}>
              {ind + 1}
            </button>
          )
        )}
        </div>
        {setting.showButton && (
          <div className={'text-book__button-container__categories'}>
            <button
              className={'level-btn waves-light red darken-2 btn'}
              onClick={showHardWords}>Cложные</button>
            <button
              className={'level-btn waves-light blue-grey darken-1 btn'}
              onClick={showDeletedWords}>Удаленные</button>
          </div>
        )}
      </div>

      <div className="text-book__words-list">
        <ul>
          {wordIdCollection && wordStack.map((it, ind) => (
              <li key={ind}
                  className={`text-book__word-container ${wordIdCollection.filter((el) => (el.wordId === it.id))[0] &&
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0].difficulty}`}>
                <div className="text__book__words-list__word-img">
                  <img src={`../` + it.image} alt={it.wordTranslate}/>
                </div>
                <div
                  className={'text-book__words-list__word-translate text-book__words-list__word-translate--vocabulary'}>
                  {it.word}
                </div>
                <div
                  className="text-book__words-list__word-translate--vocabulary__attempt text-book__words-list__word-translate--vocabulary__attempt--correct">
                  Правильно: {
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0] &&
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0].optional.correct
                }
                </div>
                <div
                  className="text-book__words-list__word-translate--vocabulary__attempt text-book__words-list__word-translate--vocabulary__attempt--uncorrect">
                  Неправильно: {
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0] &&
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0].optional.unCorrect
                }
                </div>
                <div className={`vocabulary__words-list__btn-container ${showDeleted && 'hide'}`}>
                  <button onClick={setDelete}
                          className={'vocabulary__words-list__btn--delete'}
                          title={'Переместить, в удаленные'}
                          wordid={it.id}>Удалить
                  </button>
                  <button onClick={setHardDif}
                          className={'vocabulary__words-list__btn--gohard'}
                          title={'Переместить, в сложные'}
                          wordid={it.id}>Сложное
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
        {wordStack.length === 0 && <div className={'text-book__words-list__empty-blank'}>
          <span>
            Ничего пока нет, играйте в мини игры в
          </span>
          <Link to={'/textbook'}>
            учебнике
          </Link>
        </div>}
      </div>

      <div className={'text-book__bottom-controls'}>
        <div className={'text-book__pagination-container'}>
          <button className="text-book__pagination-btn btn"
                  onClick={prevPageHandler}>Назад
          </button>
          <button className="text-book__pagination-btn btn"
                  onClick={nextPageHandler}>Вперед
          </button>
        </div>
        <div className={'text-book__info-container'}>
          <span className={`text-book__info__item ${showDeleted && 'hide'}`} title={'Сложность'}>{group + 1}</span>
          <span className={`text-book__info__item ${showDeleted && 'hide'}`} title={'Страница'}>{page}</span>
          <span className={'text-book__info__item'} title={'Слов в изучении'}>{wordStack.length}</span>
          <span className={'text-book__info__item'} title={'Количество неправильных ответов'}>
            {unCorrectAnswer && Math.floor(unCorrectAnswer / correctAnswer * 100)}%
          </span>
        </div>
      </div>
    </div>

  );
};

export default VocabularyPage;
