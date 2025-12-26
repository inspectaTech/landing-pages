import React, { useEffect } from "react";
import MasterImage from '../../../core/d3po_ITKR/src/app.d3po_ITKR';

// // i guess ill use this eventually - landing-pages will probably need it installed
// import MasterImage from '@sunzao/d3po_itkr';

const {sort_preset} = require('../../lib/sort_preset');
const {get_default_image} = require('../../lib/get_default_image');
const {exists} = require('../../lib/exists');
const {htmlDecode} = require('../../lib/html_decode');
const {detect_project_type} = require('../../lib/detect_project_type');

const display_console = false;

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

const BasicProfile = props => {
  // props.children;
  // LATER: profile template
  let iUN =  Math.round(Math.random() * 10000);
  let name = `basicProfile`;
  let disable = props.disable || false;// for a dummy display mode - use this to disable the btns

  let preset_data = props.preset;
  let data = preset_data.data /*PRESET_DATA.data ||*/ ;

  // console.log(`[basicProfile] PRESET_DATA`,data);

  useEffect(() => {
    if(display_console || true) console.warn(`[BasicProfile] update detected.`);
  })

  const get_path = () => {
    let path_array = location.pathname.split("/");
    // this shouldn't be empty - if it is ill need to do something
    return path_array[1];
  }

  const go_to_profile = () => {

    if(disable) return;// so the btns don't click
    console.warn("[ProfileIcon] go_to_profile clicked!");
    if( !exists(VIEWER_DATA) || !exists(VIEWER_DATA.project_id)) return;
    preset_data;
    let project = preset_data.project;

    // let viewer_id = VIEWER_DATA.user_id;
    // let preset_id = (preset_data.user.nav_id) ? preset_data.user.nav_id : preset_data.user.project_id;// i don't think i need nav_id anymore
    // let preset_id = preset_data.user.project_id;

    // if alias has the parent's ObjectId create a new alias using the parent's name
    let type = detect_project_type({...project});

    let preset_alias = (type == "project" && project.alias.includes(project.parent_project)) ?
    `${project.parent_name}/${project.path}` : project.alias;

    let path = get_path();
    // let is_preset_owner = (viewer_id == preset_id) ? true : false;
    // let is_on_preset_page = location.href.includes(`/${path}/${preset_id}`) ? true : false;
    // let is_on_owner_page = (location.href.includes(`/${path}/${viewer_id}`) || location.pathname == `/${path}/`) ? true : false;
    // !location.href.includes() ||

    // if(is_preset_owner && is_on_owner_page) return;

    let profile_url = `${location.origin}/core/${preset_alias}`;
    console.warn("[ProfileIcon] go_to_profile url = ",profile_url);

    location.replace(profile_url);
  }

  let preset_default_email =  (exists(preset_data.defaults.email) && exists(preset_data.defaults.email.value)) ? preset_data.defaults.email.value : "";
  let email_array = sort_preset({data, type:'email'});


  let preset_default_image =  (exists(preset_data.defaults.image) && exists(preset_data.defaults.image.value)) ? preset_data.defaults.image.value : "";

  let image_array = sort_preset({data, type:'image'});
  let image_data = (exists(preset_data.items.image)) ? preset_data.items.image : image_array[0];

  let icon_image = (typeof image_data.value != "undefined" && image_data.value != "") ? image_data.value : "";
  icon_image = (exists(icon_image)) ?  icon_image : (exists(preset_default_image)) ? preset_default_image : get_default_image();

  let my_icon_str = "basicProfile_icon_img";
  let my_scale = (icon_image.includes("flame.png")) ? 1 : 2;

  let rounded = props.rounded || false;
  let round_class = (rounded) ? `d3-profile-rounded` : "";

  let img_data = {
    varName:`${my_icon_str}`,
    url:icon_image,
    type: "profile",
    custom_class:`${my_icon_str} ${round_class} ${props.custom || ""}`,
    width:165,height:165,scale:my_scale,
    mode:"image",
    stop_bubble: true,
    auto_validate: true,
    layout: ["profile","thumbnail"],
    has_callout: true,
    callout_params: [go_to_profile]//,
    // has_error_callout: true,
    // error_callout_params:[this.img_error,{/*state,"pId":rich_image_cont_id,*/"mod":"rich",/*"tObj":trans_obj*/}]
    // default_img: default_image
  };
  // ISSUE: i need to throttle this app to see how it hang when using liefi
  if(image_data.extra != ""){
    img_data.extra = image_data.extra;// this is the whole thing (all the layout variations)
    img_data.mode = "auto";
    img_data.custom_class = `${img_data.custom_class}`;

    // i need to read the extra and see if the dimensions work for the display area,
    // in this case it needs profile or thumbnail or custom with the same width and height - otherwise do nothing
    // needs to use profile or thumbnail layout or default image (no extra) - can also send a different value (icon_image)

    //also if it has multiple images, look for the profile or thumbnail and get its extra data
  }// end if

  let MImg = React.memo(({data:img_data}) => {
    return <MasterImage data={img_data} />;
  })


   let display_image = (
     <div id={`${name}_image_cont_${iUN}`} className={`${name}_image_cont_${iUN} ${name}_image_cont`}>
       <div id={`${name}_image_${iUN}`} className={`${name}_image_${iUN} ${name}_image`} >
         {<MImg data={img_data}/>}
       </div>
     </div>
   )

  let target_email_array = (email_array.length > 0) ? email_array : [preset_default_email];

  // deprecated in BasicProfile but useful for reference
  let display_email = (target_email_array.length > 0) ? (
    <div id={`${name}_email_cont_${iUN}`} className={`${name}_email_cont_${iUN} ${name}_email_cont`}>
    {
      target_email_array.map((item, ndx) => {
        return <h4 key={`bp_${iUN}_${ndx}`}>{item.value ? item.value : item}</h4>;// item.core_data
      })
    }
    </div>
  ) : null;

  let display_text = !preset_data.project.name.includes(preset_data.project.parent_project) ? preset_data.project.name : "untitled";
  let display_name = <h4>{display_text}</h4>;


  return (
    <div id={`${name}_${iUN}`} className={`${name}_${iUN} ${name}`}>
      {display_image}
      {display_name /*display_email*/}
      {props.children ? props.children : null}
    </div>
  );
}

export default BasicProfile;

// LATER: i don't have to attach a preset to an item i can use a modal that brings up a core and
// lets me attach a presets id. then i can use that preset id to get the preset data and tool
// and send it down with the item data
