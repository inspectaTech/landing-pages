// CHANGING SECTION

const path = require('path');
const express = require('express');
const app = express();
// var http = require('http').Server(app);// added for socket.io
// const io = require('socket.io')(http);
const hbs = require('hbs');
const chalk = require('chalk');
// const bodyParser = require("body-parser");
const cors = require('cors');// make sure not just anyone can use my post requests
var os = require('os');
const mongoose = require('mongoose');
const passport = require('passport');
const passportConfig = require('./oauth_server/passport');// OAUTH
// const Keys = require('./utils/keys').mongodb;
// const {SITE_SERVER, HOSTNAME} = require('./utils/keys');
const Keys = require('../configuration/keys').mongodb;
const { SITE_SERVER, HOSTNAME } = require('../configuration/keys');

const corsOptions = require('./utils/cors-options.js');
const process_memory = require('./utils/process_memory.js');
const display_console = false;

if(display_console || false) console.log(`[server] Keys`,Keys);

// GOTCHA: make sure Keys hostname matches os.hostname (don't use subdomain name in .env file)
if(display_console || true) console.log(`[server] key hostname`, HOSTNAME);
if(display_console || true) console.log(`[server] hostname`, os.hostname());
if(display_console || false) console.log(`[server] SITE_SERVER`, SITE_SERVER);

const SERVER_PORT = typeof SITE_SERVER != "undefined" && SITE_SERVER == "beta" ? 1028 : 1027;

let PORT = (os.hostname().includes(HOSTNAME)) ? SERVER_PORT : 3000 ;// local doesn't work because my laptop was 'DESKTOP' not local
// let dbConnect = (os.hostname().includes("sunzao")) ? 'mongodb://167.99.57.20:27017/APIAuthentication' : 'mongodb://localhost/APIAuthentication' ;

// app.set('socketio', io);
/**
 * @module express-server
 * @category Server
 * @subcategory server
 * @desc express server
 */

/**
 * @file
 */

// set up mongoose
// let dbConnect = 'mongodb://localhost/SunzaoAlight';// what is this in production?
let dbConnect = (os.hostname().includes(HOSTNAME)) ? Keys.liveDB : Keys.db;// what is this in production?
mongoose.connect(dbConnect,{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// [mongoose deprecations](https://mongoosejs.com/docs/deprecations.html#-findandmodify-)

// if(display_console || false) console.log("[port]",os.hostname);


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
const oauthClientRouter = require('../public/oauth_client/routers/auth');
const oauthServerRouter = require('./oauth_server/routers/oauth');
// const liftoffRouter = require("../public/rocket/routers/liftoff");


// const {appspagesRouter} = require("../public/apps/routers/apps");// i want to use this version as a hub for routers


// if(display_console || false) console.log('forecast = ',forecast);

if(display_console || false) console.log(`[dirname]`,__dirname);
if(display_console || false) console.log(`[dirname public path]`,path.join(__dirname,"../public"));


// const app = express();
//GOTCHA: when i tried to leave the files in templates instead of templates/views it failed

// mongo db setup
app.use(express.json());//bodyParser.json - no longer bodyParser

// set up location of the hbs views files
const viewsPath = path.join(__dirname,"../templates/views");// default views location
const appsPath = path.join(__dirname,"../public/apps/views");
const alightPath = path.join(__dirname,"../public/alight/views");
const oauthClientPath = path.join(__dirname,"../public/oauth_client/views");// client side auth OAUTH
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
const oauthClientPartialsPath = path.join(__dirname,"../public/oauth_client/views");// client side auth OAUTH
const bizPartialsPath = path.join(__dirname,"../public/business/views");
const alightPartialPath = path.join(__dirname,"../public/alight/views");
const updraftPartialPath = path.join(__dirname,"../public/updraftjs/views");
const firebasePartialPath = path.join(__dirname,"../public/d3firebase");
const rocketPartialPath = path.join(__dirname,"../public/rocket/views");
// if(display_console || false) console.log("[partialsPath]",partialsPath);
// if(display_console || false) console.log("[qlPartialsPath]",qpPartialsPath);
// if(display_console || false) console.log("[qlPartialsPath]",qlPartialsPath);
if(display_console || false) console.log("[pPPath]",pPPath);
hbs.registerPartials(partialsPath);
hbs.registerPartials(qpPartialsPath);
hbs.registerPartials(qlPartialsPath);
hbs.registerPartials(pPPath);
hbs.registerPartials(oauthClientPartialsPath);
hbs.registerPartials(bizPartialsPath);
hbs.registerPartials(alightPartialPath);
hbs.registerPartials(updraftPartialPath);
hbs.registerPartials(firebasePartialPath);
hbs.registerPartials(rocketPartialPath);
// hbs.registerPartial(partialsPath);

hbs.registerHelper('json', function(context) {
  // why stringify the data?
    let data_str = JSON.stringify(context);
    return JSON.stringify(data_str);
});

hbs.registerHelper('vendor', function(name, use_local_files, force_local) {
  if(display_console || true) console.log(chalk.red(`[vendor] use_local_files name = `),name, typeof name);
  if(display_console || true) console.log(chalk.red(`[vendor] use_local_files`),use_local_files, typeof use_local_files);
  // if(display_console || false) console.log(chalk.red(`[vendor] force_local`),force_local, typeof force_local);
  let force_local_file = (typeof force_local == "boolean" && force_local == true) ? true : false;
    return (typeof use_local_files == "string" && use_local_files == "true" || force_local_file ) ? `${name}_local` : name;
});

hbs.registerHelper('fireman', function (name, use_local_files, force_local) {
  // if (display_console || true) console.log(chalk.red(`[vendor] use_local_files name = `), name, typeof name);
  // if (display_console || true) console.log(chalk.red(`[vendor] use_local_files`), use_local_files, typeof use_local_files);
  // // if(display_console || false) console.log(chalk.red(`[vendor] force_local`),force_local, typeof force_local);
  // let force_local_file = (typeof force_local == "boolean" && force_local == true) ? true : false;
  // return (typeof use_local_files == "string" && use_local_files == "true" || force_local_file) ? `${name}_local` : name;
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
app.use('/core/:val1?',express.static(publicDirectoryPath));

// i had this commented out when there was only one value - why did i need to not have this?
// did it make a difference not having it while only using val1?
app.use('/core/:val1?/:val2?',express.static(publicDirectoryPath));
//i did see this comment written below, maybe this was why it was commented out? | not needed - contaminates the params with links and scripts

app.use('/details',express.static(publicDirectoryPath));//
app.use('/details/:val1?',express.static(publicDirectoryPath));// needed for the links and scripts to work
// app.use('/details/:val1?/:val2?',express.static(publicDirectoryPath));// needed for the links and scripts to work // deprecated
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
app.use('/auth', oauthClientRouter);// client side auth
app.use('/api/auth', oauthServerRouter);// server side auth
app.use('/brand', require('../public/business/routers/business'));
app.use('/api/alight', arcAPIRouter);// server side auth
app.use('/api/profile', ppAPIRouter);// server side auth
app.use('/updraft',updraftRouter);// similar to details
app.use('/api/updraft',updraftApi);
app.use('/rocket',rocketRouter);
// app.use('/socket.io',liftoffRouter);


// app.options('*', /*cors(corsOptions),*/function(req,res){
//   // this seems to do nothing
//   if(display_console || true) console.log(chalk.yellow('[express server]setting Access-Control header'));
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
    if (display_console || true) console.log('[express server] rendering 404', req.originalUrl);
    res.render('404', {
      title:'404',
      errorMessage:'page not found'
    });

  });

// app.get('/help', (req, res) => {
//   res.send('Help page')
// })
// in this case '/help' and '/help.html' in the public folder are both running

if(display_console || true) console.log("[prepping server] ... ");

// http.listen(PORT, () => {
app.listen(PORT, () => {
  console.log(`[process] versions`, process.versions);
  if(display_console || true) console.log(`Server is up on port ${PORT}.`);
  process_memory();
})

// process.exit();// i don't need this unless i want to exit the script
