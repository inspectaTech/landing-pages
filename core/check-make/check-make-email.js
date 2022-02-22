  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Item = require('../../models/item');// centralized models
  const User = require('../../models/user');// centralized models
  const { alias_maker } = require('./alias_maker');
  const display_console = false;

  /**
   * @module oas-check-make-email
   * @category Auth
   * @subcategory defaults
   * @desc checks for the existence of an email item - if none exists make one
   * @param  {object}  user user data
   * @param  {boolean}  rtn  return value as soon as possible? - used if im only trying to get the data idk what else there would be
   * @see [setup (linkback)]{@link module:OAServer-controllers-setup}
   * @return {Promise}      requested email item object
   */

  /**
   * @file
   */

  const check_make_email = async ({user}, rtn) => {

    // , method, type, category, title, email

    let method = user.method;
    let type = "info";
    let category = "email";
    let title = `${method} login email`;
    let email = user[method].email;

    try {

      if(display_console || false) console.log(chalk.yellow('[check_make_email] accessed'));
      if(display_console || false) console.log(chalk.magenta('[check_make_email] user'),user);
      if(display_console || false) console.log(chalk.blue('[check_make_email] email'),email);

      // see if it has an email id
      let requested_email;
      let has_email_item = (typeof user[method].email_id != "undefined") ? true: false;
      if(display_console || false) console.log(chalk.yellow("[check make email] has_email_item id = "), has_email_item);

      //
      if(has_email_item){

        // see if it still exists
        requested_email = await Item.findOne({ _id: user[method].email_id }).lean();
      }

      if(rtn && requested_email){
        if(display_console || false) console.log(chalk.green('[check-make-email] requested_email'),requested_email);
        // can i do this only if requested_email value exists?
        return requested_email;
      }

      if(display_console || false) console.log(chalk.yellow('[check-make-email] requested_email'),requested_email);
      // if it doens't still exist or never existed: do this
      if(!requested_email){

        // here requested_email == null
        if(display_console || false) console.log(chalk.magenta('no requested_email was found'));

        let generic_date = ( new Date() ).getTime();

        //get email folder - deprecated - no longer needs an email folder
        // let test_binder = { user_id: user._id, admin: 1, title_data: "email", "ancestor": user._id, type: "info"};
        // let email_binder = await Item.findOne(test_binder).lean();
        // if(display_console || false) console.log(chalk.yellow('[check-make-email] email_binder'),email_binder);

        let test_email = {
          user_id: user._id,
          admin: 1,
          title_data: title,
          core_data: email,
          type,
          root: 0,
          published:true,
          data_type: "email",
          category,
          ancestor: user._id,/*email_binder._id,*/
          alias: generic_date
        }

        // test_email = {...test_email, ...additions};
        let newItem = new Item(test_email);

        await newItem.save();// does this need lean(); ?

        if(display_console || false) console.log(chalk.green('[check-make-email] newItem'),newItem);

        /**
         * @function alias_maker
         * @param {object} newItem
         * @return {object} updated object
         * @requires oas-alias-maker
         */
        let update_obj = await alias_maker(newItem);

        // add the new email to the user email_id
        let set = {$set: {}};
        set.$set[`${method}.email_id`] = newItem._id;
        let update_user = await User.findOneAndUpdate({ _id: user._id }, set, { new: true }).lean();

        if(display_console || false) console.log(chalk.green('[check-make-email] update_user'),update_user);

        return update_obj;
      }else {

        if(display_console || false) console.log(chalk.green('[check-make-email] requested_email'),requested_email);
        return requested_email;
      }

    } catch (e) {
      if(display_console || false) console.log(chalk.red("[check-make-email] an error occured"),e);
    }// catch

  }//check_make_email

  module.exports = {
    check_make_email
  }
