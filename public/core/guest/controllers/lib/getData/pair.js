
  const chalk = require('chalk');
  // const Pair = require('../../../models/pair');
  // const Item = require('../../../models/item');
  const Pair = require('../../../../../../models/pair');
  const Item = require('../../../../../../models/item');
  const getItemData = require('./getItemData');
  const {exists} = require('./exists');


  const pairMyData = async function(pObj)
  {

      let pairObj = pObj;
      let pp_ret = "";
      let link_data;

      // console.log(chalk.blue("[pair body]"),pairObj);

      // pair sample:
      // [pair body] {
      // display_data: 'media',
      // host_id: 5db985cd4fb72629144d2566,// binder_id
      // info_ids: '5db96bfa61764832d431dfe1',
      // pair_table: '#__arc_pair_host_link',
      // owner_id: 5da54e08c72fdb4a0c765b0f,
      // editor_id: 5da54e08c72fdb4a0c765b0f,
      // mode: 'add',
      // task: 'attach',
      // category: 'media home',
      // ancestor: undefined,
      // last_id: 5db985cd4fb72629144d2566,
      // style: 'pull' }


      pairObj.test_text = " returning pair object ";
      if(pairObj.style == undefined){pairObj.style = "pull";}// pull by default - delete active

      let display_data = pairObj.display_data;

      let pair_table = '#__arc_pair_host_link';

      let cur_pair_IDs_ary = [];// formerly db_info_ids_ary
      // get everything that is attached to this ancestor/parent
      let cur_pair_OBJ_ary = await Pair.find({ host_id: pairObj.host_id, editor_id: pairObj.editor_id });

      if(exists(cur_pair_OBJ_ary)){
        // create an array of just _ids
        // cur_pair_OBJ_ary.forEach((entry) => {
        for(entry of cur_pair_OBJ_ary){
          cur_pair_IDs_ary.push(entry.link_id);
        // })
        }// for
      }// if

      // console.log(chalk.yellow("[db info ids ary]"),cur_pair_IDs_ary);
      /*******************   get data section   *********************/

      //use the getter to get an updated list of current pairing
      if(pairObj.mode == "get")
      {
        // return the array of _ids
        return cur_pair_IDs_ary.join(",");
      }//end if

      /***************   end get data section   ********************/

      //return "pair obj = " .  json_encode(pairObj);

      if(pairObj.info_ids == undefined){pairObj.info_ids = "";}

      console.log(chalk.cyan("[pairObj] see info_ids"),pairObj);

      let input_ids_ary = pairObj.info_ids.split(",");



      //precaution just in case an empty array came up
      //worried it will trigger a delete and erase everything attached

      if(input_ids_ary.length < 1){return;}

      //checks for deletions
      if(exists(cur_pair_OBJ_ary) /*this is what is already there*/)
      {
        //return "entered id ary space";
        // this section works for push and pull styles
        // for pull it deletes abandoned pairs that arent in the new array list
        // for push it prevents attempting to add duplicates

        for(let b=0; b < cur_pair_IDs_ary.length; b++)
        {

          //if the recorded list has entries not on the current list use the
          //deleter to remove those paired entries
          console.log(chalk.magenta("[input_ids_ary] compare"),input_ids_ary, cur_pair_IDs_ary[b]);

          //do the new info ids array have any of the values of the old infoid?
          let is_it_there = input_ids_ary.includes(cur_pair_IDs_ary[b]);

          if(pairObj.style != "push" && !is_it_there)
          {
            // if style is push skip this delete step - its pull by default
            // pull style attachments modify the db description of info_ids - ones that were unchecked and no longer
            // appear in the set will be deleted here
            //return cur_pair_IDs_ary[b] . " is not there - delete";//works

            console.log(chalk.red(`[pair deleting] entered`), cur_pair_IDs_ary[b]);

            del_obj = {};// (object)[]
            del_obj.display_data = display_data;
            del_obj.host_id = pairObj.host_id;
            del_obj.link_id = cur_pair_IDs_ary[b];
            del_obj.pair_table = pair_table;
            del_obj.owner_id = pairObj.owner_id;
            del_obj.editor_id = pairObj.editor_id;
            del_obj.mode = "delete";

            await processPair(del_obj);

          }//end if
        }//end for
      }// if cur_pair_OBJ_ary

      for(let c=0; c < input_ids_ary.length; c++)
      {

        //return input_ids_ary[c] . " is not here - add";//works
        //look up values
        link_data = await getItemData(input_ids_ary[c]);

        add_obj = {};// (object)[]
        add_obj.display_data = display_data;
        add_obj.host_id = pairObj.host_id;
        add_obj.host_type = pairObj.host_type;
        add_obj.link_id = input_ids_ary[c];// could also be link_data._id
        add_obj.link_type = link_data.data_type;
        add_obj.pair_table = pair_table;
        add_obj.owner_id = pairObj.owner_id;
        add_obj.editor_id = pairObj.editor_id;
        add_obj.mode = "add";

        console.log(chalk.magenta("[1st add section] object"),add_obj);
        // type_array = explode("-",input_ids_ary[c]);
        // switch(type_array[0])
        // {
        //   case "g":
        //     add_obj.type = "group";
        //   break;
        //
        //   case "i":
        //     add_obj.type = "info";
        //   break;
        //
        //   case "m":
        //     add_obj.type = "media";
        //   break;
        //
        // }

        //prevent duplicates
        if(exists(cur_pair_OBJ_ary)){
          // if there is existing data to check against

          let is_it_here = cur_pair_IDs_ary.includes(input_ids_ary[c]);

          if(!is_it_here)
          {
            pp_ret += await processPair(add_obj);
          }//end if

        }else{
          // if there isn't existing paired data
          // just add it
          pp_ret += await processPair(add_obj);
        }

        if(pairObj.task == "portal"){

          // link_data = await getItemData(input_ids_ary[c]);
          console.log(chalk.green(`[link_data]`),link_data);

          if(exists(link_data)){

            // does this portal pair already exist?
            let PORT_pair_OBJ = await Pair.findOne({ host_id: link_data._id, link_id: pairObj.host_id });

            // create a portal link-back
            // echo "port data = " . json_encode(link_data);
            if(!exists(PORT_pair_OBJ)){

              port_obj = {};//(object)[]
              port_obj.display_data = display_data;
              port_obj.host_id = link_data._id;//pairObj.host_id;
              port_obj.host_type = link_data.data_type;
              port_obj.link_id = pairObj.host_id;//input_ids_ary[c];
              port_obj.link_type = pairObj.host_type;
              port_obj.pair_table = pair_table;
              port_obj.owner_id = link_data.user_id;//pairObj.owner_id;
              port_obj.editor_id = pairObj.editor_id;
              port_obj.mode = "add";

              pp_ret += await processPair(port_obj);
            }// if !PORT_pair_OBJ
          }// if
        }//if portal


      }//end for

      return `processPair return = ${pp_ret}`;

  };//end pairMyData

  const processPair = async function(pObj, uId)
  {

    let process_data = pObj;
    let action = process_data.mode;
    let display_data = process_data.display_data;
    let error_msg = "";
    let user_id = uId;
    // db = jFactory::getDbo();
    // query = db.getQuery(true);

    console.log(chalk.greenBright("[process pair] entered"), action);

    switch(action)
    {
      case "add":

      if(process_data.host_id == process_data.link_id){
        error_msg = "pairing failed - item cannot pair with itself";
        console.log(chalk.red("[process pair] test entered"), error_msg);
        return error_msg;
      }

      if(process_data.link_id == "" || process_data.link_id == undefined){
        error_msg = "pairing failed - link data unavailable";
        console.log(chalk.red("[process pair] test entered"), error_msg);
         return error_msg;
      }


        //does it already exist
        let test_result = await Pair.findOne({ host_id: process_data.host_id, link_id: process_data.link_id});

        // do you OWN THE HOST item? You don't have to own the link item
        // eventually this will check a moderator list
        let my_host_item = await Item.findOne({ _id: process_data.host_id, user_id: process_data.editor_id});


        console.log(chalk.yellowBright("[process pair] test result"),test_result);

        if(!exists(test_result) && exists(my_host_item))
        {
          console.log(chalk.yellowBright("[process pair] test entered"));

          try {

            let add_results = await new Pair({
              host_id: process_data.host_id,
              link_id: process_data.link_id,
              owner_id: process_data.owner_id,
              editor_id: process_data.editor_id
            });

            await add_results.save();

            return `${display_data} add pairing success and add_results = ${add_results}`;

          } catch (e) {
            error_msg = `${display_data} add pairing failed and add_results = ${add_results}`;
            console.log(chalk.red("[process pair] error"), error_msg, e);
            return error_msg;
          }// catch

        }else {
          let auth_msg = `[process pair] authorization error`;// does not own the host
          let dupe_msg = `${display_data} duplicate entry`;// duplicate entry - left over from phpMySql
          error_msg = (!my_host_item) ? auth_msg : dupe_msg;
          console.log(chalk.red("[process pair] error"), error_msg);
          return error_msg;
        }//end else test_result

      break;

      case "delete":

          console.log(chalk.yellowBright("[process pair] delete entered"),process_data.link_id);

          // it needs a where you are either the owner or the editor
          let del_results = await Pair.deleteOne({ host_id: process_data.host_id, link_id: process_data.link_id, owner_id: process_data.editor_id });
          console.log(chalk.yellowBright("[process pair] delete results"),del_results);
          //return results;
          if(!del_results){
            return `${display_data} delete pairing failed and del_results = ${del_results}`;
          }else {
            return `${display_data} delete pairing success and del_results = ${del_results}`;
          }

      break;
    }//end switch

  }//end processPair;

  const pair_order = async function(mod,LID,HID,OSTR)
  {

    switch (mod) {
      case 'get':

        // let updated = await Pair.updateMany({}, {$set:{pair_order: "0"}});

        // it is initially set to false which evaluates to false
        // empty() will also evaluate to true when passed a zero
        // in any case give me a zero when nothing is present
        // i don't want null though so i do need to do something
        // return pair_order;
        let pair_item = await Pair.findOne({ host_id: HID, link_id: LID}).lean();

        console.log(chalk.yellow("[pair_item]"),pair_item);

        if(exists(pair_item)){
          return pair_item.pair_order;
        }else{
          return "0";
        }//if

      break;

      case 'update':
      // i can actually get the owner string using
      // cur_arc_user = jFactory::getUser();
      // arc_user_id = cur_arc_user.id;
      // if(arc_user_id == 0){return "[server note:]unregistered user[server note]";}
      // OSTR = order string

        if(isNaN(OSTR) || OSTR === "" || OSTR == null){
          // do nothing
          return;
        }


        let response_item = await Pair.findOneAndUpdate({ host_id: HID, link_id: LID},{$set:{ pair_order: Number(OSTR) }});

        return;

      break;
    }// switch

  }// pair_order

  module.exports = {
    pairMyData,
    processPair,
    pair_order
  }
