

#### config_data   
> this is supposed to be a catchall field
> ideally i would like it to display an object key helping me to identify what is it used for then use an object to contain the data.

current use AdvancedPart.js and ImageMaker.js
**elements/Inform/lib/FormOptions/partials/AdvancedPart.js**
```
  <RawHide {...{ ...rhsp, title: "Image Options:"}} >
    <Access data={{ ...sps, title: "image enabled:", name: "config_data.img_enabled", /*default_value: false,*/ }} />
    <Access data={{ ...sps, title: "text only:", name: "text_only",  /*default_value: false,*/ }} />
    <Access data={{ ...sps, title: "auto image:", name: "config_data.auto_img", /*default_value: false,*/ }} />
  </RawHide>
  <RawHide {...{ ...rhsp, title: "Binder Options:" }} >
    <Access data={{ ...sps, title: "display contents:", name: "config_data.display_contents", /*default_value: false,*/ }} />
    <Access data={{ ...sps, title: "container:", on: "yes", off: "no", name: "container", /*default_value: false,*/ }} />
  </RawHide>
```

NOTICE the Access.js component used in Inform is different from the one in elements/Access - that being said the Inform version has an update_access fn that is used to update

**elements/Inform/lib/sections/Access/Access.js**
> this is how Access updates in the form
```
  const update_access = () => {
    // let current_value = FormStore.getData(name);
    let current_value = parent[lastly];
    // let switch_span = document.querySelector("#arc_switch_span");

    let is_root = (state.folder_data.main.current.ancestor == state.root_id) ? true : false;
    if (disable_root && display_data == "media" && is_root /**&& mode == "add"**/ && FormStore.item_data.data_type != "folder") {
      // DOCS: initially set to false in sections/Pin
      // NOTE: do this on all modes "add" and "edit"
      FormStore.setData(name, false);// keep it false if media root
    }else{
      FormStore.setData(name, !current_value);
    }
  }// update_access
```