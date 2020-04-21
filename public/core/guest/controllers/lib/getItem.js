
const getItemData = require('./getData/getItemData');

const getItem = async function(req, res){

  try {

    console.log("addMyInfo running!");
    console.log("[getItemInfo] body ",req.body);
    console.log("[getItemInfo] body item_data id ",req.body.item_id);

    let item_id = req.body.item_id,
    return_obj = {};

    let item_data = await getItemData(item_id);
    return_obj.data = item_data;

    res.json({
      ...return_obj,
      message:"data retrieved successfully"
    });

  } catch (err) {
    console.log("[update Many ] error",err);

    res.json({
      message:"an error occured",
      error: err
    });
  }//catch

}// getItem

module.exports = getItem;
