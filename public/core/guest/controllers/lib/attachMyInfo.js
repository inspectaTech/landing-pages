
  // const Item = require('../../models/item');
  const Item = require('../../../../models/item');
  const { pairMyData } = require('./getData/pair');
  const chalk = require('chalk');

	const attachMyInfo = async function(req,res)
	{

    try{

      let retData = "";
      let remove_data = "";
      let admin_attach = "motion";// what does this button do?

      // echo "mStr = " . mStr;
      // attach_obj = json_decode(mStr);
      let attach_obj = JSON.parse(req.body.arc_input);

      //prep parent ids
      let pair_ids = attach_obj.pair_ids;
      let pair_ary = pair_ids.split(",");
      let style = attach_obj.style;
      let task = attach_obj.task || "none";
      //echo "my style is " . style . " ";

      // echo "arcasset running pair_ids = " . pair_ids;
      // return;

      //process parent ids one at a time
      for(let p = 0; p < pair_ary.length; p++)
      {
        let parent_id = pair_ary[p];
        //test run
        // query.select('*');
        // query.from(db.quoteName(info_table));
        // query.where(db.quoteName('data_id') . ' = '. db.quote(htmlentities(parent_id)));//aliintro Test Page
        // db.setQuery(query);
        //
        // //create a clone and blank the info_ids field as a precaution
        // let parent_data = db.loadObject();
        let parent_data = await Item.findOne({ _id: parent_id });

        //return "attachMyInfo running" . pair_ids . " & parent ary = " . pair_ary[p] . json_encode(parent_data);

        //parent_data = json_decode(attach_obj.parent_str);
        // in one version the info_ids were combined with attach_ids on server side in another they werent
        // i need to add the info_ids from each parent when the parent string external attach is true?
        let attach_ids = attach_obj.move_ids;

        // if the style is push combine the attach_ids with the current db_info_ids_ary
        let display_data = attach_obj.display_data;

        retData += "attach parent data = " + JSON.stringify(parent_data) + " attach ids = " + attach_ids + ", ";

        retData += " attach data entered, ";
        let pair_obj = {};
        pair_obj.display_data = display_data;
        pair_obj.host_id = parent_data._id;
        pair_obj.host_type = parent_data.data_type;
        pair_obj.info_ids = attach_ids;//?
        pair_obj.pair_table = '#__arc_pair_host_link';
        pair_obj.owner_id = parent_data.user_id;//?
        pair_obj.editor_id = req.user._id;
        pair_obj.mode = "add";
        pair_obj.task = task;
        pair_obj.category = parent_data.category;//all_Data[m].category - this is not updated with the new changes
        pair_obj.ancestor = parent_data.ancestor;//all_Data[m].ancestor - since i did this at the beginning
        pair_obj.last_id = parent_data._id;//the data_id not the last_id
        pair_obj.style = style;


          //automatic pairing? yep
          pp_ret = await pairMyData(pair_obj);
          retData += pp_ret;
      }
      // return retData;

      console.log(chalk.green("[attach my info]"));

      res.json({
        data: retData,
        message:"item attached successfully."
      });


    } catch (e) {
      console.log("[controller attach] error",e);

      // using a 500 error stopped all other client side processes
      // res.status(500).json({

      res.json({
        message:"an attach error occured",
        error: e
      });
    }//catch

  }//attachMyInfo

module.exports = attachMyInfo;
