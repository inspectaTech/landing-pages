const dotenv = require('dotenv');
dotenv.config();// .env has to be in the site root to work


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
  }
}

// copied from oauth_server
//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
