const dotenv = require('dotenv');
const chalk = require('chalk');
dotenv.config();
// var whitelist = ['http://example1.com', 'http://example2.com'];
var whitelist = [
  'https://sunzao.us',
  'https://www.sunzao.us',
  'https://beta.sunzao.us'
];

if(process.env.NODE_ENV == "development"){
  whitelist.push('http://localhost:3000');
}

console.log(chalk.yellow(`[cors-options] whitelist `), whitelist);

// this works
// var corsOptions = {
//   origin: 'https://sunzao.us',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

//GOTCHA: v8::internal::Heap::PerformGarbageCollection
// learn node perform garbage collection

const corsOptions = {
  methods: "GET,POST",
  origin: function (origin, callback) {
    console.log("[cors origin]",origin);//sometimes its undefined
    if(!origin){
      console.log(`[no origin detected]`,origin);
      return callback(null, true);
    }

    console.log(`[checking origin] ${origin} against whitelist`);
    if (whitelist.indexOf(origin) !== -1) {
      console.log(`[origin permitted]`,origin);
      callback(null, true)
    } else {
      console.log(`[origin not permitted]`,origin);
      callback('Not allowed by CORS')
    }//else
  }
}//corsOptions

module.exports = corsOptions;

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
