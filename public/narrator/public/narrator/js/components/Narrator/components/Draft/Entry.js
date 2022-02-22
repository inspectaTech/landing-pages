  import React, { useEffect, useState, useContext, Fragment, useRef } from 'react';
  require("./Entry.scss");
  // const {dataCheck} = require('./dataCheck');
  import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
  import Toolbar from './toolbars/Toolbar';
  const display_console = false;

  const Entry = props => {
    // data={{toolbar, item_data, name, callback}}

    // props.children;
    const init = useRef(false);
    const input_el = useRef();
    // let desc_init = useRef(true);

    let data = props.data || {};
    const domEditor = data.editor_ref || useRef();
    const entry_ref = data.entry_ref || useRef();
    let toolbar = data.toolbar || "none"
    let item_data = data.item_data || {};
    let callback = data.callback;// if not - undefined
    let getEditorCallback = data.getEditorCallback;
    let name = props.name || "note_data";
    let custom = data.custom || "";
    let note_data = (typeof item_data[`${name}`] != "undefined") ? item_data[`${name}`] : "";
    const [trigger_update, setTriggerUpdate] = useState(0);
    const raw_ref = useRef();

    let note_obj;
    if(data.item_data){
      // why am i using this structure instead of a ternary operator?
      // oh just in case it breaks when trying to use JSON.parse
      try {
        if(note_data != ""){
          note_obj = JSON.parse(unescape(note_data));
        }else{
          throw "no editor data available";
        }
      } catch (e) {
        console.debug("note_data conversion issue", e);
        note_obj = "";
      }
    }

    const [draftEditor, setDraftEditor] = (note_data != "" && typeof note_obj == "object") ?
    useState(EditorState.createWithContent(convertFromRaw(note_obj))) :
    useState(EditorState.createEmpty());

    if(init.current == false){

      init.current = true;

    }// init.current

    let iUN = Math.round(Math.random() * 10000);

    useEffect(() => {
      if(getEditorCallback){
        getEditorCallback([EditorState, draftEditor, setDraftEditor, convertFromRaw]);
      }

      let editor_root = entry_ref.current.querySelector(`.DraftEditor-root`);
      if(data.maxHeight){
        editor_root.style.maxHeight = data.maxHeight;
      }
      if(data.hide_scroll){
        editor_root.classList.add("hide-scroll");
      }
    },[]);

    useEffect(() => {
      let editor_root = entry_ref.current.querySelector(`.DraftEditor-root`);
      let placeholder = editor_root.querySelector(".public-DraftEditorPlaceholder-inner");

      if(placeholder && !placeholder.classList.contains("ready")){
        placeholder.classList.add("ready");
        placeholder.addEventListener("click",() => {
          if(display_console || true) console.warn(`[Entry] focus has been called`);
          // entry_ref.current.focus();// this isn't the ref to the actual editor
          domEditor.current.focus();
          // draftEditor.focus();// failed
        })
      }// if
    });

    useEffect(() => {

      if(raw_ref.current == undefined) return;
      let raw = raw_ref.current;
      if(callback){
        callback(JSON.stringify(raw),draftEditor);
      }// if
    },[draftEditor])



    const update_editor = (dE) => {
      setDraftEditor(dE);
      let raw = convertToRaw(dE.getCurrentContent());
      raw_ref.current = raw;
      // if there is a callback run the callback
      // FormStore.setData(name,JSON.stringify(raw));

      // having this section do too many things will slow down the re-render process
      // if(callback){
      //   callback(JSON.stringify(raw),draftEditor);
      // }// if
      // setTriggerUpdate(prev => prev + 1);
    }// update_editor

    // const toggleBlockType(blockType) {
    //   this.onChange(
    //     RichUtils.toggleBlockType(
    //       draftEditor,
    //       // this.state.editorState,
    //       blockType
    //     )
    //   );
    // }

    const toggleBlockType = (blockType) => {
        const newState = RichUtils.toggleBlockType(draftEditor, blockType);
        if (newState) {
            update_editor(newState);
            return 'handled';
        }//
        return 'not-handled';
    }

    const handleKeyCommand = (command) => {
      const newState = RichUtils.handleKeyCommand(draftEditor, command)
      if (newState) {
          update_editor(newState);
          return 'handled';
      }//
      return 'not-handled';
    }//handleKeyCommand

    // let tb_obj = {
    //   type: "basic",
    //   draft:{
    //     draftEditor: draftEditor,
    //     update_editor: update_editor,
    //     RichUtils: RichUtils
    //   }
    // };

    // let block_tool_obj = {
    //   type: "block",
    //   draft:{
    //     draftEditor: draftEditor,
    //     update_editor: update_editor,
    //     RichUtils: RichUtils,
    //     onToggle: toggleBlockType
    //   }
    // };

    let code_tool_obj = {
      type: toolbar,
      nowrap: false,
      draft:{
        draftEditor: draftEditor,
        update_editor: update_editor,
        RichUtils: RichUtils,
        onToggle: toggleBlockType
      }
    };

    let placeholder = {};
    if(data.placeholder != undefined){
      placeholder = {placeholder: data.placeholder}
    }

    return (
      <div className={`entry_editor_${iUN} entry_editor ${name.replace("_data","")} ${custom}`} 
      data-comp={`Draft-Entry`}
      ref={entry_ref} >
        {toolbar != "none" ? <Toolbar data={code_tool_obj} /> : null}
          <Editor editorState={draftEditor}
          handleKeyCommand={handleKeyCommand}
          onChange={update_editor}
          {...placeholder}
          ref={domEditor} />
      </div>
    );
  }
  // i don't think i need that hidden input, its doing nothing

  export default Entry;


// LATER: pass in different toolbars for different editor styles
// Note: i couldn't add multiple field instances of the same note component to the form because although it will allow fresh entry,
// it doesn't update in its current iteration.
