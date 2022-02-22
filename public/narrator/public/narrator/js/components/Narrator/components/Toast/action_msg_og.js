  // console.log(`actions running!`);
  // const {action_msg} = require('../tools/actions/action_msg.js');
  import ReactDOM from 'react-dom';

  import  Actions from './actions';

  export const action_msg = function (obj) {

    let state = obj.state;
    let mode = obj.mode;

    switch (mode) {
      case "hide":
        let actions_collection = document.querySelectorAll(".action_cont");
        actions_collection.forEach(function (item) {
          item.style.display = "none";
        })//forEach

      break;
      case "test":
        alert("test mode is activated");
      break;
      default:

        let prefix = obj.prefix || "arc_";
        let view_prefix = (prefix == "") ? "arc_" : (prefix.indexOf("_") == -1) ? prefix + "_" : prefix;
        //this will create a react modal for user actions
        let message_display_str = obj.home ? `${obj.home}` : `.${view_prefix}message_display_span`;
        // let message_display_str = ".footspace";

        let actions_home = document.querySelector(message_display_str);
        let actions_cont_str = `.${view_prefix}action_cont`;
        obj.prefix = view_prefix;
        let action_element_str = (view_prefix.indexOf("arc") != -1) ? "action_element_main" : "action_element_alt";
        let action_element = document.querySelector(actions_cont_str);

        // if its not set do this
        if(action_element){
          // update the props
          action_element.style.display = "grid";
          state[action_element_str].update_state(obj);
        }else {
          ReactDOM.render(
            <Actions data={obj} ref={(myComponent) => { state[action_element_str] = myComponent; window.my_action = myComponent;}}/>,
            actions_home
          );
        }//else
    }//switch
    // else do this

  }//actions


  // usage:
  // const {action_msg} = require('../tools/actions/action_msg.js');
  // action_msg({state,mode:"show",prefix,message:sort_txt_obj[label_txt],auto:true,sec:5});
