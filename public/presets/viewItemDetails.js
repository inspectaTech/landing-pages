
  const mongoose = require('mongoose');
  // const Item = require('../../models/item');
  // const User = require('../../../../src/oauth_server/models/user');// controllers/alight/public/lading-pages
  // const Item = require('../../../../models/item');// from alight/controllers/lib/
  // const User = require('../../../../models/user');// from alight/controllers/lib/
  const Item = require('../../models/item');
  const User = require('../../models/user');
  const chalk = require('chalk');
  // const {getPresetData} = require('../../../presets/getPresetData');
  const {getPresetData} = require('./getPresetData');
  const {is_objectId_valid} = require('../../core/check-make/is_objectId_valid');
  const display_console = false;
  // const {removeSomething} = require('./getData/removeSomething');

  // this processes the url to deliver the item details to the view page
  const viewItemDetails = async function(req, res)
  {
    try {

      if(display_console || false) console.log(chalk.yellow("[details route] user"),req.user);

      if(display_console || false) console.log(chalk.red("[req params]"),req.params)
      if(display_console || false) console.log(chalk.green("[params] val1"),req.params.val1);
      if(display_console || false) console.log(chalk.green("[params] val2"),req.params.val2);
      if(display_console || false) console.log(chalk.green("[params] val3"),req.params.val3);

      // http://localhost:3000/view/
      // view will still try to run the details view without any directing data - this prevents interval
      // it also prevents view from showing the if(display_console || false) consoles js.map and css.map data
      if(!req.params.val1 && !req.params.val2) return send_404(res);




      // the first check is to see if val1 is an ObjectId item. if it is send back the item data.
      let value_1 = req.params.val1,
      value_2 = req.params.val2;

      // let isValid = mongoose.Types.ObjectId.isValid;

      switch (is_objectId_valid(value_1)) {
        case true:

        if(display_console || false) console.log(chalk.green("[params] val1 is valid"),req.params.val1);

          // is it an item
          let item = await Item.findOne({ _id: value_1}).lean();
          // test items:
          // 5dd5843d19bfc11bec9c96bb
          // #1 5db045315ee47042a086a091
          // #7 5db0a0a247d5712f102b6b58
          // #17 5db0a8449e0bc559604e968b
          // #24 5db0ba1ce291b972cc3c5e72

          // if its an item it shouldn't have any other params
          if(item && !value_2) return send_item(req, res, item);

          // if anything is added to the url send a 404
          // if its not an item it needs another param to properly locate an item
          if(item && value_2 || !item && !value_2){
            if(display_console || false) console.log(chalk.red("[params] either val1 is an item and it has a 2nd value"));
            if(display_console || false) console.log(chalk.red("[params] or 1 is not an item and there is no second value"));
            return send_404(res);
          }

          // if not an item is it a user_id?
          let user = await User.findOne({ _id: value_1}).lean();// test user_id: 5da54e08c72fdb4a0c765b0f

          // if not a user 404 ( can there ever be 2 ObjectIds? or only a hyphenated title as the second property? )
          // this seems to support the former

          let valid_test = "smooth-jazz";
          if(display_console || false) console.log(chalk.red(`[valid test] ${valid_test}`), is_objectId_valid(valid_test));

          if(!user || user && is_objectId_valid(value_2)){
            if(display_console || false) console.log(chalk.red("[params] either val1 is not a user"),user);
            if(display_console || false) console.log(chalk.red("[params] or val1 is a user and val2 is a valid id"),value_2, is_objectId_valid(value_2));
            return send_404(res);
          }

          // !value_2 is covered above
          item = await Item.findOne({user_id: value_1, path: value_2}).lean();

          if(display_console || false) console.log(chalk.magenta("[value_2 item]"),item);

          //if its not an item is it an attachment?
          // if(!item) // test to see if its a pair? how?

          if(!item){
            if(display_console || false) console.log(chalk.red("[params] item not found by that pathname"));
            return send_404(res);
          }
          if(item) return send_item(req, res, item);

          break;
        default:
          // is it a user_name
          if(!value_2 && !value_3) return send_404(res);// may need to be an or not &&

          // fallback and do nothing until i develope a username system
          return send_404(res);// ultimately its going to just hang if value_1 is a username (not valid ObjectId)
      }// switch
      // if it is an item and val2 && 3 are not undefined - send a 404

      if(display_console || false) console.log(`[index] running!`);

      // let data/
      //
      // if(display_console || false) console.log(chalk.green("[data]"),data);


    } catch (e) {
      if(display_console || false) console.log(chalk.red("[view item details] error"),e);

      res.json({
        message:"a [view item details] error occured",
        error: e
      });
    }
  }

  const send_item = async function (req, res, data) {

    // get preset
    // if(display_console || false) console.log(chalk.cyan("[send_item] getPresetData",JSON.stringify(data)));
    // if you wan't to display only published items filter that out here before getting preset data
    let preset = await getPresetData(data);

    if(display_console || false) console.log(chalk.cyan("[vID req] protocol"),req.protocol);
    if(display_console || false) console.log(chalk.cyan("[vID req] originalUrl"),req.originalUrl);//pathname
    if(display_console || false) console.log(chalk.cyan("[vID req] url"),req.url);

    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    if(display_console || false) console.log(chalk.cyan("[vID req] fullUrl"),fullUrl);

    let toolname = await get_tool_name(req.originalUrl);
    if(display_console || false) console.log(chalk.cyan("[vID req] toolname"),toolname);

    return res.render(toolname, {
      title:'details title',
      name: 'someone\'s name',
      data,
      preset/*,
      data_str*/
    });
  }

    const get_tool_name = async function (pathname) {
      let pathname_array = pathname.split("/");
      return pathname_array[1];
    }

  const send_404 = function (res) {
    return res.render('404', {
      title:'404',
      errorMessage:'article not found'
    });
  }// send_404

  module.exports = viewItemDetails;

// 5da54e08c72fdb4a0c765b0f/we-asked-web-developers-we-admire-what-about-building-websites-has-you-interested-this-y/
