const { exists } = require('./exists');
const { lowercase } = require('./lowercase');
const chalk = require('chalk');
const { toTimestamp } = require('./date');

const display_console = false;

  const sort_obj = {
    "alpha":[['title_data'],[1]],/*(1 is a-z) (-1 is z-a)*/
    "alpha2":[["title_data"],[-1]],
    "created":[["created"],[-1]],/*-1 (desc) is new largest nbr 1 (asc) is old smallest number*/
    "created2":[["created"],[1]],
    // "custom":"order",
    // "custom2":"order",
    "modified":[["modified"],[-1]],
    "modified2":[["modified"],[1]]
  }

  // const sort_obj = {
  //   "alpha":[['title_data'],[1]],/*(1 is a-z) (-1 is z-a)*/
  //   "alpha2": {"title_data":"desc"},
  //   "created":[["created"],[1]],
  //   "created2":[["created"],[-1]],
  //   // "custom":"order",
  //   // "custom2":"order",
  //   "modified":[["modified"],[1]],
  //   "modified2":[["modified"],[-1]]
  // }


  const pair_obj = {
    // "alpha":[['title_data'],[1]],/*(1 is a-z) (-1 is z-a)*/
    // "alpha2":[["title_data"],[-1]],
    "created":[["created"],[1]],
    "created2":[["created"],[-1]],
    // "custom":"order",
    // "custom2":"order",
    "modified":[["modified"],[1]],
    "modified2":[["modified"],[-1]]
  }

  const field_obj = {
    "alpha":'title_data',/*(1 is a-z) (-1 is z-a)*/
    "alpha2":"title_data",
    "created":"created",
    "created2":"created",
    "custom":"order",
    "custom2":"order",
    // "custom":"priority",
    // "custom2":"priority",
    "modified":"modified",
    "modified2":"modified"
  }

    const pair_field_obj = {
      "created":"pair_created",
      "created2":"pair_created",
      "custom":"pair_order",
      "custom2":"pair_order",
      // "custom":"pair_priority",
      // "custom2":"pair_priority",
      "modified":"pair_modified",
      "modified2":"pair_modified"
    }

  const get_sort_option = ({filter = "alpha"} = {}) => {

    // if(display_console) console.log(chalk.green("[get_sort_option] filter"),filter);
    let filter_value = sort_obj[filter];
    let orderBy = [];

    // if(display_console) console.log(chalk.green("[get_sort_option] typeof filter_value"),typeof filter_value);
    if(exists(filter_value) && Array.isArray(filter_value)){
      filter_value.forEach((item) => {
        orderBy.push(item);
      });
    }else if(exists(filter_value) && typeof filter_value == "object"){
      // for later just in case i change it.
      orderBy = {...filter_value};
    }

    orderBy = (Array.isArray(orderBy)) ? [orderBy] : orderBy;// wrapping for sort object, object to work
    // looks like in needs orderBy to look like this in order to work  [ [ [ 'title_data' ], [ -1 ] ] ]

    return orderBy;
  }// get_sort_option

  const compare = ({row_entry, pair_entry, filter, order}) =>
  {

    let field,
    pair_field,
    reordered;

    switch (filter) {
      case "alpha":
      case "alpha2":

        order =  (filter.includes("2")) ? "desc" : "asc";
        field = field_obj[filter];

        reordered = [lowercase(row_entry[field]),lowercase(pair_entry[field])].sort();

        if(order == "desc"){
          reordered.reverse();
        }

        return (lowercase(reordered[0]) == lowercase(pair_entry[field])) ? true : false;

      break;

      case "created":
      case "created2":
      case "modified":
      case "modified2":

        order =  (filter.includes("2")) ? "asc" : "desc";
        field = field_obj[filter];
        pair_field = pair_field_obj[filter];

        if(display_console) console.log(chalk.red(`[reordered] testing filter ${filter}, field ${field}, pair_field ${pair_field}`));
        // if(display_console) console.log(chalk.red(`[reordered] row_entry ${row_entry[field]} pair_entry ${pair_entry[pair_field]}`));
        // if(display_console) console.log(chalk.red(`[reordered] row_entry`),row_entry);
        if(display_console) console.log(chalk.red(`[reordered] pair_entry`),pair_entry);

        reordered = [toTimestamp(row_entry[field]),toTimestamp(pair_entry[pair_field])].sort();

        if(order == "desc"){
          reordered.reverse();
        }

        if(display_console) console.log(chalk.green("[reordered]"),reordered);
        if(display_console) console.log(chalk.yellow(`[reordered] pair field = ${pair_field} pair data = ${pair_entry[pair_field]} pair entry = ${pair_entry} `));
        if(display_console) console.log(chalk.green(`[reordered] outcome`),reordered[0] == toTimestamp(pair_entry[pair_field]));

        return (reordered[0] == toTimestamp(pair_entry[pair_field])) ? true : false;

      break;

      default:

    }
  }// compare

module.exports = {sort_obj, pair_obj, field_obj, get_sort_option, compare};
