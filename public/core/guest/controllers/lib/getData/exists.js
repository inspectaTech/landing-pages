
const exists = (item, notEmpty) => {
  let exists = (item != null && typeof item != "undefined" && item != false) ? true : false;

  if(notEmpty){
    return (exists && item != "") ? true : false;
  }else {
    return exists;
  }
}// exists

module.exports = {exists}
