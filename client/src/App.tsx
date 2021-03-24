import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import useRoutes from './routes';
import Navbar from './components/Navbar/Navbar.components';
import 'materialize-css';


function App() {
  const routes = useRoutes(true);
  const isAuthenticated = true;
  return (
    <Router>
      {isAuthenticated && <Navbar/>}
      <div className="container">
        {routes}
      </div>
    </Router>
  );
}

export default App;
