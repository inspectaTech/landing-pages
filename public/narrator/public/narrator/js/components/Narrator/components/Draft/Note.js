  import React, { useEffect, useState, useContext, Fragment, useRef } from 'react';

  import { /*Editor,*/ EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
  import Editor, {composeDecorators } from 'draft-js-plugins-editor';
  import createImagePlugin from 'draft-js-image-plugin';
  import createVideoPlugin from 'draft-js-video-plugin';

  import createAlignmentPlugin from 'draft-js-alignment-plugin';
  import createResizeablePlugin from 'draft-js-resizeable-plugin';

  const resizeablePlugin = createResizeablePlugin();
  const alignmentPlugin = createAlignmentPlugin();

  const decorator = composeDecorators(
    alignmentPlugin.decorator,
    resizeablePlugin.decorator,
  );

  const imagePlugin = createImagePlugin({decorator});
  const videoPlugin = createVideoPlugin({decorator});

  const plugins = [
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    videoPlugin
  ];

  require('./Draft.scss');

  const Note = props => {

    // props.children;
    let init = useRef(false);
    let input_el = useRef();
    let domEditor = useRef();
    const iUN_ref = useRef(props.iUN || Math.round(Math.random() * 10000));
    const iUN = iUN_ref.current;
    // let desc_init = useRef(true);


    let data = props.data;
    let item_data = data.item_data;
    let name = data.name || "note_data";
    let custom = data.custom || "";
    let note_data = (typeof item_data[`${name}`] != "undefined") ? item_data[`${name}`] : "";
    let getEditorCallback = data.getEditorCallback;
    let update_trigger = data.update_trigger;

    // let register = props.register;
    let note_obj;
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

    const [draftEditor, setDraftEditor] = (note_data != "" && typeof note_obj == "object") ?
    useState(EditorState.createWithContent(convertFromRaw(note_obj))) :
    useState(EditorState.createEmpty());

    useEffect(() => {
      if(getEditorCallback){
        getEditorCallback([EditorState, draftEditor, setDraftEditor, convertFromRaw]);
      }// if
    },[]);

    useEffect(() => {
      if(update_trigger) update_trigger();
    },[draftEditor])

    if(init.current == false){

      init.current = true;

    }// init.current

    return (
      <div className={`draft_editor_${iUN} draft_editor ${name.replace("_data", "")} ${custom}`} 
      data-comp={`Draft-Note`}>
          <Editor editorState={draftEditor}
            readOnly={true}
            onChange={() => {
              /*do nothing - fix for error:
              The prop `onChange` is marked as required in `PluginEditor`, but its value is `undefined`.*/
            }}
            plugins={plugins}
          ref={domEditor} />
      </div>
    );
  };//observer

  export default Note;

  const exists = (item) => {
    return (item != null && typeof item != "undefined" && item != false && item != "") ? true : false;
  }

// LATER: pass in different toolbars for different editor styles

// db.getCollection('items').find({category:"Krita",note_data:{$ne:""}})
// {\"blocks\"
