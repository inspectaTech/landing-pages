# JWT strategy

### How do we combine methods?
> what if a local login wants to start using google login? - if google is their verified login
> then using google login should work automatically (verified only? - actually in this case even for unverified)
### What does "method" do? Why would i need it outside the strategy being checked?

#### how does passport know which strategy to use?

**oauth_client/src/js/actions/index.js**
```
  export const oauthGoogle = data => {
  return async dispatch => {
    try {
      const res = await axios.post(`${location.origin}/api/auth/oauth/google`, { access_token: data });
```
> actions calls a specific route based on the users choice of login method
> actions are added to the component at the bottom through compose

**js/components/SignIn.js**
```
  import * as actions from '../actions/';
  . . .
  export default compose(
    /*connect(null, actions),*/
    connect(mapStateToProps, actions),
    reduxForm({ form: 'signin' })
  )(SignIn)
```

**root/src/index.js**
```
  app.use('/auth', oauthClientRouter);// client side auth
  app.use('/api/auth', oauthServerRouter);// server side auth
```
> server routes targeting routers oauth_client/.../auth.js & oauth_server/.../oauth.js 


**oauth_servers/routers/oauth.js**
```
  const passportSignIn = passport.authenticate('local', {session: false });
  const passportJWT = passport.authenticate('jwt', {session: false });
  // const passportGoogle = passport.authenticate('google', { scope:['profile'], session: false });
  const passportGoogleToken = passport.authenticate('googleToken', { session: false });
  const passportFacebookToken = passport.authenticate('facebookToken', { session: false });

  ...

  router.route('/signin')
  .post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);
```
> strategies are prepared at the top of the oauth.js file then applied to specific routes
> im not sure how passport.authenticate knows 'local' or 'jwt' is the name for LocalStrategy or JwtStrategy - maybe thats found in the docs?


#### creating the initial token
oauth_server/controllers/users.js
```
  const token = await signToken(req.user);
```
>NOTE: for signin, google and facebook the req.user is generated in passport.js

**oauth_client/src/js/actions/index.js**
```
  router.route('/signup')
  .post(validateBody(schemas.authSchema),UsersController.signUp);
```
> signup action dispatch route doesn't even use passport

#### creating the updated session/project_id token

**alight/controllers/lib/getProjectToken**
```
  if(project) has_access = check_access({user_id, project});
  let token = await signProjectToken({user_id, project_id, editor_id, admin_id});
```

#### extracting the user_id (& project_id if available)
passport.js
```
  passport.use( new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
  },
    async (payload, done) => {
      try {
        // find the user specified in token
        if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] testing payload`),payload);
        if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] payload sub`),payload.sub);// there is no payload sub

        const user = await User.findById(payload.sub).lean();

        // if user doesn't exist, handle it
        if(!user){
          return done(null,false);
        }

        // check for the existence of a project_id
        let namespace = "https://example.com/";
        let project_claim = `${namespace}project_id`;
        if(payload[`${project_claim}`]){
          if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] project_claim detected`),payload);
          user.project_id = payload[`${project_claim}`];
        }

        //  otherwise, return the user
        done(null, user);
        // user will now be added to the req.user object

      } catch (error) {
        done(error, false);
      }
  }));
```
> passport.js has a section that checks for the "project_claim". it uses this to extract the project_id from the token;
```
  if(payload[`${project_claim}`]){
    if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] project_claim detected`),payload);
    user.project_id = payload[`${project_claim}`];
  }
```

#### can i check the token directly without using a bearer token in the header?
configuration/signToken.js
```
  verifier = JWT.verify(token, JWT_SECRET);
```

#### My manual verify sample
signToken.js
```
  const verifyToken = (token, raw = false) => {
    let verifier;
    let project_claim = `${namespace}project_id`;
    try {
      verifier = JWT.verify(token, JWT_SECRET);
      if(display_console || false) console.log(`[verifyToken] verifier`,verifier);
    } catch (e) {
      // verifier will still be undefined if error
      console.error(e);
    }

    return (raw) ? verifier : (verifier != undefined) ? { user_id: verifier.sub, project_id: verifier[`${project_claim}`] } : verifier;
  }
```

#### adding new claims to the token

I need to add editor_id to the token. it will test "network" collection to see if the user has been granted editor access
LATER - projects need contacts so i can give editor access to certain users (also requires security)

where is the project token processed?

**/configuration/signToken.js**
\_signProjectToken
\_verifyToken

update **signProjectToken** with a new claim to add to the token

```
  let editor_claim = `${namespace}editor_id`;
  sign_data[`${editor_claim}`] = editor_id;
```

update **verifyToken** to output the new claim property to passport.js > JwtStrategy verification object

```
  let editor_claim = `${namespace}editor_id`;

  ...

  const verified_data = (verifier != undefined) ? { 
    user_id: verifier.sub, 
    project_id: verifier[`${project_claim}`],
    editor_id: verifier[`${editor_claim}`],
  } : null;
```

GOTCHA IMPORTANT NOTE: new claims still have to be added to JwtStrategy in passport.js to appear in req.user

**src/oauth_server/passport.js**
```
  passport.use( new JwtStrategy({

    ...

    let namespace = "https://sunzao.us/";

    // check for the existence of a project_id
    let project_claim = `${namespace}project_id`;
    if(payload[`${project_claim}`]){
      if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] project_claim detected`),payload);
      user.project_id = payload[`${project_claim}`];
    }
```

#### verifying user dashboard display

**alight/controllers/firestarter.js**
```
  let verified = is_verified(user);
  host_data.verified = verified;
```

#### verifying the viewer

**alight/xfiles/js/app.js**
```
  let gvp = await get_viewer_prefs();
```

**alight/xfiles/js/lib/user_prefs/user_prefs.js > download_user_prefs**
```
  export const download_user_prefs = (bkmk) =>
  {
    var urlMod = "getUserPrefs";

    const ctrl_Url = `${location.origin}/api/alight/users/${urlMod}`;

    try {
      const result = await axios.get(ctrl_Url);
```

**alight/xfiles/js/lib/user_prefs/user_prefs.js > download_user_prefs**
```
  export const get_viewer_prefs = async () =>
  {
    return await download_user_prefs().then(async (result)=>{

      let viewer_data = Object.freeze({...my_results, DEMO: {...demo_data}, HELP:{}});
      
      window['VIEWER_DATA'] = viewer_data;// frozen like const
```

**alight/controllers/lib/getUserPrefs.js**
```
  let verified = is_verified(req.user);

  res.json({_id: prefs._id, user_id, editor_id, admin_id, project_name, project_id: prefs.project_id, prefs, preset_data: preset, project_item, verified});
```