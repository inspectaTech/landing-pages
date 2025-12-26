  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Item = require('../../../models/item');// centralized models ./check-make
  const User = require('../../../models/user');// centralized models  ./check-make
const { pair_item } = require('../../core/guest/controllers/lib/getData/pair_item');
  const { alias_maker } = require('./alias_maker');
  const {exists} = require('./exists');
  const display_console = false;

  const check_make_image = async ({user}, rtn) => {

    // const {method, type, category, title, image} = user;
    let method = user.method;
    let type = "info";
    let category = "image";
    let title = `${method} login image`;
    let image = user[method].image;// LATER: if no image add a generic site image url

  try {

    if(display_console) console.log(chalk.yellow('[check_make_category] accessed'));
    if(display_console) console.log(chalk.magenta('[check_make_image] user'),user);
    if(display_console) console.log(chalk.blue('[check_make_image] image'),image);

    // see if it has an image id
    let requested_image;
    let has_image_item = (typeof user[`${user.method}`].image_id != "undefined") ? true: false;
    if(display_console) console.log(chalk.yellow("[check make image] has_image_item = "), has_image_item);

    //
    if(has_image_item){

      // see if it still exists
      requested_image = await Item.findOne({ _id: user[user.method].image_id }).lean();
    }

    if(rtn && exists(requested_image)){
      if(display_console) console.log(chalk.green('[requested_image] early'),requested_image);
      return requested_image;
    }

    // if it doens't still exist or never existed: do this
    if(!exists(requested_image)){

      // here requested_image == null
      if(display_console) console.log(chalk.red('no requested_image was found'));

      let generic_date = ( new Date() ).getTime();

      //get image folder
      let test_binder = { user_id: user._id, admin: 1, title_data: "image", root: 1, admin: 1, type: "info"}
      let image_binder = await Item.findOne(test_binder)

      let test_image = {
        user_id: user._id,
        admin: 1,
        title_data: title,
        img_url: image,/*previously url_data*/
        type,
        root: 0,
        published:true,
        data_type: "image",
        category,
        ancestor: image_binder._id,
        alias: generic_date
      }

      // test_image = {...test_image, ...additions};
      // let newItem = new Item(test_image);
      // await newItem.save();

      let newItem = await Item.create(test_image);
      await pair_item({item: newItem});


      // add the new image to the user image_id
      let set = {$set: {}};
      set.$set[`${method}.image_id`] = newItem._id;
      let update_user = await User.findOneAndUpdate({ _id: user._id }, set, { new: true });

      let update_obj = await alias_maker(newItem);

      if(display_console) console.log(chalk.green('[requested_image] late'),requested_image);
      return update_obj;

    } else {

      if(display_console) console.log(chalk.green('[requested_image] early'),requested_image);
      return requested_image;

    }//else

  } catch (e) {
    if(display_console) console.log(chalk.red("[check-make-image] an error occured"),e);
  }//

  }//check_make_image

  module.exports = {
    check_make_image
  }
