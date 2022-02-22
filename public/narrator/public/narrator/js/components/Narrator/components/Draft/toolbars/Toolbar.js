import {Suspense} from 'react';
import {get_toolbar} from "./lib/get_toolbar";
import toolbar_loader from "./lib/toolbar_loader";

const Toolbar = (props) => {

  let data = props.data;
  let type_txt = data.type;
  let toolbars = [];

  if(Array.isArray(type_txt)){
    toolbars = type_txt.map((type) => {
      let toolbar_name = get_toolbar(type);
      let ToolbarButtons = toolbar_loader[toolbar_name];
      return <ToolbarButtons data={data} key={type}/>
    })
  }else{
    let toolbar_name = get_toolbar(type_txt);
    let ToolbarButtons = toolbar_loader[toolbar_name];
    toolbars = [<ToolbarButtons data={data} key={type_txt}/>];
  }

  return (
    <Suspense fallback={<div className="loader_modal w3-modal active"><div className="loader">Loading...</div></div>} >
      <div className="entry_toolbar">
        {toolbars}
      </div>
    </Suspense>
  )
}

export default Toolbar;
