const chalk = require('chalk');
const Pair = require('../../../models/pair');// centralized models

const unpair = async ({host_id, link_id, owner_id, mode}) => {
  try{

    console.log(chalk.yellowBright("[unpair] delete entered"), link_id);
    let del_results;

    switch (mode) {
      case "all":
      // it needs a where you are either the owner or the editor
      del_results = await Pair.deleteMany({ link_id, owner_id });
      console.log(chalk.yellowBright("[unpair] delete results"),del_results);
      //return results;
      break;
      default:
      // it needs a where you are either the owner or the editor
      del_results = await Pair.deleteOne({ host_id, link_id, owner_id });
      console.log(chalk.yellowBright("[unpair] delete results"),del_results);
      //return results;

    }
    if(!del_results){
      return {
        error: true,
        message: ` delete pairing failed and del_results = ${del_results}`
      };
    }else {
      return {
        error: false,
        message: `delete pairing success and del_results = ${del_results}`
      };
    }
  }catch(err){
    let error_msg = "[unpair] an unpairing issue has occured.";
    console.log(chalk.red(error_msg),err);
    throw new Error(error_msg)
    return {
      error: true,
      message: error_msg,
      data: err
    }
  }
}// unpair

module.exports = {
  unpair
}
