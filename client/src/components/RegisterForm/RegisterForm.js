import React, { useState, useContext } from 'react';
import './RegisterForm.scss';
import {Link, useHistory} from 'react-router-dom';
import useHttp from '../../hooks/http.hook';
import {AuthContext} from '../../context/AuthContext';

const RegisterForm = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {loading, request, error, clearError} = useHttp();
    const [image, setImage] = useState('');

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        photo: ''
    });

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
            console.log(e);
        }
    }

    return (
        <>
        <div className="register-page-wrapper">
            <div className="card text-white bg-primary mb-3 register-form">
                <div className="card-header">
                    <button type="button" className="btn btn-secondary">Register</button>
                    <Link to="/auth/login">
                        <button
                            type="button"
                            className="btn disabled btn-white"
                            disabled={loading} >
                                Login</button>
                    </Link>
                </div>
                <div className="card-body">
                    <form
                        onSubmit={registerHandler}
                        encType='multipart/form-data' >
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                aria-describedby="emailHelp"
                                placeholder="Enter your name"
                                onChange={changeHandler} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                aria-describedby="emailHelp"
                                placeholder="Enter email"
                                onChange={changeHandler} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="photo">Avatar img</label>
                            <input
                                type="file"
                                name="photo"
                                className="form-control-file"
                                aria-describedby="emailHelp"
                                accept=".png, .jpg, .jpeg"
                                onChange={(e) => setImage(e.target.files[0])} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Password"
                                onChange={changeHandler} />
                        </div>
                        <div className="form-group">
                            <input
                                type="submit"
                                className="form-control btn-dark"
                                id="btn"
                                disabled={loading}  />
                        </div>
                    </form>
                </div>

            </div>

        </div>
        </>
    )
}

export default RegisterForm;
