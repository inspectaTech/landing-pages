  const chalk = require('chalk');
  // const Item = require('../../../models/item');
  const Item = require('../../../../../../models/item');
  const getItemData = require('./getItemData');
  const {pair_order} = require('./pair');
  //   const { getPairObject } = require('./getData/get');

  const getPairObject = async function(dObj,disp,cUId)
  {
    //  "dObj = " . json_encode(dObj);
    // data_type = gettype (dObj);
    // item_host_id = (is_object(dObj)) ? dObj._id : dObj['_id'];
    // console.log(chalk.yellow(`[getPairObject] dObj`),dObj);
    let item_host_id = dObj._id;

    // item_owner_id = (is_object(dObj)) ? dObj.user_id : dObj['user_id'];
    let item_owner_id = dObj.user_id;

    let get_pair_data = {};
    get_pair_data.display_data = disp;
    get_pair_data.host_id = item_host_id;
    // i put this user/editor id here so i can help determine write permissions
    get_pair_data.owner_id = item_owner_id;
    get_pair_data.editor_id = cUId;// current users id

    get_pair_data.mode = "get";

    //  "pair data = " . json_encode(get_pair_data);
    return get_pair_data;

  };//getPairObject

  const getInfoData = async function(id_str,hID){
    //this is my fix for query IN condition array string
    //db quote to escape - sanitize

    // console.log(chalk.yellow(`pair_order`),pair_order);

    let info_table = '#__arc_my_data' ;
    let info_ids = id_str;
    let host_id = hID;

    //explode with more sanitation
    info_ids = (typeof info_ids == "string") ? info_ids.split(",") : info_ids;
    //implode below to add inner quotes

    // db = jFactory::getDbo();
    // query = db.getQuery(true);
    //
    // query.select('*');
    // query.from(db.quoteName(info_table));
    // query.where(db.quoteName('_id') . " IN ('" . implode("','",info_ids) . "')");//aliintro Test Page
    // db.setQuery(query);
    // mYds = db.loadObjectList();

    let mYds = await Item.find({ _id : { $in: info_ids} }).lean();

    if(mYds != false){
      // mYds.forEach(async value => {
      for(value of mYds){

        let ancestor_list = await get_my_ancestors(value,value._id);

        console.log(chalk.yellow(`pancestor_list`),ancestor_list);

        value.ancestor_list = ancestor_list;
        value.is_attachment = "true";
        // echo "[attach msg] host id = host_id and link id = value._id";
        let order = await pair_order("get",value._id,host_id,"");

        console.log(chalk.yellow(`pair_order`),order);

        value.pair_order = order;
        //sR[d].ancestor_list = this.get_my_ancestors(sR[d]);
      }// for
      // })//end forEach
    }//if
    return mYds;

  };//getInfoData

  const getItemTitle = async function(iId)
  {
    // info_table = '#__arc_my_data' ;
    let item_id = iId;

    // db = jFactory::getDbo();
    // query = db.getQuery(true);
    //
    // query.select('title_data');
    // query.from(db.quoteName(info_table));
    // query.where(db.quoteName('_id') . ' = '. db.quote(item_id));
    // db.setQuery(query);
    //
    // iTi = db.loadResult();
    let iDta = await getItemData(item_id);
    let iTi = iDta.title_data;

    return iTi;

  };//getItemData

  const get_my_ancestors = async function(lObj,dID)
  {
    let anc_ary = [];
    // info_table = '#__arc_my_data';
    let cur_ancestor = lObj.ancestor;
    // console.log(chalk.magenta("[cur_ancestor]"),cur_ancestor);
    let ancestor_ary = ["m-0","g-0","i-0"];
    // let at_home = finally_home(cur_ancestor);
    let at_home = lObj.root;
    // sel_ary = array('_id','data_type','category','title_data',
    // 'desc_data','core_data','ancestor');//,'url_data'
    // //test_ary = array('_id','type','data_type','category','core_data','desc_data');
    // //type is for media, group, info - data_type is for link, folder, tab

    //  "current id = " . dID;
    //  "starting at home = " . at_home;
    while(at_home == false)
    {

      // db = jFactory::getDbo();
      // query = db.getQuery(true);
      // query.select(db.quoteName(sel_ary));
      // query.from(db.quoteName(info_table));
      // query.where(db.quoteName('_id') . ' = '. db.quote(cur_ancestor));
      // db.setQuery(query);
      //
      // aObj = db.loadObject();
      let aObj = await getItemData(cur_ancestor);

      if(!aObj || cur_ancestor == undefined){break;};
      //at_home = "true";
      //return json_encode(aObj) . query.dump() . " result type = " . gettype(aObj);
      if(dID == true){
        //modify ancestor data
        // aObj.title_data = aObj.category;
        ancestor_data = await getItemData(aObj.ancestor);
        // echo "ancestor data = " . ancestor_data.title_data;
        if(ancestor_data){
          aObj.ancestor_title = ancestor_data.title_data;
        }
      }
      // array_unshift(anc_ary,aObj);
      anc_ary.unshift(aObj);//adds data to the beginning (prepends)

      //array_push(anc_ary,aObj);

      cur_ancestor = aObj.ancestor;
      //  "current ancestor = " . cur_ancestor;
      // at_home = this.finally_home(cur_ancestor);
      at_home = aObj.root;

      if(aObj._id == cur_ancestor)
      {
        at_home = "loop";
        break;
      }
      //  "at home = " . at_home;
    }//while

    // console.log(chalk.yellow("[ancestor array]"),anc_ary);
    // return json_encode(anc_ary);//returns a string
    return JSON.stringify(anc_ary);//returns a string

  };//end get_my_ancestors

  // const finally_home = function(ancID)
  // {
  //   //deprecated
  //   let fh = "false";
  //   switch(ancID){
  //     case "i-0":
  //     case "g-0":
  //     case "m-0":
  //       fh = "true";
  //     break;
  //   }//end switch
  //   return fh;
  // }//finally_home

module.exports = {
getPairObject,
getInfoData,
getItemTitle,
get_my_ancestors
}
