import { useRef, useEffect, useState, forwardRef } from 'react';
const Color = require('tinycolor');
// const socket = io();
// import VirtualScroll from '../VirtualScroll/VirtualScroll';
import VIScroll from './components/VirtualScroll/Views';
import ProfileIcon from './components/ProfileIcon/ProfileIcon';
import Message from './Message';
import Entry from './components/Draft/Entry';

// how can i use this in details view which is stateless?
const {exists, obj_exists} = require('./tools/exists');
// const {removeSomething} = require('./tools/remove_something');

const {toaster} = require('./components/Toast/toaster');



const display_console = false;
const local_port = 3001;

require('./Narrator.scss');


const Narrator = forwardRef((props, ref) => {

  // i need to figure out the max i can add b4 i need to open a separate modal
  const data = props.data;
  const item_data = {_id:"12345"};// data.item_data;
  const iUN_ref = useRef(props.iUN || Math.round(Math.random() * 10000));
  const iUN = iUN_ref.current;
  const comment_ref = useRef();
  const editor_ref = useRef();
  const default_height = 30;
  const default_state = {text: "", count: 0, class: "", height: default_height};
  const delay = data?.delay || false;
  let init = delay ? false : true;

  // const test_presets = [{preset_data:VIEWER_DATA.preset_data}, {preset_data:VIEWER_DATA.preset_data},  {preset_data:VIEWER_DATA.preset_data}, {preset_data:VIEWER_DATA.preset_data}];

  const [state, setState] = useState({init});
  const [comment, setComment] = useState(default_state);
  const [users, setUsers] = useState({list:[],data:{}});
  const [messages, setMessages] = useState({list:[],data:{},height:[0]});
  const [reply_data, setReplyData] = useState();
  const [ref_data, setRefData] = useState();
  const ready_send = useRef(false);
  const [ randomColor, setRandomColor ] = useState(getLightColor());

  const narr_messages = useRef();// used to scroll back to bottom
  // const roomName = useRef();
  const project_token = useRef(sessionStorage.getItem("project_token"));
  const room = item_data._id;
  const socket_ref = useRef();
  const editorStateArray = useRef();
  const messageStateArray = useRef();
  const replyStateArray = useRef();
  const ref_item_store = useRef(`ref_store_${iUN}`);

  const [view_options, setViewOptions] = useState(false);
  const [view_preview, setViewPreview] = useState(false);

  useEffect((params) => {
    
    return () => {
      // unmounting
    }
  },[]);

  // can this user join the chat?
  useEffect(() => {
    // 'http://127.0.0.1:3001'

    if(!state.init) return;

    // state.init works as designed
    // toaster({name:"snap_toast",message:`[Narrator] socket is starting`, auto:false});

    socket_ref.current = (location.hostname.includes("sunzao.us")) ? io.connect(`${location.origin}`,{
      path:"/narrator"
    }) : io.connect(`http://127.0.0.1:${local_port}`);
    // `${location.origin}:3002/webrtcPeer`
    // "https://sunzao.us/narrator"
    const socket = socket_ref.current;

    if (display_console || true) console.warn(`[Narrator] project_token`, project_token.current);

    // join uses the project_id if available right now. idk if i want to limit it to user_id yet
    socket.emit("joinRoom", {room, token: project_token.current, color: randomColor});

    // get room users
    socket.on("roomUsers", ({room, users}) => {
      if(display_console || true) console.log(`[narrator] users`, users);
      let list = [];
      let data = {};
      users.forEach((user) => {
        // let user_id = user.user_id;
        let project_id = user.project_id;
        list.push(project_id);// user_id
        data[`${project_id}`] = user;// user_id
      });

      setUsers({list, data});
      // outputRoomName(room);
      // outputUsers(users)
    });

    socket.on("info", message => {
      if(display_console || true) console.log("[narrator] info ", message);
    });// info

    // message from server
    socket.on("message", message => {
      if(display_console || true) console.log("[narrator] message ", message);
      const msg_cont = narr_messages.current
      // output the message to the DOM
      outputMessage(message);
      // add the message to the front of the array

      // scroll down
      msg_cont.scrollTop = msg_cont.scrollHeight;
    });

    socket.on("blocked", message => {
      // print blocked message?
      socket.close();
    });
    // return () => {
    //   leaveRoom();
    // }
    return () => {
      socket.close();
    }
  },[state.init]);

  useEffect(() => {
    // update the reply editor after the reply_data state is updated and re-rendered
    if(replyStateArray.current != undefined){

      if(reply_data){
        update_editor({editor:replyStateArray, blocks:reply_data.payload.text});
      }/*else{
        // of its undefined it won't need to reset the editor. the editor won't exist
        reset_editor(replyStateArray);
      }// else*/
    }// if rereplyStateArray
  },[reply_data]);

  const initialize = () => {
    if(display_console || true) console.warn("[Narrator] initializing");
    if(state.init) return;
    setState({init:true});
  }// initialize

  if(ref){
    ref.state = state;// works
    ref.initialize = initialize;// works
  }

  const getEditorState = (stateArrays) => {
    editorStateArray.current = stateArrays;
  }// getEditorState

  const getMessageState = (stateArrays) => {
    messageStateArray.current = stateArrays;
  }// getMessageState

  const getReplyState = (stateArrays) => {
    replyStateArray.current = stateArrays;
  }// getReplyState

  // output message to DOM
  const outputMessage = (message) => {
    // users// this version of users isn't an update verison - its the nearly empty version set at the init
    setMessages((prev) => {
      // return [message, ...prev];
      let msg_id =  message._id;// msg_id - this may not even matter
      // add preset_data to the message
      // let found_user = users[message.project_id]
      // let preset_data = found_user.preset_data || {};
      // message.preset_data = preset_data;

      let message_state = {};
      message_state.list = [...prev.list, msg_id];
      message_state.data = {...prev.data};
      message_state.data[`${msg_id}`] = message;
      let last_height_value = prev.height[prev.height.length - 1];
      message_state.height = [...prev.height, last_height_value + message.payload.height];

      return message_state;
    });
  }// outputMessage


  // // add room name to DOM
  // function outputRoomName(room){
  //   roomName.innerText = room;
  // }// outputRoomName
  //
  // // output users to DOM
  // function outputUsers(users){
  //   userList.innerHTML = `
  //     ${users.map(user => `<li>${user.username}</li>`).join("")}
  //     `;
  // }// outputUsers

  const update_comment = (eTxt) => {
    let target_el = comment_ref.current;
    let height = default_height;// default height
    if(display_console || false) console.warn(`[Narrator] target_el`,target_el);
    if(display_console || false) console.warn(`[Narrator] scrollHeight`,target_el.scrollHeight);
    // [Creating a textarea with auto-resize](https://stackoverflow.com/questions/454202/creating-a-textarea-with-auto-resize)

    // trim before saving (trim just removes leading and trailing spaces)
    // let prepared_value = removeSomething(target_el.value, "   ","  ");// restricts multiple spaces (allows 2)
    if(display_console || false) console.warn(`[Narrator] entry text`,eTxt);
    let prepared_value = eTxt;
    // remove empty space

    // reset height if empty - do i need to/can i remove enters?
    if(display_console || false) console.warn(`[Narrator] target height`,target_el.getBoundingClientRect().height);
    // target_el.style.height = (target_el.scrollHeight > height) ? target_el.scrollHeight+'px' : `${height}px`;
    // target_el.style.height = (target_el.getBoundingClientRect().height > height) ? target_el.getBoundingClientRect().height+'px' : `${height}px`;

    // // controlling text limit
    // let counter_class = (prepared_value.length >= caption_limit) ? "full": (prepared_value.length > (caption_limit - remaining_warning) && prepared_value.length < caption_limit) ? "warn" : "";
    let counter_class = "";
    // // just keep it sliced anyway
    // prepared_value = prepared_value.slice(0,caption_limit);
    const [editorState, draftEditor, setDraftEditor] = editorStateArray.current;
    const constentState = draftEditor.getCurrentContent()
    let has_text = constentState.hasText();

    let raw_data = JSON.parse(prepared_value);

    let has_content = raw_data.blocks.some((block) => {
      return block.text != "";
    });

    ready_send.current = has_content || ref_data ? true : false;

    update_editor({editor: messageStateArray,blocks:prepared_value});

    setComment((prev) => {
      // i should floor the height
      return {...prev,text: prepared_value, count: prepared_value.length, class: counter_class, height: Math.floor(target_el.getBoundingClientRect().height)}
    });
  }// update_comment

  const send_comment = () => {
    let socket = socket_ref.current;
    let prep_text = comment.text
    // prep_text = `<span>${prep_text.replace(/\r\n|\r|\n/g,"<br />")}</span>`;// replaces textarea newline with br tags - deprecated
    let height_el = document.querySelector(`.narr_hidden_message_cont`);
    // i should floor the height from the start
    let final_height = Math.floor(height_el.getBoundingClientRect().height);

    let msg = {
      room,
      payload:{
        text: prep_text,
        height: final_height
      },
      token: project_token.current,
      item_id: item_data._id
    };

    if(reply_data){
      msg.reply_id = reply_data._id;
    }// if

    if (ref_data) {
      msg.ref_id = ref_data._id;
    }// if

    socket.emit("chatMessage", msg);
    reset_text();
  }// send_comment

  const update_editor = ({editor, blocks}) => {

      if(editor.current == undefined) return;// do nothing

      const [editorState, draftEditor, setDraftEditor, convertFromRaw] = editor.current;

      const newContentState = convertFromRaw(JSON.parse(blocks));// GOTCHA: needed to be parsed
      setDraftEditor(editorState.createWithContent(newContentState));

      // const ContentState = convertFromRaw(JSON.parse(txt_obj))

      // setDraftEditor(editorState.push(editorState, ContentState));
  }// update_editor

  const reset_editor = (editor) => {

    if(editor.current == undefined) return;// do nothing

    const [editorState, draftEditor, setDraftEditor, convertFromRaw] = editor.current;

    setDraftEditor(editorState.createEmpty());
  }

  // clear editors
  const reset_text = () => {
    // let target_el = comment_ref.current;
    // target_el.value = "";
    // target_el.style.height = `${default_height}px`;
    // const [editorState, draftEditor, setDraftEditor] = editorStateArray.current;

    // setDraftEditor(editorState.createEmpty());
    reset_editor(editorStateArray);
    reset_editor(messageStateArray);
    // reset_editor(replyStateArray);// nope this doesn't help erase the sample

    setComment(default_state);
    setReplyData();
    setRefData();

    setViewOptions(false);
    setViewPreview(false);
    // draftEditor.focus();// failed - but extraneous
  }// reset_text

  const fetch_info = async ({obj = {}} = {}) => {
    if(display_console || false) console.warn(`[Narrator] fetch_info callback triggered...`);
  }// fetch_info

  const reply = (data) => {
    // state or ref?
    setReplyData(data);
    // display the preview
    setViewOptions(true);
    setViewPreview(true);
  }// reply

  const un_reply = () => {
    setReplyData();
  }// un_reply

  const un_ref = () => {
    setRefData();
  }// un_ref

  const height_calc = ({list,data}) => {
    let height_array = [0];
    list.forEach((id) => {
      let item = data[id];
      // get the item height value
      // let item_height = Math.floor(item.payload.height);// i just need to floor it once.
      let item_height = item.payload.height;// i think using this raw decimal number is creating an issue
      let last_height = height_array[height_array.length - 1];
      let h_calc = last_height + item_height;// height calculation

      if(display_console || false) console.warn(`[narrator] item_height = ${item_height} \n last_height = ${last_height} \n h_calc = ${h_calc}`);

      height_array.push(h_calc);
    });

    if(display_console || false) console.warn(`[narrator] height_array = ${height_array}`);
    return height_array;
  }// height_calc

  const get_flip_height = (dHt) => {
    // i can have a condition on a ref and return that ref if its set to limit this calculations occurance
    return Array.isArray(dHt) && dHt.length > 0 ? dHt[dHt.length - 1] : 0;
  }// get_flip_height

  const copy_to_item = (e, obj) => {
    if (display_console || true) console.warn(`[SelectOptions] copy_to_clipboard`);

    let item = obj.item;

    // if not this project toaster

    if (typeof item != "undefined" && item._id && item._id != "") {
      setRefData(item);
      setViewOptions(true);
      setViewPreview(true);
    }// if

    // comment_ref.current;

    let modal = obj.modal_ref.current;

    modal.close();
    // reset_feed_ids();
  }// copy_to_item

  // user dummy data

  let user_icons = Array.isArray(users.list) && users.list.length > 0 ? users.list.map((user, ndx) => {
    let name = "narr_profile";
    let item_id = item_data._id;// i may not need this but just in case a person can somehow have 2 details of the same item open
    let user_data = users.data[`${user}`];
    let preset_data = user_data.preset_data;
    let user_user_id = user_data.user_id
    let user_project_id = obj_exists(user_data,"project_id") ? user_data.project_id : user_user_id;

    let key = `${name}_${iUN}_${item_id}_${user_project_id}_${user_user_id}`;// i don't need the ndx - only one per unique user

    return <ProfileIcon key={key} user_id={user_data.user_id} data={{ /*item:data,*/preset_data, name, /*deep_dive:callbackName,*/ /*init_stage: 3, fallback: "icon"*/}}/>
  })
  : null;

  // let message_display = messages.map((message, ndx) => {
  //       // const div = document.createElement("div");
  //       // div.classList.add("message");
  //       //
  //       // div.innerHTML = `<p class="meta">${username} <span>${time}</span></p>
  //       // <p class="text">
  //       //   ${text}
  //       // </p>`;
  //       //
  //       // document.querySelector(".chat-messages").appendChild(div);
  //   return <Message data={{...message,user_data: users.data[`${message.user_id}`]}} key={`message_${iUN}_${ndx}`}/>;
  // });

  let message_display;

  if(messages.list.length != 0){

    // let Item = props.Item;

    message_display = React.memo( ({index : ndx}) => {

      let msg_id = messages.list[ndx];// messages (needs a list)
      let message = messages.data[msg_id];// messages (needs objects)
      let list_length = messages.list.length;
      let project_id = message.project_id || message.user_id;// legacy project/user id finder
      let user_data = users.data[`${project_id}`];// user_id

      return (
        <div className="views_item_wrapper" key={`message_${iUN}_${ndx}`} data-ndx={ndx}>
            <Message data={{...message, ...user_data, reply}} />
        </div>
      );
    });// memo
  }else{
    message_display = null;
  }

  let vIScroll_data = {
    visible:true,
    data:{
      render: "none",
      internal_tracking: false,
      home:`narr_messages_${iUN}`,
      iUN: iUN,
      scroll_loader: false,
      // main_loader: true,
      // callback:fetch_info,
      list: messages.list,
      items: messages.data,
      setList: setMessages,
      request_src: "external",
      list_display: message_display,
      flip: true,
      // stats: true,
      height_calc,
      position: get_flip_height(messages.height),// this should be safe to run
      dynamic_height: messages.height,
      shortfall: 100
    }
  }// vIScroll_data



  let entry_data = {
    entry_ref:comment_ref,
    editor_ref: editor_ref,
    callback:update_comment,
    getEditorCallback:getEditorState,
    maxHeight:"20rem",
    hide_scroll: true,
    placeholder:"Add a comment..."
  };

  let v_data = users.data[`${VIEWER_DATA.project_id}`];

  let hidden_data = {
    custom: "msg_preview",
    payload:{text: comment.text, height: comment.height},
    ...v_data,
    un_reply,
    un_ref,
    getEditorCallback: getMessageState,
    reply_data,
    ref_data,
    getReplyState: getReplyState
  }

  let loader = (
    <div className="loader_wrapper hide-scroll" >
      <div className="segue_item_loader loader reset-low"
        onClick={() => {
          if(display_console || true) console.warn(`[Arc] loader was clicked`);
          // iconWall_callback();
        }} >
        <div className="loader_refresh icon-spinner11 d3-ico d3-bloc"></div>
      </div>
    </div>
  );

  let display_els = state.init ? (
    <div className="Narrator narr_wrapper" data-comp={`Narrator`}>
      <div className="Narrator narr_cont">
        <div className="narr_header">
          <div className="narr_users">
            {user_icons}
          </div>
          <div className="narr_invite narr_btn d3-ico icon-plus"></div>
          <div className="narr_video narr_btn d3-ico icon-video"></div>
          <div className="narr_options narr_btn d3-ico icon-options"></div>
        </div>
        <div className="narr_content_cont hide-scroll">
          <div className={`narr_messages narr_messages_${iUN}`} ref={narr_messages}>
            {/* {message_display} */}
            <VIScroll {...vIScroll_data}/>
          </div>
        </div>
        <div className="narr_footer">
          {/* <textarea
            className={"narr_text hide-scroll"}
            type="text"
            placeholder={"Add a comment..."}
            ref={comment_ref}
            onChange={update_comment}
            onFocus={(e) => {
              e.preventDefault();
              e.target.select();
            }}
            ></textarea> */}
            {view_options ? (
              <div className={`narr_comment_ctrls ${view_options ? "visible" : ""}`}>
                <div className={`narr_preview narr_btn footer d3-ico icon-${view_preview ? "eye-blocked" : "eye"}`}
                  onClick={() => {
                    setViewPreview(!view_preview);
                  }} ></div>
                <div className="narr_clear narr_btn footer d3-ico icon-bin"
                  onClick={() => {
                    reset_text();
                  }}></div>
              </div>
            ) : null}
            <Entry data={entry_data} />
            {comment.count > 0 && ready_send.current || ref_data ? (
              <div className="narr_send narr_btn footer d3-ico icon-send"
              onClick={send_comment}></div>
            ) : null}
            <div className="narr_options narr_btn footer d3-ico icon-options"
              onClick={() => {
                setViewOptions(!view_options);
                setViewPreview(false);// make it false every time
              }}></div>
        </div>
        <div className={`narr_hidden_area ${view_options && view_preview ? "preview" : ""}`}>
          <div className="narr_hidden_message_cont">
            {/* make sure the user has been set - so icons can be updated */}
            { /*users.list.length > 0 ?*/ <Message data={hidden_data} /> /*: null*/}
          </div>
        </div>
      </div>
    </div>
  ) : loader;
  // ISSUE: users.list.length won't work for all settings, may need a different trigger

  return (
    <>
      {display_els}
    </>
  );
});// Narrator

export default Narrator;

const getLightColor = () => {
  // break into 2 values because i don't want to lighten a dark color
  // if i lighten a dark color it will be light but not as light because i started dark
  let test_color = Color.random();
  // let try_color = test_color.lighten(25);// failed
  // let try_color = Color(test_color).lighten(25);// failed
  let try_color = Color(test_color.toHex8()).lighten(22);// worked

  let white = Color("white");
  while(!test_color.isLight() || Color.equals(try_color, white)){
    test_color = Color.random();
    try_color = Color(test_color.toHex8()).lighten(22);
  }
  // return `#${try_color.lighten().saturate(20).toHex8()}`;
  return `#${try_color.toHex8()}`;
}// getLightColor

//data={{callback:update_comment/*toolbar:"none"*/}}

// [How to clear input field in Draft-js](https://stackoverflow.com/questions/37463757/how-to-clear-input-field-in-draft-js)
