  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Item = require('../../../models/item');// centralized models ./check-make
  const User = require('../../../models/user');// centralized models  ./check-make
  const { alias_maker } = require('./alias_maker');
  const {exists} = require('./exists');
  const keys = require('./keys');
  const display_console = false;

  const check_make_preset = async ({user, method, type = "info", category = "preset", title = "default preset"}, rtn) => {

    try {

      if(display_console) console.log(chalk.yellow('[check_make_preset] accessed'));
      if(display_console) console.log(chalk.magenta('[check_make_preset] user'),user);

      // see if it has an preset id
      let requested_preset;

      // see if admin created preset still exists
      requested_preset = await Item.findOne({ user_id: user._id, data_type: "preset", type: "info", admin: 1}).lean();

      if(rtn){
        // what is this for? what if it doesn't exist? why am i returning it empty?
        return requested_preset;
      }// if


      // if it doesn't still exist or never existed: do this
      if(!exists(requested_preset)){

        // here requested_preset == null
        if(display_console) console.log(chalk.red('no requested_preset was found!'));

        let generic_date = ( new Date() ).getTime();

        //get preset folder - deprecated
        // let test_binder = { user_id: user._id, title_data: "presets", data_type: "folder", admin: 1, root: 1, type: "info"};
        // let preset_binder = await Item.findOne(test_binder)

        let project_item = await check_make_item(user._id);

        // there are 2 of these one in src/oauth_server and another in public/presets
        let test_preset = {
          user_id: user._id,
          admin: 1,
          title_data: title,
          type,
          root: 0,
          published:true,
          data_type: "preset",
          category,
          project_id: user._id,
          ancestor: user._id,/*ancestor is the user._id which will also be the user's project _id and the project_id*/
          alias: generic_date,
          tool:{
            name: keys.preset.default.tool.name,
            template: keys.preset.default.tool.template
          }
        }

        if(display_console) console.log(chalk.yellow('making preset'),test_preset);

        // test_preset = {...test_preset, ...additions};
        let newItem = new Item(test_preset);

        await newItem.save();

        let update_obj = await alias_maker(newItem);

        // add the new preset to the user preset_id
        // let set = {$set: {}};
        // set.$set[`${method}.preset_id`] = newItem._id;//what method?
        // let update_user = await User.findOneAndUpdate({ _id: user._id }, set, { new: true });

        // update the project items preset_id
        let set = {$set: {}};
        set.$set[`preset_id`] = newItem._id;//what method?
        let update_project_item = await Item.findOneAndUpdate({ _id: project_item._id }, set, { new: true });

        return update_obj;

      } else {
        if(display_console) console.log(chalk.green('[requested_preset]'),requested_preset);
        return requested_preset;
      }// else

    } catch (e) {
      if(display_console) console.log(chalk.red("[check-make-preset] an error occured"),e);
    }// catch

  }//check_make_preset

  module.exports = {
    check_make_preset
  }
