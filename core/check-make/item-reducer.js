  const chalk = require('chalk');
  const display_console = false;
  const {exists} = require('./exists');

  // DEPRECATED?

  /**
   * @module presets-item-reducer
   * @category Server
   * @subcategory presets
   * @desc reduces the returned data of the given item
   * image-reducer also determines which db field will be the source of the value i.e. img_url vs url_data
   * @example
   * const item_reducer = async function(items)
   * {
   *   ...
   *   result.push({id: item._id, _id: item._id, data_type, value, published: item.published, extra: item.extra});
   *   ...
   * @see [getPresetData]{@link module:getPresetData~getPresetData}
   */

  /**
   * @file
   */

  /**
   * @var data_filter
   * @type {Object}
   * @desc determines which field will be used for the reducers value property
   * @prop email db field containing the email value
   * @prop image db field containing the image value now using img_url was url_data
   */
  let data_filter = {
    email:"core_data",
    image:"img_url",
    image2:"url_data"
  }

  const item_reducer = async function(items)
  {
    let item_type = (Array.isArray(items)) ? "array" : "object";
    let reduced_items;

    switch (item_type) {
      case "array":
      reduced_items = items.reduce((result, item, ndx) => {
        // get the item data_type
        let data_type = item.data_type;

        // use the data_type to determine the location of the targeted data
        let value = item[`${data_filter[data_type]}`];
        if(display_console || false) console.log(chalk.cyan("[item reducer] value"),value);

        result.push({id: item._id, _id: item._id, data_type, value, published: item.published, extra: item.extra});

        if(display_console || false) console.log(chalk.cyan("[item reducer] result"),result);

        return result;
      },[]);

        break;
      default:

        let item = items;

        if(display_console || false) console.log(chalk.cyan("[item reducer] item"),item);

        let data_type = item.data_type;

        // use the data_type to determine the location of the targeted data
        let value;
        if(data_type == "image"){
          // value = (exists(item[`${data_filter[data_type]}`])) ? item[`${data_filter[data_type]}`] : item[`${data_filter[`${data_type}2`]}`];
          if(display_console || false) console.log(chalk.cyan("[item reducer] data_filter[data_type]"),data_filter[data_type]);
          let str_1 = item[`${data_filter[data_type]}`];
          if(display_console || false) console.log(chalk.yellow("[item reducer] image1"),);
          let str_2 = item[`${data_filter[`${data_type}2`]}`];
          if(display_console || false) console.log(chalk.red("[item reducer] image2"),str_2);
          if(display_console || false) console.log(chalk.red("[item reducer] same str_1 str_2"),str_1 == str_2);

          // value = item[`${data_filter[data_type]}`];
          value = item[`${data_filter[`${data_type}`]}`];
        }else{
          value = item[`${data_filter[data_type]}`];
        }

        if(display_console || false) console.log(chalk.cyan("[item reducer] item value"),value);

        reduced_items = {id: item._id, _id: item._id, data_type, value, published: item.published, extra: item.extra};

        if(display_console || false) console.log(chalk.cyan("[item reducer] result"), reduced_items);
    }

    return reduced_items;// LATER: i may need the single item so still return an array to be consistent. idk

  };//get_item_data

module.exports = {
  item_reducer
};

// { id: 5e2d86bfce73a50888495bf0,
//   _id: 5e2d86bfce73a50888495bf0,
//   data_type: 'image',
//   value: 'https://lh5.googleusercontent.com/-hAYUj7Y2LZs/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rcnBQE6MaabjBtcXxx1VTncvxoKJA/photo.jpg',
//   published: false,
//   extra: '' }
  /// fails
