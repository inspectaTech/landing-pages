const chalk = require('chalk');
// const User = require('../../../../models/user');// centralized models
const Item = require('../../models/item');// centralized models
const { alias_maker } = require('./alias_maker');
const display_console = false;

const check_make_item = async (item_id, get = false) => {

  if(display_console || false) console.log(chalk.yellow(`[check_make_item] user id`),item_id);

  // there is no such thing as user.project_id yet - this user is just signing up or signing in
  let item = await Item.findOne({_id:item_id}).lean();

  if(get) return item;

  if(!item){

    if(display_console || false) console.log(chalk.yellow(`[check_make_item] has_item = false`));

    let string_id = item_id.toString();
    const newItem = new Item({
      _id: item_id,
      user_id: item_id,
      project_id: item_id,
      type: "group",
      data_type: "user",
      title_data: string_id,
      category: "community home",
      alias:`${string_id}/${string_id}`,// this is what was missing, "items" will never have single path alias like a "project" does
      path: string_id,
      ancestor: item_id,
      published: true,
      admin: true,
      root: true
    });
    // root: true, helps protect from an infinite loop when using get_my_ancestors

    item = await newItem.save();

  }else{
    if(display_console || false) console.log(chalk.yellow(`[check_make_item] has_item detected`));
  }


  return item;
}// check_make_item

module.exports = {
  check_make_item
};
