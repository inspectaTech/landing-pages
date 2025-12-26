const chalk = require('chalk');
const gI = require('../../../../alight/controllers/lib/getItem');


const getItem = async function(req, res){

  
  try {
    
    const obj = {
      guest: true,
    };
  
    gI(req, res, obj);
    

  } catch (e) {
    let err_msg = "[guest/getItem] an error occured";
    console.error(chalk.red(err_msg), e);
    res.json({
      message: err_msg,
      error: e
    });
  }

}// getItem

module.exports = getItem;
