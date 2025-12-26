const mongoose = require('mongoose');
const chalk = require('chalk');
const JWT = require('jsonwebtoken');
const {JWT_SECRET, LINK_LIMIT} = require('./keys');
const { get_date_value } = require('./get_date_value');
const display_console = false;
const ObjectId = mongoose.Types.ObjectId;

const namespace = "https://sunzao.us/";// add to env

const signToken = user => {

  let rs = get_date_value();// ready_stamp
  let ts = rs.timestamp();
  rs.add("1 day");// i need to add 3 mins
  let exp_date = rs.timestamp();

  let sign_data = {
    iss: 'sunzao.us',/*can't be a static value*/
    sub: user._id,
    iat: ts,// new Date().getTime(),
    exp: exp_date// new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
  }

  let project_claim = `${namespace}project_id`;

  sign_data[`${project_claim}`] = user._id;// initial project is user._id

  return [JWT.sign(sign_data, JWT_SECRET), sign_data];
}//signToken
// i could add a project_id by default - but not right now, it already falls back to the user_id without it

const signProjectToken = ({user_id, project_id, editor_id, admin_id, action = "project"}) => {
  let rs = get_date_value();// ready_stamp
  let ts = rs.timestamp();
  rs.add("1 day");// i need to add 3 mins
  let exp_date = rs.timestamp();
  
  let sign_data = {
    iss: 'sunzao.us',/*can't be a static value*/
    sub: user_id,
    iat: ts,//new Date().getTime(),
    exp: exp_date// new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
  };

  let project_claim = `${namespace}project_id`;

  let editor_claim = `${namespace}editor_id`;

  let admin_claim = `${namespace}admin_id`;

  let action_claim = `${namespace}action`;

  // if(display_console || false) console.log(chalk.bgRed(`[signProjectToken] editor_claim`),editor_claim);//test WORKS

  sign_data[`${project_claim}`] = project_id;

  sign_data[`${editor_claim}`] = editor_id;

  sign_data[`${admin_claim}`] = admin_id;

  if (action){
    // what do i need this for?
    // i need tokens to have action (labels) so they can't be used interchangeably
    sign_data[`${action_claim}`] = action;
  }// if

  return [JWT.sign(sign_data, JWT_SECRET), sign_data];
}//signToken

const signGuestToken = ({sponsor, client, email, expires = false, payload, action, test = false}) => {

  const client_id = client ? client : new ObjectId();// generate a ObjectId

  let rs = get_date_value();// ready_stamp
  let ts = rs.timestamp();
  rs.add(`${LINK_LIMIT} minutes`);// i need to add 3 mins
  let exp_date = rs.timestamp();
  
  let sign_data = {
    iss: `sunzao.us`,/*can't be a static value*/
    sub: sponsor._id,
    iat: ts,//new Date().getTime(),
  }
  
  if(expires) sign_data.exp = exp_date;
  // sponsor creates a host code that lives in their client array.
  // once that code is erased, the users token is no longer valid

  let sponsor_claim = `${namespace}sponsor_id`;
  let client_claim = `${namespace}client_id`;// save a client id in the sponsors client array
  let action_claim = `${namespace}action`;
  let test_claim = `${namespace}test`;
  let payload_claim = `${namespace}payload`;
  let email_claim = `${namespace}email`;

  // sponsor can add notes to the id to help them identify the client
  // no, no notes. The sponsor can message them using their id if here is an issue. Also if they are blocked
  // the sponsor gets a record of blocks and negative interactions in an object related to that id

  // self sponsored?
  sign_data[`${sponsor_claim}`] = sponsor._id;// initial sponsor is sponsor._id
  sign_data[`${client_claim}`] = client_id;

  if (action){
    // what do i need this for?
    // i need tokens to have action (labels) so they can't be used interchangeably
    sign_data[`${action_claim}`] = action;
  }// if

  if (test) {
    sign_data[`${test_claim}`] = true;
  }// if

  if (payload) {
    // i think it has to be stringified
    sign_data[`${payload_claim}`] = JSON.stringify(payload);
    // sign_data[`${payload_claim}`] = payload;
  }// if

  if (email) {
    // i think it has to be stringified
    sign_data[`${email_claim}`] = email;
    // sign_data[`${payload_claim}`] = payload;
  }// if

  return [JWT.sign(sign_data, JWT_SECRET), sign_data];

}// signGuestToken

const verifyToken = (token, raw = false) => {
  let verifier;
  // if(display_console || false) console.log(`[verifyToken] JWT_SECRET`,JWT_SECRET);
  let project_claim = `${namespace}project_id`;

  let editor_claim = `${namespace}editor_id`;

  let admin_claim = `${namespace}admin_id`;

  // registration claims
  let sponsor_claim = `${namespace}sponsor_id`;
  let client_claim = `${namespace}client_id`;// save a client id in the sponsors client array
  let action_claim = `${namespace}action`;
  let test_claim = `${namespace}test`;
  let payload_claim = `${namespace}payload`;
  let email_claim = `${namespace}email`;

  try {
    verifier = JWT.verify(token, JWT_SECRET);
    // if(display_console || true) console.log(chalk.bgMagenta(`[verifyToken] verifier`),verifier);
  } catch (e) {
    // verifier will still be undefined if error
    console.error(e);
  }

  // if the claim doesn't exist it should return null and the object property won't be passed along (?)
  const verified_data = (verifier != undefined) ? { 
    user_id: verifier.sub, 
    project_id: verifier[`${project_claim}`],
    editor_id: verifier[`${editor_claim}`],
    admin_id: verifier[`${admin_claim}`],
    // registration claims
    sponsor: verifier[`${sponsor_claim}`],
    client: verifier[`${client_claim}`],
    action: verifier[`${action_claim}`],
    test: verifier[`${test_claim}`],
    payload: verifier[`${payload_claim}`],
    email: verifier[`${email_claim}`],
    exp: verifier.exp,
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
  signGuestToken,
  verifyToken
}
