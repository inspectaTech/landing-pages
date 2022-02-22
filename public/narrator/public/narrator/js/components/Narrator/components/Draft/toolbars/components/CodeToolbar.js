
  import StyleButton from './StyleButton';


  const BLOCK_TYPES = [
    {label: 'Code Block', style: 'code-block'},
  ];

  const CodeStyleControls = (props) => {
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
        <div className="code-controls">
          {btns}
        </div>
      );
    }// else
  };

export default CodeStyleControls;
