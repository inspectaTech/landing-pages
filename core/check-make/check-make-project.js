const Project = require('../../models/project');
const Item = require('../../models/item');
const chalk = require('chalk');
const display_console = false;

/**
 * @see root/src/oauth_server/controllers/setup.js > initiate_starter_data
 */
const check_make_project = async (obj, upsert = false) => {
  try {

    //
    if(display_console || 1) console.log(chalk.yellow(`[core/check_make_project] user`,JSON.stringify(obj)));

    let {_id, owner_id, parent_project, title, alias, path} = obj;

    // let project = await Project.findOne({_id}).lean();
    // find returns an array (even if its empty), findOne returns an object or nothing - will detect false

    // if(!project){
    //
    //   if(display_console || false) console.log(chalk.yellow(`[core/check_make_project] has_project = false`));
    //   const newProject = new Project({
    //     _id,
    //     owner_id,
    //     name: title,/*if creating the initial project, the title & alias will be the user's id*/
    //     alias: alias,
    //     path: path,
    //     access:{
    //       data:[_id]
    //     }
    //   });
    //   project = await newProject.save();
    //
    // }else{
    //   if(display_console || false) console.log(chalk.yellow(`[core/check_make_project] has_project detected`));
    // }

    
    let project = await Project.findOne({ _id });

    if (display_console || 1) console.log(chalk.bgCyan("[check-make-project] project",project));
    if (display_console || 1 ) console.log(chalk.bgCyan("[check-make-project] upsert",upsert));

    // GOTCHA: if there's not project, force upsert to be true otherwise doc on the callback will be null 
    // because the project isn't being made
    
    if(!project) upsert = true;// this works
    
    if(!project || upsert == true){

      if (display_console || 1 ) console.log(chalk.bgCyan(`[check-make-project] making project (${project}) upsert = ${upsert}`));

      let project_data = {
        owner_id,
        parent_project,
        name: title,/*if creating the initial project, the title & alias will be the user's id*/
        alias: alias,
        path: path
      };

      if (display_console || 1 ) console.log(chalk.bgCyan("[check-make-project] project_data",project_data));
      
      // [new returns the document after update is applied](https://mongoosejs.com/docs/tutorials/findoneandupdate.html)
      // why not an upsert? upserting here is like force update. back to title = owner_id
      project = await Project.findOneAndUpdate({_id},project_data,{ new: true, upsert },(err, doc) => {

        if (err) console.error(chalk.red("[check-make-project] err", err));

        if (display_console || false) console.log(chalk.bgCyan("[check-make-project] doc", doc));

        let id_str = doc._id.toString();
        if(typeof doc.access != "undefined" && typeof doc.access.data != "undefined"){
          
          if(!doc.access.data.includes(id_str)){
            // doc.access.data = [id_str, ...doc.access.data];
            let access_data = [id_str, ...doc.access.data];
            // doc.save((err) => {
            //   if(err) throw "results failed to save";
            //   if(display_console || true) console.log(chalk.green("[check-make-project] doc saved successfully"));
            // });
            // Project.updateOne({_id: doc._id}, {$set: {...doc}});
            Project.updateOne({_id: doc._id}, {$set: {"access.data": access_data}});
          }
        }else{
          // if undefined
          // doc.access = {data:[id_str]};
          let access_data = [id_str]
          // Project.updateOne({_id: doc._id}, {$set: {...doc}});
          Project.updateOne({_id: doc._id}, {$set: {"access": {data: access_data}}});
        }// else
      })//.lean();// the .lean() causes the .save() fn inside the callback to fail
      
    }// !project



    return project;
  } catch (e) {
    let error_msg = "[core][core/check_make_project] an error occured";
    console.error(chalk.red(error_msg),e);
    return {
      error: true,
      message: error_msg,
      data: e
    };
  }
}

module.exports = {
  check_make_project
};
