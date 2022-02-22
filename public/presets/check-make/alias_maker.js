  // const {testAlias} = require('./getData/test_alias');
  // const Item = require('../../../models/item');

  const mongoose = require('mongoose');

  // location customized for src/oauth_server/controllers/lib/alias_maker.js
  const Item = require('../../../models/item');// ./check-make
  const chalk = require('chalk');
  const removeSomething = require('./remove_something');
  const display_console = false;

  const alias_maker = async function(item)
  {
    // let generic_date = ( new Date() ).getTime();
    let alias_title = removeSomething(item.title_data,' ','-');
    alias_title = alias_title.replace(/[^a-zA-Z0-9 -]/g, "");
    alias_title = alias_title.toLowerCase();

    let isValid = mongoose.Types.ObjectId.isValid,
    valid_id = isValid(item.user_id);

    if(display_console) console.log(chalk.yellow("[alias_maker] item"),item);

    let id_str = (isValid) ? item.user_id.toString() : item.user_id;

    let test_alias = escape(`${id_str}/${alias_title}`);
    let path = escape(`${alias_title}`);

    // arc_input.alias = testAlias(req.user._id,`${req.user._id.toString()}/${alias_title}`);
    let prep_alias = await testAlias({ mode: "add", user_id: item.user_id, test: test_alias, path, data: item });
    item.alias = prep_alias.alias;
    item.path = prep_alias.path;

    let update_obj = await Item.findOneAndUpdate({ _id: item._id, user_id: item.user_id}, item, { new: true }).lean();

    return update_obj;
  }// alias_maker

  const testAlias = async function(tObj)
  {
    try {

      let user_id = tObj.user_id;
      let prep_alias = {};
      prep_alias.alias = tObj.test;
      prep_alias.path = tObj.path;
      let mode = tObj.mode || "edit";
      let data = tObj.data;
      let is_ok = false;

      let match = await Item.findOne({user_id, alias: prep_alias.alias}).lean();
      if(display_console) console.log(chalk.cyan("[match]"),match);

      // let items = await Item.find({user_id}).lean();
      // if(items){setDefaultAlias(items)}

      if(mode == "add"){
        // if it matches its not this item (hasn't been created) move on.
        is_ok = (!match) ? true : false;
        if(display_console) console.log(chalk.yellow("[is_ok]"),is_ok);
      }else{
        // if it doesn't match or it matches and the match matches the id of the edited item
        // if one matches see if the ids match, if so do nothing
        is_ok = (match._id ==  data._id) ? true : false;// !match no need for changing it if there is no match in edit mode
      }

      if(is_ok){
        // if the similar one
        // return prep_alias;
        if(display_console) console.log(chalk.yellow("[prep_alias value]"),prep_alias);
      }else{
        // !match || match._id ==  similar || similar.length < 2

        if(mode == "edit"){
          // if its edit try to use the same thing it already had
          // use this to preserve the custom alias i.e. < aliasName-nbr >
          let similar = await Item.find({ user_id, alias: {"$regex": prep_alias.alias,"$options": "i" }}).lean();
          if(display_console) console.log(chalk.magenta("[item alias length]"),similar.length);

          // if its similar match each similar one to the current alias
          if(similar){

            for(value of similar){

              //if similar alias matches the edited items custom alias && the id's are the same (its a possibly not needed double check)
              if(value.alias == data.alias && value._id == data._id){
                // preserve the alias
                prep_alias.alias = value.alias;
                prep_alias.path = value.path;
                is_ok = true;
              }// if

            }// for
          }// if similar

        }// if edit

        // otherwise:
        if(is_ok === false){
          prep_alias = await iUN_alias(prep_alias);
        }
        // move this section up into the if edit bracket to simulate a duplicate entry with add
        // i need to manage that error (maybe)

        //if not:

      }//else is_ok

      return prep_alias; // "similar";
    } catch (e) {
      if(display_console) console.error(chalk.red("[testAlias]"),"an error has occured",e);
    }

  }// testAlias

  const iUN_alias = function (pA) {
    let iUN = Math.round(Math.random() * 1000);
    let prep_alias = {};
    prep_alias.alias = `${pA.alias}-${iUN}`;
    prep_alias.path = `${pA.path}-${iUN}`;
    if(display_console) console.log(chalk.yellow("[prep_alias value] iUN"),prep_alias);
    return prep_alias;
  }

  const setDefaultAlias = async function (items) {
    try {

      for(value of items){

        let alias_title = await removeSomething(value.title_data,' ','-');
        alias_title = alias_title.replace(/[^a-zA-Z0-9 -]/g, "");
        alias_title = alias_title.toLowerCase();

        let prep_alias = {};
        prep_alias.alias = escape(`${value.user_id.toString()}/${alias_title}`);
        prep_alias.path = escape(`${alias_title}`);

        if(display_console) console.log(chalk.yellow("[prep_alias]"),prep_alias);
        let ils = await Item.find({user_id: value.user_id, alias: {"$regex": alias_title,"$options": "i"}}).lean();//"$regex": "Alex", "$options": "i"

        if(display_console) console.log(chalk.magenta("[item alias length]"),ils.length);

        if(ils && ils.length < 2){
          value.alias = prep_alias.alias;
          value.path = prep_alias.path;
          if(display_console) console.log(chalk.yellow("[alias value]"),value);
          await Item.findOneAndUpdate({_id: value._id}, value, { new: true });
        }else{
          let iUN = Math.round(Math.random() * 1000);
          prep_alias.alias = `${prep_alias.alias}-${iUN}`;
          prep_alias.path = `${prep_alias.path}-${iUN}`;
          value.alias = prep_alias.alias;
          value.path = prep_alias.path;
          if(display_console) console.log(chalk.yellow("[alias value] iUN"),value);
          await Item.findOneAndUpdate({_id: value._id}, value, { new: true });
        }// else

      }// for

    } catch (e) {
      if(display_console) console.error(chalk.red("[set default alias]"),"an error has occured",e);
    }
  }// setDefaultAlias

  module.exports = {
    alias_maker,
    testAlias
  };

// 46 5da54e08c72fdb4a0c765b0f/a-short-title
//47 5da54e08c72fdb4a0c765b0f/a-short-title
