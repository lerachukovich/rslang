import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import useRoutes from './routes';
import Navbar from './components/Navbar/Navbar.components';
import 'materialize-css';

import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import Footer from "./components/Footer/Footer.component";

function App() {
  const {login, logout, token, userId, name, photo, timeLogin} = useAuth();
  const isAuthenticated = !!token;

  useEffect(() => {
    if (isAuthenticated) {                          
      if ((new Date().getTime() - new Date(JSON.parse(localStorage.getItem('userDataRSLangLoginTime'))).getTime()) > 14400000) {
        console.log(new Date().getTime() - new Date(JSON.parse(localStorage.getItem('userDataRSLangLoginTime'))).getTime())
        logout();
    }
    }
  }, [])

  const routes = useRoutes(true);
  return (
    <AuthContext.Provider value={{
      login, logout, token, userId, name, photo, isAuthenticated
    }}>
      <Router>
        <Navbar/>
        <div className={'main-wrapper'}>
          {routes}
        </div>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
