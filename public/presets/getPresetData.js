    const chalk = require('chalk');
    const Item = require('../../models/item');// ./presets
    const Project = require('../../models/project');// ./presets
    const User = require('../../models/user');// ./presets
      // const {getItemPreset} = require('./getItemPreset');
      // const {getPublicBinder} = require('./getPublicBinder');
      const {check_make_binder} = require('../../core/check-make/check-make-binder');
      const {check_pair_preset} = require('../../core/check-make/check-pair-preset');
      const {check_make_preset} = require('../../core/check-make/check-make-preset');
      const {check_pair_items} = require('../../core/check-make/check-pair-items');
      const {get_item_data} = require('../../core/check-make/get-item-data');
      const {check_make_email} = require('../../core/check-make/check-make-email');
      const {check_make_image} = require('../../core/check-make/check-make-image');
      const {check_make_item} = require('../../core/check-make/check-make-item');
      const {item_reducer} = require('../../core/check-make/item-reducer');
      const {unpair} = require('../../core/check-make/unpair');
      const {exists, obj_exists} = require('../../core/check-make/exists');
      const preset_defaults = require('../../core/check-make/preset_defaults');
      const {sandwich_sorter} = require('../alight/controllers/lib/getData/sandwich_sorter');
      const { project_types, user_org } = require('../alight/controllers/lib/getData/types');

      // const {check_make_binder} = require('./check-make/check-make-binder');
      // const {check_pair_preset} = require('./check-make/check-pair-preset');
      // const {check_make_preset} = require('./check-make/check-make-preset');
      // const {check_pair_items} = require('./check-make/check-pair-items');
      // const {get_item_data} = require('./check-make/get-item-data');
      // const {check_make_email} = require('./check-make/check-make-email');
      // const {check_make_image} = require('./check-make/check-make-image');
      // const {item_reducer} = require('./check-make/item-reducer');
      // const {unpair} = require('./check-make/unpair');
      // const {exists} = require('./check-make/exists');
      // const preset_defaults = require('./check-make/preset_defaults');
      const display_console = false;

    /**
       * @module getPresetData
       * @category Server
       * @subcategory presets
       * @desc gets guest accessible item data with presets for Paper and Clips
       * @param  {object} req request object - holds the request data req.body
       * @param  {object} res holds the requests response data
       * @see [getItem]{@link module:guest-getItem}
     */

    /**
     * @file
     */


    /**
     * @callback getPresetData
     * @desc  gets the users prepared preset data <br>
     * this may also update any missing default admin items, but not all because its not iterating through an array of defaults titles
     * @param  {string} user_id user id that will be used to find the given users prepared preset data
     * @param  {boolean} rrn     deprecated value
     * @return {void}         [description]
     * @requires oas-check-make-binder
     * @requires oas-check-pair-preset
     * @requires oas-check-make-email
     * @requires oas-check-make-image
     * @requires oas-check-pair-items
     * @requires get_item_data
     * @requires presets-item-reducer
     * @see [add_presets]{@link module:getPresetData~add_presets}
     */

    // GOTCHA: this needs protection from errors - if it doesn't find values it should do something

    const getPresetData = async function(dObj, rrn)
    {
      let { project_id, data_type, _id, title_data, preset_id, user_id} = dObj;

      if(display_console || false) console.log(chalk.yellow("[getPresetData] dObj"),dObj);// is this thing on??

      if(project_id == undefined) project_id = user_id;// comments may not include a project_id
      // - in this case the user_id is the item owner's id (item.user_id)

      // use the item id as the project_id for projects
      if(data_type != undefined && project_types.includes(data_type)) project_id = _id;// data_type == "project"
      try {

        let rerun = rrn || false;
        let preset_items = [];
        let preset;

        if(dObj.data_type == "preset"){
          // a presets dObj preset_id will always be itself, even if you try to set it to something else
          preset = dObj;
          preset_id = dObj._id;
        }// if data_type


        // let preset_id;
        if(display_console || false) console.log(chalk.yellow("[getPresetData] getting project id"),project_id);
        if(display_console || false) console.log(chalk.yellow("[getPresetData] title"),title_data);
        if(display_console || false) console.log(chalk.yellow("[getPresetData] getting preset id"),preset_id);
        // if(display_console || false) console.log(chalk.yellow("[getPresetData] item is published = "),published);

        if(preset_id && !preset){
          // get the preset item object
          preset = await get_item_data(preset_id);
          if(display_console || false) console.log(chalk.yellow("[getPresetData] test preset"),preset);
          // if(preset) preset_id = preset._id;// this seems redundant.  i had to have the preset_id to get the preset
        }// if

        let project = await Project.findOne({ _id: project_id }).lean();

        if (!project) {
          console.log(chalk.red("[getPresetData] no project was found"), project);
          console.log(chalk.red("[getPresetData] missing project_id"), project_id);
          // if there is no project or no user - i need to send back some generic data and a way to fix the issue
          // "orphaned" files - use 5f9b1bafb309802c1784e89e as the test project_id (in question)
        }

          // for consistency it needs to fall back to the project owner's id not the item owner's id
        let user;
          try {
            // LATER: what happens if it doesn't find a user?
            user = await User.findOne({ _id: project.owner_id });// should throw an error if no user

            if(!user) {
              console.log(chalk.red("[getPresetData] no user was found"), user);
            }
          } catch (error) {
            if (display_console || true) console.log(chalk.yellow("[getPresetData] project error"),error, project);
          }

        if(!preset){

          if(display_console || false) console.log(chalk.yellow("[getPresetData] preset not found"));

          // switch (published) {
          //   case true:
          //if the item is published - find the users public binder
          /**
           * [public_binder description]
           * @type {object}
           * @requires oas-check-make-binder
           */
          let preset_binder = 'project preset';

          // get the default public group binder
          let project_item = await check_make_item(project_id, true);// deprecated - now there is a project item
          // get project item

          if(project_item && project_item.preset_id){


            preset_id = project_item.preset_id;

            if(display_console || false) console.log(chalk.yellow("[getPresetData] project_item preset_id"),preset_id);

            // if(display_console || false) console.log(chalk.yellow("[getPresetData] public_binder"),public_binder);
            //
            // // find the preset associated with the binder/project (attachment pairing)
            // let target_preset = await check_pair_preset({user, host_id: public_binder._id, link_type: "preset"}, true);
            //
            // if(exists(target_preset) && exists(target_preset.error)){
            //   // NOW: what if the target_preset (pair) doesn't exists - the whole thing breaks if one item returns without a preset.
            //   // i need to make this preset proof
            //   return target_preset;
            // }//if
            //
            // if(display_console || false) console.log(chalk.yellow("[getPresetData] target preset"),target_preset);
            //
            // preset_id = target_preset.link_id;
            // // use check_make_preset only if i need a default preset
            //
            // //this is done inside of check_pair_preset
            // // if(!exists(target_preset)){
            // //   target_preset = await check_make_preset(
            // //     { user,
            // //       method: user.method,
            // //       type: "info",
            // //       category: preset_defaults.preset.default.category,
            // //       title: preset_defaults.preset.default.title/*"default preset"*/
            // //     }
            // //   );
            // //   preset_id = target_preset._id;
            // //
            // // }else{
            // //   preset_id = target_preset.link_id;
            // // }
            //
            // // after getting the preset associated with the binder, use its id to get the actual preset item.
          preset = await get_item_data(preset_id);// what if there is no preset item?

          if (!preset) {
            // if after all that & still no preset make one
            preset = await check_make_preset({_id:user._id});
            preset_id = preset._id;
          }// if

        }else{
          // here the user._id is the project owner's (or organization's) id
          preset = await check_make_preset({_id:user._id});// DOCS: depends on finding a user
            preset_id = (obj_exists(preset,"_id")) ? preset._id : null;
          if(display_console || false) console.log(chalk.yellow("[getPresetData] using default preset_id"),preset_id);
        }// else

      }// if !preset


            // get all preset item's attachments (paired items) - returns an array of "Pair" data not "Item" data
            let preset_attachments = preset_id ? await check_pair_items({user, host_id: preset_id, all: true}, true) : null;

            if(display_console || false) console.log(chalk.yellow("[getPresetData] preset attachments"),preset_attachments);

            if(display_console || false) console.log(chalk.magenta("[preset_attachments] exist? "),exists(preset_attachments));
            // if no preset attachments exists make defaults
            if(!exists(preset_attachments)){

              // if there are no preset_attachments fall back to user defaults
              if(display_console || false) console.log(chalk.yellow("[getPresetData] no attachments found, finding default data"));

              /**
               * preset email item data
               * @type {object}
               * @requires oas-check-make-email
               */
              item_email = await check_make_email({ user }, true);//user, method, type, category, title, email

              if(item_email) preset_attachments.push(item_email);

              /**
               * preset image item data
               * @type {object}
               * @requires oas-check-make-image
               */
              item_image = await check_make_image({ user }, true);//user, method, type, category, title, image
              if(item_image) preset_attachments.push(item_image);

            }

              // preset_items = preset_attachments.reduce(async (result, pair) => {
              //   let item = await get_item_data(pair.link_id);
              //   result.push(item);
              //   return result;
              // },[]);

              // get all items - nested and attachments
              let all_attachments = [];
              let all_nested_items = [];
              let all_items = [];
              let limit = 20;

              //get all items whose ancestor is preset_id - use generic sorts and limits
              let sort_array = [ [ [ 'priority' ], [ -1 ] ], [ [ 'created' ], [ -1 ] ] ];
              let query = { project_id, ancestor: preset_id/*, data_type: {$ne:"folder"}*/ };// probably filter out unwanted types later
              all_nested_items = await Item.find(query).collation({locale: "en" }).sort(sort_array).limit(limit).lean();
              if(display_console || false) console.log(chalk.yellow(`[getPresetData] all_nested_items`), all_nested_items);

              // get all all_attachments
              let saved_pair_ids = [];
              let saved_pair_obj = {};

              if(preset_attachments && preset_attachments.length > 0){

                for(pair of preset_attachments) {

                  if(display_console || false) {
                    console.log(chalk.yellow(`[getPresetData] getting ${pair.link_id != undefined ? pair.link_type : pair.data_type} data`), pair);
                  }

                  let item = (pair.link_id != undefined) ? await get_item_data(pair.link_id) : pair;

                  if(display_console || false) console.log(chalk.yellow(`[getPresetData] item `), item);

                  if(item && item.title_data != undefined){

                    item.pair_created = pair.created || "";
                    item.pair_modified = pair.modified || "";
                    item.pair_priority = pair.pair_priority || 0;
                    item.pair_review = pair.pair_review || 0;

                    all_attachments.push(item);
                  }// item

                }// for loop

                if(display_console || false) console.log(chalk.yellow(`[getPresetData] all_attachments`), all_attachments);
              }// if preset_attachments

              if(display_console || false) console.log(chalk.yellow(
                `[getPresetData] all_attachments length = ${all_attachments.length} all_nested_items length = ${all_nested_items.length}`));


              if( all_attachments.length > 0 && all_nested_items.length > 0 ){
                // blend/sort them
                all_items = await sandwich_sorter({rows: all_nested_items, pair_ary: all_attachments, limit: 50, filter: "created"});
              }else{
                all_items = [...all_attachments, ...all_nested_items];
              }// else
              // if one or the other use them as is


              preset_obj = {};// a set of one of each published type of items (key by type)
              preset_items = [];// any number of similar available items (key by ndx)

              // use the pair data link_id to get the actual items from the items collection
              for(item of all_items) {

                // if(display_console || false) console.log(chalk.yellow(`[getPresetData] getting ${pair.link_type} data`), pair);
                // let item = await get_item_data(pair.link_id);
                if(display_console || false) console.log(chalk.yellow(`[getPresetData] ${item.data_type} data`), item);

                preset_items.push(item);// use else to protect from other null pair items that should be omitted
                if(typeof preset_obj[`${item.data_type}`] == "undefined" && item.published == true){
                  preset_obj[`${item.data_type}`] = await item_reducer({...item});
                }//if

                //ISSUE: if these presets fail to load - pair.link_id no longer an existing item the details page breaks (PRESET_DATA issue)
                // simulate the error with:
                // preset_items = [null,null];// then figure out how to show the page with no preset data
              }// end for


            if(display_console || false) console.log(chalk.green("[getPresetData] preset items"), preset_items);

            let reduced_items = await item_reducer(preset_items);
            if(display_console || false) console.log(chalk.green("[getPresetData] reduced items"), reduced_items);

            // only return published items
            // let filter_items = preset_items;
            let filter_items = [...reduced_items];
            preset_items = filter_items.filter((item) => {
              return item.published == true;
            });// formerly preset_data
            //NOTE: preset_items should be able to be empty

            //try to rerun getItemPreset

            let default_tool = {
              name: preset_defaults.preset.default.tool.name,
              template: preset_defaults.preset.default.tool.template
            };

            let return_preset = {};
            return_preset._id = preset._id;
            return_preset.category = preset.category;
            return_preset.title_data = preset.title_data;
            return_preset.tool = preset.tool || default_tool;

            let preset_links = {};

            preset_links.links_enabled = typeof preset.links_enabled != "undefined" ? preset.links_enabled : false;

            preset_links.links = typeof preset.links != "undefined" ? preset.links : {ids:[],data:{}};

            // additional preset data here
            let default_email = await check_make_email({ user }, true);
            default_email = await item_reducer(default_email);
            // if(!default_email.published) default_email.value = "unavailable";

            let default_image = await check_make_image({ user }, true);
            default_image = await item_reducer(default_image);
            // if(!default_image.published) default_image.value = "unavailable";// use a generic image instead of unavailable

            // if the defaults are unpublished use a generic substitute;

            let default_obj = {
              email: default_email,
              image: default_image
            }

            let project_obj = {
              project_id,
              user_id: user._id,
              // owner_id: project.owner_id,
              // parent_project: project.parent_project,
              // name: project.name,
              // alias: project.alias,
              // path: project.path
              ...project
            }

            if(project.parent_project){
              // try to get an up-to-date parent name
              let parent_project = await Project.findOne({ _id: project.parent_project }).lean();

              if(parent_project) project_obj.parent_name = parent_project.name;
            }// if parent_project

            // if(data_type != undefined){
            //   // deprecated - nav_id is project_id (_id) if data_type == "project"
            //   if(display_console || false) console.log(chalk.green(`[getPresetData] ${title_data} data_type`), data_type);
            //   user_obj.nav_id = _id;
            // }

            // whats the difference between data and items?
            /**
             * @property return-object
             * @desc process' returned preset data in an object
             * @type {object}
             * @prop items unique one-of-each-type items (image, email)
             * @prop data multiple items of type x (any type)
             * @prop defaults default email and image for backup data
             * @prop preset preset config data has user selected template preference
             */
        return { preset: return_preset, data: preset_items, items: preset_obj/*reduced_items*/, defaults: default_obj, project: project_obj, ...preset_links};

        //     break;// break case "true":
        //   default:
        //   // what if its not published?
        // }// switch


      } catch (e) {
        if(display_console || true) console.error(chalk.red("[getPresetData] an error occured"),e);
      }// catch

    };// getPresetData

    /**
     * adds the preset data to the specifc item - also saves preset data in 2 places so it can be optimally reused
     * @param  {array}  rows array of item data
     * @param  {Array}   [preset_ids=[]]  saved user_ids for previously acquired preset data
     * @param  {Object}  [preset_obj={}}] previously acquired preset data organized by user_id strings
     * @return {Promise}  modifies reference data
     * @see [getItem]{@link module:guest-getItem}
     * @requires getPresetData~getPresetData
     */
    const add_presets = async ({ rows, preset_ids = [], preset_obj = {}}) => {
      // gets the individual items preset
      try {

        if(display_console || false) console.log(chalk.magenta('[add_presets] adding presets'));

        for(let item of rows){
          if(display_console || false) console.log(chalk.magenta('[add_presets] item.project_id = '), item.project_id);
          // is it in the preset ids array?
          if(display_console || false) console.log(chalk.magenta('[add_presets] item.project_id = '), item.project_id);
          if(display_console || false) console.log(chalk.cyan('[add_presets] preset_ids = '),preset_ids.includes(`${item.project_id}`), preset_ids);

          // GOTCHA i needed to put the ObjectId in a string to compare it correctly - now this works.
          // i use this to make sure i don't keep requesting the same users preset data
          // - if its one users 20 items then i only need to get it once

          if(display_console || false) console.log(chalk.cyan('[add_presets] preset_id test'),item.preset_id);


          // if preset_id is present and in the array or project_id is in the array, and its not a project or preset - do something
          if(( exists(item.preset_id) && preset_ids.includes(`${item.preset_id}`)) && !project_types.includes(item.data_type) && item.data_type != "preset"){
            // each instance of !project_types.includes(item.data_type) was formerly item.data_type != "project"
            // filter project and preset id's are different from the generic project preset
            if(display_console || false) console.log(chalk.green('[add_presets] using preset data...'));

            item.preset_data = {...preset_obj[`${item.preset_id}`]};

          }else if(( preset_ids.includes(`${item.project_id}`)) && !project_types.includes(item.data_type) && item.data_type != "preset"){
            // filter project and preset id's are different from the generic project preset
            if(display_console || false) console.log(chalk.green('[add_presets] using preset data...'));

            item.preset_data = {...preset_obj[`${item.project_id}`]};

          }else{
            if(display_console || false) console.log(chalk.yellow('[add_presets] getting preset data...'));

            /**
             * @callback getPresetData
             * @desc gets the desired preset data
             */
            let preset = await getPresetData(item, true);
            if(exists(preset)){
              // if the preset exists add the preset_id to the 'id' and 'obj' array so i can reuse the data
              // LATER: how do i use custom presets specific to the item - if ever?
              if(!project_types.includes(item.data_type) && item.data_type != "preset"){
                // this condition makes sure projects are processed each time
                if(display_console || false) console.log(chalk.green('[add_presets] preset = '), preset);
                let use_id = (exists(item.preset_id)) ? item.preset_id : item.project_id;
                preset_ids.push(`${use_id}`);
                if(display_console || false) console.log(chalk.red('[add_presets] preset_ids = '), preset_ids);
                preset_obj[`${use_id}`] = {...preset};
              }// if

              item.preset_data = {...preset};
            }//if
          }// else
        };
      } catch (err) {
        console.log(chalk.red('[add_presets] error'),err);
      }// catch

    }// add_presets

  module.exports = {
    getPresetData,
    add_presets
  };
