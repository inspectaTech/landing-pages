  const chalk = require('chalk');
  // const Pair = require('../../../models/pair');
  const Pair = require('../../../../../models/pair');

  const display_console = false;

  const pair_order = async function(mod,LID,HID,OSTR)
  {

    // pair_table = '#__arc_pair_host_link';
    //
    // //get pair current link_id record
    // db = jFactory::getDbo();
    // query = db.getQuery(true);
    //
    // conditions = array(
    // db.quoteName('host_id') . ' = ' . db.quote(htmlentities(HID)) . ' AND ' .
    // db.quoteName('link_id') . ' = '. db.quote(htmlentities(LID))
    // //db.quoteName('published') . ' = 1 ',
    // //db.quoteName('id') . ' IN (' . id_result . ')'
    // );

    switch (mod) {
      case 'get':
        // query.select('pair_order');
        // query.from(db.quoteName(pair_table));
        // query.where(conditions);//aliintro Test Page
        // db.setQuery(query);
        // pair_order = db.loadResult();

        // let updated = await Pair.updateMany({}, {$set:{pair_order: "0"}});

        // it is initially set to false which evaluates to false
        // empty() will also evaluate to true when passed a zero
        // in any case give me a zero when nothing is present
        // i don't want null though so i do need to do something
        // return pair_order;
        let pair_item = await Pair.findOne({ host_id: HID, link_id: LID}).lean();

        let order = pair_item.pair_order;
        if(display_console) console.log(chalk.yellow("[pair_item]"),pair_item);

        if(pair_item){
          return order;
        }else{
          return "0";
        }//if

      break;

      case 'update':
      // i can actually get the owner string using
      // cur_arc_user = jFactory::getUser();
      // arc_user_id = cur_arc_user.id;
      // if(arc_user_id == 0){return "[server note:]unregistered user[server note]";}
      // OSTR = order string

        // fields = array(
        //   db.quoteName('pair_order') . ' = ' . db.quote(htmlentities(OSTR))
        // );
        // query.update(db.quoteName(info_table)).set(fields).where(conditions);
        // db.setQuery(query);
        // results = db.execute();
        if(isNaN(OSTR) || OSTR === "" || OSTR == null){
          // do nothing
          return;
        }


        let response_item = await Pair.findOneAndUpdate({ host_id: HID, link_id: LID},{$set:{ pair_order: Number(OSTR) }});

        return;

      break;
    }// switch

  }// pair_order

  module.exports = pair_order;
