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

const display_console = false;

  const getItemPairs = async function(req, res)
  {

      if(display_console) console.log("addMyInfo running!");
      if(display_console) console.log("[guest/getItemPairs] body ",req.body);
      if(display_console) console.log("[guest/getItemPairs] body item_data ",req.body.item_data);
      if(display_console) console.log("[guest/getItemPairs] body item_data id ",req.body.item_data._id);
      // if(display_console) console.log("[addMyInfo] type ", typeof req.body.arc_input);

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
    rows = [],/*req_data*/
    isValid = mongoose.Types.ObjectId.isValid,
    item_ancestor = item_data._id,
    valid_ancestor = isValid(item_data._id),
    ancestor_obj,
    type_array = ["media","info", "group"],
    item_type = (type_array.includes(item_data.display_data)) ? item_data.display_data : "media";
    let { mode = "none", page, limit } = req.body;

    if(display_console) console.log("[i am root]",item_data.root);

    try {
      // let updated = await Item.update({"order":0}, {$set:{desc_data: ""}}, {multi:true});// worked
      // let updated = await Item.update({"order":0}, {$unset:{desc_data: ""}}, {multi:true});// worked
      // let updated = await Item.updateMany({}, {desc_data: ""});// worked
      // let updated = await Item.updateMany({}, {$rename:{"description": "desc_data"}});//failed until schema

        if(display_console) console.log("[guest/getItemPairs][ancestor] searching....");
        // [using equals](https://docs.mongodb.com/manual/reference/operator/query/eq/#op._S_eq)

        // NO ITEM DATA

        // here i used exists == true to only find documents were the ancestor field exists and also equals the
        // item_ancestor ObjectId - without exists it will include items where the ancestor doesn't exist at all
        // if(display_console) console.log("[req_data]",req_data);

        ancestor_obj = await getItemData(item_ancestor);
        // get the ancestors ordering format
        return_obj.filter = (ancestor_obj && ancestor_obj.filter != undefined) ? ancestor_obj.filter : "alpha";


      if(display_console) console.log("[guest/getItemPairs][updating many]");



    // Item.updateMany({}, {"$set":{"desc_data": ""}});
    // Item.updateMany({}, {"$rename":{"description": "desc_data"}});


    item_data.data_category = item_data.data_category || "";
    item_data.eyes = item_data.eyes || "";

    let display_data = item_data.display_data;
    let data_mode = item_data.data_mode;//in js "data" : "part" there isn't a full right now
    let data_category = item_data.data_category;


    let info_table = '#__arc_item_data' ;



      // for data and full modes
      // data_mode == "data"
      if(display_console) console.log(chalk.yellow("[guest/getItemPairs][rows] length"),rows.length);
      // this section is deprecated
      for(let y = 0; y < rows.length; y++)
      {
        if(display_console) console.log(chalk.yellow("[guest/getItemPairs][rows] for loop entered..."));
        //I have to get this on a case by case basis.
        //get my pair data

        //make an array of ids for comparison to pair_ids to eliminate duplicates
        present_data_ids.push(rows[y]['_id']);

        //this limits the info_ids to admin tabs only in data mode
        // full mode gets all info_ids
        // if(data_mode == "data" && rows[l]['admin'] != 1){continue;}// deprecated
        // finds the admin's info ids

        //prepare the object to help get the pair data
        //- needed to avoid duplicate code blocks (shortens code)
        // if(display_console) console.log(chalk.red(`[getPairObject] rows[${l}]`),rows[l]);
        // forms the pair object request instructions
        let prep_pair_obj = await getPairObject(rows[y], display_data/*, item_data.user_id*/);//preps a pair request using ancestor object

        // get this ancestors pair data
        let _pair_data = await pairMyData(prep_pair_obj);
        //return json_encode(get_pair_data);

        //this is going to change now that i updated the initiate_starter_data method
        if(_pair_data != ""){
          rows[y]['info_ids'] = _pair_data;
          //save the string of info_ids
          //deprecated
          // if(data_mode == "data" && rows[l]['admin'] == 1){
          //   admin_info_ids = _pair_data;
          // }//if
        }

      }//end for

      if(data_mode != "data" && ancestor_obj){
        //get the ancestors data_id
        // ancestor_obj = this.getItemData(item_data.ancestor);
        // what if item_data.ancestor is i-0, m-0, g-0?  what if ancestor_obj == false? (no such data)
        // i would make admin_info_ids = "";

        //get the ancestors pair info_ids
        let ancestor_pair_obj = await getPairObject(ancestor_obj,display_data/*, item_data.user_id*/);

        let ancestor_pair_data = await pairMyData(ancestor_pair_obj);
        admin_info_ids = ancestor_pair_data;
      }// if data_mode

      /**************************  attacment section ***************************/
      // get all the referenced pairs associated with this ancestor - exclude overlap (has this ancestor & also paired)
      //processing attachments here
      //make a new string of non duplicated ids using a comparison function
      // fix for nested items which are or were also attachments - removes the attachment
      admin_info_ids = admin_info_ids.split(",");
      if(admin_info_ids.length != 0 && valid_ancestor)
      {
        // admin_info_ids.forEach( async value => {
        for(value of admin_info_ids){

          //if the recorded list has entries not on the current list use the
          //deleter to remove those paired entries
          let is_it_there = present_data_ids.includes(value);

          // if(is_it_there == "" && is_it_there !== 0)
          if(!is_it_there)
          {
            //adds to an empty hold_me array declared in the functions properties
            hold_me.push(value);
          }else{
            // array_push(dual_ary,value);
            //unpair any attachments where the asset is now in the same binder
            let host_data = {}; // (object)[];
            host_data._id = item_data._id;
            let detach_data = {}; // (object)[];
            detach_data.host_data = host_data;
            detach_data.link_id = value;
            let detach_value = await detachMyInfo(detach_data);// can be a string or not
          }//end else

        // });//foreach
        }// for

        //if hold_me array is not empty pass its data in string form to a data getter
        if(display_console) console.log(chalk.magenta(`[guest/getItemPairs][item_data ancestor]`),item_data._id);
        if(display_console) console.log(chalk.magenta(`[guest/getItemPairs][hold_me]`),hold_me);
        if(hold_me.length != 0 && isValid(hold_me[0]))
        {
          //get the info_data
          // hold_me = hold_me.join();// ","
          // if(display_console) console.log(chalk.magenta(`[hold_ary] before`),hold_ary);
          let attached_items = await getInfoData(hold_me,item_data._id);//host_id

          if(attached_items){

            hold_ary = [...hold_ary, ...attached_items];
          }
          if(display_console) console.log(chalk.magenta(`[guest/getItemPairs][hold_ary] after`),hold_ary, typeof hold_ary);
        }//if

        //merge the data attachment array with the data rows array
        rows = (hold_ary.length != 0) ? [ ...rows, ...hold_ary ] : rows;
      }//end count admin_info_ids
      /**************************  attacment section ***************************/

    //admin_info_ids present_data_ids

    //  "help data = " . var_dump(rows[0]);


    // indicate which assets have both an asset and a pairing
    // happens when an asset is moved to the binder it was being paired with
    // needed for local records when an asset is moved back out of the binder
    // if(count(dual_ary) != 0)
    // {
    //   for(v = 0; v < count(rows); v++)
    //   {
    //     is_dual = array_search(rows[v].data_id,dual_ary,true);
    //     if(is_dual == "" && is_dual !== 0)
    //     {
    //       //do nothing
    //     }else {
    //       // code...
    //       rows[v].is_attachment = "dual";
    //     }
    //   }
    // }

    //prep data to move (stringify)

    if(mode != "none"){
      page = parseInt(page);
      limit = parseInt(limit);
      let startIndex = (page - 1) * limit;
      let endIndex = page * limit;
      rows.slice()
    }

    return_obj.data = rows;
    // returnData = json_encode(rows);
    //  "return str = " . returnData;
    // returnData = preg_replace('/\s+/', ' ',returnData);
    // returnData = preg_replace(array('/\s{2,}/', '/[\t\n]/'), ' ', returnData);

    //why not this? it decodes quotes which break json
    // "meta_data":"{"title":"A%20Issue%20W = bad
    // "meta_data":"{&quot;title&quot;:&quot;A%20Issue%20With% = good
    // returnData .= html_entity_decode(json_encode(rows));

    //returnData = html_entity_decode(returnData);

    //unset(item_data);
  //item_data = (object)[];
    if(item_data.eyes == "eyes only"){
      // return help_data;
      return_obj.help = help_data;
    }
    // return returnData;

    /*
    //here is what my results look like
    [{"category":"quick link"},{"category":"quick link"},{"category":"quick link"},{"category":"quick link"},{"category":"quick link"},
    {"category":"quick link"},{"category":"untitled"},{"category":"video"},{"category":"website"}]
    */

      res.json({
        ...return_obj,
        message:"data updated successfully"
      });

    } catch (err) {
      console.log(chalk.red("[guest/getItemPairs][update Many ] error"),err);

      res.json({
        message:"an error occured",
        error: err
      });
    }

  };//end getItemPairs

  module.exports = getItemPairs;
