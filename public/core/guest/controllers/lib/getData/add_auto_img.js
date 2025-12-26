
const chalk = require('chalk');
const Item = require('../../../../../../models/item');
const { getAdvData } = require('../../../../../alight/controllers/lib/getData/getAdvData');
const { exists, obj_exists } = require('./exists');


const collections = ["folder", "project", "user", "organization"];

const display_console = false;

const get_auto_img = async (item) => {

  if ((!collections.includes(item.data_type) && !item.container) || obj_exists(item,"img_url")) return;

  if (display_console || false) console.log(chalk.green(`[get_auto_img] item`), item.title_data);

  let info_ids = item.info_ids;// use itself so i don't have to test for an empty string
  if (display_console || false) console.log(chalk.green(`[get_auto_img] info_ids`), item.info_ids);


  try {
    info_ids = info_ids.split(",");
  } catch (error) {
    // do nothing
  }

  let query = {};

  // using getAdvData doesn't actually need info_ids but since there here...
  if (exists(info_ids) && Array.isArray(info_ids) && info_ids.length > 0) {
    query[`$or`] = [{ host_id: item._id }, { pair_id: { $in: info_ids } }];
  } else {
    query = { ...query, host_id: item._id }
  }

  let query2 = { img_url: { $ne: "" } };

  if (display_console || false) console.log(chalk.green(`[get_auto_img] query`), query);

  // let iDta = await Item.findOne({ ...query }).sort([[["created"], [-1]]]).lean();

  let pair_obj_ary = await getAdvData({
    query,
    limit: 1,
    query2,
    sort: { pair_created: -1 },
    label: "[get_auto_img] pair",
    // vp: true,// view (console.log) pipeline
    // vq: true,
    // vs: true,
  });
  
  let iDta = Array.isArray(pair_obj_ary) && pair_obj_ary[0] ? pair_obj_ary[0] : null;


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
        if (display_console || false) console.log(chalk.cyan(`[add_auto_img] alt_img`), alt_img);
        item.alt_img = alt_img;
        if (display_console || false) console.log(chalk.cyan(`[add_auto_img] item alt_img`), item.title_data, item.alt_img);
      }
      // db.getCollection('items').findOne({ $or: [ {ancestor: ObjectId("5e2d883a6be8ab12f02ed94b")} , {ancestor:{ $in: [] }}], img_url: { $ne: "" }, img_url: { $ne: null } })
      // $or:[{access:{$in:[user_id]}}, {access:{$eq:[]}}] }
      // $or: [{ ancestor: item._id }, { "$in": info_ids }]
      
    }// if
  }// for
  
  return;
};// add_auto_img

module.exports = {add_auto_img, get_auto_img};
