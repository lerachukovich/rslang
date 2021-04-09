import React, { useCallback, useContext, useEffect, useState } from 'react';
import StatisticToday from '../components/Statistic/StatisticToday';
import { AuthContext } from '../context/AuthContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MathHelper from '../helper/Math.helper';
import Storage from '../helper/Storage';
import StatisticGlobal from '../components/Statistic/StatisticGlobal';

const StatisticPage = () => {
  const auth = useContext(AuthContext);

  const { token, userId } = useContext(AuthContext);
  const [wordIdCollection, setWordIdCollection] = useState(null);
  const [wordStack, setWordStack] = useState([]);
  
  const [wordsStatistic, setWordsStatistic] = useState([]);
  const [todayStatistic, setTodayStatistic] = useState([]);  

  useEffect(() => {
      auth.isAuthenticated ? getWordsStatistic() : setTodayStatistic(Storage.getStorage('statistic'));
  }, [])

  const getWordsStatistic = useCallback(
      async () => {
          try {
              const response = await fetch(`/users/${auth.userId}/statistics`, {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${auth.token}`,
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                  }
              })
              const content = await response.json();
              setWordsStatistic(content.learnedWords || []);
              const todayLearnedWords = content.learnedWords.filter(item => item.date.slice(0, 10) === new Date().toISOString().slice(0 ,10));
              setTodayStatistic(todayLearnedWords.map(item => item.word) || []);
          } catch (e) {
              
          }
      }, []
  )

  const getWord = async ( {wordId} ) => {
      try {
        const rawResponse = await fetch(`/words/${wordId}`, {
          method: 'GET',
          withCredentials: true,
          headers: {
            'Accept': 'application/json'
          }
        });
        const word = await rawResponse.json();
        // console.log(word)
        setWordStack(prevState => [...prevState, word]);
        } catch (e) {
      }
      ;
    }
  ;

  const getUserWords = async ({ userId }) => {
    const rawResponse = await fetch(`/users/${userId}/words/`, {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Accept': 'application/json'
      }
    });
    const content = await rawResponse.json();
    setWordIdCollection(content);
  };

  useEffect(() => {

    if (!auth) {
      return;
    }
    getUserWords({ userId });
    // console.log(token, userId);
  }, []);

  useEffect(() => {
    if (!wordIdCollection) {
      return;
    }
    // console.log('Вот', wordIdCollection);
    wordIdCollection.map(it => {
      // console.log(it.wordId);
      const { wordId } = it;
      getWord({wordId})
    })
  }, [wordIdCollection]);

  useEffect(() => {
    // console.log('ВОТ', wordStack);
  }, [wordStack])

  return (
    <div className="statistic-wrapper">
      <Tabs>
        <TabList>
          <Tab>Сегодня</Tab>
          <Tab disabled={!auth.isAuthenticated}>Словарь</Tab>
          <Tab disabled={!auth.isAuthenticated}>Статистика</Tab>
        </TabList>

        <TabPanel>
          <StatisticToday words={todayStatistic} />
        </TabPanel>

        <TabPanel>
          <Tabs>
            <TabList>
              <Tab>Изучаемые слова</Tab>
              <Tab>Сложные слова</Tab>
              <Tab>Удалённые слова</Tab>
            </TabList>

            <TabPanel>

              {wordStack.length !== 0 &&
              wordStack.map(it => (
                <li>{it.word}</li>
                )
              )
              }
            </TabPanel>
            <TabPanel>
              <h2>Сложные слова из бэка</h2>
            </TabPanel>
            <TabPanel>
              <h2>Удалённые слова из бэка</h2>
            </TabPanel>
          </Tabs>
        </TabPanel>

        <TabPanel>
          <StatisticGlobal statistic={wordsStatistic} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default StatisticPage;
