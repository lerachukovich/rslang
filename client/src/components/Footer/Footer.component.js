import React from "react";
import './Footer.component.scss'

const Footer = () => {
    return (
        <footer className="page-footer">
            <div className="footer-container">
                <a href="https://rs.school/js/">
                    <img className='footer-logo' src="https://rs.school/images/rs_school_js.svg" alt="logo"/>
                </a>
                <div>2021</div>
                <ul className='dev-links'>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/Alexus-bat"
                           target='_blank' rel="noreferrer">Alex</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/OlgaFedorovich"
                           target='_blank' rel="noreferrer">Olga</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/OlegMikhailov23"
                           target='_blank' rel="noreferrer">Oleg</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/lerachukovich"
                           target='_blank' rel="noreferrer">Lera</a></li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer;
