
const chalk = require('chalk');
// const Item = require('../../models/item');
const Item = require('../../../../models/item');

console.log("addMyInfo loaded!");
const remove_ancestor = require('./remove_ancestor');
const removeSomething = require('./getData/remove_something');
const { alias_maker } = require('./getData/alias_maker');
// getItemData

const editMyInfo = async function(req, res)
{

  try {

    // let arc_input = json_decode(inStr);
    let arc_input = JSON.parse(req.body.arc_input);
    //arc_input = json_decode(newStr);
    //return "arc_input = " . arc_input.data_id . " && json error = " . json_last_error();
    arc_input.user_id = req.user.id;

    //return "data_id = " . arc_input.data_id;
    // display_data = dsp_Dta;
    let display_data = req.body.display_data;

    await remove_ancestor(arc_input, display_data);

    // db = jFactory::getDbo();
    // query = db.getQuery(true);
    let has_info_ids = "false";
    let retData = "";

    //compare the user_id to the current user's id

    //if they match, update

    // actually i can add the current users id the the query
    // let alias_title = removeSomething(arc_input.title_data,' ','-');
    // alias_title = alias_title.replace(/[^a-zA-Z0-9 -]/g, "");
    // alias_title = alias_title.toLowerCase();
    //
    // let test_alias = escape(`${req.user._id.toString()}/${alias_title}`);
    // let path = escape(`${alias_title}`);
    //
    // // arc_input.alias = testAlias(req.user._id,`${req.user._id.toString()}/${alias_title}`);
    // let prep_alias = await testAlias({ mode: "edit", user_id: req.user._id, test: test_alias, path, data: arc_input });
    // arc_input.alias = prep_alias.alias;
    // arc_input.path = prep_alias.path;
    //
    // console.log(chalk.yellow("[prep_alias]"),prep_alias);
    //
    // let update_obj = await Item.findOneAndUpdate({ _id: arc_input._id, user_id: req.user._id}, arc_input, { new: true });

    let update_obj = await alias_maker(arc_input);

    // NOTE: i need a joi validator that preps default data to "" if its undefined? or omits it?

    res.json({
      data: update_obj,
      message:"item updated successfully."
    });


  } catch (e) {
    console.log("[controller edit] error",e);

    // using a 500 error stopped all other client side processes
    // res.status(500).json({

    res.json({
      message:"an edit error occured",
      error: e
    });
  }//catch

}//editMyInfo

module.exports = editMyInfo;

// 5da54e08c72fdb4a0c765b0f/we-asked-web-developers-we-admire-what-about-building-websites-has-you-interested-this-y/
