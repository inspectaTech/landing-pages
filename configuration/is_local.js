var os = require('os');
const { SITE_SERVER, HOSTNAME } = require('./keys');
const display_console = true;

const is_local = (log = false) => { 
  let live_detector = (os.hostname().includes(HOSTNAME));
  
  if(display_console || 0 || log) console.log(`[server] key hostname`, HOSTNAME);
  if(display_console || 0 || log) console.log(`[server] os.hostname()`, os.hostname());
  if(display_console || 0 || log) console.log(`[is_local] live_detector`, live_detector)
  return  live_detector ? false : true;
}// is_local

const is_live = (log = false) => {
  return !is_local(log);
}

module.exports = {
  is_local,
  is_live
}