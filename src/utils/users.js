const chalk = require('chalk');
const User = require('../../models/user');
const {getPresetData} = require('../../public/presets/getPresetData');
const display_console = false;

const users = [];

// join user to chat
async function userJoin(user){
  // const user = { id, user_id, room};// the room right now is the project_id
  try {

    // const user_data = await User.findById(user_id).lean();
    if (display_console || true) console.log(chalk.yellow(`[narrator_server] user`), user);

    let preset_data = await getPresetData({project_id: user.project_id});// editor_id
    if(display_console || false) console.log(chalk.yellow(`[narrator_server] user - i got this far`),preset_data);

    if(preset_data){
      user.preset_data = preset_data;
    }

    // console.log(chalk.green(`[narrator_server] user - user`),user);

    users.push(user);

  } catch (e) {
    console.error(chalk.red(`[narrator_server] user - an error occured`),e);
  }


  return user;
}// userJoin

// get current user
function getCurrentUser(id){
  return users.find(user => user.id === id );
}// getCurrentUser

function userLeave(id){
  const index = users.findIndex(user => {
    return user.id === id
  });

  if(index !== -1){
    return users.splice(index, 1)[0];// this will return an array of all removed items - needs [0] to return the item not an array,bcx
  }
}// userLeave

//get room users
function getRoomUsers(room){
  return users.filter(user => user.room === room);
}// getRoomUsers

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
}
