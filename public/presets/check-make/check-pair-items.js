  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Pair = require('../../../models/pair');// centralized models
  const {exists} = require('./exists');


  const check_pair_items = async ({user, host_id, host_type, link_id, link_type, all}, rtn) => {

  try {

    console.log(chalk.yellow('[check_pair_items] accessed'));
    console.log(chalk.magenta('[check_pair_items] user'),user);

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
      // this generically finds any of a specific type - if any exist return it - this way it doesn't have to be a default item
      pair_obj = {host_id, owner_id: user._id, editor_id: user._id, link_type };
      requested_pair = await Pair.findOne(pair_obj).lean();
    }
    console.log(chalk.yellow("[check_pair_items] requested_pair"),requested_pair);

    if(rtn){
      return requested_pair;
    }

    if(!exists(requested_pair)){
      pair_obj.link_id = link_id;

      if(exists(host_type)){
        pair_obj.host_type = host_type;
      }

      let newPair = new Pair(pair_obj);
      await newPair.save();
      console.log(chalk.green("[check_pair_items] newPair"),newPair);

      let lean_newPair = newPair.toObject();

      return lean_newPair;

    }else{
      console.log(chalk.green("[check_pair_items] a requested_pair was found"),requested_pair);
      return requested_pair;
    }


  } catch (e) {
    console.log(chalk.red("[check-pair-items] an error occured"),e);
  }

  }//check_pair_items
  module.exports = {
    check_pair_items
  }
