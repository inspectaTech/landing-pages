const mongoose = require('mongoose');
const chalk = require('chalk');

const Pair = require('../../../../../../models/pair');
const Item = require('../../../../../../models/item');
const { item_reducer } = require('../../../../../../core/check-make/item-reducer');
const { getAdvData } = require('../../../../../alight/controllers/lib/getData/getAdvData');

const display_console = false;

const ObjectId = mongoose.Types.ObjectId;

const pair_item = async ({item, test=false, upsert=true}) => { 

  let pair, test_pair;

  if(display_console || false) console.log(chalk.cyan(`[pair_item] running...`));

  if (display_console || false) console.log(chalk.cyan(`[pair_item] item`), item);

  let host = await Item.findOne({ _id: item.ancestor });

  if (host) {

    //item.markModified("links");
    if (display_console || false) console.log(chalk.cyan(`[pair_item] host`), host);

    let new_pair = {
      // "_id":item._id,
      "host_id": item.ancestor,
      "host_type": host.data_type,
      "host_display": host.type,
      "host_project_id": host.project_id,
      "pair_order": item.order || 0,
      "owner_id": host.user_id,
      "editor_id": item.user_id,
      "link_id": item._id,
      "link_type": item.data_type,
      "link_display": item.type,
      "link_project_id": item.project_id,
      "pair_created": item.created,
      "pair_modified": item.modified,
      "init_date": item.created,
      "admin": item.admin || false,
      "pair_priority": item.priority || 0,
      "pair_caption": {text: item.caption || "", mode: "default", editor: item.owner_id},
      "attachment": false,
    };

    if(test){
      test_pair = await Pair.findOne({ _id: item._id });
    }// if

    if(!test || test && !test_pair){
      
      pair = await Pair.findOneAndUpdate({ _id: item._id }, { $set: new_pair }, { upsert });
  
      if (display_console || false) console.log(chalk.cyan(`[pair_item] pair`), pair);

    }// if
    
    return pair;

  } else {
    console.log(chalk.red(`[aggregate] host not found`), item.ancestor);
  }// else

}// pair_item

const backup_pair = async ({pair_id}) => {
  let item = await Item.findOne({_id: pair_id});
  let pair_obj_ary;

  if(item){
    let new_pair = await pair_item({ item, test: true });

    pair_obj_ary = await getAdvData({
      query: {
        '_id': new ObjectId(pair_id),
      },
      limit: 1
    });
    
  }// item

  if (pair_obj_ary){
    let pair_obj = Array.isArray(pair_obj_ary) && pair_obj_ary[0] ? pair_obj_ary[0] : null;
    return pair_obj;
  }else{
    return;
  }// else

}// backup_pair

 module.exports = {
   pair_item,
   backup_pair
 }