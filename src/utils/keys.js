const dotenv = require('dotenv');
dotenv.config();

// NOTE: Deprecated - use ../../configuration/keys.js

module.exports = {
  mongodb:{
    dbURI: process.env.MONGODB_LOCAL_TASK_URI,
    liveURI:process.env.MONGODB_LIVE_TASK_URI,
    db:process.env.MONGODB_LOCAL_DB,
    liveDB:process.env.MONGODB_LIVE_DB,
    localhost:process.env.MONGODB_LOCALHOST_DB
  },
  session:{
    cookieKey:process.env.SESSION_COOKIE_KEY
  },
  SITE_SERVER: process.env.SITE_SERVER,
  DOMAIN_NAME: process.env.DOMAIN_NAME,
  HOSTNAME: process.env.DOMAIN_NAME.split(".")[0],
}
