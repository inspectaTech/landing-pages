  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Item = require('../../models/item');// centralized models
  const User = require('../../models/user');// centralized models
  const { pair_item } = require('../../public/core/guest/controllers/lib/getData/pair_item');
  const { alias_maker } = require('./alias_maker');
  const {exists} = require('./exists');
  const display_console = false;

  /**
   * @module oas-check-make-image
   * @category Auth
   * @subcategory defaults
   * @desc checks for the existence of a image item - if none exists make one
   * @param  {object}  user user data
   * @param  {boolean}  rtn  return value as soon as possible? - used if im only trying to get the data idk what else there would be
   * @see [setup (linkback)]{@link module:OAServer-controllers-setup}
   * @return {Promise}      requested email item object
   */

  /**
   * @file
   */

  const check_make_image = async ({user}, rtn) => {

    // , method, type, category, title, image
    try {
    
      let method = user.method;
      let type = "info";
      let category = "image";
      let title = `${method} login image`;
      let image = user[method].image;


      if(display_console || false) console.log(chalk.yellow('[core/check_make_category] accessed'));
      if(display_console || false) console.log(chalk.magenta('[core/check_make_image] user'),user);
      if(display_console || false) console.log(chalk.blue('[core/check_make_image] image'),image);

      // see if it has an image id
      let requested_image;
      let has_image_item = (typeof user[user.method].image_id != "undefined") ? true: false;
      if(display_console || false) console.log(chalk.yellow("[core/check_make_image] has_image_item = "), has_image_item);

      //
      if(has_image_item){

        // see if it still exists
        requested_image = await Item.findOne({ _id: user[user.method].image_id }).lean();
      }

      if(rtn && exists(requested_image)){
        if(display_console || false) console.log(chalk.green('[core/check_make_image] requested_image'),requested_image);
        return requested_image;
      }

      // if it doens't still exist or never existed: do this
      if(!exists(requested_image)){

        // here requested_image == null
        if(display_console || false) console.log(chalk.magenta('[core/check_make_image] no requested_image was found'));

        let generic_date = ( new Date() ).getTime();

        //get image folder - no longer needs an image folder
        // let test_binder = { user_id: user._id, admin: 1, title_data: "image", "ancestor": user._id, type: "info"}
        // let image_binder = await Item.findOne(test_binder);

        let test_image = {
          user_id: user._id,
          admin: 1,
          title_data: title,
          img_url: image,/*url_data*/
          type,
          root: 0,
          published:true,
          data_type: "image",
          category,
          ancestor: user._id,/*image_binder._id,*/
          alias: generic_date,
          project_id: user._id,
        }

        // test_image = {...test_image, ...additions};
        // let newItem = new Item(test_image);
        // await newItem.save();//does this need lean(); ?

        let newItem = await Item.create(test_image);
        if(0) console.log(chalk.yellow(`[core/check_make_item] image`, newItem));
        await pair_item({item: newItem});

        if(display_console || false) console.log(chalk.green('[core/check_make_image] newItem newly saved'),newItem);

        // add the new image to the user image_id
        let set = {$set: {}};
        set.$set[`${method}.image_id`] = newItem._id;
        let update_user = await User.findOneAndUpdate({ _id: user._id }, set, { new: true });

        let update_obj = await alias_maker(newItem);

        if(display_console || false) console.log(chalk.green('[core/check_make_image] requested_image newly saved'),update_obj);
        return update_obj;

      }else {

        if(display_console || false) console.log(chalk.green('[core/check_make_image] requested_image'),requested_image);
        return requested_image;
      }

    } catch (e) {
      console.log(chalk.red("[core/check_make_image] an error occured"),e);
    }

  }//check_make_image

  module.exports = {
    check_make_image
  }

// ISSUE: when does presets/check-make/check-make-image run?
// ISSUE: check-make isn't DRY - src/oauth_server/controllers/lib/check-make && public/presets/check-make
// presets run a limited version that checks the pair data and makes adjustments to obsolete email or image pair references
// it doesn't actually make new default items unless the old ones are useless
