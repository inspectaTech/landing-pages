
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
const { backup_pair } = require('./getData/pair_item');
const display_console = false;
const ObjectId = mongoose.Types.ObjectId;
/**
   * @module guest-getItems
   * @category Server
   * @subcategory guest
   * @desc gets guest accessible item data with presets for Paper and Clips
   * NOTE: diff - getItem vs getItems - i think this one is newer
   * @param  {object} req request object - holds the request data req.body
   * @param  {object} res holds the requests response data
   * @requires Paper
   * @requires Clips
 */

/**
 * @file
 */

const getItems = async function(req, res){

  try {

    if(display_console || false) console.log("[guest/getItems] running!");
    if(display_console || 1) console.log("[guest/getItems] body ",req.body);
    if(display_console || false) console.log("[guest/getItems] body rows id ",req.body.item_id);

    let pair,
    rows,
    // display_data = req.body.display_data,
    return_obj = {};

    let {
      item_id = req.body.item_id,
      // pair_id = req.body.pair_id || "",
      // link_id,
      host_id,
      host_project_id,
      id,
      mode,
      size = 4,
    } = req.body;


      // let query = mode == "binder" ? {link_id: new ObjectId(link_id), host_id: new ObjectId(host_id)} : 
      // { _id: new ObjectId(pair_id) };
      let query, 
      item_ids,
      pair_obj_ary,
      host_obj_ary,
      published = true,// NOTE: lets treat all this part like guests
      is_logged_in = (typeof req.user != "undefined") ? true : false;
      pre_req = {},
      data_req = {
        // info_ids: true,// do i need info_ids?
      }

      // if(!is_logged_in || req.user.project_id != ancestor_obj.project_id){
      //   // if not logged in or doesn't have project access - only show published
      //   if(display_console || false) console.log(chalk.bgMagenta("[getMoreInfo] prepping pin_published? "));

      //   published = true;
      // }// is_logged_in
      
      
      switch(mode){

        case "list":
            item_ids = item_id.map((entry)=>{
              if (display_console || false) console.log(chalk.yellow("[guest/getItems] item_id"), entry);
              return new ObjectId(entry);
            });


            data_req.query = { _id: { "$in": item_ids } };
            data_req.query2 = {published: true, type: "media"};

            if (display_console || false) console.log(chalk.yellow("[guest/getItems] query"), query);

            pair_obj_ary = await getAdvData(data_req);// GOTCHA: merge failed - but i can run 2 requests instead

            if (display_console || false) console.log(chalk.yellow("[guest/getItems] agg. pair_obj_ary"), pair_obj_ary);

            rows = Array.isArray(pair_obj_ary) ? pair_obj_ary : null;
          break;

        case "similar":
            // get sample of shared binders (binders that also have this item attached)

            pre_req.query = { "link_id": new ObjectId(item_id), "host_id": {"$ne": new ObjectId(item_id)}, "host_project_id": new ObjectId(host_project_id)}
            pre_req.more = [{"$project":{host_id: 1, _id: 0}},{"$sample":{size}}];
            pre_req.unlimited = true;
            // pre_req.limit = 4;// WORKS without limit - GOTCHA with limit - only reorders first 4 selected records
            pre_req.label = `[guest/getItems][similar][pre_req]`; 
            // pre_req.vp = true;
            pre_req.query2 = {published: true, type: "media"};

            if (display_console || 1) console.log(chalk.yellow("[guest/getItems] similar query"), pre_req.query);

            host_obj_ary = await getAdvData(pre_req);

            
            host_obj_ary = host_obj_ary.map((entry)=>{
              return new ObjectId(entry.host_id);
            });

            if (display_console || false) console.log(chalk.yellow("[guest/getItems] agg. host_obj_ary"), host_obj_ary[0]);
            
            data_req.query = { _id: { "$in": host_obj_ary } }

            data_req.query2 = {published: true, type: "media"};

            data_req.label = `[guest/getItems][similar][data_req]`; 

            // request_data.limit = 3;

            pair_obj_ary = await getAdvData(data_req);// GOTCHA: merge failed - but i can run 2 requests instead

            if (display_console || false) console.log(chalk.yellow("[guest/getItems] agg. pair_obj_ary"), pair_obj_ary);

            rows = Array.isArray(pair_obj_ary) ? pair_obj_ary : null;
          break;

          case "related":
            // sample item siblings

            data_req.query = { "host_id": new ObjectId(host_id) };
            data_req.label = `[guest/getItems][related]`; 
            data_req.more = [{"$sample":{size}}];
            data_req.unlimited = true;
            // data_req.limit = 4;// WORKS without limit - GOTCHA with limit - only reorders first 4 selected records
            data_req.query2 = {published: true, type: "media"};

            if (display_console || false) console.log(chalk.yellow("[guest/getItems] related query"), data_req.query);

            pair_obj_ary = await getAdvData(data_req);// GOTCHA: merge failed - but i can run 2 requests instead

            if (display_console || false) console.log(chalk.yellow("[guest/getItems] agg. pair_obj_ary"), pair_obj_ary);

            rows = Array.isArray(pair_obj_ary) ? pair_obj_ary : null;

            // request_data.limit = 3;
          break;
      }

      if(display_console || mode == "similar" && 0) console.log(chalk.green("[guest/getItems] row"),rows[0]);


    /**
     * @callback add_presets
     * @desc adds preset data to each item in the array of nested/related item data
     * @requires getPresetData
     */
    if(rows) await add_presets({rows});
    if(rows) await add_auto_img({rows});

    if(display_console || false) console.log(chalk.green("[guest/getItems] rows"),rows);
    if(display_console || 0) console.log(chalk.green("[guest/getItems] rows length"),rows.length);

    return_obj.data = rows;

    res.json({
      ...return_obj,
      message:"data retrieved successfully"
    });

  } catch (err) {
    console.log(chalk.red("[guest/getItem] error"),err);

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

module.exports = getItems;
