const chalk = require('chalk');

const Item = require('../../../models/item');// ./check-make
const User = require('../../../models/user');// centralized models
const { alias_maker } = require('./alias_maker');

const check_make_binder = async ({user, binder, type, category}, rtn) => {

try {

  console.log(chalk.yellow('[check_make_binder] accessed'));
  console.log(chalk.magenta('[check_make_binder] user'),user);
  console.log(chalk.blue('[check_make_binder] binder'),binder);

  let test_binder = { user_id: user._id, admin: 1, title_data: binder, root: 1, type}

  let requested_binder = await Item.findOne(test_binder).lean();

  if(rtn){
    return requested_binder;
  }

  if(!requested_binder){

    // here requested_binder == null
    console.log(chalk.red('no requested_binder was found'));

    let generic_date = ( new Date() ).getTime();

    let set_category = (typeof category != "undefined") ? category : (type == "group") ? "community home" : (type == "info") ? "info home" : "media home";

    let additions = {
      published:true,
      data_type: "folder",
      category: set_category,
      alias: generic_date
    }

    test_binder = {...test_binder, ...additions};
    let newItem = new Item(test_binder);

    await newItem.save();

    let update_obj = await alias_maker(newItem);

    return update_obj;
  }else {

    console.log(chalk.green('[requested_binder]'),requested_binder);
    return requested_binder;

  }

} catch (e) {
  console.log(chalk.red("[check-make-binder] an error occured"),e);
}

}//check_make_binder




module.exports = {
  check_make_binder
};
