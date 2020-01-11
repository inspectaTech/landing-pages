import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import axios from 'axios'; 


// import * as serviceWorker from './serviceWorker';

import App from "./components/App";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import authGuard from "./components/HOCs/authGuard";
import Dashboard from "./components/Dashboard";
import reducers from "./reducers/";

import { HOME_PATH, SIGN_UP_PATH, SIGN_IN_PATH, DASHBOARD_PATH } from './paths/'

const jwtToken = localStorage.getItem('JWT_TOKEN');
console.log("[jwtToken]", jwtToken);
axios.defaults.headers.common['Authorization'] = jwtToken;

ReactDOM.render(
  /*<Provider store={createStore(reducers, {})}>*/
  <Provider store={createStore(reducers, {
    auth: {
      token: jwtToken,
      isAuthenticated: jwtToken ? true : false
     }
  }, applyMiddleware(reduxThunk))}>
    <BrowserRouter>
      <App>
        <Route exact path={HOME_PATH} component={Home} />
        <Route exact path={SIGN_UP_PATH} component={SignUp} />
        <Route exact path={SIGN_IN_PATH} component={SignIn} />
        <Route exact path={DASHBOARD_PATH} component={authGuard(Dashboard)} />
      </App>
    </BrowserRouter>
  </Provider>,
  document.querySelector('#oauth_root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
// serviceWorker.register();
