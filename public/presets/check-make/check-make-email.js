  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Item = require('../../../models/item');// centralized models ./check-make
  const User = require('../../../models/user');// centralized models  ./check-make
  const { alias_maker } = require('./alias_maker');

  const check_make_email = async ({user}, rtn) => {

// const { method, type, category, title, email } = user;
// user, method, type: "info", category:"email", title: "google login email", email

  let method = user.method;
  let type = "info";
  let category = "email";
  let title = `${method} login email`;
  let email = user[method].email;

  try {

    console.log(chalk.yellow('[check_make_email] accessed'));
    console.log(chalk.magenta('[check_make_email] user'),user);
    console.log(chalk.blue('[check_make_email] email'),email);
    console.log(chalk.blue('[check_make_email] user method'),user.method);
    console.log(chalk.blue('[check_make_email] email id '),user[user.method].email_id);

    // see if it has an email id
    let requested_email;
    let has_email_item = (typeof user[`${user.method}`].email_id != "undefined") ? true: false;
    console.log(chalk.yellow("[check make email] has_email_item = "), has_email_item);

    //
    if(has_email_item){

      // see if it still exists
      requested_email = await Item.findOne({ _id: user[`${user.method}`].email_id }).lean();
    }

    if(rtn && requested_email != false){
      console.log(chalk.cyan("[requested_email] returning "),requested_email);
      return requested_email;
    }

    // if it doens't still exist or never existed: do this
    if(requested_email == false){

      // here requested_email == null
      console.log(chalk.red('no requested_email was found'));

      let generic_date = ( new Date() ).getTime();

      //get email folder
      let test_binder = { user_id: user._id, admin: 1, title_data: "email", root: 1, admin: 1, type: "info"}
      let email_binder = await Item.findOne(test_binder)

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
        ancestor: email_binder._id,
        alias: generic_date
      }

      // test_email = {...test_email, ...additions};
      let newItem = new Item(test_email);

      await newItem.save();

      let update_obj = await alias_maker(newItem);

      // add the new email to the user email_id
      let set = {$set: {}};
      set.$set[`${method}.email_id`] = newItem._id;
      let update_user = await User.findOneAndUpdate({ _id: user._id }, set, { new: true });

      return update_obj;
    }else {

      console.log(chalk.green('[requested_email]'),requested_email);
      return requested_email;
    }

  } catch (e) {
    console.log(chalk.red("[check-make-email] an error occured"),e);
  }

  }//check_make_email

  module.exports = {
    check_make_email
  }
