import React, { useContext } from 'react';
import StatisticNotAuth from '../components/Statistic/Statistic.notAuth';
import {AuthContext} from '../context/AuthContext';

const StatisticPage = () => {
  const auth = useContext(AuthContext);

  if (auth.isAuthenticated) {
    return (
      <div>Statistic for auth</div>
    )
  } else {
    return (
      <StatisticNotAuth />
    )
  }
}

export default StatisticPage
