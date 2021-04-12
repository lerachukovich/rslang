import React, { useState, useContext, useEffect } from 'react';
import './RegisterForm.scss';
import {Link, useHistory} from 'react-router-dom';
import useHttp from '../../hooks/http.hook';
import {AuthContext} from '../../context/AuthContext';
import useMessage from '../../hooks/message.hook';
import RubberBand from 'react-reveal/RubberBand';
import Pulse from 'react-reveal/Pulse';
import Fade from 'react-reveal/Fade';

const RegisterForm = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, request, error, clearError} = useHttp();
    const [image, setImage] = useState('');
    const [isShowPulse, setIsShowPulse] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        photo: ''
    });

    useEffect(() => {
        message(error);
        clearError();
      }, [error, message, clearError]);

    const changeHandler = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const getUrl = async (e) => {
        e.preventDefault();
        const file = new FormData();
        file.append('file', image);
        file.append('upload_preset', 'rslang');
        file.append('cloud_name', 'rslang2021');

        return await fetch('https://api.cloudinary.com/v1_1/rslang2021/image/upload', {
            method: 'post',
            body: file
        })
            .then(res => res.json())
            .then(file => file.url)
            .catch(err => console.log(err))
    }

    const registerHandler = async (e) => {
        form.photo = await getUrl(e);
        try {
            const data = await request('/users', 'POST', {...form}, {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            })
            console.log('data', data)
        } catch (e) {
        }
    }

    return (
        <Fade>
            <div className="register-page-wrapper">
                <div className="card text-white bg-primary mb-3 register-form">
                    <div className="card-header">
                        <button type="button" className="btn-active">Регистрация</button>
                        <Link to="/auth/login">
                            <button
                                type="button"
                                className="btn-inactive"
                                disabled={loading} >
                                    Войти</button>
                        </Link>
                    </div>
                    <div className="card-body">
                        <form
                            onSubmit={registerHandler}
                            encType='multipart/form-data' >
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    aria-describedby="emailHelp"
                                    placeholder="Введите имя"
                                    onChange={changeHandler} />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    aria-describedby="emailHelp"
                                    placeholder="Введите email"
                                    onChange={changeHandler} />
                            </div>
                            <div className="form-group">
                                    <div className="file-field input-field">
                                        <div className="btn btn-active">
                                            <span>Файл</span>
                                            <input
                                                type="file"
                                                name="photo"
                                                className="form-control-file"
                                                aria-describedby="emailHelp"
                                                accept=".png, .jpg, .jpeg"
                                                onChange={(e) => setImage(e.target.files[0])} />
                                        </div>
                                        <div className="file-path-wrapper">
                                            <input className="file-path validate" type="text" placeholder="Выберите аватар"/>
                                        </div>
                                    </div>
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Введите пароль"
                                    onChange={changeHandler} />
                            </div>
                            <RubberBand>
                                <Pulse spy={isShowPulse}>
                                    <div className="form-group" onMouseEnter={() => setIsShowPulse(true)} onMouseLeave={() => setIsShowPulse(false)}>
                                        <input
                                            type="submit"
                                            className="form-submit"
                                            id="btn"
                                            value="Зарегистрироваться"
                                            disabled={loading}  />
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

export default RegisterForm;
