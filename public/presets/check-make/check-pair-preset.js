  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Pair = require('../../../models/pair');// centralized models
  const {get_item_data} = require('./get-item-data');
  const {check_make_preset} = require('./check-make-preset');
  const keys = require('./keys');
  const {exists} = require('./exists');
  const {unpair} = require('./unpair');

  const check_pair_preset = async ({user, host_id, host_type, link_type, all}, rtn) => {
    // finds preset that is paired with the group

    try {

      console.log(chalk.yellow('[check_pair_preset] accessed'));
      console.log(chalk.magenta('[check_pair_preset] user'),user);

      // check to see if already paired
      let find_all = all || false;
      let pair_obj;
      let does_item_exist = false;

      if(find_all){
        pair_obj = {host_id, owner_id: user._id, editor_id: user._id};
        if(typeof link_type != "undefined"){
          pair_obj.link_type = link_type;
        }
        requested_pair = await Pair.find(pair_obj).lean();
      }else{
        pair_obj = {host_id, owner_id: user._id, editor_id: user._id, link_type};
        requested_pair = await Pair.findOne(pair_obj).lean();
      }
      console.log(chalk.yellow("[check_pair_preset] requested_pair"),requested_pair);

      // does the paired preset still actually exist?
      if(exists(requested_pair)){
        does_item_exist = await get_item_data(requested_pair.link_id);
        console.log(chalk.yellow("[check_pair_preset] does_item_exist"),does_item_exist);
      }


      // or more depending on how may presets were 'mistakenly' attached to this binder

      // if not can we make a default preset to use? - below ill check to find a default and pair it



      if(exists(requested_pair) && exists(does_item_exist) && rtn){
        console.log(chalk.green("[check_pair_preset] all is well, returning early"));
        return requested_pair;
      }else if(exists(requested_pair) && !exists(does_item_exist)){
        // if not delete this pairing and see if there others available for this binder? - this may run recursively 3x
        console.log(chalk.red("[check_pair_preset] expired pairing detected, deleting pair"));
        // this is going to delete the false pair and try to get another one
        let unpaired = await unpair({ link_id:requested_pair.link_id, owner_id: user._id, mode: "all"})
        console.log(chalk.magenta("[unpaired] results"),unpaired);

        // run this again recursively
        requested_pair = await check_pair_preset({user, host_id, host_type, link_type, all}, true);
      }

      // if there are no paired presets add the default preset to the group public binder
      // what default preset
      if(!exists(requested_pair)){

        // i need the default check here
        let default_preset = await check_make_preset(
          {
            user,
            method: user.method,
            type: "info",
            category:keys.preset.default.category,
            title: keys.preset.default.title
          }
        );

        pair_obj.link_id = default_preset._id;
        if(typeof host_type != "undefined"){
          pair_obj.host_type = host_type;
        }

        let newPair = new Pair(pair_obj);
        await newPair.save();
        console.log(chalk.green("[check_pair_preset] newPair"),newPair);

        let lean_newPair = newPair.toObject();

        return lean_newPair;

      }else{
        console.log(chalk.green("[check_pair_preset] a requested_pair was found"),requested_pair);
        return requested_pair;
      }


    } catch (e) {
      let error_msg = "[check-pair-preset] an error occured";
      console.log(chalk.red(error_msg),e);
      return {
        error: true,
        message: error_msg,
        data: e
      };
    }

  }//check_pair_preset


  module.exports = {
    check_pair_preset
  }
