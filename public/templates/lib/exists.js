  // const {exists} = require('./lib/tools/exists.js');
export const exists = (item, empty_strings_are_ok) => {
  // by default the item does not exist if empty string ("")
  try {
    let the_verdict = (item != null && typeof item != "undefined" && item != false) ? true : false;
    
    // special condition for empty objects
    if(item != null && typeof item == "object" && !empty_strings_are_ok){
      // the_verdict = JSON.stringify(item) == "{}" ? false : true;
      the_verdict = Object.keys(item).length === 0 ? false : true;
    }

    if(empty_strings_are_ok){
      // it has a value, the value is just empty
      let alt_verdict = (item == "" || item === 0 || item == false) ? true : the_verdict;
      return alt_verdict;
    }else {
      return the_verdict;
    }
  } catch (err) {

    console.log(`[exists] error`,err);
    return false;
  }
}// exists

// module.exports = {exists}
