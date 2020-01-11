  const chalk = require('chalk');
  const Item = require('../../models/item');// ./presets

  const getItemPreset = async function({ user_id, published },rrn)
  {
    try {

      let rerun = rrn || false;
      let preset_data = {};
      console.log(chalk.yellow("[get preset] getting user id"),user_id);
      console.log(chalk.yellow("[get preset] item is published = "),published);

      //if the item is published - find the users public binder

      // find the preset associated with the binder

      // if there is no public binder and no preset run the restore defaults fn

      //try to rerun getItemPreset




      if(!rerun){
        preset_data = await getItemPreset({user_id, published}, true);
        return preset_data;
      }

    } catch (e) {
      console.error(chalk.red("[get item preset] an error occured"),e);
    }

  };//getItemPreset

module.exports = {
  getItemPreset
};
