  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Pair = require('../../../models/pair');// centralized models
  const {exists} = require('./exists');
  const display_console = false;


  const check_pair_items = async ({user, host_id, host_type, link_id, link_type, admin = false, all}, rtn) => {

  try {

    if(display_console) console.log(chalk.yellow('[check_pair_items] accessed'));
    if(display_console) console.log(chalk.magenta('[check_pair_items] user'),user);

    // check to see if already paired
    let find_all = all || false;
    let pair_obj;

    if(find_all){
      pair_obj = {host_id, owner_id: user._id, editor_id: user._id};
      if(typeof link_type != "undefined"){
        pair_obj.link_type = link_type;
      }
      requested_pair = await Pair.find(pair_obj).sort([[["pair_priority"],[-1]],[["created"],[-1]]]).lean();
    }else{
      // this generically finds any of a specific type - if any exist return it - this way it doesn't have to be a default item
      pair_obj = {host_id, owner_id: user._id, editor_id: user._id, link_type };
      requested_pair = await Pair.findOne(pair_obj).sort([[["pair_priority"],[-1]],[["created"],[-1]]]).lean();
    }
    if(display_console) console.log(chalk.yellow("[check_pair_items] requested_pair"),requested_pair);

    if(rtn){
      return requested_pair;
    }

    if(!exists(requested_pair) /*&& !exists(link_id)*/){
      // don't make a pair without a link_id
      if(display_console) console.log(chalk.green("[check_pair_items] no requested_pair was found or created"),requested_pair);
      return requested_pair;
    // } else if(!exists(requested_pair) && exists(link_id)){
      // pair_obj.link_id = link_id;

      // if(exists(host_type)){
      //   pair_obj.host_type = host_type;
      // }

      // pair_obj.admin = admin;// admin generated pair

      // let newPair = new Pair(pair_obj);
      // await newPair.save();
      // if(display_console) console.log(chalk.green("[check_pair_items] newPair"),newPair);

      // let lean_newPair = newPair.toObject();

      // return lean_newPair;

    }else{
      if(display_console) console.log(chalk.green("[check_pair_items] a requested_pair was found"),requested_pair);
      return requested_pair;
    }


  } catch (e) {
    if(display_console) console.log(chalk.red("[check-pair-items] an error occured"),e);
  }

  }//check_pair_items
  module.exports = {
    check_pair_items
  }
