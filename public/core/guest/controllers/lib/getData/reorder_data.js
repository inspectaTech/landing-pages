  // const {switch_display} = require('./switch_display.js');
  const chalk = require('chalk');
  const { field_obj } = require('./sort');
  const { toTimestamp } = require('./date');
  const { exists } = require('./exists');

  const display_console = false;

  if(display_console) console.log("switch_display running");

  const read_filter = ({filter},convert = false) => {

    let customized = false, alt_sort_by = "";

    if(filter.includes("custom_")){
      customized = true;
      alt_sort_by = (filter.includes("custom2")) ? "custom2" : "custom";
      let sort_by_ary = filter.split("_");// used the split method here instead of replace b/c of custom2
      filter = sort_by_ary[1];// example: separate custom_alpha to become alpha
    }//if

    if(convert == true){
      return {filter, customized, alt_sort_by};
    }else{
      return filter;
    }

  }// read_filter


  const reorder_data = function({data, filter}, mkStrs = false)
  {
    // switch_display reorders/reorganizes/sorts the data
    // i stopped this from being async - i may not need to use await inside but keeping it async makes it thenable
    // WARNING: BREAKING CHANGE making this async breaks the entire app.  i have no idea how.

    let customized = false;
    let alt_sort_by = "";
    let new_result_data = [];

    //i need to know if this is customized
    // if(filter.includes("custom_")){
    //   customized = true;
    //   alt_sort_by = (filter.includes("custom2")) ? "custom2" : "custom";
    //   let sort_by_ary = filter.split("_");// used the split method here instead of replace b/c of custom2
    //   filter = sort_by_ary[1];// example: separate custom_alpha to become alpha
    // }//if
    let reader = read_filter({filter},true);
    customized = reader.customized;
    filter = reader.filter;
    alt_sort_by = reader.alt_sort_by;

    if(display_console) console.log(chalk.cyan("[reorder_data] filter"),filter);
    if(display_console) console.log(chalk.cyan("[reorder_data] alt_sort_by"),alt_sort_by);

    let binder_data_array = data;

    switch (filter) {
      case "alpha" :
      case "alpha2" :

        new_result_data = [...binder_data_array];

          if(customized)
          {
            //if its customized filter it again by order
            new_result_data = reorder_data(
              {
                filter:alt_sort_by,
                data:[...new_result_data]
              }/*,
              true*/
            );
          }//if customized


          if(!mkStrs){
            // i was calling the mkStrs property above and setting it to true
            // if(display_console) console.log(chalk.cyan(`[reorder_data] new_result_data) is array ${Array.isArray(new_result_data)}`),new_result_data);
            return [...new_result_data];
          }else{
            return JSON.stringify([...new_result_data]);
          }
      break;

      case "created" :
      case "created2" :
      case "modified" :
      case "modified2" :
      case "custom":
      case "custom2":

        let field = field_obj[filter];
        let scrambled_data = {};
        let scrambled_keys_array = [];
        new_result_data = [];

        binder_data_array.forEach(function (entry) {

          // get the pair order for attachments as a priority
          let obj_cat = (field.includes("order") && entry["pair_order"]) ? entry["pair_order"] : entry[field];
          if(display_console) console.log(chalk.yellow(`[reorder_data] entry ${entry[field]} field ${field}`));

          if(field.includes("created") || field.includes("modified")){
            //convert the created date into a timestamp
            // obj_cat = ( new Date(obj_cat) ).getTime();
            let date_str = (field.includes("created")) ? "created" : "modified";
            obj_cat = (exists(entry[`pair_${date_str}`])) ? toTimestamp(entry[`pair_${date_str}`]) : toTimestamp(entry[`${date_str}`]);

          }else if(field.includes("order")){
            // array can't sort string numbers so i need to make them of type number
            // obj_cat = Number(obj_cat);
          }else{
            // this section is for alphabetical
            if(display_console) console.log(chalk.green(`[reorder_data] alphabetical field ${field}`));
            obj_cat = obj_cat.toLowerCase();
          }

          if(scrambled_data[obj_cat] == undefined){scrambled_data[obj_cat] = [];}
          // scrambled_data[obj_cat] = scrambled_data[obj_cat].concat(entry);
          scrambled_data[obj_cat].push(entry);// this makes an array of all items that may share this title (even if its a letter or number)

        });

        scrambled_keys_array = Object.keys(scrambled_data);

        if(!field.includes("order")){
          scrambled_keys_array.sort();
        }


        if(filter == ("modified") || filter.includes("created") || filter.includes("alpha2") || filter.includes("custom")){
          //sort puts the smallest number first. use reverse() to put the largest number 1st (most recent)
          // custom needs the largest to be on the top
          scrambled_keys_array.reverse();
        }
        //2018-12-20 12:58:19


        scrambled_keys_array.forEach(function (title) {
          // new_result_data.push(...scrambled_data[title]);// for adding arrays to an array (especially with multiple indexes)
          new_result_data = [...new_result_data, ...scrambled_data[title]];
        });// does adding a spread operator here even do anything?


        if(customized)
        {
          //if its customized filter it again by order
          new_result_data = reorder_data(
            {
              filter:alt_sort_by,
              data:[...new_result_data]
            }/*,
            true*/
          );
        }//if customized

        let mesee = new_result_data;
        if(!mkStrs){
          return [...new_result_data]
        }else {
          return JSON.stringify([...new_result_data]);
        }

      break;

      default:
      // case "default":
      if(filter == "default2"){
        let reversed_default = [...binder_data_array];
        reversed_default = reversed_default.reverse();
        if(!mkStrs){
          return [...reversed_default];
        }else{
          return JSON.stringify([...reversed_default]);
        }
      }else{
        // return;// return undefined
        if(!mkStrs){
          return [...binder_data_array];
        }else{
          return JSON.stringify([...binder_data_array]);
        }
      }//else
    }//switch

  }//end reorder_data


  module.exports = { read_filter, reorder_data };

  // to make timestamps use this
  // ["2018-12-21T00:08:07.000Z","2018-04-14T21:41:35.000Z"]
  //
  // ["2018-12-21T00:08:07.000Z","2018-04-14T21:41:35.000Z","2018-1-21T00:08:07.000Z","2018-8-21T00:08:07.000Z","2018-5-21T00:08:07.000Z"]
  //
  // Date.UTC("2018-12-21T00:08:07.000Z")
  //
  // date = new Date("2018-12-21T00:08:07.000Z")
  // Thu Dec 20 2018 19:08:07 GMT-0500 (Eastern Standard Time)
  // date.getTime()// this is the timestamp converter
  // 1545350887000
