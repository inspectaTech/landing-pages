  // const Item = require('../../../models/item');
  const Item = require('../../../../../../models/item');

  const getItemData = async function(iId)
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
    let iDta = await Item.findOne( { _id: item_id } );
    return iDta;

  };//getItemData

module.exports = getItemData;
