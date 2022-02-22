import React, { useEffect } from "react";
const {sort_preset} = require('../../lib/sort_preset');
const {exists} = require('../../lib/exists');
const {htmlDecode} = require('../../lib/html_decode');

require('./BasicProfile.scss');
/**
 * @module BasicProfile
 * @desc Basic profile template for presets
 * @category Presets
 * @subcategory templates
 * @param  {object} props [description]
 * @return {elements}       [description]
 * @see [templates]{@link module:Templates}
 */

/**
 * @file
 */

const basicProfile = props => {
  // props.children;
  // LATER: profile template
  let iUN =  Math.round(Math.random() * 10000);
  let name = `basicProfile`;

  let preset_data = props.preset;
  let data = preset_data.data /*PRESET_DATA.data ||*/ ;

  // console.log(`[basicProfile] PRESET_DATA`,data);

  let email_array = sort_preset({data, type:'email'});

  let display_image = (
    <div id={`${name}_image_cont_${iUN}`} className={`${name}_image_cont_${iUN} ${name}_image_cont`}>
      <div id={`${name}_image_${iUN}`} className={`${name}_image_${iUN} ${name}_image`}>
      </div>
    </div>
  )

  useEffect(() => {
    // display the image
    // console.log(`[useEffect] display name = ${name}`);// works, use effect can access parent data
    let image_array = sort_preset({data, type:'image'});

    // if(image_array.length > 0){
    if(exists(preset_data.items.image) || image_array.length > 0){
      let image_data = (exists(preset_data.items.image)) ? preset_data.items.image : image_array[0];
      let image_cont_id = `${name}_image_${iUN}`;
      // let url_data = image_data.url_data;
      let url_data = image_data.value;
      let img_type = "profile";

      // is there extra data?
      let has_extra_data = exists(image_data.extra);
      let mode = (has_extra_data) ? "canvas" : "image";

      let basic_img = new masterImage({home:image_cont_id,url:url_data,type:img_type, width:165, height:165, scale:2, mode});
      basic_img.setCustomClass(name);
      basic_img.matchView();

      if(has_extra_data){
        basic_img.setCanvasClass("d3-profile-rounded");
        let extra_obj = image_data.extra.split(',');
        let extra_url = extra_obj[0];

        basic_img.setView(htmlDecode(image_data.extra));

      }else
      {
        basic_img.setImageClass("d3-profile-rounded");
        // basic_img.setRawDisplay();
      }
      basic_img.display();
    }// if there is an image do this
  },[])// useEffect - run once

  let display_email = (email_array.length > 0) ? (
    <div id={`${name}_email_cont_${iUN}`} className={`${name}_email_cont_${iUN} ${name}_email_cont`}>
    {
      email_array.map((item, ndx) => {
        return <h4 key={`bp_${iUN}_${ndx}`}>{item.value}</h4>;// item.core_data
      })
    }
    </div>
  ) : null;


  return (
    <div id={`${name}_${iUN}`} className={`${name}_${iUN} ${name}`}>
      {display_image}
      {display_email}
    </div>
  );
}

export default basicProfile;

// LATER: i don't have to attach a preset to an item i can use a modal that brings up a core and
// lets me attach attach a presets id. then i can use that preset id to get the preset data and tool
// and send it down with the item data
