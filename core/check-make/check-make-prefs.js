  const chalk = require('chalk');
  // const Pref = require("../models/pref");
  const Pref = require("../../models/pref");
  const mongoose = require('mongoose');
  // const recent = require('./recent');
  // const {exists} = require('./exists');
  const {default_prefs} = require('./default_prefs');
  const {is_objectId_valid} = require('./is_objectId_valid');
  const display_console = false;

  const ObjectId = mongoose.Types.ObjectId;


  /**
   * @module check_make_prefs
   * @category Presets
   * @desc gets user preferences - not new code but relocated
   * @param  {string}  user_id finds the user prefs of the given user by the user id
   * @return {Promise}  returns an object of user preferences including recent data
   * @requires firestarter
   */
  const check_make_prefs = async (_id) => {

    // if(display_console || false) console.log('UsersController.secret() called!');
    if(display_console || false) console.log(chalk.green('I managed to get here'));
    if(display_console || 0) console.log(chalk.yellow('[core/check_make_prefs] _id '),_id);
    // res.json({secret: 'resource'})
    // let oid = new ObjectId()
    try {

      let is_valid = await is_objectId_valid(_id);// this isn't working
      if(display_console || 0) console.log("[core/check_make_prefs] ObjectId valid",is_valid);

      // if(!is_valid) throw "[check-make-prefs] _id ObjectId is invalid";
      // ISSUE: fix is_objectId_valid - its returning false for valid ids

      let prefs;

      prefs = await Pref.findOne({_id}).lean();
      if(display_console || 0) console.log(chalk.magenta("[Pref]"),prefs);

      //if you get here its valid
      if(!prefs){
        // res.send("no data available");
        if(display_console || false) console.log(chalk.green("[Pref] creating a new pref"));
        let new_prefs = {...default_prefs};
        new_prefs.project_id = _id;
        prefs = await Pref.findOneAndUpdate({_id},{$set:new_prefs}, { new: true, upsert: true }).lean();// works
        // const newPref = new Pref({...default_prefs, _id});
        // prefs = await newPref.save();// works
      }// if

        // res.json({
        //   prefs:"",
        //   bookmarks:""
        // })


        // prefs.recent = [];
        // //USER: check section views if recent is present do this
        // let recent_data = await recent(_id, "blank");
        // if(recent_data){
        //   prefs.recent = recent_data;
        //   // return json_encode($recent_data);
        // }
        // return json_encode($userData);//returns a string of an object prefs:{} & bookmarks:{}

        return prefs;

    } catch (e) {
      let error_msg = "[core/check_make_prefs] an error occured";
      console.error(chalk.red(error_msg),e);
      return {
        error: true,
        message: error_msg,
        data: e
      };
    } // catch
  }// check_make_prefs

  module.exports = {check_make_prefs};
