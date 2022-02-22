  const chalk = require('chalk');

  const Item = require('../../../models/item');// centralized models ./check-make

  const get_item_data = async function(iId)
  {
    // let info_table = '#__arc_my_data' ;
    let item_id = iId;

    // db = jFactory::getDbo();
    // query = db.getQuery(true);
    //
    // query.select('*');
    // query.from(db.quoteName(info_table));
    // query.where(db.quoteName('_id') . ' = '. db.quote(item_id));
    // db.setQuery(query);
    //
    // iDta = db.loadObject();
    let iDta = await Item.findOne( { _id: item_id } ).lean();
    return iDta;

  };//get_item_data

module.exports = {
  get_item_data
};
