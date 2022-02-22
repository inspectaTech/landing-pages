# presets

routers/details/deatils.js
  - require presets/viewItemDetails
  - require presets/fourOhfour

viewItemDetails
  - send_item > getPresetData
  - preset = getPresetData(data)
  - return res.render(toolname, {
      ...
      preset
    });
  - ./getPresetData

getPresetData
  - //get user
  - let user = ...
  - switch(published) // what is published?
  
  > is the main item published - if so get the items owners preset_datam   

  - let public_binder = check_make_binder({})
