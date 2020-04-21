// CHANGING SECTION

const path = require('path');
const express = require('express');
const app = express();
// var http = require('http').Server(app);// added for socket.io
// const io = require('socket.io')(http);
const hbs = require('hbs');
const chalk = require('chalk');
const bodyParser = require("body-parser");
const cors = require('cors');// make sure not just anyone can use my post requests
var os = require('os');
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('./oauth_server/passport');
const Keys = require('./utils/keys').mongodb;

const corsOptions = require('./utils/cors-options.js');
const process_memory = require('./utils/process_memory.js');
let PORT = (os.hostname().includes("sunzao")) ? 1027 : 3000 ;// local doesn't work because my laptop was 'DESKTOP' not local
// let dbConnect = (os.hostname().includes("sunzao")) ? 'mongodb://167.99.57.20:27017/APIAuthentication' : 'mongodb://localhost/APIAuthentication' ;

// app.set('socketio', io);

// set up mongoose
// let dbConnect = 'mongodb://localhost/SunzaoAlight';// what is this in production?
let dbConnect = (os.hostname().includes("sunzao")) ? Keys.liveDB : Keys.db;// what is this in production?
mongoose.connect(dbConnect,{ useNewUrlParser: true });
// mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// [mongoose deprecations](https://mongoosejs.com/docs/deprecations.html#-findandmodify-)

// console.log("[port]",os.hostname);


//routers
// const landingpagesRouter = require("./routers/lead-pages");
const appspagesRouter = require("../public/apps/routers/apps");
const detailsPagesRouter = require("../public/alight/routers/details/details");
const detailsApi = require("../public/alight/routers/details/api");
const arcPagesRouter = require("../public/alight/routers/alight");
const arcAPIRouter = require("../public/alight/routers/api");
const ppAPIRouter = require("../public/profile-panel/routers/api");
const businessRouter = require("../public/business/routers/business");
const updraftRouter = require("../public/updraftjs/routers/updraft");
const updraftApi = require("../public/updraftjs/routers/api");
const rocketRouter = require("../public/rocket/routers/rocket");
// const liftoffRouter = require("../public/rocket/routers/liftoff");


// const {appspagesRouter} = require("../public/apps/routers/apps");// i want to use this version as a hub for routers


// console.log('forecast = ',forecast);

console.log(`[dirname]`,__dirname);
console.log(`[dirname public path]`,path.join(__dirname,"../public"));


// const app = express();
//GOTCHA: when i tried to leave the files in templates instead of templates/views it failed

// mongo db setup
app.use(express.json());//bodyParser.json - no longer bodyParser

// set up location of the hbs views files
const viewsPath = path.join(__dirname,"../templates/views");// default views location
const appsPath = path.join(__dirname,"../public/apps/views");
const alightPath = path.join(__dirname,"../public/alight/views");
const oauthClientPath = path.join(__dirname,"../public/oauth_client/views");// client side auth
const businessPath = path.join(__dirname,"../public/business/views");
const updraftPath = path.join(__dirname,"../public/updraftjs/views");
const rocketPath = path.join(__dirname,"../public/rocket/views");

//setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', [viewsPath, appsPath, alightPath, oauthClientPath, businessPath, updraftPath, rocketPath]);//this works

// set up the partials path
const partialsPath = path.join(__dirname,"../templates/partials");
const qpPartialsPath = path.join(__dirname,"../public/quick-panel/views");
const qlPartialsPath = path.join(__dirname,"../public/quick-link/views");
const pPPath = path.join(__dirname,"../public/profile-panel/views");
const oauthClientPartialsPath = path.join(__dirname,"../public/oauth_client/views");// client side auth
const bizPartialsPath = path.join(__dirname,"../public/business/views");
const alightPartialPath = path.join(__dirname,"../public/alight/views");
const updraftPartialPath = path.join(__dirname,"../public/updraftjs/views");
const firebasePartialPath = path.join(__dirname,"../public/d3firebase");
const rocketPartialPath = path.join(__dirname,"../public/rocket/views");
// console.log("[partialsPath]",partialsPath);
// console.log("[qlPartialsPath]",qpPartialsPath);
// console.log("[qlPartialsPath]",qlPartialsPath);
console.log("[pPPath]",pPPath);
hbs.registerPartials(partialsPath);
hbs.registerPartials(qpPartialsPath);
hbs.registerPartials(qlPartialsPath);
hbs.registerPartials(pPPath);
hbs.registerPartials(oauthClientPartialsPath);// client side auth
hbs.registerPartials(bizPartialsPath);
hbs.registerPartials(alightPartialPath);
hbs.registerPartials(updraftPartialPath);
hbs.registerPartials(firebasePartialPath);
hbs.registerPartials(rocketPartialPath);
// hbs.registerPartial(partialsPath);

hbs.registerHelper('json', function(context) {
    let data_str = JSON.stringify(context);
    return JSON.stringify(data_str);
});

hbs.registerHelper('vendor', function(name, use_local_files) {
  console.log(chalk.red(`[vendor] use_local_files`),name, typeof name);
  console.log(chalk.red(`[vendor] use_local_files`),use_local_files, typeof use_local_files);
    return (typeof use_local_files == "string" && use_local_files == "true") ? `${name}_local` : name;
});



// path to public directory - where to find external files
//setup static directory to serve - server default/root
// this along with the nginx server location blocks directs paths to specific 'public' site directories
const publicDirectoryPath = path.join(__dirname,"../public");
// app.use('/req',express.static(publicDirectoryPath));
// app.use('/apps',express.static(publicDirectoryPath));
// app.use('/light',express.static(publicDirectoryPath));

// set the public path for the link and script urls found in the views directories
app.use('/',express.static(publicDirectoryPath));
app.use('/core',express.static(publicDirectoryPath));
app.use('/details',express.static(publicDirectoryPath));//
app.use('/details/:val1?',express.static(publicDirectoryPath));// needed for the links and scripts to work
app.use('/details/:val1?/:val2?',express.static(publicDirectoryPath));// needed for the links and scripts to work
// app.use('/view/:val1?/:val2?/:val3?',express.static(publicDirectoryPath));// needed for the links and scripts to work
app.use('/auth',express.static(publicDirectoryPath));// client side auth
app.use('/brand',express.static(publicDirectoryPath));

app.use('/updraft',express.static(publicDirectoryPath));//
app.use('/updraft/:val1?',express.static(publicDirectoryPath));// needed for the links and scripts to work
app.use('/updraft/:val1?/:val2?',express.static(publicDirectoryPath));// needed for the links and scripts to work
app.use('/rocket',express.static(publicDirectoryPath));
// app.use('/liftoff',express.static(publicDirectoryPath));

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
// app.use(express.json());

// app.use(express.static(publicDirectoryPath));// formerly

// app.use('/req',nR_Proxy);

// setup all routers
// app.use(landingpagesRouter);
// app.use(appspagesRouter);
// app.use('/apps',appspagesRouter);//this sets up the router path so i don't have to add it to each route
// app.use('/light',arcPagesRouter);

// set the routers for paths not found in the views link and script tags
app.use('/core',arcPagesRouter);
app.use('/details',detailsPagesRouter);
app.use('/api/details',detailsApi);
// app.use('/view/:val1?',detailsPagesRouter);// not needed - contaminates the params with links and scripts
// app.use('/view/:val1?/:val2?',detailsPagesRouter);// not needed - contaminates the params with links and scripts
// app.use('/view/:val1?/:val2?/:val3?',detailsPagesRouter);// not needed - contaminates the params with links and scripts
app.use('/auth', require('../public/oauth_client/routers/auth'));// client side auth
app.use('/brand', require('../public/business/routers/business'));
app.use('/api/auth', require('./oauth_server/routers/oauth'));// server side auth
app.use('/api/alight', arcAPIRouter);// server side auth
app.use('/api/profile', ppAPIRouter);// server side auth
app.use('/updraft',updraftRouter);// similar to details
app.use('/api/updraft',updraftApi);
app.use('/rocket',rocketRouter);
// app.use('/socket.io',liftoffRouter);


// app.options('*', cors(corsOptions),function(req,res){
//   res.setHeader("Access-Control-Allow-Origin",`*`);
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.end();
// });


  app.get('/', (req, res) => {
    // res.send('Help page')
    res.redirect('/core');
  })

  //catchall has to be last to work
  app.get('*', cors(corsOptions), (req, res) => {
    // res.send('my 404 page')
    console.log('[express server] rendering 404')
    res.render('404', {
      title:'404',
      errorMessage:'page not found'
    });

  });

// app.get('/help', (req, res) => {
//   res.send('Help page')
// })
// in this case '/help' and '/help.html' in the public folder are both running

console.log("[prepping server] ... ");

// http.listen(PORT, () => {
app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}.`);
  process_memory();
})

// process.exit();// i don't need this unless i want to exit the script
