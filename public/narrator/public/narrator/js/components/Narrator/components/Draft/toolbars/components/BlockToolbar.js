
  import StyleButton from './StyleButton';


  const BLOCK_TYPES = [
    {label: 'H1', style: 'header-one'},
    {label: 'H2', style: 'header-two'},
    {label: 'H3', style: 'header-three'},
    {label: 'H4', style: 'header-four'},
    {label: 'H5', style: 'header-five'},
    {label: 'H6', style: 'header-six'},
    {label: 'Blockquote', style: 'blockquote'},
    {label: 'UL', style: 'unordered-list-item'},
    {label: 'OL', style: 'ordered-list-item'},
    {label: 'Code Block', style: 'code-block'},
  ];

  const BlockStyleControls = (props) => {
    const data = props.data;
    const no_wrapper = data.nowrap || false;
    const {draftEditor:editorState, onToggle} = data.draft;
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    let btns = BLOCK_TYPES.map((type) =>
      <StyleButton
        key={type.label}
        active={type.style === blockType}
        label={type.label}
        onToggle={onToggle}
        style={type.style}
      />
    );

    if(no_wrapper){
      return (
        <>
        {btns}
      </>
    )
    }else {
      return (
        <div className="RichEditor-controls">
          {btns}
        </div>
      );
    }// else
  };

export default BlockStyleControls;
