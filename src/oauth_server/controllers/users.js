// const User = require('../models/user');
const User = require('../../../models/user');// centralized models
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('../configuration/keys')
const { initiate_starter_data } = require('./setup');

const signToken = user => {
  return JWT.sign({
    iss: 'InspectaTech',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
  }, JWT_SECRET);
}//signToken

module.exports = {
  signUp: async (req, res, next) => {
    // expects Email & Password
    // req.value.body
    // console.log("content of req.value.body",req.value.body);
    console.log('UsersController.signUp() called!');
    // const email = req.value.body.email;
    // const password = req.value.body.password;
    const {email, password } = req.value.body;//see helpers/routeHelpers for src of on req.value.body

    //  Check if there is a user with the same email
    const foundUser = await User.findOne({"local.email":email});
    if(foundUser){
        return res.status(403).json({error:'Email is already in use'});
    }

    // create a new user


    const newUser = new User({
      method: "local",
      local:{
        email,
        password
      }
    });
    await newUser.save();


    // res.json({user:'created'});
    const token = signToken(newUser);
    // respond with token
    res.status(200).json({token})

  },
  signIn: async (req, res, next) => {
    // console.log('UsersController.signIn() called!');
    console.log('successful login');
    console.log('[signIn] req.user',req.user);
    // generate token
    const token = signToken(req.user);
    res.status(200).json({token});

  },
  googleOAuth: async (req, res, next) => {
    // Generate token
    // same as above
    console.log('[googleOAuth] req.user',req.user);

    // actually needs initiating in the strategy near the new user.save() fn right before done();
    // or do i need this to run every time? - i shouldn't if i make the admin items un-deleteable
    // i can add a restore defaults to the settings and give user ctrl to run it.
    initiate_starter_data({user:req.user});

    const token = signToken(req.user);
    res.status(200).json({token});
  },
  facebookOAuth: async (req, res, next) => {
    // Generate token
    // same as above
    console.log("[facebookOAuth] Got here!")
    console.log('req.user',req.user);
    const token = signToken(req.user);
    res.status(200).json({token});
  },
  secret: async (req, res, next) => {
    // console.log('UsersController.secret() called!');
    console.log('I managed to get here');
    res.json({secret: 'resource'})

  }
}
