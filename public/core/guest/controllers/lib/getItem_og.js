
const mongoose = require('mongoose');
const chalk = require('chalk');
const getItemData = require('./getData/getItemData');
const {add_presets} = require('../../../../presets/getPresetData');
const { getAdvData } = require('../../../../alight/controllers/lib/getData/getAdvData');
const { set_container, is_container } = require('../../../../alight/controllers/lib/getData/container');
const { get_my_ancestors } = require('../../../../alight/controllers/lib/getData/get_my_ancestors');
const { getPairObject, getInfoData } = require('./getData/get');
const { getPureError } = require('./getData/error_manager');
const { pairMyData } = require('../../../../alight/controllers/lib/getData/pair');
const { add_auto_img } = require('./getData/add_auto_img');
const { exists, obj_exists } = require('./getData/exists');
const { backup_pair } = require('./getData/pair_item');
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

    if(display_console || false) console.log(chalk.bgMagenta("[guest getItem] guest running!"));
    if(display_console || false) console.log("[guest getItem] body ",req.body);
    if(display_console || false) console.log("[guest getItem] body item_data id ",req.body.item_id);

    let pair,
    item_data,
    // display_data = req.body.display_data,
    return_obj = {};

    let {
      item_id = req.body.item_id,
      pair_id = req.body.pair_id || "",
      link_id,
      host_id,
      mode,
      get_ancestors = false,
    } = req.body;

    if (exists(pair_id) || mode == "binder" || mode == "list") {

      // let query = mode == "binder" ? {link_id: new ObjectId(link_id), host_id: new ObjectId(host_id)} : 
      // { _id: new ObjectId(pair_id) };
      let query, item_ids;
      
      switch(mode){
        case "binder":
            query = {link_id: new ObjectId(link_id), host_id: new ObjectId(host_id)};
          break;

        case "list":
            item_ids = item_id.map((entry)=>{
              // i tested the aggregate view - it has to be ObjectId
              if (display_console || false) console.log(chalk.yellow("[guest getItem] item_id"), entry);
              return new ObjectId(entry);
            });

            query = { _id: { "$in": item_ids } }
            if (display_console || false) console.log(chalk.yellow("[guest getItem] query"), query);
          break;

        default:
          query = { _id: new ObjectId(pair_id) };
      }

      let pair_obj_ary = await getAdvData({
        query,
        info_ids: true,
        label: `[guest getItem]`,
      });// GOTCHA: merge failed - but i can run 2 requests instead

      if (display_console || false) console.log(chalk.yellow("[guest getItem] pair_obj_ary"), pair_obj_ary);

      item_data = Array.isArray(pair_obj_ary) && pair_obj_ary[0] ? pair_obj_ary[0] : null;

    }// if

    if(!item_data && mode != "list"){

        if(display_console || false) console.log(chalk.bgCyan("[guest getItem] running new backup_pair!"));
      
        // item_data = await getItemData(item_id);
        item_data = await backup_pair({ pair_id: item_id });

        if (display_console || 1) console.log(chalk.yellow("[guest getItem] item_data"), item_data);
  
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

    // this is kind of redundant - but i don't want to rely on info_ids only - i eventually want to DEPRECATE them
      item_data['container'] = await is_container({id: item_data._id});
      if(display_console || false) console.log(chalk.bgGreen("[guest getItem] container"),item_data.container);

    /**
     * @callback add_presets
     * @desc adds preset data to each item in the array of nested/related item data
     * @requires getPresetData
     */
    if(item_data) await add_presets({rows:[item_data]});
    if(item_data) await add_auto_img({rows:[item_data]});

    if(get_ancestors){
      let ancestor_list = await get_my_ancestors({ ancestor: item_data.host_id, root: false }, true);
      item_data.ancestor_list = ancestor_list;
    }// if

    if(display_console || false) console.log(chalk.green("[guest getItem] item_data"),item_data);

    return_obj.data = item_data;

    res.json({
      ...return_obj,
      message:"data retrieved successfully"
    });

  } catch (err) {
    console.log(chalk.red("[guest getItem] error"),err);

    let err_obj = getPureError(err);

    if (display_console || false){
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
