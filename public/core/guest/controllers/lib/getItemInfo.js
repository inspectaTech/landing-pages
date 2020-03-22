const chalk = require('chalk');
// const Item = require('../../models/item');
// const Pref = require('../../models/pref');
const Item = require('../../../../../models/item');
const Pref = require('../../../../../models/pref');
const { getPairObject, getInfoData } = require('./getData/get');
const getItemData = require('./getData/getItemData');
const { pairMyData } = require('./getData/pair');
const detachMyInfo = require('./detachMyInfo');
const mongoose = require('mongoose');

  const getItemInfo = async function(req, res)
  {

      console.log("addMyInfo running!");
      console.log("[getItemInfo] body ",req.body);
      console.log("[getItemInfo] body item_data ",req.body.item_data);
      console.log("[getItemInfo] body item_data id ",req.body.item_data._id);
      // console.log("[addMyInfo] type ", typeof req.body.arc_input);

    let item_data = req.body.item_data,
    return_obj = {},
    returnData = "",
    help_data = "",
    present_data_ids = [],
    admin_info_ids = "",
    hold_me = [],
    hold_ary = [],
    dual_ary = [],
    host_id = "",
    rows = "",/*req_data*/
    isValid = mongoose.Types.ObjectId.isValid,
    item_ancestor = item_data._id,
    valid_ancestor = isValid(item_data._id),
    ancestor_obj,
    type_array = ["media","info", "group"],
    item_type = (type_array.includes(item_data.display_data)) ? item_data.display_data : "media";
    let { mode = "none", page, limit } = req.body;

    console.log("[i am root]",item_data.root);

    try {

        // GET THE ITEM DATA HERE

        if(mode == "none"){
          rows = await Item.find({ user_id: item_data.user_id, ancestor: {$exists: true, $eq:item_ancestor}, type: item_type }).lean();
        }else {
          page = parseInt(page);
          limit = parseInt(limit);
          let start_at = (page - 1) * limit;
          rows = await Item.find({ user_id: item_data.user_id, ancestor: {$exists: true, $eq:item_ancestor}, type: item_type }).skip(start_at).limit(limit).lean();
        }


    return_obj.data = rows;

    if(item_data.eyes == "eyes only"){
      // return help_data;
      return_obj.help = help_data;
    }
    // return returnData;


      res.json({
        ...return_obj,
        message:"data updated successfully"
      });

    } catch (err) {
      console.log("[update Many ] error",err);

      res.json({
        message:"an error occured",
        error: err
      });
    }

  };//end getItemInfo

  module.exports = getItemInfo;
