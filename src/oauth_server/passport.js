const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20');
const chalk = require('chalk');
// const GoogleTokenStrategy = require('passport-google-plus-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const {ExtractJwt} = require('passport-jwt');
const {JWT_SECRET} = require('./configuration/keys');
const Keys = require('./configuration/keys').oauth;
// const User = require('./models/user');
const User = require('../../models/user');// centralized models

// console.log("[jwt_secret]",JWT_SECRET);

// JSON WEB TOKEN STRATEGY
passport.use( new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
},
  async (payload, done) => {
    try {
      // find the user specified in token
      const user = await User.findById(payload.sub);

      // if user doesn't exist, handle it
      if(!user){
        return done(null,false);
      }

      //  otherwise, return the user
      done(null, user);
      // user will now be added to the req.user object

    } catch (error) {
      done(error, false);
    }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user give the Email
    const user = await User.findOne({ "local.email":email });

    // if not, handle it
    if(!user){
      return done(null, false);
    }

    //  check if password is correct
    const isMatch = await user.isValidPassword(password);

    // if not handle it
    if(!isMatch){
      return done(null, false);
    }

    // otherwise, return user
    done(null, user);
  } catch (error) {
    done(error, false);
  } //catch
}));

// passport.use('googleToken', new GoogleStrategy({
passport.use('googleToken', new GoogleTokenStrategy({
  clientID: Keys.google.clientID,
  clientSecret: Keys.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {

  try {

    console.log('[google] accessToken',accessToken);
    console.log('[google] refreshToken',refreshToken);
    console.log('[google] profile1',profile);

    console.log(chalk.yellow("[google] profile _json"),profile._json);
    let g_data = profile._json;

    // check whegher this current user exists inour DB
    const existingUser = await User.findOne({"google.id":g_data.id});
    if (existingUser) {
      console.log("user already exists in our DB");
      return done(null, existingUser);
    }//if

    console.log("user doesn't exist we are creating a new one");
    // if new account
    const newUser = new User({
      method: "google",
      google:{
        id: g_data.id,
        email: g_data.emails,
        picture: g_data.picture
      }
    });

    await newUser.save();
    done(null, newUser);

  } catch (error) {
    console.log('[google error]',error);
    done(error, false, error.message);
  }

}))

passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: Keys.facebook.clientID,
  clientSecret: Keys.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('[facebook] profile',profile);
    console.log('[facebook] accessToken',accessToken);
    console.log('[facebook] refreshToken',refreshToken);

    const existingUser = await User.findOne({"facebook.id":profile.id});

    if(existingUser){
      console.log("[facebook] user already exists in our DB");
      return done(null, existingUser);
    }//if

    console.log("[facebook] user doesn't exist we are creating a new one");
    // if not
    const newUser = new User({
      method:"facebook",
      facebook:{
        id: profile.id,
        email: profile.emails[0].value
      }
    });

    await newUser.save();

    done(null, newUser);

  } catch (error) {
    done(error, false, error.message);
  }// catch
}))
