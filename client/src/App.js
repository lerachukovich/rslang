import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import useRoutes from './routes';
import Navbar from './components/Navbar/Navbar.components';
import 'materialize-css';
import './App.css';

import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import {SettingContext} from './context/SettingContext';
import Footer from "./components/Footer/Footer.component";
import { useSetting } from './hooks/setting.hook';

function App() {
  const {login, logout, token, userId, name, photo, timeLogin} = useAuth();
  const {isSound, showTranslate, showButton, wordsCount, life, changeSetting, getSetting } = useSetting();

  const isAuthenticated = !!token;

  useEffect(() => {
    if ((new Date().getTime() - new Date(JSON.parse(localStorage.getItem('userDataRSLangLoginTime'))).getTime()) > 14400000) {
      console.log(new Date().getTime() - new Date(JSON.parse(localStorage.getItem('userDataRSLangLoginTime'))).getTime())
      logout();
    }
  }, [])

  useEffect(() => {
    if (userId && token) {
      getSetting(userId, token)
    }
  }, [isAuthenticated])

  const routes = useRoutes(true);
  return (
    <AuthContext.Provider value={{
      login, logout, token, userId, name, photo, isAuthenticated
    }}>
      <SettingContext.Provider value={{isSound, showTranslate, showButton, wordsCount, life, changeSetting, getSetting}}>
        <Router>
          <Navbar/>
          <div className={'main-wrapper'}>
            {routes}    
            <Footer />
          </div>
        </Router>
      </SettingContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
