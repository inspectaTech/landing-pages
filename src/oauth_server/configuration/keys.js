const dotenv = require('dotenv');
dotenv.config();// .env has to be in the site root to work


module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  oauth: {
    google:{
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET
    },
    facebook:{
      clientID:process.env.FACEBOOK_CLIENT_ID,
      clientSecret:process.env.FACEBOOK_CLIENT_SECRET
    },
  },
  mongodb:{
    dbURI: process.env.MONGODB_LOCAL_TASK_URI,
    liveURI:process.env.MONGODB_LIVE_TASK_URI,
    db:process.env.MONGODB_LOCAL_DB,
    liveDB:process.env.MONGODB_LIVE_DB
  },
  session:{
    cookieKey:process.env.SESSION_COOKIE_KEY
  },
  youtube:{
    APIKey:process.env.YOUTUBE_API_KEY
  }
}


//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
