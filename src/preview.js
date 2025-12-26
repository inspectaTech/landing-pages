const path = require('path');
const express = require('express')
const hbs = require('hbs');
const app = express();
var os = require('os');


const Keys = require('../configuration/keys').mongodb;
const { SITE_SERVER, HOSTNAME } = require('../configuration/keys');
const process_memory = require('./utils/process_memory.js');

const display_console = false;

if(display_console || false) console.log(`[server] Keys`,Keys);
if(display_console || true) console.log(`[server] key hostname`, HOSTNAME);
if(display_console || true) console.log(`[server] os.hostname()`, os.hostname());
if(display_console || false) console.log(`[server] SITE_SERVER`, SITE_SERVER);

const PORT = (os.hostname().includes(HOSTNAME)) ? 1024 : 3001;// NOTE DOCS: live port is 1024 in main server block

app.use(express.json());//bodyParser.json - no longer bodyParser

// set public path directory for each route
const publicDirectoryPath = path.join(__dirname,"public");

// set the public path for the link and script urls found in the views directories
app.use('/preview',express.static(publicDirectoryPath));

// set the routers for paths not found in the views link and script tags
const previewRouter = require("../public/alight/routers/previews/preview");// normally top of file
app.use('/preview',previewRouter);

// route
// app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`listening at PORT ${PORT}`))