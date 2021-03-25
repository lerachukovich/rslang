import React, {useState, useEffect, useContext} from 'react';
import './LoginForm.scss';
import {Link, useHistory} from 'react-router-dom';
import useHtt from '../../hooks/http.hook';
import {AuthContext} from '../../context/AuthContext';

const LoginForm = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {loading, request, error, clearError} = useHtt();

    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const changeHandler = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    };

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const data = await request('/signin', 'POST', {...form});
            console.log(data);
            // auth.login(data.token, data.userId, data.image, data.name);
            // history.push('/');
            auth.login(data.token, data.userId, data.photo, data.name)
        } catch (e) {      
            console.log(e);      
        }
    }

    return (
        <>
        <div className="login-page-wrapper">
            <div className="card text-white bg-primary mb-3 login-form">
                <div className="card-header">
                    <Link to="/auth/register">
                        <button
                            type="button"
                            className="btn disabled btn-white"
                            disabled={loading} >
                                Register</button>
                    </Link>
                    <button type="button" className="btn btn-secondary">Login</button>
                </div>
                <div className="card-body">
                    <form
                        onSubmit={loginHandler}>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                aria-describedby="emailHelp"
                                placeholder="Enter email"
                                value={form.email}
                                onChange={changeHandler} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={changeHandler} />
                        </div>
                        <div className="form-group">
                            <input
                                type="submit"
                                className="form-control btn-dark"
                                id="btn"
                                disabled={loading} />
                        </div>
                    </form>
                </div>

            </div>
        </div>
        </>
    )

}

export default LoginForm;
