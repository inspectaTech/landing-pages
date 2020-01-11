  const chalk = require('chalk');
  const Item = require('../../models/item');// ./presets

  const getPublicBinder = async function({ user },rrn)
  {
    try {

      let rerun = rrn || false;
      let preset_data = {};
      let user_id = user._id;
      console.log(chalk.yellow("[get binder] user id"),user_id);

      let test_binder = { user_id, admin: 1, title_data: "public", root: 1, type}

      let requested_binder = await Item.findOne(test_binder).lean();

      if(!rerun){
        // preset_data = await getItemPreset({user_id, published}, true);
        // return preset_data;
      }

    } catch (e) {
      console.error(chalk.red("[get item preset] an error occured"),e);
    }

  };//getPublicBinder

module.exports = {
  getPublicBinder
};
