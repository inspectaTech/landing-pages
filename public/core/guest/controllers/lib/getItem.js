
const mongoose = require('mongoose');
const chalk = require('chalk');
const getItemData = require('./getData/getItemData');
const {add_presets} = require('../../../../presets/getPresetData');
const { getAdvData } = require('../../../../alight/controllers/lib/getData/getAdvData');
const { set_container } = require('./getData/container');
const { getPairObject, getInfoData } = require('./getData/get');
const { getPureError } = require('./getData/error_manager');
const { pairMyData } = require('./getData/pair');
const { add_auto_img } = require('./getData/add_auto_img');
const { exists, obj_exists } = require('./getData/exists');
const display_console = false;
const ObjectId = mongoose.Types.ObjectId;
/**
   * @module guest-getItem
   * @category Server
   * @subcategory guest
   * @desc gets guest accessible item data with presets for Paper and Clips
   * @param  {object} req request object - holds the request data req.body
   * @param  {object} res holds the requests response data
   * @requires Paper
   * @requires Clips
 */

/**
 * @file
 */

const getItem = async function(req, res){

  try {

    if(display_console || false) console.log("addMyInfo running!");
    if(display_console || false) console.log("[getItemInfo] body ",req.body);
    if(display_console || false) console.log("[getItemInfo] body item_data id ",req.body.item_id);

    let item_id = req.body.item_id,
    pair_id = req.body.pair_id || "",
    pair,
    item_data,
    // display_data = req.body.display_data,
    return_obj = {};

    if (exists(pair_id)) {
      let pair_obj_ary = await getAdvData({
        query: { _id: new ObjectId(pair_id) },
        info_ids: true,
      });// GOTCHA: merge failed - but i can run 2 requests instead

      if (display_console || false) console.log(chalk.yellow("[getItem] agg. pair_obj_ary"), pair_obj_ary);

      item_data = Array.isArray(pair_obj_ary) && pair_obj_ary[0] ? pair_obj_ary[0] : null;

    }// if

    if(!item_data){
      
        item_data = await getItemData(item_id);
  
        // get pair data
        let prep_pair_obj = await getPairObject(item_data, item_data.type/*, item_data.user_id*/);//preps a pair request using ancestor object
        // let prep_pair_obj = await getPairObject(rows[x], display_data, req.user._id)
  
        // get this ancestors pair data
        // take teh preped pair object and make a request with it
        let _pair_data = await pairMyData(prep_pair_obj);
        //return json_encode(get_pair_data);
  
        //this is going to change now that i updated the initiate_starter_data method
        // take the items pair ids and add them to the items info ids property
        if(_pair_data != ""){
          item_data['info_ids'] = _pair_data;
          // if not a collection, make it a collection
          //find this items ancestor and make sure its marked as a container
        }// if
    }// if

    if (obj_exists(item_data, "info_ids")) {
      item_data['container'] = 1;
      await set_container(item_data._id, "set");
    }// if

    /**
     * @callback add_presets
     * @desc adds preset data to each item in the array of nested/related item data
     * @requires getPresetData
     */
    await add_presets({rows:[item_data]});
    await add_auto_img({rows:[item_data]});

    if(display_console || false) console.log(chalk.green("[getItemInfo] item_data"),item_data);

    return_obj.data = item_data;

    res.json({
      ...return_obj,
      message:"data retrieved successfully"
    });

  } catch (err) {
    console.log(chalk.red("[guest getItem] error"),err);

    let err_obj = getPureError(err);

    if (display_console || true){
      // do nothing
      res.json({
        message: "an error occured",
        error: err_obj
      });
    }else{
      // don't deliver any error info
      res.json({
        message: "an error occured",
        error: true
      });
    }

  }//catch

}// getItem

module.exports = getItem;
