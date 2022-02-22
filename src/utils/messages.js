    // const moment = require('moment');
    // https://dockyard.com/blog/2020/02/14/you-probably-don-t-need-moment-js-anymore
    const mongoose = require('mongoose');
    const Comment = require('../../models/comment');
    const Item = require('../../models/item');
    const chalk = require('chalk');
    const {getPresetData} = require('../../public/presets/getPresetData');
    const display_console = false;

    async function formatMessage({user, project_id, user_id, room, msg, color, save = false}){
      let message_id = mongoose.Types.ObjectId();
      let time = new Date().getTime()// date and time in ms
      let {payload, item_id, preset_id, ref_id, reply_id} = msg;
      // save msg to the db

      // needs project_id for the proper preset display of user representing a organization
      // do i need users to be able to mask themselves using an org?
      // no. they won't be able to mask. when info is given it will show the user and the org.
      let comment_data = {_id: message_id, payload, time, user_id, project_id, item_id};
      try {

        if(save){
          if(preset_id != undefined){
            // what is the preset_id?
            // i think this is deprecated
            comment_data.preset_id = preset_id;
          }
          if(ref_id != undefined){
            // will this be an empty string or undefined or null?
            comment_data.ref_id = ref_id;
          }// if

          if(reply_id != undefined){
            comment_data.reply_id = reply_id;
          }// if

          // if(access != undefined){
          //   // do something with access
          //   comment_data.access = access;
          // }// if

          if(display_console || true) console.log(chalk.yellow(`[message] saving comment`), comment_data);

          let comment = await new Comment(comment_data);
          await comment.save();
          console.log(chalk.yellow(`[message] saving comment`));
        }//if save


        // send the relevent ref/reply data so i don't have to query the db and delay the broadcast

      } catch (e) {
        console.log(chalk.red(`[message] a saving error occured`),e);
      }

      // i could send the preset data this way but it should already be at the client (extraneous)
      let preset_data = project_id ? await getPresetData({project_id: project_id}) : null;
      // ISSUE: distinguish messages from info and work with comments that don't have preset_data

      let return_data = {
        _id: message_id,
        user,
        user_id,
        project_id,
        payload,
        item_id: room,
        preset_data,
        color,
        time
      }

      let reply_data;
      if(reply_id != undefined){
        reply_data = await prep_reply(reply_id);

        if(reply_data){
          return_data.reply_data = reply_data;
        }
      }// if

      let ref_data;
      if (ref_id != undefined) {
        ref_data = await prep_ref(ref_id);

        if (ref_data) {
          return_data.ref_data = ref_data;
        }
      }// if

      return return_data;
    }// formatMessage

    const prep_reply = async (rId) => {
        let reply_data = await Comment.findOne({_id: rId}).lean();

        if(reply_data){
          let reply_project_id = (reply_data.project_id) ? reply_data.project_id : reply_data.user_id;
          let reply_preset = await getPresetData({project_id: reply_project_id});

          if(reply_preset){
            reply_data.preset_data = reply_preset;
          }
        }

        // if(access != undefined){
        //   // do something with access
        //   reply_data.access = access;
        // }// if

        return reply_data;
    }// prep_reply

    const prep_ref = async (refId) => {
      let ref_data = await Item.findOne({ _id: refId }).lean();

      if (ref_data) {
        let ref_project_id = (ref_data.project_id) ? ref_data.project_id : ref_data.user_id;
        let ref_preset = await getPresetData({ project_id: ref_project_id });

        if (ref_preset) {
          ref_data.preset_data = ref_preset;
        }// if
      }// if
      return ref_data;
    }// prep_ref

    module.exports = formatMessage;
