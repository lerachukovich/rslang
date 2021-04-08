import React, { useContext, useEffect, useState } from 'react';
import {AuthContext} from '../context/AuthContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const VocabularyPage = () => {
  const { token, userId, isAuthenticated } = useContext(AuthContext);
  const [wordIdCollection, setWordIdCollection] = useState(null);
  const [wordStack, setWordStack] = useState([]);
  const [hardStack, setHardStack] = useState([]);

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
    setWordIdCollection(content);
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
    wordIdCollection.map(it => {

      const { wordId } = it;
      getWord({ wordId });
    });
    const hardCollection = wordIdCollection.filter( it => it.difficulty === 'hard')
    hardCollection.map(it => {
      const { wordId } = it;
      getHardWord({ wordId });
    })
  }, [wordIdCollection]);

  useEffect(() => {
    console.log(wordStack, wordIdCollection)
  }, [wordStack]);

  return (
    <div>
      <h1>This is Vocabulary page</h1>
      <Tabs>
        <TabList>
          <Tab>Изучаемые</Tab>
          <Tab>Сложные</Tab>
          <Tab>Удаленные</Tab>
        </TabList>

        <TabPanel>
          {wordStack.length !== 0 &&
          wordStack.map((it, ind) => (

              <li>{it.word}, Правильно: {
                wordIdCollection.filter((el) => (el.wordId === it.id))[0].optional.correct
              }
              Неправильно: {
                wordIdCollection.filter((el) => (el.wordId === it.id))[0].optional.unCorrect
                }
              </li>
            )
          )
          }
        </TabPanel>

        <TabPanel>
          {hardStack.length !== 0 &&
          hardStack.map(it => (
              <li>{it.word},
                Правильно: {
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0].optional.correct
                }
                Неправильно: {
                  wordIdCollection.filter((el) => (el.wordId === it.id))[0].optional.unCorrect
                }
              </li>
            )
          )
          }
        </TabPanel>

        <TabPanel>
          {wordStack.length !== 0 &&
          wordStack.map(it => (
              <li>{it.word}</li>
            )
          )
          }
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default VocabularyPage;
