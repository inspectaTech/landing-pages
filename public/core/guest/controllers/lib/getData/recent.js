const chalk = require('chalk');
// const Item = require('../../../models/item');
const Item = require('../../../../../models/item');
const {get_my_ancestors} = require('./get');
const recent = async function(uId, sMed)
{
  //function to process search string in bookmark popup srch section

  // if(!isset(sMed) OR sMed == ""){return;}

  // media = sMed;
  // media = preg_replace ("/ +/", " ", media); # convert all multispaces to space
  // media = preg_replace ("/^ /", "", media);  # remove space from start
  // media = preg_replace ("/ /", "", media);
  // if(media == ""){return "";}

  // sel_ary = array('data_id','type','data_type','category','title_data','desc_data','core_data','ancestor','created');//,'url_data'
  // // columns = array('desc_data','core_data','other_data','note_data','tag_data','task_data');
  // //test_ary = array('data_id','type','data_type','category','core_data','desc_data');
  //
  // db = jFactory::getDbo();
  // query = db->getQuery(true);
  // query->select(db->quoteName(sel_ary));
  // query->from(db->quoteName(info_table));
  // query->where(db->quoteName('user_id') . ' = ' . db->quote(arc_user_id)
  // . ' AND ' . db->quoteName('type') . '=' . db->quote("media"));
  // // . 'AND CONCAT(' . implode(",",columns). ')' . ' LIKE '. db->quote(htmlentities("%" . media . "%")));//arc Test Page
  // query->order('created DESC');// this gives me the last first
  // query->setLimit(50);
  // // . 'LIMIT ' . 50;
  // db->setQuery(query);
  //
  // rR = db->loadObjectList();
  // //return json_encode(rR) . query->dump();
  let recent_items = await Item.find({type: "media", user_id: uId}).sort({created: -1}).limit(50).lean();

  // console.log(chalk.yellow("[recent_items] typeof"),typeof recent_items, recent_items);

  if(!recent_items) return recent_items;
  /*for(d = 0; d < count(rR); d++)*/
  for(value of recent_items)
  {
    // echo "value ancestor = " . value->ancestor;
    // ancestor_data = this->getItemData(value->ancestor);
    // // echo "ancestor data = " . ancestor_data->title_data;
    // if(ancestor_data != false){
    //   value->ancestor_title = ancestor_data->title_data;
    // }
    // value->ancestor_list = this->get_my_ancestors(value,value->data_id);
    value.ancestor_list = await get_my_ancestors(value,true);
    // console.log(chalk.yellow("[ancestor list]"),typeof value.ancestor_list, value.ancestor_list);
    //rR[d]->ancestor_list = this->get_my_ancestors(rR[d]);
  }//end for

  //return json_encode(rR) . query->dump();
  //return stripslashes(json_encode(rR));
  // return json_encode(rR);
  return recent_items;

  /*
  SELECT *
  FROM projects
  WHERE
  CONCAT(category,"|",name,"|",description,"|",keywords,"|",type) LIKE '%query%'
  ORDER BY name ASC;

  bkmkData = db->loadObject();
  */

};//end recent

module.exports = recent;
