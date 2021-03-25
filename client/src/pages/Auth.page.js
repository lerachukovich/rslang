import React from 'react'
import { Switch, Route, Redirect } from "react-router-dom";
import LoginForm from '../components/LoginForm/LoginForm';
import RegisterForm from '../components/RegisterForm/RegisterForm';

const AuthPage = () => {
  return(
    <Switch>
      <Route path="/auth/login" exact>
        <LoginForm />
      </Route>
      <Route path="/auth/register" exact>
        <RegisterForm />
      </Route>
      <Redirect to="/auth/login" />
    </Switch>
  )
}

export default AuthPage;
