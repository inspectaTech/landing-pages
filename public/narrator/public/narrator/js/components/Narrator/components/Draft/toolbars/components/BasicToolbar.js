import {Fragment} from 'react';
const constants = [
  {
    type: "bold",
    icon: "B",
    style: "BOLD"
  },
  {
    type: "italic",
    icon: "I",
    style: "ITALIC"
  },
  {
    type: "underline",
    icon: "U",
    style: "UNDERLINE"
  },
  {
    type: "code",
    icon: "C",
    style: "CODE"
  }
]

const BasicToolbar = (props) => {

  let data = props.data;
  let draft = data.draft;
  let draftEditor = draft.draftEditor;
  let RichUtils = draft.RichUtils;
  let update_editor = draft.update_editor;

  const applyStyle = (style) => {
    // e.preventDefault();
    update_editor(RichUtils.toggleInlineStyle(draftEditor, style));
    // domEditor.current.focus();
  }

  const isActive = (style) => {
    const currentStyle = draftEditor.getCurrentInlineStyle();
    return (currentStyle.has(style)) ? "active" : "";
  }/*isActive*/

  let toolbar_btns = constants.map((item, ndx) => {
    return (
      <div className={`draft_style_btn ${item.type}-btn ${isActive(item.style)}`}
      onMouseDown={function(e){e.preventDefault(); applyStyle(item.style)}}
      key={`${item.type}_${ndx}`} >
        <em>{item.icon}</em>
      </div>
    )
  });

  return (
    <Fragment>
      {toolbar_btns}
    </Fragment>
  );
}

export default BasicToolbar;
