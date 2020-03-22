  const chalk = require('chalk');
  const Item = require('../../models/item');// ./presets
  const User = require('../../models/user');// ./presets
    // const {getItemPreset} = require('./getItemPreset');
    // const {getPublicBinder} = require('./getPublicBinder');
    const {check_make_binder} = require('./check-make/check-make-binder');
    const {check_pair_preset} = require('./check-make/check-pair-preset');
    const {check_make_preset} = require('./check-make/check-make-preset');
    const {check_pair_items} = require('./check-make/check-pair-items');
    const {get_item_data} = require('./check-make/get-item-data');
    const {check_make_email} = require('./check-make/check-make-email');
    const {check_make_picture} = require('./check-make/check-make-picture');
    const {item_reducer} = require('./check-make/item-reducer');
    const {unpair} = require('./check-make/unpair');
    const {exists} = require('./check-make/exists');
    const keys = require('./check-make/keys');

  const getPresetData = async function({ user_id, published },rrn)
  {
    try {

      let rerun = rrn || false;
      let preset_items = [];
      let preset;
      let preset_id;
      console.log(chalk.yellow("[get preset data] getting user id"),user_id);
      console.log(chalk.yellow("[get preset data] item is published = "),published);

      let user = await User.findOne({ _id: user_id });// should throw an error if no user

      switch (published) {
        case true:
          //if the item is published - find the users public binder
          let public_binder = await check_make_binder({user, binder:'public', type:'group'});
          console.log(chalk.yellow("[get preset data] public_binder"),public_binder);

          // find the preset associated with the binder
          let target_preset = await check_pair_preset({user, host_id: public_binder._id, link_type: "preset"}, true);

          if(exists(target_preset) && exists(target_preset.error)){
            return target_preset;
          }//if

          preset_id = target_preset.link_id;
          // use check_make_preset only if i need a default preset

          //this is done inside of check_pair_preset
          // if(!exists(target_preset)){
          //   target_preset = await check_make_preset(
          //     { user,
          //       method: user.method,
          //       type: "info",
          //       category: keys.preset.default.category,
          //       title: keys.preset.defaut.title/*"default preset"*/
          //     }
          //   );
          //   preset_id = target_preset._id;
          //
          // }else{
          //   preset_id = target_preset.link_id;
          // }

          preset = await get_item_data(preset_id);

          console.log(chalk.yellow("[get preset data] target preset"),target_preset);

          // get all preset attachents
          preset_attachments = await check_pair_items({user, host_id: preset_id, all: true}, true);
          console.log(chalk.yellow("[get preset data] preset attachments"),preset_attachments);

          console.log(chalk.magenta("[preset_attachments] exist? "),exists(preset_attachments));
          // if no attachments make defaults
          if(!exists(preset_attachments)){

            console.log(chalk.yellow("[get preset data] no attachments found, finding default data"));

            item_email = await check_make_email({ user }, true);//user, method, type, category, title, email

            item_picture = await check_make_picture({ user }, true);//user, method, type, category, title, picture

            preset_items = [];
            if(item_email){preset_items.push(item_email);}
            if(item_picture){preset_items.push(item_picture);}

            //what is missing is that these new items have to be attached to the preset binder.
            let email_pair = await check_pair_items({user, host_id: preset_id, host_type: "preset", link_id: item_email._id, link_type: "email" });
            let picture_pair = await check_pair_items({user, host_id: preset_id, host_type: "preset", link_id: item_picture._id, link_type: "picture "});

          }else{

            // preset_items = preset_attachments.reduce(async (result, pair) => {
            //   let item = await get_item_data(pair.link_id);
            //   result.push(item);
            //   return result;
            // },[]);
            preset_items = [];

            for(pair of preset_attachments) {
              console.log(chalk.yellow(`[get preset data] getting ${pair.link_type} data`), pair);
              let item = await get_item_data(pair.link_id);
              console.log(chalk.yellow(`[get preset data] ${pair.link_type} data`), item);

              if(!exists(item)){
                console.log(chalk.yellow(`[get preset data] making new ${pair.link_type}`));
                //unpair the broken item
                await unpair(pair,"one");
                //make a new item
                switch (pair.link_type) {
                  case "picture":
                    item = await check_make_picture({ user }, true);
                    preset_items.push(item);
                    break;
                  case "email":
                    item = await check_make_email({ user }, true);
                    preset_items.push(item);
                    break;
                  default:
                  // any other items will be omitted
                  // i need this to do nothing so i had to repeat the .push
                }
              }else{
                // add as regular
                preset_items.push(item);// use else to protect from other null pair items that should be omitted
              }

              //ISSUE: if these presets fail to load - pair.link_id no longer an existing item the details page breaks (PRESET_DATA issue)
              // simulate the error with:
              // preset_items = [null,null];// then figure out how to show the page with no preset data
            };

          }
          console.log(chalk.green("[get preset data] preset items"), preset_items);

          let reduced_items = await item_reducer(preset_items);
          console.log(chalk.green("[get preset data] preset items"), reduced_items);

          // only return published items
          preset_items = preset_items.filter((item) => {
            return item.published == true;
          })

          //try to rerun getItemPreset
          return {preset, data: preset_items /*reduced_items*/};

          break;// break case "true":
        default:
        // what if its not published?
      }


    } catch (e) {
      console.error(chalk.red("[get preset data] an error occured"),e);
    }

  };//getItemPreset

module.exports = {
  getPresetData
};
