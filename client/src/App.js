import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import useRoutes from './routes.js';
import Navbar from './components/Navbar/Navbar.components.js';
import 'materialize-css';
import Header from "./components/Header/Header.component.js";
import Footer from "./components/Footer/Footer.component";


function App() {
  const routes = useRoutes(true);
  const isAuthenticated = true;
  return (
    <Router>
        <Header />
      {isAuthenticated && <Navbar/>}
      <div className="container">
        {routes}
      </div>
        <Footer />
    </Router>
  );
}

export default App;
