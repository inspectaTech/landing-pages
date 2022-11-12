const chalk = require('chalk');
const JWT = require('jsonwebtoken');
const {JWT_SECRET} = require('./keys');
const display_console = false;

const namespace = "https://sunzao.us/";// add to env

const signToken = user => {
  let sign_data = {
    iss: 'sunzao.us',/*can't be a static value*/
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
  }

  let project_claim = `${namespace}project_id`;

  sign_data[`${project_claim}`] = user._id;// initial project is user._id

  return JWT.sign(sign_data, JWT_SECRET);
}//signToken
// i could add a project_id by default - but not right now, it already falls back to the user_id without it

const signProjectToken = ({user_id, project_id, editor_id, admin_id}) => {
  let sign_data = {
    iss: 'sunzao.us',/*can't be a static value*/
    sub: user_id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
  };

  let project_claim = `${namespace}project_id`;

  let editor_claim = `${namespace}editor_id`;

  let admin_claim = `${namespace}admin_id`;

  // if(display_console || false) console.log(chalk.bgRed(`[signProjectToken] editor_claim`),editor_claim);//test WORKS

  sign_data[`${project_claim}`] = project_id;

  sign_data[`${editor_claim}`] = editor_id;

  sign_data[`${admin_claim}`] = admin_id;

  return JWT.sign(sign_data, JWT_SECRET);
}//signToken

const verifyToken = (token, raw = false) => {
  let verifier;
  // if(display_console || false) console.log(`[verifyToken] JWT_SECRET`,JWT_SECRET);
  let project_claim = `${namespace}project_id`;

  let editor_claim = `${namespace}editor_id`;

  let admin_claim = `${namespace}admin_id`;

  try {
    verifier = JWT.verify(token, JWT_SECRET);
    // if(display_console || true) console.log(chalk.bgMagenta(`[verifyToken] verifier`),verifier);
  } catch (e) {
    // verifier will still be undefined if error
    console.error(e);
  }

  const verified_data = (verifier != undefined) ? { 
    user_id: verifier.sub, 
    project_id: verifier[`${project_claim}`],
    editor_id: verifier[`${editor_claim}`],
    admin_id: verifier[`${admin_claim}`],
  } : null;

  // IMPORTANT: NOTE: new claims still have to be added to JwtStrategy in passport.js to appear in req.user

  // if(display_console || true) console.log(chalk.bgMagenta(`[verifyToken] verified_data`),verified_data);
  // GOTCHA: also NOTE: console in verifyToken doesn't seem to work??

  // what sense does this make?  i guess raw and returning as-is deals with unregistered users?
  return (raw) ? verifier : (verifier != undefined) ? verified_data : verifier;
}

module.exports = {
  signToken,
  signProjectToken,
  verifyToken
}
