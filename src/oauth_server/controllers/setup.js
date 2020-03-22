const chalk = require('chalk');
const {check_make_binder} = require('./lib/check-make/check-make-binder');
const {check_make_email} = require('./lib/check-make/check-make-email');
const {check_make_picture} = require('./lib/check-make/check-make-picture');
const {check_make_preset} = require('./lib/check-make/check-make-preset');
const {check_pair_preset} = require('./lib/check-make/check-pair-preset');
const {check_pair_items} = require('./lib/check-make/check-pair-items');

// const group_binder_array = ['public','business','family','friend','online','project','education','team','social','spiritual','work'];
const group_binder_array = ['public'];

// prep default info binders - default binders
// the name is the data type
const info_binder_array = [
    'presets',
    /*'collection',*/
    'email',
    'e-commerce',
    /*'favorite apps',*/
    /*'name',*/
    'notification',
    'phone',
    'address',
    /*'profile picture',*/
    'picture'/*,*/
    /*'social community',*/
    /*'web address'*/
  ];

	const initiate_starter_data = async function({user})
	{
    // isd running in controllers/user.js for testing - will run in passport.js strategy before done();
    let item_email,
    item_picture,
    public_binder,
    default_preset,
    preset_pair,
    email_pair,
    picture_pair;

    console.log(chalk.green('[init entered]'),user);

    group_binder_array.forEach(async (binder) => {

      let return_binder = await check_make_binder({user, binder, type: 'group'});
      if(binder == "public"){
        public_binder = return_binder;
      }
      console.log(chalk.green("[check make binder] group ready"));

    })

    info_binder_array.forEach(async (binder) => {

      await check_make_binder({user, binder, type: 'info'});
      console.log(chalk.green("[check make binder] info ready"));
    });

      let method = user.method;

      switch (method) {
        case "google":
          let email = user[method].email;
          let picture = user[method].picture;

          // let items_array = [
          //   { user, category:"email", title: "contact us", data: email },
          // ];

          item_email = await check_make_email({ user, method, type: "info", category:"email", title: "google login email", email });

          item_picture = await check_make_picture({ user, method, type: "info", category:"profile picture", title: "google login picture", picture });

          break;
        default:

      }

      //create default preset
      default_preset = await check_make_preset({ user, method, type: "info", category:"preset", title: "default preset" });

      preset_pair = await check_pair_preset({user, host_id: public_binder._id, host_type: "group", link_id: default_preset._id, link_type: "preset" });
      console.log(chalk.magenta("[preset_pair]"),preset_pair);
      // pair item_email and item_picture with default_preset

      console.log(chalk.magenta("[item_email]"),item_email);
      if(item_email){
        email_pair = await check_pair_items({user, host_id: default_preset._id, host_type: "preset", link_id: item_email._id, link_type: "email" });
        console.log(chalk.cyan("[email_pair]"),email_pair);
      }

      console.log(chalk.magenta("[item_picture]"),item_picture);
      if(item_picture){
        picture_pair = await check_pair_items({user, host_id: default_preset._id, host_type: "preset", link_id: item_picture._id, link_type: "picture "});
        console.log(chalk.cyan("[picture_pair]"),picture_pair);
      }

    //
	}//end initiate_starter_data


module.exports = {
  initiate_starter_data
};
