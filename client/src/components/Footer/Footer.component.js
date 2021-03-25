import React from "react";
import './Footer.component.scss'

const Footer = () => {
    return (
        <footer className="page-footer">
            <div className="footer-container">
                <a href="https://rs.school/js/"><img className='footer-logo'
                                                     src="https://rs.school/images/rs_school_js.svg" alt="logo"/></a>
                <div>2021</div>

                <ul className='dev-links'>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/OlgaFedorovich">Alex</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/OlgaFedorovich">Olga</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/OlegMikhailov23">Oleg</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/lerachukovich">Lera</a></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;
