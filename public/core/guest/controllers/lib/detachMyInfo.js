const chalk = require('chalk');

const getItemData = require('./getData/getItemData');
const {processPair} = require('./getData/pair');

const detachMyInfo = async function(req, res)
{
  let error_msg = "[detachMyInfo] error: ";

  try {

  console.log(chalk.yellow(`[detachMyInfo] body`),req.body);

  let dtchStr = req.body;// .data

  let retData = "";


  let detach_obj = (typeof dtchStr == "string") ? JSON.parse(dtchStr) : dtchStr ;

  let host_data = detach_obj.host_data;
  //return "host data = " . json_encode(host_data);

  let del_obj = {};// (object)[]
  del_obj.display_data = "detachMyInfo";
  del_obj.host_id = host_data._id;
  //return "host data data_id = " . host_data.data_id;


    let full_host_data = await getItemData(host_data._id);
    // echo "full host user id = " . full_host_data.user_id;

    if(full_host_data){

      del_obj.link_id = detach_obj.link_id;
      del_obj.pair_table = '#__arc_pair_host_link';
      del_obj.owner_id = full_host_data.user_id;
      del_obj.editor_id = req.user._id;
      del_obj.mode = "delete";
      // retData .= "delete obj = " . json_encode(del_obj);

      let pp_dta = await processPair(del_obj);
      retData += pp_dta;

      // return retData;
      res.json({
        /*data: update_obj,*/
        message: retData,
      });
    }else{
      error_msg += "no host data found"
      console.log(chalk.red(error_msg));
      res.json({
        message:error_msg
      });
    }//else

  } catch (e) {
    error_msg += "an error occured"
    console.log(chalk.red(error_msg),e);
    res.json({
      message: error_msg,
      error: true
    });
  }

};//detachMyInfo

module.exports = detachMyInfo;
