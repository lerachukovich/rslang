import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import StartLearnPage from './pages/StartLearn.page.js';
import VocabularyPage from './pages/Vocabulary.page.js';
import GamePage from './pages/Game.page.js';
import StatisticPage from './pages/Statistic.page.js';
import CreditsPage from './pages/Credits.page.js';
import SettingsPage from './pages/Settings.page.js';
import PromoPage from './pages/Promo.page.js';


const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/learning" exact>
          <StartLearnPage/>
        </Route>
        <Route path="/vocabulary" exact>
          <VocabularyPage/>
        </Route>
        <Route path="/games" exact>
          <GamePage/>
        </Route>
        <Route path="/statistic" exact>
          <StatisticPage/>
        </Route>
        <Route path="/credits" exact>
          <CreditsPage/>
        </Route>
        <Route path="/settings" exact>
          <SettingsPage/>
        </Route>
        <Redirect to="/learning"/>
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <PromoPage/>
      </Route>
      <Redirect to="/"/>
    </Switch>
  );
};

export default useRoutes;


