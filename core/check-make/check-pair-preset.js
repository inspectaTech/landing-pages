    const chalk = require('chalk');
    // const User = require('../../../../models/user');// centralized models
    const Pair = require('../../models/pair');// centralized models
    const display_console = false;

    /**
     * @module oas-check-pair-preset
     * @category Auth
     * @subcategory defaults
     * @param  {object}  user user data
     * @param  {boolean}  rtn  return value as soon as possible? - used if im only trying to get the data idk what else there would be
     * @see [setup (linkback)]{@link module:OAServer-controllers-setup}
     * @return {Promise}      requested email item object
     */

    /**
     * @file
     */

  const check_pair_preset = async ({user, host_id, host_type, link_id, link_type, admin = false, all}, rtn) => {
    // finds preset that is paired with the group

    try {

      if(display_console || false) console.log(chalk.yellow('[core/check_pair_preset] accessed'));
      if(display_console || false) console.log(chalk.magenta('[core/check_pair_preset] user'),user);

      // check to see if already paired
      let find_all = all || false;
      let pair_obj;

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
      if(display_console || false) console.log(chalk.yellow("[core/check_pair_preset] requested_pair"),requested_pair);

      if(rtn){
        return requested_pair;
      }

      // if there are no presets add the default preset to the group public binder
      if(!requested_pair){

        pair_obj.link_id = link_id;

        if(typeof host_type != "undefined"){
          pair_obj.host_type = host_type;
        }

        pair_obj.admin = admin;// admin generated pair

        let newPair = new Pair(pair_obj);
        await newPair.save();
        if(display_console || false) console.log(chalk.green("[core/check_pair_preset] newPair"),newPair);

        let lean_newPair = newPair.toObject();

        return lean_newPair;

      }else{
        if(display_console || false) console.log(chalk.green("[core/check_pair_preset] a requested_pair was found"),requested_pair);
        return requested_pair;
      }


    } catch (e) {
      console.log(chalk.red("[check-pair-preset] an error occured"),e);
    }

  }//check_pair_preset


  module.exports = {
    check_pair_preset
  }
