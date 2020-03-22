
  const chalk = require('chalk');
  // const Item = require('../../models/item');
  // const Pair = require('../../models/pair');
  const Item = require('../../../../models/item');
  const Pair = require('../../../../models/pair');
  const { get_container, check_container, set_container } = require('./getData/container');
  const {exists} = require('./getData/exists');

	const deleteMyInfo = async function(req,res)
	{
    console.log(chalk.green("[deleteMyInfo] delete entered"));

    try {

      let arc_input = JSON.parse(req.body.arc_input);
  		// arc_input = json_decode(idStr);

      let display_data = req.body.display_data;
      // display_data = dsp_Dta;

      // console.log(chalk.blue('chalk is working'));
      console.log(chalk.blue("[arc_input]"),arc_input);

      //TODO:640 i need to check if the id belongs to the user

      // check to see if its the last item, if so remove collection indication
      let item_ancestor = await get_container(arc_input._id);//active or inactive
      console.log(chalk.yellow('[item_ancestor]'),item_ancestor);// returns either an ObjectID or undefined - undefined will be for root items
      //return ' item_ancestor = ' . item_ancestor;//works
  //
      // only authorized users should be able to delete
      let del_res = await Item.deleteOne({ _id: arc_input._id, user_id: req.user._id});

      // clear the pair data
      let del_host_pairs = await Pair.deleteMany({ host_id: arc_input._id});
      let del_link_pairs = await Pair.deleteMany({ link_id: arc_input._id});

      if(!exists(del_res)){
        throw new Error("possible authorization error");
      }

      // delete the pairing data


      let del_msg = (del_res.ok == 1) ? "item deleted successfully." : "item not deleted" ;
      let was_deleted = (del_res.ok == 1) ? true : false;

      // update the containers status if needed
      if(exists(item_ancestor)){
        container_status = await check_container(item_ancestor);//active or inactive
      }

      if(container_status == "inactive")
      {
        let unset_container = await set_container(item_ancestor,"unset");
        console.log(chalk.green("[unset container]"), unset_container);
        //return ' unset_container results = ' . unset_container;//works
      }//end if
  //
  //         //return ' container_status = ' . container_status;//works

  		// return results;

      res.json({
        /*data: update_obj,*/
        message: del_msg,
        was_deleted
      });

    } catch (e) {
      console.log("[controller deleteMyInfo delete] error",e);

      // using a 500 error stopped all other client side processes
      // res.status(500).json({

      res.json({
        message:"a delete error occured",
        error: e
      });
    }

	}; //end deleteMyInfo


module.exports = deleteMyInfo;
