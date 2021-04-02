import { NavLink } from 'react-router-dom';
import React, { useEffect } from 'react';
import M from 'materialize-css/dist/js/materialize.min';
import './Navbar.component.scss'

const Navbar = () => {
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
              className="waves-effect"
              to='/promo'>Главная страница</NavLink>
        </li>
        <li>
          <NavLink
              onClick={closeHandler}
              className="waves-effect"
              to='/auth/login'>Войти</NavLink>
        </li>
        {/*<li>*/}
        {/*  <NavLink*/}
        {/*    onClick={closeHandler}*/}
        {/*    className="waves-effect"*/}
        {/*    to="/learning">*/}
        {/*    Изучение*/}
        {/*  </NavLink>*/}
        {/*</li>*/}
        {/*<li>*/}
        {/*  <NavLink*/}
        {/*    onClick={closeHandler}*/}
        {/*    className="waves-effect"*/}
        {/*    to="/vocabulary">*/}
        {/*    Словарь*/}
        {/*  </NavLink>*/}
        {/*</li>*/}
        <li>
          <NavLink
            onClick={closeHandler}
            className="waves-effect"
            to="/games">
            Игры
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={closeHandler}
            className="waves-effect"
            to="/statistic">Статистика
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={closeHandler}
            className="waves-effect"
            to="/credits">
            Разработчики
          </NavLink>
        </li>
        {/*<li>*/}
        {/*  <NavLink*/}
        {/*    onClick={closeHandler}*/}
        {/*    className="waves-effect"*/}
        {/*    to="/settings">*/}
        {/*    Настройки*/}
        {/*  </NavLink>*/}
        {/*</li>*/}
      </ul>
      <button data-target="slide-out" className="sidenav-trigger btn"><i
        className="material-icons">menu</i></button>
    </div>
  );
};

export default Navbar;
