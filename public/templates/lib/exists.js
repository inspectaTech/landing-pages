  // const {exists} = require('./lib/tools/exists.js');
const exists = (item) => {
  return (item != null && typeof item != "undefined" && item != false) ? true : false;
}

module.exports = {exists}
