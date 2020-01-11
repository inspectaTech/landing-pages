import axios from 'axios';
import { AUTH_SIGN_UP, AUTH_SIGN_OUT, AUTH_SIGN_IN, DASHBOARD_GET_DATA, AUTH_ERRORS } from './types';
// console.log("[host]",location.host);

// ActionCreators
console.log("[actions] index.js");


export const signIn = (data) => {
  return async (dispatch) => {
    /*
    Step 1: Use the data to make HTTP requrest to our Backend and send it along [x]
    Step 2: Take the Backend's response (jwtToken is here now!) [x]
    Step 3: Dispatch user just signed up (with jwtToken) [x]
    Step 4: save the jwtToken into our localStorage [x]
    */

    try {
      console.log('[ActionCreator] signIn called!');
      // const res = await axios.post('http://localhost:3000/api/auth/signup', data);
      const res = await axios.post(`${location.origin}/api/auth/signin`, data);

      console.log("[axios res]",res);

      console.log('[ActionCreator] signIn dispatched an action!');
      dispatch({
        type: AUTH_SIGN_IN,
        payload: res.data.token
      });

      localStorage.setItem('JWT_TOKEN', res.data.token);
      axios.defaults.headers.common['Authorization'] = res.data.token;

    } catch (err) {
      dispatch({
        type: AUTH_ERRORS,
        payload: 'Email and password combination isn\'t valid'
      })
    }

  }
}// signIn


export const signUp = (data) => {
  return async (dispatch) => {
    /*
    Step 1: Use the data to make HTTP requrest to our Backend and send it along [x]
    Step 2: Take the Backend's response (jwtToken is here now!) [x]
    Step 3: Dispatch user just signed up (with jwtToken) [x]
    Step 4: save the jwtToken into our localStorage [x]
    */

    try {
      console.log('[ActionCreator] signUp called!');
      // const res = await axios.post('http://localhost:3000/api/auth/signup', data);
      const res = await axios.post(`${location.origin}/api/auth/signup`, data);

      console.log("[axios res]",res);

      console.log('[ActionCreator] signUp dispatched an action!');
      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data.token
      });

      localStorage.setItem('JWT_TOKEN', res.data.token);
      axios.defaults.headers.common['Authorization'] = res.data.token;

    } catch (err) {
      dispatch({
        type: AUTH_ERRORS,
        payload: 'Email is already in use'
      })
    }

  }
}// signUp

export const oauthGoogle = data => {
  return async dispatch => {
    try {
      console.log("We received the accessToken", data);

      // const res = await axios.post('http://localhost:3000/api/auth/oauth/google', { access_token: data });
      const res = await axios.post(`${location.origin}/api/auth/oauth/google`, { access_token: data });

      console.log("[axios res]",res);

      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data.token
      });

      localStorage.setItem('JWT_TOKEN', res.data.token);
      axios.defaults.headers.common['Authorization'] = res.data.token;

    } catch (err) {
      console.log("oauthGoogle error", err);
      dispatch({
        type: AUTH_ERRORS,
        payload: 'oauthGoogle error' + err
      });
    }
  }// return
}// oauthGoogle

export const oauthFacebook = data => {
  return async dispatch => {
    try {
      console.log("We received the accessToken", data);

      // const res = await axios.post('http://localhost:3000/api/auth/oauth/facebook', { access_token: data });

      const res = await axios.post(`${location.origin}/api/auth/oauth/facebook`, { access_token: data });

      console.log("[axios res]",res);

      dispatch({
        type: AUTH_SIGN_UP,
        payload: res.data.token
      });

      localStorage.setItem('JWT_TOKEN', res.data.token);
      axios.defaults.headers.common['Authorization'] = res.data.token;

    } catch (err) {
      console.log("oauthFacebook error", err);

      dispatch({
        type: AUTH_ERRORS,
        payload: 'oauthFacebook error' + err
      });
    }
  }// return
}// oauthGoogle

export const signOut = () => {
    return dispatch => {
      try {
          localStorage.removeItem('JWT_TOKEN');
          axios.defaults.headers.common['Authorization'] = '';

          dispatch({
            type: AUTH_SIGN_OUT,
            payload: ''
          })

      } catch (err) {
        // console.log("signout error", err);
        dispatch({
          type: AUTH_ERRORS,
          payload: 'there was an issue signing out'
        })
      }// catch
    }
}

export const getSecret = () => {
  return async dispatch => {

    try {
      console.log('[ActionCreator] trying to get BE\'s secret');

      //need jwtToken in axios header to work
      const res = await axios.get(`${location.origin}/api/auth/secret`);

      console.log("[axios res]",res);

      dispatch({
        type: DASHBOARD_GET_DATA,
        payload: res.data.secret

      })

    } catch (e) {
      console.log('error',e);
    }
  }
}
