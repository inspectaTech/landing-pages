  const chalk = require('chalk');

  let data_filter = {
    email:"core_data",
    picture:"core_data"
  }

  const item_reducer = async function(items)
  {
    let reduced_items = items.reduce((result, item, ndx) => {
      // get the item data_type
      let data_type = item.data_type;

      // use the data_type to determine the location of the targeted data
      let value = item[`${data_filter[data_type]}`];
      console.log(chalk.cyan("[item reducer] value"),value);

      result.push({id: item._id, _id: item._id, data_type, value});

      console.log(chalk.cyan("[item reducer] result"),result);

      return result;
    },[]);

    return reduced_items;

  };//get_item_data

module.exports = {
  item_reducer
};
