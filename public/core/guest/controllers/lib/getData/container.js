
  // const Item = require('../../../models/item');
  const Item = require('../../../../../models/item');
    // exports:
    // get_container
    // check_container
    // set_container

  const get_container = async function(ckVar)
  {
    // takes the item._id and returns the items ancestor
    let targ_var = ckVar;

    // find a documument whose id = the given id
    let item = await Item.findOne({ _id: targ_var});

    // what if it doesn't have an ancestor?
    let targ_ancestor = item.ancestor;

    return targ_ancestor;

    //get its ancestor

  };//end get_container

  const check_container = async function(anc)
  {
    let ancestor = anc;
    let item = await Item.findOne({ ancestor: ancestor});


    if(!item)
    {
      return "inactive";
    }else {
      return "active";
    }//if

  };//end check_container

  const set_container = async function(cVar,sCMod)
  {
    let targ_item = cVar;

    let container_setting = (sCMod == "set") ? 1 : 0;

    let res = Item.findOneAndUpdate({ _id: targ_item }, {$set: { container: container_setting} });

    // return "set_container sCMod = " . sCMod . " & set to = " . container_setting;
    return res;

  };//end set_container

    module.exports = {
      get_container,
      check_container,
      set_container
    }
