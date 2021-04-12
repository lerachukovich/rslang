import React, {useState, useEffect, useContext} from 'react';
import './LoginForm.scss';
import {Link, useHistory} from 'react-router-dom';
import useHtt from '../../hooks/http.hook';
import {AuthContext} from '../../context/AuthContext';
import useMessage from '../../hooks/message.hook';
import RubberBand from 'react-reveal/RubberBand';
import Pulse from 'react-reveal/Pulse';
import Fade from 'react-reveal/Fade';

const LoginForm = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, request, error, clearError} = useHtt();
    const [isShowPulse, setIsShowPulse] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        message(error);
        clearError();
      }, [error, message, clearError]);

    const changeHandler = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const data = await request('/signin', 'POST', {...form});
            // auth.login(data.token, data.userId, data.image, data.name);
            auth.login(data.token, data.userId, data.photo, data.name)
            history.push('/');
        } catch (e) {
        }
    }

    return (
        <Fade>
            <div className="login-page-wrapper">
                <div className="card text-white bg-primary mb-3 login-form">
                    <div className="card-header">
                        <Link to="/auth/register">
                            <button
                                type="button"
                                className="btn-inactive"
                                disabled={loading} >
                                    Регистрация</button>
                        </Link>
                        <button type="button" className="btn-active">Вход</button>
                    </div>
                    <div className="card-body">
                        <form
                            onSubmit={loginHandler}>
                            <div className="form-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    aria-describedby="emailHelp"
                                    placeholder="Введите email"
                                    value={form.email}
                                    onChange={changeHandler} />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Введите пароль"
                                    value={form.password}
                                    onChange={changeHandler} />
                            </div>
                            <RubberBand>
                                <Pulse spy={isShowPulse}>
                                    <div className="form-group" onMouseEnter={() => setIsShowPulse(true)} onMouseLeave={() => setIsShowPulse(false)}>
                                        <input
                                            type="submit"
                                            className="form-submit"
                                            value="Войти"
                                            id="btn"
                                            disabled={loading} />
                                    </div>
                                </Pulse>
                            </RubberBand>
                        </form>
                    </div>
                </div>
            </div>
        </Fade>
    )

}

export default LoginForm;
