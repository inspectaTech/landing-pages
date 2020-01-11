const express = require('express');
// const router = express.Router;
const router = require('express-promise-router')();
const passport = require('passport');
// const passportConfig = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', {session: false });
const passportJWT = passport.authenticate('jwt', {session: false });
// const passportGoogle = passport.authenticate('google', { scope:['profile'], session: false });
const passportGoogleToken = passport.authenticate('googleToken', { session: false });
const passportFacebookToken = passport.authenticate('facebookToken', { session: false });

router.route('/signup')
.post(validateBody(schemas.authSchema),UsersController.signUp);
//sample path:  const res = await axios.post(`${location.origin}/api/auth/signup`, data);

router.route('/signin')
.post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);
//sample path:  const res = await axios.post(`${location.origin}/api/auth/signin`, data);

router.route('/secret')
.get(passportJWT, UsersController.secret);
// .get((req, res) => {
//   console.log('[logging request] req ',req.headers);
//   console.log("[axios] secret is working");
//   res.send("[axios] secret is working");
// })

router.route('/oauth/google')
.post(passportGoogleToken, UsersController.googleOAuth);// same as signIn
// .post((req, res) => {
//   console.log("[axios] is working");
//   res.send("axios is working")
// })
// sample path: const res = await axios.post(`${location.origin}/api/auth/oauth/google`, { access_token: data });

router.route('/oauth/facebook')
.post(passportFacebookToken, UsersController.facebookOAuth);// same as signIn
// sample path: const res = await axios.post(`${location.origin}/api/auth/oauth/facebook`, { access_token: data });

module.exports = router;
