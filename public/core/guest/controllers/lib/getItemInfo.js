  const chalk = require('chalk');
  const mongoose = require('mongoose');
  // const Item = require('../../models/item');
  // const Pref = require('../../models/pref');
  const Item = require('../../../../../models/item');
  const Pref = require('../../../../../models/pref');
  const { getPairObject, getInfoData } = require('./getData/get');
  const getItemData = require('./getData/getItemData');
  const { pairMyData } = require('./getData/pair');
  const detachMyInfo = require('./detachMyInfo');
  const {is_objectId_valid} = require('./getData/is_objectId_valid');
  const { exists } = require('./getData/exists');
  const { reorder_data, read_filter } = require('./getData/reorder_data');
  // const { lowercase } = require('./getData/lowercase');
  const { get_sort_option, compare } = require('./getData/sort');
  const {add_presets} = require('../../../../presets/getPresetData');
  const { add_auto_img } = require('./getData/add_auto_img');

  const display_console = false;

  const getItemInfo = async function(req, res)
  {
    // DEPRECATED - currently using getMyInfo
    // id_match();// run this first if the idPairs.json file hasn't been created
    // migrate_to_db(req);
    // migrate_pairs(req);
    // migrate_urls(req);

    // migrate_dates(req);
  try {

    throw "[guest/getItemInfo] is this thing on?";
    return;

    if(display_console || true) console.log(chalk.bgCyan("[guest/getItemInfo] running!"));
    if(display_console || true) console.log(chalk.cyan("[guest/getItemInfo] body "),req.body);
    console.log(`[guest/getItemInfo] is this thing working?`);
    // if(display_console || false) console.log("[addMyInfo] type ", typeof req.body.arc_input);

    // let my_data = req.body.my_data;
    let my_data = req.body;
    let { mode = "none", limit = 15 } = my_data;
    let { pair_more = true,
          pair_start = 0,
          row_more = true,
          row_start = 0 } = my_data.scroll_data || {};// works
        /*resets are automatic - if i don't send start data or row_more it resets*/

    let search_value = (exists(my_data.scroll_data) && exists(my_data.scroll_data.value)) ? my_data.scroll_data.value :
    (exists(my_data.value)) ? my_data.value : "";

    if(display_console || false) console.log(chalk.green("[search_value]"),search_value);

    let return_obj = {scroll_data:{}},
    returnData = "",
    help_data = "",
    present_data_ids = [],
    ancestor_info_ids = "",
    pair_me = [],
    pair_ary = [],
    dual_ary = [],
    host_id = "",
    orderBy = [],
    rows = "",/*req_data*/
    remaining_rows = [],
    force_filter = my_data.force_filter || false,
    init_filter = my_data.filter || "alpha",
    filter = my_data.filter || "alpha",
    data_mode = my_data.data_mode || "full",//in js "data" : "part" there isn't a full right now
    /*isValid = mongoose.Types.ObjectId.isValid,*/
    item_ancestor = my_data.ancestor,
    valid_ancestor = is_objectId_valid(my_data.ancestor),
    ancestor_obj,
    type_array = ["media", "info", "group"],
    item_type = (typeof my_data.display_data != "undefined" && type_array.includes(my_data.display_data)) ? my_data.display_data : "media";

    if(display_console || false) console.log(chalk.yellow("[i am root]"),my_data.root);

    
      // let updated = await Item.update({"order":0}, {$set:{desc_data: ""}}, {multi:true});// worked
      // let updated = await Item.update({"order":0}, {$unset:{desc_data: ""}}, {multi:true});// worked
      // let updated = await Item.updateMany({}, {desc_data: ""});// worked
      // let updated = await Item.updateMany({}, {$rename:{"description": "desc_data"}});//failed until schema

        // if(display_console || false) console.log(chalk.magenta("[ancestor] searching...."));
        // [using equals](https://docs.mongodb.com/manual/reference/operator/query/eq/#op._S_eq)

        // GET THE ITEM DATA HERE
        ancestor_obj = await getItemData(item_ancestor);// this needs to run first to find out the filter. - apply filter to the sort
        init_filter = (force_filter) ? filter : (exists(ancestor_obj) && exists(ancestor_obj.filter)) ? ancestor_obj.filter : "alpha";


        // init_filter = "alpha2";
        filter = read_filter({filter: init_filter});

        if(display_console || false) console.log(chalk.blue("[filter] init filter"),init_filter);
        if(display_console || false) console.log(chalk.blue("[filter] filter"),filter);
        // im going to have to compile the sort by the filter
        // if alfa then title 1

        //LATER: i can send an array of values and run a forEach on the values. and push them using the sort_obj

        // let filter_array = sort_obj[filter];
        //
        // if(exists(filter_array)){
        //   filter_array.forEach((item) => {
        //     orderBy.push(item);
        //   });
        // }
        // i may need to add to the orderBy array
        orderBy = get_sort_option({filter});

        // if(display_console || false) console.log(chalk.yellow("[orderBy]",Array.isArray(orderBy), orderBy));

      if(row_more){
        start_ndx = parseInt(row_start);
        limit = parseInt(limit);
        // let start_ndx = (page - 1) * limit;
        // let recent_items = await Item.find({type: "media", user_id: user_id, published: true}).sort({created: -1}).skip(start_ndx).limit(limit).lean();

        // rows = await Item.find({ user_id: req.user._id, ancestor: {$exists: true, $eq:item_ancestor}, type: item_type }).sort("path").lean();
        // rows = await Item.find({ user_id: req.user._id, ancestor: {$exists: true, $eq:item_ancestor}, type: item_type }).sort([["title_data"],[-1]]).skip(start_ndx).limit(limit).lean();
        let query = { ancestor: {$exists: true, $eq:item_ancestor}, type: item_type };
        // im not sure if i need the type or not. (it may not matter if attachments aren't typed - which they aren't)

        if(exists(search_value)){
          // if(display_console || false) console.log(chalk.yellow("[guest/getItemInfo] adding search_value"));
          query['$text'] = { "$search": search_value };// works

        }//if

        rows = await Item.find(query).collation({locale: "en", strength: 2}).sort(orderBy).skip(start_ndx).limit(limit).lean();
        // IMPORTANT: here i used exists == true to only find documents were the ancestor field exists and also equals the
        // item_ancestor ObjectId - without exists it will include items where the ancestor doesn't exist at all
        // if(display_console || false) console.log("[req_data]",req_data);

        // for(let i = 0; i < 5; i++){
        //   // show me the first 5 titles
        // if (rows[i]) {
        //   if(display_console || false) console.log(chalk.yellow(`[rows] ${i}`),rows[i].title_data);
        // }
        // }

      }// if

      return_obj.filter = filter;
      return_obj.scroll_data.row_more = (!row_more) ? false : (!exists(rows) || rows.length < limit) ? false : true;
      if(exists(ancestor_obj)) return_obj.category = ancestor_obj.title_data;
      // if(display_console || false) console.log(chalk.cyan("[updating many]"));



    // Item.updateMany({}, {"$set":{"desc_data": ""}});
    // Item.updateMany({}, {"$rename":{"description": "desc_data"}});


    my_data.data_category = my_data.data_category || "";
    my_data.eyes = my_data.eyes || "";

    let display_data = my_data.display_data;
    if(display_console || false) console.log(chalk.green("[data_mode]"),data_mode);
    let data_category = my_data.data_category;




    let info_table = '#__arc_my_data' ;



    // when does data_mode == data
    // A: when im not getting category data for tabs  -deprecated

      // for data and full modes
      // data_mode == "data"
    if(row_more && rows.length != 0){

      // get the info_ids for each row item
      for(let x = 0; x < rows.length; x++)
      {
        //I have to get this on a case by case basis.
        //get my pair data

        //make an array of ids for comparison to pair_ids to eliminate duplicates
        present_data_ids.push(rows[x]['_id']);


        //prepare the object to help get the pair data
        //- needed to avoid duplicate code blocks (shortens code)
        // if(display_console || false) console.log(chalk.red(`[getPairObject] rows[${l}]`),rows[x]);

        // this literally returns an object correctly formatted to make a pair request
        let prep_pair_obj = await getPairObject(rows[x], display_data/*, rows[x].user_id*/);//preps a pair request using ancestor object
        // let prep_pair_obj = await getPairObject(rows[x], display_data, req.user._id)

        // get this ancestors pair data
        // take teh preped pair object and make a request with it
        let _pair_data = await pairMyData(prep_pair_obj);
        //return json_encode(get_pair_data);

        //this is going to change now that i updated the initiate_starter_data method
        // take the items pair ids and add them to the items info ids property
        if(_pair_data != ""){
          rows[x]['info_ids'] = _pair_data;
        }

      }//end for
    }// end if rows

      if(display_console || false) console.log(chalk.yellow("[data_mode]"),data_mode);
      if(data_mode != "data" && ancestor_obj){
        //get the ancestors data_id
        // ancestor_obj = this.getItemData(my_data.ancestor);
        // what if my_data.ancestor is i-0, m-0, g-0?  what if ancestor_obj == false? (no such data)
        // i would make ancestor_info_ids = "";

        // create another object formatted for making a pair request
        let ancestor_pair_obj = await getPairObject(ancestor_obj, display_data, /*ancestor_obj.user_id,*/ {sort:true});
        // let ancestor_pair_obj = await getPairObject(ancestor_obj, display_data, req.user._id, {sort:true});

        //get the ancestors pair info_ids in a particular order
        ancestor_info_ids = await pairMyData(ancestor_pair_obj);
        // if(display_console || false) console.log(chalk.magenta(`[ancestor_info_ids]`),ancestor_info_ids);

      }// if data_mode

      /**************************  attacment section ***************************/
      // get all the referenced pairs associated with this ancestor - exclude overlap (has this ancestor & also paired)
      //processing attachments here
      //make a new string of non duplicated ids using a comparison function
      // fix for nested items which are or were also attachments - removes the attachment
      ancestor_info_ids = ancestor_info_ids.split(",");// if its empty it will split to an empty array
      if(ancestor_info_ids.length != 0 && valid_ancestor)
      {
        // ancestor_info_ids.forEach( async value => {
        for(value of ancestor_info_ids){

          //if the recorded list has entries not on the current list use the
          //deleter to remove those paired entries
          let is_it_there = present_data_ids.includes(value);

          // if(is_it_there == "" && is_it_there !== 0)
          if(!is_it_there)
          {
            //adds to an empty pair_me array declared in the functions properties
            // pair_me will be an array of non native ancestor_info_ids
            pair_me.push(value);
          }else{
            // array_push(dual_ary,value);
            //unpair any attachments where the asset is now in the same binder
            let host_data = {}; // (object)[];
            host_data._id = my_data.ancestor;
            let detach_data = {}; // (object)[];
            detach_data.host_data = host_data;
            detach_data.link_id = value;
            let detach_value = await detachMyInfo(detach_data);// can be a string or not
          }//end else

        // });//foreach
        }// for

        //if pair_me array is not empty pass its data in string form to a data getter
        if(display_console || false) console.log(chalk.magenta(`[my_data ancestor]`),my_data.ancestor);
        // if(display_console || false) console.log(chalk.magenta(`[pair_me]`),pair_me);//logs a list of info_ids
        if(pair_me.length != 0 && is_objectId_valid(pair_me[0]))
        {
          //get the info_data
          // pair_me = pair_me.join();// ","
          // if(display_console || false) console.log(chalk.magenta(`[pair_ary] before`),pair_ary);
          let attached_items;

          if(filter.includes("alpha")){
            attached_items = await getInfoData(pair_me, my_data.ancestor,{sort: true, limit, filter, start_ndx: pair_start, search_value});//host_id
          }else{
            attached_items = await getInfoData(pair_me,my_data.ancestor);
          }

          if(exists(attached_items)){

            pair_ary = [...pair_ary, ...attached_items];
          }
          // if(display_console || false) console.log(chalk.magenta(`[pair_ary] after`),pair_ary, typeof pair_ary);
          for(let i = 0; i < 5; i++){
            // show me the first 5 titles
            if (pair_ary[i]) {
              // if(display_console || false) console.log(chalk.yellow(`[pair_ary] after filter ${filter} ndx ${i}`),pair_ary[i].title_data);
            }
            // if(display_console || false) console.log(chalk.yellow(`[rows] ${i}`),rows[i]);
          }

          if(pair_ary.length != 0){
            // put the pairs into the proper order
            pair_ary = reorder_data({data: pair_ary, filter: init_filter});
          }

        }//if

        return_obj.scroll_data.pair_more = (!pair_more) ? false : (!exists(pair_ary) || pair_ary.length < limit) ? false : true;

        //merge the data attachment array with the data rows array
        // pair_ary is the attachment array
        // i have to process this better so that the attachments are in the correct order

        // what if there are no more rows but there are more pairs? - a binder with only pair items.
        if(exists(rows) && rows.length != 0 && row_more){

          rows = await rows.reduce((row_results,row_entry,row_ndx) => {

            // let full = (row_results.length < limit) ? false : true;// full's status changes and has to be re-evaluated
            let full;
            let last_row = (row_ndx == rows.length - 1) ? true : false;
            let added_last_item = false;

            //if the first item doesn't get added, don't check the others
            let stop_checking = false;

            if(Array.isArray(pair_ary) && pair_ary.length != 0 && pair_more){
              let its_me = "what";

              pair_ary = pair_ary.reduce((pair_results, pair_entry, pair_ndx) => {
                // if i use it don't add it back

                // if(display_console || false) console.log(chalk.green(`[pair entry] ${pair_entry["title_data"]} index `),pair_ndx);

                // if we not at the limit && they are identical or
                full = (row_results.length < limit) ? false : true;// full's status changes and has to be re-evaluated


                if(!full && compare({row_entry, pair_entry, filter}) && !stop_checking){
                  // if i use it do this
                  // if(display_console || false) console.log(chalk.blue(`[pair entry] adding ${pair_entry["title_data"]}`));
                  row_results.push(pair_entry);
                  return [...pair_results];
                }else if(last_row && !full){
                  //if its the last item and were still under the limit start filling the remaining spaces
                  if(!added_last_item){
                    // add the last row entry item
                    row_results.push(row_entry);
                    added_last_item = true;
                  }
                  // if(display_console || false) console.log(chalk.red(`[pair entry] adding ${pair_entry["title_data"]}`));
                  //then start adding the attach pair entries at the end if there is still room
                  if(row_results.length < limit){
                    // this sequence potentially adds 2 items when there may only be room for 1 - so check again
                    row_results.push(pair_entry);
                    return [...pair_results];
                  }else{
                    return [...pair_results, pair_entry];
                  }//else
                  // row_results.push(pair_entry);
                  // return [...pair_results];
                }else{
                  // if i don't use it do this
                  stop_checking = true;
                  return [...pair_results, pair_entry];
                }

              },[]);

            }else{
              // if(display_console || false) console.log(chalk.magenta(`[row_entry[compare]]`),row_entry[compare]);
            }

            full = (row_results.length < limit) ? false : true;// full's status changes and has to be re-evaluated b4 using
            if(!full && !last_row || !full && last_row && !added_last_item){
              // make sure when you're on the last item that it hasn't been added in the pair_ary
              row_results.push(row_entry);
            }else{
              remaining_rows.push(row_results);
            }
            return row_results;

          },[])// rows reduce
        }else if(exists(pair_ary) && pair_ary.length != 0 && pair_more){
          // using pair_more here is redundant overkill
          // send them all into the empty row
          rows = [...pair_ary];
          pair_ary = [];

        }

        // rows = (pair_ary.length != 0) ? [ ...rows, ...pair_ary ] : rows;


      }else {
        // it had no chance to call a pair
        return_obj.scroll_data.pair_more = false;
      }//end count ancestor_info_ids
      /**************************  attacment section ***************************/


    // for(let i = 0; i < 5; i++){
    //   // show me the first 5 titles
    // if (rows[i]) {
    //     if(display_console || false) console.log(chalk.yellow(`[rows] ${i}`),rows[i].title_data);
    //     // if(display_console || false) console.log(chalk.yellow(`[rows] ${i}`),rows[i]);
    // }
    // }
    //prep data to move (stringify)
    await add_presets({rows});
    await add_auto_img({rows});

    return_obj.data = rows;
    let row_rem = remaining_rows.length;
    if(row_rem > 0) return_obj.scroll_data.row_more = true;
    // return_obj.scroll_data.remaining = row_rem;
    return_obj.scroll_data.row_start = row_start + (limit - row_rem);
    // return_obj.scroll_data.row_more
    // return_obj.scroll_data.pair_more
    let pair_rem = pair_ary.length;
    if(pair_rem > 0) return_obj.scroll_data.pair_more = true;
    // return_obj.scroll_data.remaining = pair_rem;
    return_obj.scroll_data.pair_start = pair_start + (limit - pair_rem);

    if(display_console || false) console.log(chalk.green(`[rows] row_start`),row_start);
    if(display_console || false) console.log(chalk.green(`[pairs] pair_start`),pair_start);
    return_obj.scroll_data.mode = (row_start == 0 && pair_start == 0) ? "init" : "update";

    return_obj.scroll_data.value = search_value;

    if(display_console || false) console.log(chalk.cyan(`[rows] remaining`),row_rem);
    if(display_console || false) console.log(chalk.blue(`[pairs] remaining`),pair_rem);




    // convert the rows array into an object with id's as keys

    //maybe the reordering is happening in transit, as this JSON object moves from the server to the client
    // let row_obj = {};
    // rows = rows.forEach((item) => {
    //   row_obj[item._id] = item;
    // })

    // let temp_row_obj_keys = Object.keys(row_obj)
    // for(let i = 0; i < 5; i++){
    //   // show me the first 5 titles
    // if (temp_row_obj_keys[i] && row_obj[temp_row_obj_keys[i]]) {
    //   if(display_console || false) console.log(chalk.yellow(`[row_obj] ${i}`),row_obj[temp_row_obj_keys[i]].title_data);
    // }
    // }
    // all these variations are the same

    // return_obj.data = row_obj;






    //unset(my_data);
  //my_data = (object)[];
    if(my_data.eyes == "eyes only"){
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
      console.log(chalk.red("[update Many ] error"),err);

      res.json({
        message:"an error occured",
        error: err
      });
    }

  };//end getItemInfo

  module.exports = getItemInfo;
