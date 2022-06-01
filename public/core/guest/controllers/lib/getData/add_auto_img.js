
const chalk = require('chalk');
const Item = require('../../../../../../models/item');
const { exists, obj_exists } = require('./exists');


const collections = ["folder", "project", "user", "organization"];

const display_console = false;

const get_auto_img = async (item) => {

  if ((!collections.includes(item.data_type) && !item.container) || obj_exists(item,"img_url")) return;

  if (display_console || false) console.log(chalk.green(`[get_auto_img] item`), item.title_data);

  let info_ids = item.info_ids;// use itself so i don't have to test for an empty string
  try {
    info_ids = info_ids.split(",");
  } catch (error) {
    // do nothing
  }

  let query = {};

  if (exists(info_ids) && Array.isArray(info_ids) && info_ids.length > 0) {
    query[`$or`] = [{ ancestor: item._id }, { _id: { $in: info_ids } }];
  } else {
    query = { ...query, ancestor: item._id }
  }

  query = { ...query, img_url: { $ne: "" } };

  if (display_console || false) console.log(chalk.green(`[get_auto_img] query`), query);

  let iDta = await Item.findOne({ ...query }).sort([[["created"], [-1]]]).lean();
  // let iDta = await Item.findOne({ $or: [{ancestor: item._id} , {_id:{ $in: info_ids }}], img_url: { $ne: "" }, img_url: { $ne: null } }).sort([[["created"], [-1]]]).lean();
  // let iDta = await Item.findOne({ ancestor: item._id, img_url: { $ne: "" }, img_url: { $ne: null } }).sort([[["created"], [-1]]]).lean();
  if (display_console || false) console.log(chalk.cyan(`[get_auto_img] iDta`), iDta.title_data, iDta.img_url);

  return obj_exists(iDta,"img_url") ? iDta.img_url : "";
};// get_auto_img

const add_auto_img = async ({rows}) => {

  // if(!Array.isArray(rows)) rows = [rows];

  for (let item of rows) {

    // LATER: test for image_enabled and auto_img or img_url != ""

    if ((collections.includes(item.data_type) || item.container == true) && !obj_exists(item,"img_url")){
      // find an item with this _id as an ancestor that also has an img_url that isn't blank

      if(display_console || false) console.log(chalk.cyan(`[add_auto_img] item`), item.title_data, item.img_url);

      let alt_img = await get_auto_img(item);

      if (alt_img){
        item.alt_img = alt_img;
        if (display_console || false) console.log(chalk.cyan(`[add_auto_img] alt img`), item.title_data, item.alt_img);
      }
      // db.getCollection('items').findOne({ $or: [ {ancestor: ObjectId("5e2d883a6be8ab12f02ed94b")} , {ancestor:{ $in: [] }}], img_url: { $ne: "" }, img_url: { $ne: null } })
      // $or:[{access:{$in:[user_id]}}, {access:{$eq:[]}}] }
      // $or: [{ ancestor: item._id }, { "$in": info_ids }]
      
    }// if
  }// for
  
  return;
};// add_auto_img

module.exports = {add_auto_img, get_auto_img};
