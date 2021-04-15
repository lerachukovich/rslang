import { NavLink } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import M from 'materialize-css/dist/js/materialize.min';
import {AuthContext} from '../../context/AuthContext';
import './Navbar.component.scss'

const Navbar = () => {
  const auth = useContext(AuthContext);
  useEffect(() => {
    let elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, {
      edge: 'right',
      draggable: true,
      preventScrolling: true
    });
  }, []);

  const closeHandler = () => {
    const instance = M.Sidenav.getInstance(document.querySelector('.sidenav'));
    instance.close();
  };

  return (
    <div className='header-nav'>
      <h1 className='logo'>
        <NavLink to='/promo'>RS Lang</NavLink>
      </h1>
      <ul id="slide-out" className="sidenav">
        <li><button className="sidenav-close btn">Закрыть</button></li>
        <li>
          <NavLink
              onClick={closeHandler}
              className="nav-link"
              to='/promo'>Главная страница</NavLink>
        </li>
        <li>
          <NavLink
            onClick={closeHandler}
            className="nav-link"
            to="/textbook">
            Учебник
          </NavLink>
        </li>
        {auth.isAuthenticated && (
          <li>
            <NavLink
              onClick={closeHandler}
              className="waves-effect"
              to="/vocabulary">
              Словарь
            </NavLink>
          </li>
        )}
        <li>
          <NavLink
            onClick={closeHandler}
            className="nav-link"
            to="/games">
            Игры
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={closeHandler}
            className="nav-link"
            to="/statistic">Статистика
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={closeHandler}
            className="nav-link"
            to="/credits">
            Разработчики
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={closeHandler}
            className="nav-link"
            to="/settings">
            Настройки
          </NavLink>
        </li>
      </ul>
      <div className="header-block">
        <div className="auth-block">
          {auth.isAuthenticated && auth.photo && (
            <div>
              <span>{auth.name}</span>
              <img className="responsive-img circle" src={auth.photo} alt="avatar" />
            </div>
          )}
          <span>
            {auth.isAuthenticated ? (
              <NavLink
                className="nav-log"
                onClick={auth.logout}
                to='/auth/login'>Выход</NavLink>
            ) : (
              <NavLink
                className="nav-log"
                to='/auth/login'>Войти</NavLink>
            )}
          </span>
        </div>
        <button data-target="slide-out" className="sidenav-trigger btn">
          <i className="material-icons">menu</i>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
