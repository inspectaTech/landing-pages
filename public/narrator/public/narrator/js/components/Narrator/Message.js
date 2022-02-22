// const {htmlDecode} = require('../../tools/html_decode');
import {useMemo, useEffect, useRef, useState} from 'react';
import ProfileIcon from './components/ProfileIcon/ProfileIcon';
// import Clips from '../Clips/Clips';

import Note from './components/Draft/Note'
import { obj_exists, exists } from './tools/exists';

const Message = ({data}) => {
  const iUN_ref = useRef(data.iUN || Math.round(Math.random() * 10000));
  const iUN = iUN_ref.current;
  let payload = data.payload;
  let user = data.project_id ? data.project_id : data.user_id;//user_id vs project_id is too confusing
  //what if user has multiple projects - like i have multiple channels on youtube?
  //what if multiple users are chatting from the same project?
  let no_color = `#f3f3f3`;
  let color = data.color || no_color;
  let custom = data.custom || "";
  let preset_data = data.preset_data || {};
  let getEditorCallback = data.getEditorCallback;
  let name = "narr_message_profile";
  let item_id = data.item_id;
  let msg_id = data._id;
  let reply = data.reply;
  let un_reply = data.un_reply;
  let un_ref = data.un_ref;
  let reply_data = data.reply_data;
  let ref_data = data.ref_data;
  let reply_attr = {};
  let msg_attr = {};
  let ref_attr = {};
  let prep_reply_data;


  const [upVal, setUpVal] = useState(0); // integer state
  const forceUpdate = () => {
    setUpVal(upVal => ++upVal); // update the state to force render
  }// forceUpdate
  // ultimately for this to work id have to use dangerouslySetInnerHTML
  const who_dis = (user == VIEWER_DATA.project_id) ? "viewer" : "contact";// .user_id

  // useEffect(() => {
  //   let reply_message = document.querySelector(`.message_${iUN}`);
  //
  //   if(!reply_message) return;
  //
  //   let reply_box_height = reply_message.getBoundingClientRect().height;
  //
  //   // let reply_height = `${Math.floor(reply_box_height * .70)}px`;
  //   let reply_height = `${Math.floor(reply_box_height)}px`;// im measuring its scaled size - no need to scale it further
  //
  //   let reply_section = document.querySelector(`.narr_reply_section_${iUN}`);
  //   reply_section.style.height = reply_height;
  //
  //   // reply data Note is updated after the setReplyData render - so this height detection will only
  //   // target the last Note text not the current text
  // },[upVal]);

  const Profile = useMemo(() => {
    return <ProfileIcon  data={{ /*item:data,*/preset_data, name, /*deep_dive:callbackName,*/ /*init_stage: 3, fallback: "icon"*/}}/>
  },[preset_data]);// works but not helping to reduce jank

  const note_data = {item_data:payload, name:"text", custom};
  let has_note = has_content(payload);

  if(getEditorCallback){
    note_data.getEditorCallback = getEditorCallback;
  }

  if(reply_data){
    prep_reply_data = {item_data: reply_data.payload, name:"text", custom:"reply"};
    if(data.getReplyState){
      prep_reply_data.getEditorCallback = data.getReplyState;
      // prep_reply_data.update_trigger = forceUpdate;
    }// if

    // still an old/ obsolete payload height
    // reply_attr = {
    //   style:{
    //     height:`${Math.floor(reply_data.payload.height * .70)}px`
    //   }
    // }
  }// if

  if(ref_data && un_ref){
    // set Clips cancel/close btn
    ref_data.remove = { icon: "cross", callback: un_ref, force: true};
  }// if

  if (msg_id){
    // console.log(`[Message] data`, data._id);
    msg_attr["data-msg_id"] = msg_id;
  }

  return (
    <div className={`message ${who_dis} ${custom}`}>
      {/* {Profile} */}
      <ProfileIcon  data={{ /*item:data,*/preset_data, name, /*deep_dive:callbackName,*/ /*init_stage: 3, fallback: "icon"*/}}/>
      <div className="narr_message_content w3-card" style={{backgroundColor: color}} {...msg_attr} >
          { reply_data ? (
            <div className={`narr_reply_section narr_reply_section_${iUN}`} {...reply_attr} >
              <>
                <div className="narr_reply">
                  <div className={`message message_${iUN} ${who_dis} reply_ref`}>
                    <ProfileIcon  data={{ /*item:data,*/preset_data:reply_data.preset_data, name: "narr_reply_profile", /*deep_dive:callbackName,*/ /*init_stage: 3, fallback: "icon"*/}}/>
                    <div className="narr_message_content w3-card " style={{backgroundColor: reply_data.color}}>
                      <div className="inner">
                        <Note data={prep_reply_data} />
                      </div>
                    </div>
                  </div>
                </div>
                { un_reply ? (<div className="narr_un_reply d3-ico icon-cross" onClick={() => {
                  un_reply();
                }}></div>) : null }
              </>
            </div>
          ) : null}
        <div className="inner">
          {!has_note && (reply_data || ref_data) ? null : <Note data={note_data} />}
        </div>
        {item_id && has_note ? (<div className="narr_reply_icon d3-ico icon-reply" onClick={() => {
          reply(data);
        }}></div>) : null }
          {ref_data ? (
            <div className={`narr_ref_section narr_ref_section_${iUN}`} {...ref_attr} >
              {/* <Clips data={{ ...ref_data }} mode="core" /> */}
            </div>
          ): null}
      </div>
    </div>
  );
}
// ISSUE: come up with a reply scheme for ref_data with no note && no reply. Can i use the ref_data title instead?

export default Message;

// return <div className={`message`}>{htmlDecode(escape(payload.text))}</div>

const has_content = (payload) => {
  if (!exists(payload) || !obj_exists(payload,"text")) return false;
  let raw_data = typeof payload.text == "string" ? JSON.parse(payload.text) : payload.text;
  return obj_exists(raw_data,"blocks") ? raw_data.blocks.some((block) => {
    return block.text != "";
  }) : false;
}