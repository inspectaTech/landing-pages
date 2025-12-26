const chalk = require('chalk');

const Item = require('../../../models/item');// ./check-make
const User = require('../../../models/user');// centralized models
const { pair_item } = require('../../core/guest/controllers/lib/getData/pair_item');
const { alias_maker } = require('./alias_maker');
const display_console = false;

// DEPRECATED: see check-make-items
const check_make_binder = async ({user, binder, type, category}, rtn) => {

try {

  if(display_console) console.log(chalk.yellow('[check_make_binder] accessed'));
  if(display_console) console.log(chalk.magenta('[check_make_binder] user'),user);
  if(display_console) console.log(chalk.blue('[check_make_binder] binder'),binder);

  let test_binder = { user_id: user._id, admin: 1, title_data: binder, root: 1, type}

  let requested_binder = await Item.findOne(test_binder).lean();

  if(rtn){
    return requested_binder;
  }

  if(!requested_binder){

    // here requested_binder == null
    if(display_console) console.log(chalk.red('no requested_binder was found'));

    let generic_date = ( new Date() ).getTime();

    let set_category = (typeof category != "undefined") ? category : (type == "group") ? "community home" : (type == "info") ? "info home" : "media home";

    let additions = {
      published:true,
      data_type: "folder",
      category: set_category,
      alias: generic_date
    }

    test_binder = {...test_binder, ...additions};
    // let newItem = new Item(test_binder);
    // await newItem.save();

    let newItem = await Item.create(test_binder);
    await pair_item({item: newItem});

    let update_obj = await alias_maker(newItem);

    return update_obj;
  }else {

    if(display_console) console.log(chalk.green('[requested_binder]'),requested_binder);
    return requested_binder;

  }

} catch (e) {
  if(display_console) console.log(chalk.red("[check-make-binder] an error occured"),e);
}

}//check_make_binder




module.exports = {
  check_make_binder
};
