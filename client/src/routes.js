import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import StartLearnPage from './pages/StartLearn.page';
import VocabularyPage from './pages/Vacabulary.page';
import GamesPage from './pages/Games.page';
import StatisticPage from './pages/Statistic.page';
import CreditsPage from './pages/Crefdits.page';
import SettingsPage from './pages/Settings.page';
import PromoPage from './pages/Promo.page';
import AuthPage from './pages/Auth.page';
import GameField from "./components/SprintGameComponents/GameField.component";
import Audiocall from './components/AudiocallGameComponents/Audiocall';
import GameAudiocall from './components/AudiocallGameComponents/GameAudiocall';
import Statistic from './components/AudiocallGameComponents/Statistic';
import SavannaPromo from './pages/SavannaPromo.page';
import SavannaPlay from './components/SavannaGame/SavannaPlay.page';
import SprintWelcome from "./components/SprintGameComponents/SprintWelcome.component";


const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/promo" exact>
          <PromoPage/>
        </Route>
        <Route path="/learning" exact>
          <StartLearnPage/>
        </Route>
        <Route path="/vocabulary" exact>
          <VocabularyPage/>
        </Route>
        <Route path="/games" exact>
          <GamesPage/>
        </Route>
        <Route path="/games/audiocall" exact>
          <Audiocall />
        </Route>
        <Route path="/games/audiocall/playing" exact>
          <GameAudiocall />
        </Route>
        <Route path="/games/audiocall/statistic" exact>
          <Statistic />
        </Route>
        <Route path="/statistic" exact>
          <StatisticPage/>
        </Route>
          <Route path="/games/sprint" exact>
              <SprintWelcome />
          </Route>
          <Route path="/games/sprint/playing" exact>
              <GameField />
          </Route>
        <Route path="/credits" exact>
          <CreditsPage/>
        </Route>
        <Route path="/settings" exact>
          <SettingsPage/>
        </Route>
        <Route path="/auth">
          <AuthPage/>
        </Route>
        <Route path='/games/savanna/play' exact>
          <SavannaPlay/>
        </Route>
        <Route path="/games/savanna" exact>
          <SavannaPromo/>
        </Route>
          <Redirect to="/promo"/>
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


