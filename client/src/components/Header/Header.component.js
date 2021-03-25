import React from 'react';
import { NavLink } from 'react-router-dom';
import M from 'materialize-css/dist/js/materialize.min';


const Header = () => {
    let dropdowns = document.querySelectorAll('.dropdown-trigger')
    for (let i = 0; i < dropdowns.length; i++){
        M.Dropdown.init(dropdowns[i], {
            draggable: true
        });
    }

    return (
        <div className='header'>
            <ul id="dropdown1" className="dropdown-content">
                <li><NavLink to="#">Аудиовызов</NavLink></li>
                <li><NavLink to="#">Саванна</NavLink></li>
                <li><NavLink to="#">Спринт</NavLink></li>
                <li><NavLink to="#">Своя игра</NavLink></li>
            </ul>
            <nav>
                <div className="nav-wrapper">
                    <NavLink to="#" className="brand-logo">RS Lang</NavLink>
                    <ul className="right hide-on-med-and-down">
                        <li><NavLink to="#">Учебник</NavLink></li>
                        <li><NavLink className="menu dropdown-trigger" to="#" data-target="dropdown1">Наши игры<i
                            className="material-icons right">arrow_drop_down</i></NavLink></li>
                        <li><NavLink to="#">Статистика</NavLink></li>
                        <li><NavLink to='/auth/login'>Войти</NavLink></li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Header;
