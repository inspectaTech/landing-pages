// var whitelist = ['http://example1.com', 'http://example2.com'];
var whitelist = [
  'https://sunzao.us',
  'https://www.sunzao.us',
  'https://beta.sunzao.us'
];

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
    if(!origin) return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback('Not allowed by CORS')
    }//else
  }
}//corsOptions

module.exports = corsOptions;
