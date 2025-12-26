const chalk = require('chalk');
// const User = require('../../../../models/user');// centralized models
const Item = require('../../models/item');// centralized models
const User = require('../../models/user');// centralized models
const { pair_item } = require('../../public/core/guest/controllers/lib/getData/pair_item');
const { alias_maker } = require('./alias_maker');
const display_console = false;

/**
 * @module oas-check-make-binder
 * @category Auth
 * @subcategory defaults
 * @desc checks for the existence of default binder items from an array - if none exists make one
 * @param  {object}  user     user object
 * @param  {string}  binder   binderName?
 * @param  {string}  type     info or groupo
 * @param  {string}  category idk what this is
 * @param  {boolean}  rtn      return what you found?
 * @return {Promise}          [description]
 */

/**
 * @file
 */
// DEPRECATED: see check-make-item
const check_make_binder = async ({user, binder, type, category}, rtn) => {

  try {

    if(display_console || false) console.log(chalk.yellow(`[core/check_make_binder] accessed`));
    if(display_console || false) console.log(chalk.magenta(`[core/check_make_binder] user`),user);
    if(display_console || false) console.log(chalk.blue(`[core/check_make_binder] binder`),binder);

    let test_binder = { project_id: user._id,user_id: user._id, admin: 1, title_data: binder, ancestor: user._id, type};// no longer using root: 1

    let requested_binder = await Item.findOne(test_binder).lean();

    if(rtn && requested_binder){
      if(display_console || false) console.log(chalk.green(`[core/check_make_binder] ${binder} requested_binder`),requested_binder);
      return requested_binder;
    }

    if(display_console || false) console.log(chalk.yellow(`[core/check_make_binder] ${binder} requested_binder`),requested_binder);
    if(!requested_binder){

      // here requested_binder == null
      if(display_console || false) console.log(chalk.magenta(`[core/check_make_binder] ${binder} no requested_binder was found`));

      let generic_date = ( new Date() ).getTime();

      let set_category = (typeof category != "undefined") ? category : (type == "group") ? "community home" : (type == "info") ? "info home" : "media home";

      let additions = {
        published:true,
        data_type: "folder",
        category: set_category,
        alias: generic_date,
        root: true
      }

      test_binder = {...test_binder, ...additions};
      // let newItem = new Item(test_binder);
      // await newItem.save();// does this need lean(); ?

      let newItem = await Item.create(test_binder);
      await pair_item({item: newItem});

      if(display_console || false) console.log(chalk.green(`[core/check_make_binder] ${binder} newItem`),newItem);

      let update_obj = await alias_maker(newItem);

      if(display_console || false) console.log(chalk.green(`[core/check_make_binder] ${binder} update_obj`),update_obj);

      return update_obj;
    }else {

      console.log(chalk.green(`[core/check_make_binder] ${binder} requested_binder`),requested_binder);
      return requested_binder;

    }

  } catch (e) {
    console.log(chalk.red(`[check-make-binder] ${binder} an error occured`),e);
  }

}//check_make_binder

//db.getCollection(`items`).updateMany({user_id:ObjectId(`xxxxx`),root: true},{$set:{ancestor:ObjectId(`xxxxx`)}})




module.exports = {
  check_make_binder
};
