const chalk = require('chalk');
// const User = require('../../../../models/user');// centralized models
const Item = require('../../models/item');// centralized models
const { pair_item } = require('../../public/core/guest/controllers/lib/getData/pair_item');
const { alias_maker } = require('./alias_maker');
const display_console = false;

const check_make_item = async (item_id, get = false) => {

  try {
    if(display_console || false) console.log(chalk.yellow(`[core/check_make_item] user id`),item_id);
  
    // there is no such thing as user.project_id yet - this user is just signing up or signing in
    let item = await Item.findOne({_id:item_id}).lean();
  
    if(get) return item;
  
    if(!item){
  
      if(display_console || false) console.log(chalk.yellow(`[core/check_make_item] has_item = false`));
  
      let string_id = item_id.toString();
  
      let test_item = {
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
        filter: "custom_alpha",
        published: true,
        admin: true,
        root: true
      };
  
      // const newItem = new Item(test_item);
      // // root: true, helps protect from an infinite loop when using get_my_ancestors
      // item = await newItem.save();
  
      let newItem = await Item.create(test_item)
      if(0) console.log(chalk.yellow(`[core/check_make_item] item`, newItem));
      await pair_item({item: newItem});
  
      item = newItem;
  
    }else{
      if(display_console || false) console.log(chalk.yellow(`[core/check_make_item] has_item detected`));
    }
  
  
    return item;

  } catch (e) {
    if(display_console || 1) console.log(chalk.red(`[check-make-item] an error occured`), e);
  }
}// check_make_item

module.exports = {
  check_make_item
};
