// <?php
// defined('_JEXEC') or die;
// const Item = require('../../models/item');
const chalk = require('chalk');

const Item = require('../../../../models/item');
const remove_ancestor = require('./remove_ancestor');
const removeSomething = require('./getData/remove_something');
const { alias_maker } = require('./getData/alias_maker');
const { set_container } = require('./getData/container');
const {exists} = require('./getData/exists');

const display_console = false;

if(display_console) console.log("addMyInfo loaded!");

const addMyInfo = async function(req, res)
{
  //inStr,dsp_Dta
  if(display_console) console.log("addMyInfo running!");
  if(display_console) console.log("[addMyInfo] body ",req.body);
  if(display_console) console.log("[addMyInfo] type ", typeof req.body.arc_input);
  //set up variables
  let has_info_ids = "false";// is this for early pairing? Do i need this again?
  // let pair_table = "false";

  // decode the json string
  let arc_input = JSON.parse(req.body.arc_input);
  if(display_console) console.log("[user _id]",req.user._id);
  if(display_console) console.log("[user id]",req.user.id);
  arc_input.user_id = req.user.id;

  // get the display data category string (media, info, group)
  let display_data = req.body.display_data;

  let data_loc;

  switch(arc_input.ancestor)
  {
    case "i-0":
    case "g-0":
    case "m-0":
    //do nothing;
    break;

    default:
    //find this items ancestor and make sure its marked as a container
    let sCon = await set_container(arc_input.ancestor,"set");
    break;

  }//end switch

  //deprecated switch
  await remove_ancestor(arc_input, display_data);

  // delete arc_input.ancestor;
  // arc_input.ancestor = null;// no ancestor must me an ObjectId - it cant be a string.
  // can it be null? no it produces a duplicate key error
  arc_input.type = req.body.display_data;
  arc_input.alias = ( new Date() ).getTime();// this helps fix the issue of wanting a unique alias before we go into .save();

  // include the items schema
  try {
    let item = await new Item(arc_input);

    await item.save();

    if(item) if(display_console) console.log("[controller add] successfully saved", item);

    // let alias_title = removeSomething(item.title_data,' ','-');
    // alias_title = alias_title.replace(/[^a-zA-Z0-9 -]/g, "");
    // alias_title = alias_title.toLowerCase();
    //
    // let test_alias = escape(`${item.user_id.toString()}/${alias_title}`);
    // let path = escape(`${alias_title}`);
    //
    // // arc_input.alias = testAlias(req.user._id,`${req.user._id.toString()}/${alias_title}`);
    // let prep_alias = await testAlias({ mode: "add", user_id: item.user_id, test: test_alias, path, data: item });
    // item.alias = prep_alias.alias;
    // item.path = prep_alias.path;
    //
    // let update_obj = await Item.findOneAndUpdate({ _id: item._id, user_id: item.user_id}, item, { new: true });

    let update_obj = await alias_maker(item);

    if(update_obj) if(display_console) console.log("[controller add] update successfully saved", update_obj);

    if(display_console) console.log("[item id] ObjectId",item._id);
    if(display_console) console.log("[item id] ObjectId",String(item._id));

    let set_ancestor = exists(item.ancestor) ? item.ancestor : get_ancestor(req.body.display_data);

    res.json({
      data: {...item._doc, ancestor: set_ancestor},
      // item: item,
      message:"item added successfully."
    });

  } catch (e) {
    console.log(chalk.red("[controller add] error"),e);

    // using a 500 error stopped all other client side processes
    // res.status(500).json({

    res.json({
      message:"an error occured",
      error: e
    });
  }//catch

};//end addMyInfo

const get_ancestor = function (display_data) {
  let data_loc;
  switch(display_data)
  {
    case "info":
      data_loc = "i-";
      return `${data_loc}0`;
    break;

    case "media":
      data_loc = "m-";
      return `${data_loc}0`;
    break;

    case "group":
      data_loc = "g-";
      return `${data_loc}0`;
    break;
  }
}

module.exports = addMyInfo;
