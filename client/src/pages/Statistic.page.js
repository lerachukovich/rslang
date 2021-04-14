import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Storage from '../helper/Storage';
import StatisticToday from '../components/Statistic/StatisticToday';
import StatisticGlobal from '../components/Statistic/StatisticGlobal';
import 'react-tabs/style/react-tabs.css';

const StatisticPage = () => {
  const auth = useContext(AuthContext);
  
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

  return (
    <div className="statistic-wrapper">
      <Tabs>
        <TabList>
          <Tab>Сегодня</Tab>
          <Tab disabled={!auth.isAuthenticated}>Статистика</Tab>
        </TabList>

        <TabPanel>
          <StatisticToday words={todayStatistic} />
        </TabPanel>

        <TabPanel>
          <StatisticGlobal statistic={wordsStatistic} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default StatisticPage;
