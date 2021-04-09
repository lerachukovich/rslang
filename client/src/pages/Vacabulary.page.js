import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Spinner from '../components/Spinner/Spinner';

const VocabularyPage = () => {
  const { token, userId, isAuthenticated } = useContext(AuthContext);
  const [group, setGroup] = useState(0);
  const [page, setPage] = useState(0);
  const [wordIdCollection, setWordIdCollection] = useState(null);
  const [wordStack, setWordStack] = useState([]);
  const [hardStack, setHardStack] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [unCorrectAnswer, setUnCorrectAnswer] = useState(0);
  const [coefficient, setCoefficient] = useState(0);

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

  const getHardWord = async ({ wordId }) => {
    try {
      const rawResponse = await fetch(`/words/${wordId}`, {
        method: 'GET',
        withCredentials: true,
        headers: {
          'Accept': 'application/json'
        }
      });
      const word = await rawResponse.json();
      setHardStack(prevState => [...prevState, word]);
    } catch (e) {
    }
    ;
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
    setWordIdCollection(content.filter(it => it.optional.group === group).filter(el => el.optional.page === page));
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
    wordIdCollection.map((it, ind)=> {
      const { wordId } = it;
      getWord({ wordId });
    });

    const hardCollection = wordIdCollection.filter(it => it.difficulty === 'hard');
    hardCollection.map(it => {
      const { wordId } = it;
      getHardWord({ wordId });
    });
    setCorrectAnswer(wordIdCollection.reduce((acc, curr) => acc + curr.optional.correct, 0));
    setUnCorrectAnswer(wordIdCollection.reduce((acc, curr) => acc + curr.optional.unCorrect, 0));
  }, [wordIdCollection]);

  useEffect(() => {
    console.log(wordStack, wordIdCollection);
  }, [wordStack]);

  const chooseGroupHandler = (e) => {
    setGroup(Number(e.target.getAttribute('datalevel')));
    setPage(0);
  };

  useEffect(() => {
    getUserWords({ userId });
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

  return (
    <div className={'text-book__wrapper'}>
      <h1 className={'text-book__title'}>Словарь 📓</h1>
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

      <div className="text-book__words-list">
       <ul>
          {wordIdCollection && wordStack.map((it, ind) => (
              <li key={ind}
                  className={`text-book__word-container ${wordIdCollection.filter((el) => (el.wordId === it.id))[0] &&
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0].difficulty}`}>
                <div className="text__book__words-list__word-img">
                  <img src={`../` + it.image} alt={it.wordTranslate}/>
                </div>
                <div className={"text-book__words-list__word-translate text-book__words-list__word-translate--vocabulary"}>
                  {it.word}
                </div>
                <div className="text-book__words-list__word-translate--vocabulary__attempt text-book__words-list__word-translate--vocabulary__attempt--correct">
                  Правильно: {
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0] &&
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0].optional.correct
                }
                </div>
                <div className="text-book__words-list__word-translate--vocabulary__attempt text-book__words-list__word-translate--vocabulary__attempt--uncorrect">
                  Неправильно: {
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0] &&
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0].optional.unCorrect
                }
                </div>
              </li>
            )
          )}
          {wordStack.length === 0 && <b>Ничего пока нет</b>}
        </ul>
        <p>{page}</p>
      </div>

      <div className={'text-book__bottom-controls'}>
        <div className={'text-book__pagination-container'}>
          <button className="text-book__pagination-btn btn"
                  onClick={prevPageHandler}>Назад</button>
          <button className="text-book__pagination-btn btn"
                  onClick={nextPageHandler}>Вперед</button>
        </div>
        <div>
          <span>Группа: {group}</span>
          <span>Страница: {page}</span>
          <span>Слов в изучении: {wordStack.length}</span>
          <span>Неправильных ответов:
            {unCorrectAnswer && Math.floor(unCorrectAnswer/correctAnswer * 100)}%
          </span>
        </div>
      </div>
    </div>

  );
};

export default VocabularyPage;
