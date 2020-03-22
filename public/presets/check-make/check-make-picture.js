  const chalk = require('chalk');
  // const User = require('../../../../models/user');// centralized models
  const Item = require('../../../models/item');// centralized models ./check-make
  const User = require('../../../models/user');// centralized models  ./check-make
  const { alias_maker } = require('./alias_maker');
  const {exists} = require('./exists');

  const check_make_picture = async ({user}, rtn) => {

    // const {method, type, category, title, picture} = user;
    let method = user.method;
    let type = "info";
    let category = "picture";
    let title = `${method} login picture`;
    let picture = user[method].picture;// LATER: if no picture add a generic site picture url

  try {

    console.log(chalk.yellow('[check_make_category] accessed'));
    console.log(chalk.magenta('[check_make_picture] user'),user);
    console.log(chalk.blue('[check_make_picture] picture'),picture);

    // see if it has an picture id
    let requested_picture;
    let has_picture_item = (typeof user[`${user.method}`].picture_id != "undefined") ? true: false;
    console.log(chalk.yellow("[check make picture] has_picture_item = "), has_picture_item);

    //
    if(has_picture_item){

      // see if it still exists
      requested_picture = await Item.findOne({ _id: user[user.method].picture_id }).lean();
    }

    if(rtn && exists(requested_picture)){
      console.log(chalk.green('[requested_picture] early'),requested_picture);
      return requested_picture;
    }

    // if it doens't still exist or never existed: do this
    if(!exists(requested_picture)){

      // here requested_picture == null
      console.log(chalk.red('no requested_picture was found'));

      let generic_date = ( new Date() ).getTime();

      //get picture folder
      let test_binder = { user_id: user._id, admin: 1, title_data: "picture", root: 1, admin: 1, type: "info"}
      let picture_binder = await Item.findOne(test_binder)

      let test_picture = {
        user_id: user._id,
        admin: 1,
        title_data: title,
        url_data: picture,
        type,
        root: 0,
        published:true,
        data_type: "picture",
        category,
        ancestor: picture_binder._id,
        alias: generic_date
      }

      // test_picture = {...test_picture, ...additions};
      let newItem = new Item(test_picture);

      await newItem.save();


      // add the new picture to the user picture_id
      let set = {$set: {}};
      set.$set[`${method}.picture_id`] = newItem._id;
      let update_user = await User.findOneAndUpdate({ _id: user._id }, set, { new: true });

      let update_obj = await alias_maker(newItem);

      console.log(chalk.green('[requested_picture] late'),requested_picture);
      return update_obj;

    } else {

      console.log(chalk.green('[requested_picture] early'),requested_picture);
      return requested_picture;

    }//else

  } catch (e) {
    console.log(chalk.red("[check-make-picture] an error occured"),e);
  }//

  }//check_make_picture

  module.exports = {
    check_make_picture
  }
