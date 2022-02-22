  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Item = require('../../models/item');// centralized models
  const User = require('../../models/user');// centralized models
  const { alias_maker } = require('./alias_maker');
  const preset_defaults = require('./preset_defaults');
  const display_console = false;

  /**
   * @module oas-check-make-preset
   * @category Auth
   * @subcategory defaults
   * @desc checks for the existence of a preset item - if none exists make one
   * @param  {object}  user user data
   * @param  {boolean}  rtn  return value as soon as possible? - used if im only trying to get the data idk what else there would be
   * @see [setup (linkback)]{@link module:OAServer-controllers-setup}
   * @return {Promise}      requested email item object
   */

  /**
   * @file
   */

  const check_make_preset = async ({_id, method, type, category, title}, rtn) => {

  try {

    if(display_console || false) console.log(chalk.yellow('[check_make_preset] accessed'));
    if(display_console || false) console.log(chalk.magenta('[check_make_preset] user'),user);

    // see if it has an preset id
    let requested_preset;

    // see if it still exists
    requested_preset = await Item.findOne({ user_id: _id, data_type: "preset", type: "info", admin: 1}).lean();

    if(rtn){
      return requested_preset;
    }


    // if it doens't still exist or never existed: do this
    if(!requested_preset){

      // here requested_preset == null
      if(display_console || false) console.log(chalk.magenta('[check_make_preset] no requested_preset was found'));

      let generic_date = ( new Date() ).getTime();

      //get preset folder - deprecated - no longer needs a preset binder
      // let test_binder = { user_id: _id, title_data: "presets", data_type: "folder", admin: 1, "ancestor": _id, type: "info"};
      // let preset_binder = await Item.findOne(test_binder)

      // there are 2 of these one in src/oauth_server and another in public/presets
      let test_preset = {
        user_id: _id,
        admin: 1,
        title_data: title,
        type,
        root: 0,
        published:true,
        data_type: "preset",
        category,
        ancestor: _id,/*preset_binder._id,*/
        alias: generic_date,
        tool:{
          name: preset_defaults.preset.default.tool.name,
          template: preset_defaults.preset.default.tool.template
        }
      }

      // test_preset = {...test_preset, ...additions};
      let newItem = new Item(test_preset);

      await newItem.save();// does this need lean(); ?

      if(display_console || false) console.log(chalk.green('[check_make_preset] newItem'),newItem);

      let update_obj = await alias_maker(newItem);

      // add the new preset to the user preset_id
      let set = {$set: {}};
      set.$set[`${method}.preset_id`] = newItem._id;
      let update_user = await User.findOneAndUpdate({ _id }, set, { new: true });

      return update_obj;

    }else {

      if(display_console || false) console.log(chalk.green('[check_make_preset] requested_preset'),requested_preset);
      return requested_preset;
    }

  } catch (e) {
    if(display_console || false) console.log(chalk.red("[check_make_preset] an error occured"),e);
  }

  }//check_make_preset

  module.exports = {
    check_make_preset
  }
