import React, { useCallback, useContext, useEffect, useState } from 'react';
import StatisticToday from '../components/Statistic/StatisticToday';
import { AuthContext } from '../context/AuthContext';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MathHelper from '../helper/Math.helper';

const StatisticPage = () => {
  const auth = useContext(AuthContext);



  return (
    <div className="statistic-wrapper">
      <Tabs>
        <TabList>
          <Tab>Сегодня</Tab>
          <Tab disabled={!auth.isAuthenticated}>Словарь</Tab>
          <Tab disabled={!auth.isAuthenticated}>Графики?/Долгосрочная стата</Tab>
        </TabList>

        <TabPanel>
          <StatisticToday/>
        </TabPanel>

        <TabPanel>
          <Tabs>
            <TabList>
              <Tab>Изучаемые слова</Tab>
              <Tab>Сложные слова</Tab>
              <Tab>Удалённые слова</Tab>
            </TabList>
            <TabPanel>
              <h2>Сложные слова из бэка</h2>
            </TabPanel>
            <TabPanel>
              <h2>Удалённые слова из бэка</h2>
            </TabPanel>
          </Tabs>
        </TabPanel>

        <TabPanel>
          <h2>Графики?</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default StatisticPage;
