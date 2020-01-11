console.log('[quick link running]');
$(document).ready(function () {
  makeSpace();
});

//alert("quick_link.js is running");
console.log("ql running");//**

var component_title = "com_com_aliintro";

    function makeSpace()
    {
      // var bigDaddy = $("#ql_innerPanel")[0];
      //
      //     var ql_column_cont = document.createElement("div");
      //     ql_column_cont.id = "ql_column_cont";
      //     ql_column_cont.className = "ql_column_cont ";//test_red
      //
      //         var ql_perm_btn_cont = document.createElement("div");
      //         ql_perm_btn_cont.id = "ql_perm_btn_cont";
      //         ql_perm_btn_cont.className = "ql_perm_btn_cont ";//test_green
      //
      //             var ql_media_cont = document.createElement("div");
      //             ql_media_cont.id = "ql_media_cont";
      //             ql_media_cont.className = "ql_media_cont ";//test_orange

                      // var ql_media_btn = document.createElement("button");
                      // var ql_media_btn = $("#ql_media_btn")[0];
                      // ql_media_btn.id = "ql_media_btn";
                      // ql_media_btn.className = "ql_media_btn quick_btn ui-btn ui-icon-bookmark ui-btn-inline ui-corner-all ui-btn-icon-notext";
                      // ql_media_btn.title = "quick link media";

                      // ql_media_btn.onclick = function(e)
                      // {
                      $('#ql_media_btn').on('click', function (e) {
                        e.preventDefault();
                        //display the view

                        //if it doesn't exist, run the quick link
                        //if()
                        //make a lightbox with a form space
                        //promise this
                        /*
                        var light_the_way = new Promise((resolve, reject) =>
            						{
                          resolve(liteBox_id);
                        });

                        light_the_way.then(()=>{}).catch(()=>{console.error("promise failed quick_link_module line 52")});
                        */

                          var liteBox  = new masterButtons({varName:'liteBox',home:"ql_hidden_cont",type:'lightbox'});//display_home
                          liteBox.setPrefix('liteBox');
                          liteBox.setCustomClass(["ql_modal"]);
                          //liteBox.setCloseBtn("false");
                          liteBox.setLabels(["quick links","more options"]);
                          liteBox.setIcons(["bars","home"])
                          liteBox.setGoBtn("false");
                          //liteBox.setCancelBtn();
                          liteBox.clearHome("false");
                          liteBox.display();

                          var lb_id_ary = liteBox.get_event_ids();
                          var liteBoxFront_id = lb_id_ary[0];
                          var liteBoxRear_id = lb_id_ary[1];

                          $(".liteBox_looking_glass.ql_modal").addClass("d3-btn").removeClass("ui-btn");
                          $(".liteBox_tog_glass.ql_modal").addClass("d3-btn").removeClass("ui-btn");




                          var quicky = new quick_link_module({varName:'quicky',home:liteBoxFront_id,alt_home:liteBoxRear_id});
                          quicky.setPrefix('quicky');
                          quicky.set_cancel("external","liteBox_glass_cancel");
                          quicky.display();

                        // $(".ql_panel").panel("close");
                        $('.dismiss').click();
                        $(".liteBox_tog_glass.ql_modal")[0].style.display = "none";

                      })//end ql_media_btn


      //             ql_media_cont.appendChild(ql_media_btn);
      //
      //         ql_perm_btn_cont.appendChild(ql_media_cont);
      //
      //     ql_column_cont.appendChild(ql_perm_btn_cont);
      //
      // bigDaddy.appendChild(ql_column_cont);

      //prep the light box space
      if(!document.getElementById("ql_hidden_cont"))
      {
        var main_body = document.getElementsByTagName('body')[0];

        var ql_hidden_cont = document.createElement("div");
        ql_hidden_cont.id = "ql_hidden_cont";
        ql_hidden_cont.className = "ql_hidden_cont ";//test_orange

        main_body.appendChild(ql_hidden_cont);


      }//end if

    }//end makeSpace

    function quick_link_module(p_obj)
    {
        //examples and more instructions
        /************************************* Sample Code ******************************************
        var quicky = new quick_link_module({varName:'quicky',home:liteBox_id});
        quicky.setPrefix('quicky');
        quicky.set_cancel("liteBox_glass_cancel");
        quicky.display();

        *********************************************************************************************/

        //properties
        //var prepType = p_obj.type;
        //var type = prepType.toLowerCase() || "";//see set & get
        var prefix = p_obj.varName || "masBtn";//get set
        var iUN = p_obj.iUN || Math.round(Math.random() * 10000);//see iUN get and set
        var objectName = p_obj.varName;//objects variable name
        var home = p_obj.home || "";
        var alt_home = p_obj.alt_home || "";
    		var clearHome = "true";
        //var start = p_obj.start || "";
        //var homeContainer = document.getElementsByClassName(home)[0];
        //var labels = [];

    		//var has_labels = "false";
        var has_callout = "false";
        var callout_params = ["","","","","","","",""];

        //TODO add to template
        var has_go_callout = "false";
        var go_callout_params = ["","","","","","","",""];
        var has_can_callout = "false";
        var can_callout_params = ["","","","","","","",""];
        //var need_search_string = "true";
        //var titles = [];
    		//var placeholders = [];//handles more than 1 elements placeholder
    		var custom_class = [];
    		var event_ids = [];//array of id's of html elements this object manages
    		var obj_attributes = [];//used to add attributes to input/textarea
    		//good for one element or duplicate attributes on multiple elements
    		var object_elements = {};
        var database_pair = {};
        var database_alt_pair = {};
        var obj_validity = "valid";
        var set_clear = "false";
    		var add_to_class = true;
    		var id_type = "default";
    		var custom_id = "";
    		var fill_content = "";//for list,label_box,tag
    		var default_setting = "";//for slider & select
    		var inner_html = "";//for create_text_input,create_select
    		var currentValue = "";
        var d3_replace_id = "";
        var go_home = "";
        var external_cancel = "false";
        var cancel_home = "false";
        var preview_section = "false";
        var preview_type = "link";//embed,picture,rich_preview - link by default

        //methods

      //  this.setStart = function(str){start = str;}

        this.setHome = function(str){ home = str;/*homeStr = str;*/ }

        this.getHome = function(str){return home;}

        //no getter - set externally
        this.setPrefix = function(str){prefix = str;}

        this.setType = function(){type = str;}
        this.getType = function(){return type;}

        this.setIUN = function(str){ iUN = parseInt(str);}//must be a number
        this.getIUN = function(){return iUN;}

        var setText = function(str){inner_html = str; default_setting = str; fill_content = str; tag_text = str;}//works in: create_text_input,create_select

        this.setText = function(str){setText(str);}//works in: create_text_input,create_select

    		this.setDefault = function(str){setText(str);}//works in: create_select

    		this.setContent = function(str){setText(str);}//works in: label_box, list & tag

    		this.clearHome = function(str){clearHome = str};//set other than true stop bigDaddy from clearing its innerHTML

        this.setCallout = function()
        {
          /*sample use
          if(has_callout == "true")
          {
              var callout_fn = callout_params[0];
              callout_fn(dummy.id,callout_params[1],callout_params[2],callout_params[3],callout_params[4],callout_params[5]);

          }//end if
          */

          has_callout = (arguments.length != 0) ? "true" : "false";
          for(var i = 0; i < arguments.length; i++)
          {
            callout_params[i] = arguments[i];

          }//end for

        }//end setCallout

        //TODO add to template
        this.setGoCallout = function()
        {
              /*sample use
            if(has_go_callout == "true")
            {
                var go_callout_fn = go_callout_params[0];
                go_callout_fn(dummy.id,go_callout_params[1],go_callout_params[2],go_callout_params[3],go_callout_params[4],go_callout_params[5]);

            }//end if
            */
            has_go_callout = (arguments.length != 0) ? "true" : "false";
            for(var i = 0; i < arguments.length; i++)
            {
              go_callout_params[i] = arguments[i];

            }//end for

        }//end setGoCallout

        this.setCancelCallout = function()
        {
              /*sample use
            if(has_can_callout == "true")
            {
                var can_callout_fn = go_callout_params[0];
                can_callout_fn(dummy.id,can_callout_params[1],can_callout_params[2],can_callout_params[3],can_callout_params[4],can_callout_params[5]);

            }//end if
            */
            has_can_callout = (arguments.length != 0) ? "true" : "false";
            for(var i = 0; i < arguments.length; i++)
            {
              can_callout_params[i] = arguments[i];

            }//end for

        }//end setCancelCallout

        //sets labes and titles of the individual buttons
        this.setLabels = function(arObj)
        {
    			//console.log("label type = ",typeof(arObj));//**
    			//can take an array,a single str and be set to none
    			if(arObj != undefined && typeof(arObj) == "object")
          {
    				labels = arObj;//still will be an array
    				has_labels = "true";
                }else if(arObj != undefined && typeof(arObj) == "string" && arObj != ""){
    				labels[0] = arObj;//labels initiate counts
    				has_labels = "true";
    			}else{
    				labels[0] = (arObj != undefined && arObj != "") ? arObj : "";
    				has_labels = (labels[0] != "") ? "true" : "false";
    			}

        }//end setLabels

        this.setTitles = function(arObj)
        {
    			if(arObj != undefined && typeof(arObj) == "object"){
    				titles = arObj;
    			}else{
    				titles[0] = (arObj != undefined && arObj != "") ? arObj : "";
    			}//end if

        }//end setTitles

		    this.setPlaceholders = function(arObj)
        {
            placeholders = arObj;

        }//end setPlaceholders


        var _checkArray = function(sObj)
        {
          //formerly checkArrayForString
            var testString = sObj.string;
            var testArray = sObj.array;

            var strIndx = -1;

            for(var i = 0; i < testArray.length; i++)
            {
                var checkString = testArray[i];

				//does the array index have this string anywhere in it
				//"&*()$".indexof("*")
                if(checkString.indexOf(testString) != -1)
                {
                  strIndx = i;
                }

            }//end for

            return strIndx;
        }//end _checkArray

      	var _checkString = function(sObj)
      	{
          //formerly checkStringForArray
      		//example use: var isString = _checkString({'string':start,'array':labels});

      		var testString = sObj.string;
      		var testArray = sObj.array;

      		var strIndx = -1;

      		for(var i = 0; i < testArray.length; i++)
      		{
      			var checkString = testString;//

      			//does the string - (usually long) have anything found in this (short) array index
      			//"https://youtube.com/#*(&$)*&*(*)whatever".indexof("youtube")
      			if(checkString.indexOf(testArray[i]) != -1)
      			{
      			  strIndx = i;
      			}
      		}//end for

      		return strIndx;

      	}//_checkString

        this.getObjectName = function(){return objectName;}

    		this.setClear = function(){set_clear = "true";}

    		this.setCustomClass = function(clsAry,addPar){custom_class = clsAry; add_to_class = addPar || true;/*addPar is nothing yet*/}

    		this.get_event_ids = function(){return event_ids;}

    		this.setInputAttributes = function(iObj){ obj_attributes.push(iObj);}

    		this.setCustomId = function(cId){custom_id = cId; id_type = "custom";}


    		this.setCasing = function(){casing = "true";}

        this._replace = function(rId){d3_replace_id = rId;}

    		this.getCurrentValue = function(){return currentValue;}
    		this.getCurrentValue2 = function(){return extractData3();}

        this.set_go_home = function(str){go_home = str;}

        this.set_cancel = function(mode,str)
        {
          switch(mode)
          {
            case "home":
                cancel_home = str;
            break;
            case "external":
                external_cancel = str;
            break;
          }//end switch
        }//false by default

        var quick_form = function()
        {

          var homeCont = (document.getElementById(home)) ? document.getElementById(home) : document.getElementsByClassName(home)[0];//"option1"
          if(alt_home != ""){
            var homeCont = (document.getElementById(home)) ? document.getElementById(home) : document.getElementsByClassName(home)[0];//"option1"
          }//end if

          //clear the stage
          if(clearHome == "true"){
            homeCont.innerHTML = "";
          }

          //front display
          //start with a title section
          object_elements.ql_title = new masterButtons({varName:'ql_title',home:homeCont.id,type:'tag'});
          object_elements.ql_title.setTextTag('div');
          object_elements.ql_title.setPrefix('ql_title');
          object_elements.ql_title.setContent('<h5>quick link:</h5>');
          object_elements.ql_title.setCustomClass(["ql_title arc_heading"]);
          //object_elements.ql_title.clearHome("false");
          object_elements.ql_title.display();

          //add the buttonGroup
          object_elements.ql_med_type = new masterButtons({varName:'ql_med_type',home:homeCont.id,type:'buttonGroup'});
          object_elements.ql_med_type.setPrefix('ql_med_type');
          object_elements.ql_med_type.setLabels(['link','video','picture']);
          object_elements.ql_med_type.setTitles(['shara a link.','add a video.','add a picture.']);
          object_elements.ql_med_type.setGroupLabel('type:');
          object_elements.ql_med_type.setSelectedButton("link");
          object_elements.ql_med_type.setCustomClass(["ql_view d3-icon-wifi d3-btn","ql_view d3-icon-video d3-btn","ql_view d3-icon-camera d3-btn"]);
          object_elements.ql_med_type.setCasing();
          object_elements.ql_med_type.clearHome("false");
          object_elements.ql_med_type.setCallout(switch_preview_type);
          object_elements.ql_med_type.display();
          database_pair.ql_med_type = "data_type";

          $(".ql_view").on("focus",function(){
            $(".ql_view").removeClass("selected");
          });



          //input title
          object_elements.inpTitle = new masterButtons({varName:'inpTitle',home:homeCont.id,type:"text"});
    			//object_elements.inpTitle.setLabels([inputLabel]);
    			//object_elements.inpTitle.setTitles([inputTitle]);
    			object_elements.inpTitle.setPrefix('inpTitle');
    			object_elements.inpTitle.setInputAttributes({"maxlength":90});
    			object_elements.inpTitle.setInputAttributes({"type":"text"});//email, tel, url
    			object_elements.inpTitle.setInputAttributes({"data-required":"true"});//with rich text this will be false or true with auto entry
          object_elements.inpTitle.setInputAttributes({"required":"true"});
    			object_elements.inpTitle.setCustomClass(["ql_text inpTitle borderline "]);
          object_elements.inpTitle.setInputIcon('nope');
    			//dataInp.setInputAttributes({"required":true});
    			object_elements.inpTitle.setInputAttributes({"placeholder":"Title or description..."});
    			//object_elements.inpTitle.setCasing();
          object_elements.inpTitle.setAltCallout("click",custom_url_title);
          object_elements.inpTitle.clearHome("false");
    			object_elements.inpTitle.display();
          database_pair.inpTitle = "title_data";

          var inpTitle_id_array = object_elements.inpTitle.get_event_ids();
    			object_elements.inpTitle_id = inpTitle_id_array[0];

          object_elements.inpTitle_El = document.getElementById(object_elements.inpTitle_id);
          object_elements.inpTitle_El.parentNode.style.display = "none";

          object_elements.inpTitle_El.addEventListener("focus",function(){object_elements.inpTitle_El.select();});

          object_elements.inpTitle_El.addEventListener("input",function()
  				{

  						checkChange("","",{"mode":"validate"});

  				})//end input

          //input url
          object_elements.inpUrl = new masterButtons({varName:'inpUrl',home:homeCont.id,type:"text"});
          //object_elements.inpUrl.setLabels([inputLabel]);
          //object_elements.inpUrl.setTitles([inputTitle]);
          object_elements.inpUrl.setPrefix('inpUrl');
          object_elements.inpUrl.setInputAttributes({"maxlength":200});
          object_elements.inpUrl.setInputAttributes({"type":"url"});//email, tel, url
          object_elements.inpUrl.setInputAttributes({"data-required":"true"});//with rich text this will be false or true with auto entry
          object_elements.inpUrl.setInputAttributes({"required":"true"});//with rich text this will be false or true with auto entry
          object_elements.inpUrl.setCustomClass(["ql_text inpUrl "]);
          //dataInp.setInputAttributes({"required":true});
          object_elements.inpUrl.setInputAttributes({"placeholder":"enter url..."});
          //object_elements.inpUrl.setCasing();
          object_elements.inpUrl.clearHome("false");
          object_elements.inpUrl.display();
          database_pair.inpUrl = "url_data";

    			var inpUrl_id_array = object_elements.inpUrl.get_event_ids();
    			object_elements.inpUrl_id = inpUrl_id_array[0];

          object_elements.inpUrl_El = document.getElementById(object_elements.inpUrl_id);

          object_elements.inpUrl_El.addEventListener("focus",function(){object_elements.inpUrl_El.select();});

          object_elements.inpUrl_El.addEventListener("input",function()
  				{

  						checkChange("","",{"mode":"validate"});

  						//this gives it preview capability without being in edit mode
  						//it does this when the image is ready - if there is not url this isn't run
  						//so what does the code below do?

                switch(preview_type)
                {
                  case "picture":
                    display_preview_picture({"id":this.id,prev_home:'ql_prev_box'});
                  break;

                  case "link":
                    display_rich_preview({"id":this.id,prev_home:'ql_prev_box',"title_id":object_elements.inpTitle_id});
                  break;
                }//end switch

  				})//end input


          /*****************************************************************************************************/
          //more options section
          if(alt_home != "")
          {
            object_elements.ql_tags  = new masterButtons({varName:'ql_tags',home:alt_home,type:'tags'});
            object_elements.ql_tags.setPrefix('ql_tags');
            object_elements.ql_tags.setCustomClass([""]);
            object_elements.ql_tags.setPosition("up");
            //object_elements.ql_tags.setLabels("type phrase then press enter:");
            //object_elements.ql_tags.setTitles("tag maker:");
            object_elements.ql_tags.setInputAttributes({"data-required":"false"});
            object_elements.ql_tags.setInputAttributes({"required":"false"});
            object_elements.ql_tags.setInputAttributes({"maxlength":80});
            object_elements.ql_tags.setInputAttributes({"placeholder":"enter tag text..."});//another way to set placeholder - single entry for now
            object_elements.ql_tags.setCallout(checkChange,{"mode":"validate"});
            //object_elements.ql_tags.clearHome("false");
            object_elements.ql_tags.display();
            database_pair.ql_tags = "tag_data";

            var tags_id_ary = object_elements.ql_tags.get_event_ids();
            var targetElement = document.getElementById(tags_id_ary[0]);
          }//end if alt_home

          var noteInputType = 'textarea';
					var noteLabel = "notes & other info*<small>(optional)</small>";
					var noteTitle = "notes & other info*<small>(optional)</small>";
					var noteMaxLength = 120;
					var noteTypeAttr = "text";
					var notePlaceholder = "notes & other details...";
					var noteRequired = "false";
					var noteCustomize = "false";
					var noteCustomClass = "";

					var unique_class = "";

        object_elements.ql_notes = new masterButtons({varName:'ql_notes',home:alt_home,type:noteInputType});
				//object_elements.ql_notes.setLabels([noteLabel]);
				object_elements.ql_notes.setTitles([noteTitle]);
				object_elements.ql_notes.setPrefix('ql_notes');
				object_elements.ql_notes.setInputAttributes({"maxlength":noteMaxLength});
				object_elements.ql_notes.setInputAttributes({"type":noteTypeAttr});
				object_elements.ql_notes.setInputAttributes({"data-required":"false"});
        //object_elements.ql_notes.setInputAttributes({"required":true});//once you set this it becomes required - no matter true of false
				object_elements.ql_notes.setCustomClass([" ql_notes "+ noteCustomClass + unique_class]);
				object_elements.ql_notes.clearHome("false");
				object_elements.ql_notes.setInputAttributes({"placeholder":notePlaceholder});
        object_elements.ql_notes.setCallout(checkChange,{"mode":"validate"});
				object_elements.ql_notes.setCasing();
				object_elements.ql_notes.display();
        database_pair.ql_notes = "note_data";

				var ql_notes_id_array = object_elements.ql_notes.get_event_ids();
				object_elements.ql_notes_id = ql_notes_id_array[0];

          /*****************************************************************************************************/



          //box for previews
          object_elements.ql_prev_box = new masterButtons({varName:'ql_prev_box',home:homeCont.id,type:'tag'});
          object_elements.ql_prev_box.setTextTag('div');
          object_elements.ql_prev_box.setPrefix('ql_prev_box');
          //object_elements.ql_prev_box.setContent('quick link:');
          object_elements.ql_prev_box.setCustomClass(["ql_prev_box"]);
          object_elements.ql_prev_box.clearHome("false");
          object_elements.ql_prev_box.display();

          var prev_box_id_array = object_elements.ql_prev_box.get_event_ids();
          object_elements.ql_prev_box_id = prev_box_id_array[0];
          var prev_display = document.getElementById(object_elements.ql_prev_box_id);
          prev_display.style.display = "none";

          //rear display

          //create cancel
          if(external_cancel == "false")
          {

            if(cancel_home != "false")
            {
              var cancel_cont = (document.getElementById(cancel_home)) ? document.getElementById(cancel_home) : document.getElementsByClassName(cancel_home)[0];//"option1"
            }else {
              var cancel_cont = homeCont;
            }

            var canEl = document.createElement('a');
            canEl.id = prefix + "_can_btn_" + iUN;
            canEl.className = prefix + "_can_btn_" + iUN + " " + prefix + "_can_btn" + " ql_form_btn can_btn ui-btn ui-icon-check ui-btn-icon-left ui-btn-icon-notext";
            canEl.setAttribute("href","#");
            //goEl.setAttribute("onclick","setItOff()");
            canEl.innerHTML = "<h4>cancel</h4>";
            canEl.title = "cancel";

            canEl.addEventListener("click",function()
            {

              if(has_can_callout == "true")
              {
                  var can_callout_fn = can_callout_params[0];
                  can_callout_fn(can_callout_params[1],can_callout_params[2],can_callout_params[3],can_callout_params[4],can_callout_params[5]);

              }//end if

            });

            cancel_cont.appendChild(canEl);

          }//end if

        }//end quick_form

        var switch_preview_type = function(e,selBtnObj)
        {
          //change preview value
          //get the current btn value
          $(".ql_view").removeClass("selected");
          var btn_id_str = "#" + selBtnObj.btn.id;
          $(btn_id_str).addClass("selected");
          var selected_value = selBtnObj.value;

          //switch the preview type
          preview_type = selected_value;



            switch(preview_type)
            {
              case "link":
                ql_window_reset();

                //temp feats
                //display_rich_preview
                display_rich_preview({"id":object_elements.inpUrl_id,"prev_home":'ql_prev_box',"title_id":object_elements.inpTitle_id});
                //ql_activate_window();
              break;

              case "picture":
                ql_window_reset();

                display_preview_picture({"id":object_elements.inpUrl_id,prev_home:'ql_prev_box'});
              break;

              case "video":
                ql_window_reset();
                ql_activate_window();
              break;
            }//end switch

        }//end switch_preview_type

        var ql_window_reset = ()=>
        {
          //clear the box
          var prev_box_str = 'ql_prev_box';
          var prev_box = (document.getElementById(prev_box_str)) ? document.getElementById(prev_box_str) : document.getElementsByClassName(prev_box_str)[0];
          prev_box.innerHTML = "";

          //hide the options btn
          $(".liteBox_tog_glass")[0].style.display = "none";

          //hide empty titles
          if(object_elements.inpTitle_El.value == ""){
            object_elements.inpTitle_El.parentNode.style.display = "none";
          }//end if

          //initial hide the display
          var prev_display = document.getElementById(object_elements.ql_prev_box_id);
          prev_display.style.display = "none";
        }//end ql_window_reset

        var ql_activate_window = ()=>
        {

          //show the title
            object_elements.inpTitle_El.parentNode.style.display = "block";

            //show the options btn
            $(".liteBox_tog_glass")[0].style.display = "block";

          //initial show the display
          //var prev_display = document.getElementById(object_elements.ql_prev_box_id);
          //prev_display.style.display = "block";

        }//end ql_activate_window


        var display_preview_picture = function(dpi_obj){

    			var targetElement = document.getElementById(dpi_obj.id);
    			var targetValue = targetElement.value;


          var prev_home = dpi_obj.prev_home;

          if(targetValue.indexOf("http") != -1 && targetValue.indexOf("https") == -1)
    			{
    				var new_Value = targetValue.replace("http","https");
    				targetElement.value = new_Value;
    			}else {
    				//var new_Value = targetValue;
    			}

    			//preview image container
    			//if(!document.getElementsByClassName("prev_cont")[0])
    			//{
        			var prev_cont = new masterButtons({varName:'ql_prev_cont',home:prev_home,type:'tag'});
        			prev_cont.setTextTag('div');
        			prev_cont.setPrefix('ql_prev_cont');
        			//prev_cont.setInputAttributes({"href":"#"});
        			prev_cont.setInputAttributes({"title":"image preview"});
        			//prev_cont.setContent();
        			prev_cont.setCustomClass(["ql_prev_cont"]);
        			//prev_cont.clearHome("false");
        			prev_cont.display();

              var prev_cont_id_array = prev_cont.get_event_ids();
              var prev_cont_id = prev_cont_id_array[0];

        			/*var prev_box = new masterButtons({varName:'prev_box',home:'ql_prev_cont',type:'tag'});
        			prev_box.setTextTag('div');
        			prev_box.setPrefix('prev_box');
        			//prev_box.setInputAttributes({"href":"#"});
        			prev_box.setInputAttributes({"title":"image preview"});
        			//prev_box.setContent();
        			prev_box.setCustomClass(["prev_box test_red"]);
        			prev_box.clearHome("false");
        			prev_box.display();

              var prev_box_id_array = prev_box.get_event_ids();
              var prev_box_id = prev_box_id_array[0];*/


        			//create the canvas image
        			//if mode is edit the image will be preformatted
        			//if not it won't be formatted - if it isn't i will use default settings hopefully i can get the image dimensions too.
              var url_input = document.getElementById(object_elements.inpUrl_id);

              if(url_input.value != "")
              {
                var img_display = document.getElementById(object_elements.ql_prev_box_id);
                img_display.style.display = "block";

                object_elements.prev_img = new masterImage({home:'ql_prev_cont',varName:'ql_prev_img',url:targetElement.value,type:"profile"});
                prev_cont.setPrefix('ql_prev_img');
                object_elements.prev_img.setCustomClass("ql_prev_img");
                object_elements.prev_img.setRawDisplay();
                object_elements.prev_img.setLoadCallout(img_success,prev_cont_id);
                object_elements.prev_img.setErrorCallout(img_error,prev_cont_id,"img");
                object_elements.prev_img.display();
                database_pair.prev_img = "none";

                var prev_img_id_array = object_elements.prev_img.get_event_ids();
                object_elements.prev_imgElement = prev_img_id_array[1];
                console.dir(object_elements.prev_imgElement);
              }//end if


    	  }//end display_preview_picture

        var img_error = function(pId,mod){

            var prev_id = "#" + pId;
            var display_type = mod;
            $(prev_id).addClass("ql_flame");

            checkChange("","",{"mode":"validate"});

            if(display_type == "rich" && object_elements.meta_data.image != undefined)
            {
              //setErrorCallout
              delete object_elements.meta_data.image;
            }

        }//end img_error

        var img_success = function(pId)
        {
          ql_activate_window();

          var prev_id = "#" + pId;
          $(prev_id).removeClass("ql_flame");

          checkChange("","",{"mode":"validate"});

        }//end img_success

        //add to template
        var htmlDecode = function(input)
    		{
    		  var doc = new DOMParser().parseFromString(input, "text/html");
    		  return doc.documentElement.textContent;
    		}

        var display_rich_preview = function(dpi_obj){

          var targetElement = document.getElementById(dpi_obj.id);
          var targetValue = targetElement.value;

          var titleElement = document.getElementById(dpi_obj.title_id);

          var prev_home = dpi_obj.prev_home;

          if(targetValue.indexOf("http") != -1 && targetValue.indexOf("https") == -1)
          {
            var new_Value = targetValue.replace("http","https");
            targetElement.value = new_Value;

            //i may have to write something that can at least make http links shareable even if i don't get
            //the rich data from an http (unsecure) site.
          }else {
            //var new_Value = targetValue;
          }

          //preview image container
          //if(!document.getElementsByClassName("rich_cont")[0])
          //{
              var rich_cont = new masterButtons({varName:'ql_rich_cont',home:prev_home,type:'tag'});
              rich_cont.setTextTag('div');
              rich_cont.setPrefix('ql_rich_cont');
              //rich_cont.setInputAttributes({"href":"#"});
              rich_cont.setInputAttributes({"title":"image preview"});
              //rich_cont.setContent();
              rich_cont.setCustomClass(["ql_rich_cont"]);
              //rich_cont.clearHome("false");
              rich_cont.display();

              var rich_cont_id_array = rich_cont.get_event_ids();
              var rich_cont_id = rich_cont_id_array[0];

              var rich_box = new masterButtons({varName:'ql_rich_box',home:'ql_rich_cont',type:'tag'});
              rich_box.setTextTag('div');
              rich_box.setPrefix('ql_rich_box');
              //rich_box.setInputAttributes({"href":"#"});
              rich_box.setInputAttributes({"title":"rich preview"});
              //rich_box.setContent();
              rich_box.setCustomClass(["ql_rich_box "]);
              rich_box.clearHome("false");
              rich_box.display();

              var rich_box_id_array = rich_box.get_event_ids();
              var rich_box_id = rich_box_id_array[0];


              //create the canvas image
              //if mode is edit the image will be preformatted
              //if not it won't be formatted - if it isn't i will use default settings hopefully i can get the image dimensions too.
              var url_input = document.getElementById(object_elements.inpUrl_id);

              if(url_input.value != "")
              {

    						ql_parser(url_input.value).then((res_var)=>{
    							//do something with the data
                  //console.log("scrape_it thenable running!");
                  //remove the escaped slashes
                  var results = res_var;

                  if(results.indexOf("|*:|unathorized user|*:|") != -1){return;}

                  while(results.indexOf("\\/") != -1){
                    results = results.replace("\\/","/");
                  }//end while
                  //console.log("new results = " + results);

                  //turn the string into an object
                  //var meta_obj = JSON.parse(results);
                  //var has_data = meta_obj.has_data;

                  if(results == "" || results.indexOf("<b>Fatal error</b>") != -1 || results.indexOf("|*:|data unavailable|*:|") != -1){
          					//no preview available
          					var meta_obj = {};
          					var has_data = "false";
          					var meta_title = "No preview available";
          				}else
          				{
          					var meta_obj = JSON.parse(results);
          					var has_data = meta_obj.has_data || "";

          					var meta_title = meta_obj.title || "";
          					meta_title = htmlDecode(meta_title);
          				}//end else indexOf

                  meta_title = unescape(meta_title);

                  var meta_url = meta_obj.url || "";
                  meta_url = htmlDecode(meta_url);

                  var meta_description = meta_obj.description || "";
                  meta_description = htmlDecode(meta_description);
                  meta_description = unescape(meta_description);

                  var meta_image = meta_obj.image || "";
                  meta_image = htmlDecode(meta_image);

                  //clear the meta_data home
                  var rich_home = (document.getElementById("ql_rich_box")) ? document.getElementById("ql_rich_box") : document.getElementsByClassName("ql_rich_box")[0];
                  rich_home.innerHTML = "";

                  if(meta_title != "")
                  {
                      //prepare a container
                      object_elements.meta_data = {};
                      //add the title to the input

                      //modify the data to a max limit
                      var title_limit = 90;
                      meta_title = (meta_title.length > title_limit) ? meta_title.slice(0,title_limit) : meta_title;

                      /*
                      while(meta_title.indexOf('"') != -1)
                      {
                        meta_title = meta_title.replace("\"","\\\"");
                      }//end while
                      */

                      object_elements.meta_data.title = escape(meta_title);

                      if(meta_title != "No preview available"){
                        titleElement.value = meta_title;
                        titleElement.oninput();
                      }

                      titleElement.onblur = function()
                      {
                        if(titleElement.value == "")
                        {
                          titleElement.value = meta_obj.title || "";
                          titleElement.oninput();
                        }//end if
                      }//end onblur

                      var img_display = document.getElementById(object_elements.ql_prev_box_id);
                      img_display.style.display = "block";

                      //create a title element for the preview title
                      var rich_title = new masterButtons({varName:'ql_rich_title',home:'ql_rich_box',type:'tag'});
                      rich_title.setTextTag('p');
                      rich_title.setPrefix('ql_rich_title');
                      //rich_title.setInputAttributes({"href":"#"});
                      rich_title.setInputAttributes({"title":"rich preview"});
                      rich_title.setContent(meta_title);
                      rich_title.setCustomClass(["ql_rich_title "]);
                      rich_title.clearHome("false");
                      rich_title.setMaxLength(90);
                      rich_title.display();

                      var rich_title_id_array = rich_title.get_event_ids();
                      var rich_title_id = rich_title_id_array[0];
                    }//end if meta_title

                    if(meta_image != "")
                    {
                      meta_image = (meta_image.indexOf("https") == -1) ? meta_image.replace("http","https") : meta_image;

                      var url_limit = 200;
                      meta_image = (meta_image.length > url_limit) ? meta_image.slice(0,url_limit) : meta_image;

                      object_elements.meta_data.image = meta_image;

                      var rich_image_cont = new masterButtons({varName:'ql_rich_image_cont',home:'ql_rich_box',type:'tag'});
                      rich_image_cont.setTextTag('div');
                      rich_image_cont.setPrefix('ql_rich_image_cont');
                      //rich_image_cont.setInputAttributes({"href":"#"});
                      rich_image_cont.setInputAttributes({"title":"rich preview container"});
                      //rich_image_cont.setContent(meta_title);
                      rich_image_cont.setCustomClass(["ql_rich_image_cont "]);
                      rich_image_cont.clearHome("false");
                      rich_image_cont.display();

                      var rich_image_cont_id_array = rich_image_cont.get_event_ids();
                      var rich_image_cont_id = rich_image_cont_id_array[0];

                      object_elements.rich_img = new masterImage({home:'ql_rich_image_cont',varName:'ql_rich_img',url:meta_image,type:"profile"});
                      //object_elements.rich_img.setPrefix('ql_rich_img');
                      object_elements.rich_img.setCustomClass("ql_rich_img");
                      object_elements.rich_img.setRawDisplay();
                      object_elements.rich_img.setLoadCallout(img_success,rich_image_cont_id);
                      object_elements.rich_img.setErrorCallout(img_error,rich_image_cont_id,"rich");
                      object_elements.rich_img.display();
                      database_pair.rich_img = "none";

                      var rich_img_id_array = object_elements.rich_img.get_event_ids();
                      object_elements.rich_imgElement = rich_img_id_array[1];
                      //console.dir(object_elements.rich_imgElement);
                    }

                    if(meta_description != "")
                    {
                      var desc_limit = 150;
                      meta_description = (meta_description.length > desc_limit) ? meta_description.slice(0,desc_limit) : meta_description;

                      /*
                      while(meta_description.indexOf('"') != -1)
                      {
                        meta_description = meta_description.replace("\"","\\\"");
                      }//end while
                      */

                      object_elements.meta_data.description = escape(meta_description);

                      var rich_description = new masterButtons({varName:'ql_rich_description',home:'ql_rich_box',type:'tag'});
                      rich_description.setTextTag('p');
                      rich_description.setPrefix('ql_rich_description');
                      //rich_description.setInputAttributes({"href":"#"});
                      rich_description.setInputAttributes({"title":"rich description"});
                      rich_description.setContent(meta_description);
                      rich_description.setCustomClass(["ql_rich_description word_wrap "]);
                      rich_description.clearHome("false");
                      rich_description.setMaxLength(150);
                      rich_description.display();
                    }//end if

                    database_alt_pair.meta_data = "meta_data";



                  ql_activate_window();

    						})//.catch((err)=>{console.error("promise failed arc_site line 2683" + err)});


              }//end if


        }//end display_rich_preview

        var custom_url_title = function(inId)
        {
          var input_id = inId;
          var input_element = document.getElementById(input_id);

          input_element.value = "";
          input_element.oninput();
          input_element.onfocus();

        }//end custom_url_title

        var test_xml_scaper = function(txsu)
        {
          //Failes for this useage
          var test_url = txsu;

          $(document).ready(function()
          {
              $.ajax({
                    type: 'GET',
                    url: test_url,
                    //dataType: 'html',
                    dataType: 'text/plain',
                    success: function(data) {

                      //cross platform xml object creation from w3schools
                      try //Internet Explorer
                        {
                        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async="false";
                        xmlDoc.loadXML(data);
                        }
                      catch(e)
                        {
                        try // Firefox, Mozilla, Opera, etc.
                          {
                          parser=new DOMParser();
                          xmlDoc=parser.parseFromString(data,"text/xml");
                          }
                        catch(e)
                          {
                          alert(e.message);
                          return;
                        }//end catch - inner

                        }//end catch - outer

                      //alert(xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue);
                      var result_value = xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
                      console.log("test scrape return value = ",result_value);

                      //result output for:
                      //http://mashable.com/2017/04/04/mastodon-twitter-social-network/#Md.eDvQdhiqm
                      //net::ERR_INSECURE_RESPONSE - not https

                      //lets try youtube
                      //result error:
                      //XMLHttpRequest cannot load https://www.youtube.com/watch?v=MclEy-z9038.
                      //No 'Access-Control-Allow-Origin' header is present on the requested resource.
                      //Origin 'http://localhost' is therefore not allowed access.

                      //lets try it on the server
                      //same result = different is therefore not allowed.

                      //conclusion, this wont work cross site because it can't produce an 'Access-Control-Allow-Origin' header


                    }//end success

              });//end ajax

            });//end ready


        }//end test_xml_scaper


        var ql_parser = function(tUrl)
        {
         return new Promise((resolve, reject)=>{
            var uploadData = {};
            // var arc_input = {};
            // arc_input.url = tUrl;

            //wait_a_minute("show");

              // uploadData.url = JSON.stringify(arc_input);//just in case i need to send other data along with the url
              uploadData.url = tUrl;
        			uploadData.task = "get_preview_data";
              //console.log(uploadData);

              // var form_token = FORM_TOKEN;

              ql_rex(uploadData)
              .then((results) => {
                console.log("parse results = ",results);
                resolve(results)
              })
              .catch(err => {
                reject(err);
              })


          })//end promise function

        }//end ql_parser

        const ql_rex = async function(http_obj)
        {
          return new Promise((resolve, reject)=>{
              // var form_token = http_obj.token || FORM_TOKEN;
              // let site_url = http_obj.site || SITEURL;
              var uploadData = {...http_obj};
              let manual_origin = "https://sunzao.us";
              // let site_origin = location.origin;//nginx fix
              let site_origin = (!origin.includes("//localhost:")) ? origin : manual_origin;//nginx fix

              // var ctrl_Url = site_url + "index.php?option=com_arc&task=" + urlMod + "&format=raw&" + form_token + "=1";//this works
              var ctrl_Url =` ${site_origin}/req/post`;//this works
              // var ctrl_Url =`http://localhost:3000/req/post`;//this works

              // fetch(ctrl_Url, uploadData)
              // .then(function(response) {
              //   resolve(response.text());
              // });
              let post = { title: "some text"};

              let options = {
                method:'POST',
                body:JSON.stringify(uploadData),
                headers: new Headers({'Content-Type': 'application/json'})
              }// options

              fetch(ctrl_Url,options)
              .then(function(response) {
                resolve(response.text());
              });
          });
        }




        this.display = function()
        {
            quick_form();
            /*switch(type)
            {
                case "typeName":

                break;

            }//end switch
            */

        }//end display

        //TODO add to template
        var checkChange = function(e,eID,mob,tObj)
        {
          var mode = (mob != undefined && mob.mode != undefined && mob.mode  != "") ? mob.mode : "validate" ;
          //var more_info = mob.more_info
          var isReady = "true";
          //mod is edit or make passed from form_display

          var form_id_Ary = [];


            /*if(object_elements.inpTitle != undefined)
            {
                var check_it = object_elements.inpTitle.runDataCheck();
                if(check_it == "invalid")
                {
                  isReady = "false";
                }
            }// end if

            if(object_elements.inpUrl != undefined)
            {
                var check_it = object_elements.inpUrl.runDataCheck();
                if(check_it == "invalid")
                {
                  isReady = "false";
                }
            }// end if

            if(object_elements.prev_img != undefined)
            {
                var check_it = object_elements.prev_img.runDataCheck();
                if(check_it == "invalid")
                {
                  isReady = "false";
                }//end if
            }//end if
            */
            var pair_keys = Object.keys(database_pair);
            for(var i = 0; i < pair_keys.length; i++)
            {

              if(object_elements[pair_keys[i]] != undefined)
              {
                  var check_it = object_elements[pair_keys[i]].runDataCheck();
                  if(check_it == "invalid")
                  {
                    isReady = "false";
                  }//end if
              }//end if
            }//end for


            //console.log(form_id_Ary);

            //var isReady = validityCheck(form_id_Ary);

            if(isReady == "true")
            {
              giveItAGo({"ready":"yes"});

            }else{

              giveItAGo({"ready":"no"});
              return;
            }//end else

            if(mode == "submit" && isReady == "true")
            {
              //upload data
              makeContact();

            }

        }//end checkChange

        //TODO add to template
        var giveItAGo = function(gOb)
    		{
    			//mod is edit or make passed from form_display
    			//TODO:10 enter key go btn
          var go_btn_id = prefix + "_go_btn_" + iUN;

    			if(gOb.ready == "yes")
    			{
    				//if the btns not there make it
    				if(!document.getElementById(go_btn_id))
    				{

    					var targContain = (document.getElementById(go_home)) ? document.getElementById(go_home) : document.getElementsByClassName(go_home)[0];

    					var goEl = document.createElement('a');
    					goEl.id = prefix + "_go_btn_" + iUN;
    					goEl.className = prefix + "_go_btn_" + iUN + " " + prefix + "_go_btn" + " ql_form_btn go_btn ui-btn ui-icon-check ui-btn-icon-left ui-btn-icon-notext";
    					goEl.setAttribute("href","#");
    					//goEl.setAttribute("onclick","setItOff()");
    					goEl.innerHTML = "<h4>OK</h4>";
    					goEl.title = "make contact";

    					goEl.addEventListener("click",function()
              {
    						checkChange("","",{"mode":"submit"});

                if(has_go_callout == "true")
                {
                    var go_callout_fn = go_callout_params[0];
                    go_callout_fn(go_callout_params[1],go_callout_params[2],go_callout_params[3],go_callout_params[4],go_callout_params[5]);

                }//end if

    					});

              if(external_cancel != "false"){
                var canEl = (document.getElementById(external_cancel)) ? document.getElementById(external_cancel) : document.getElementsByClassName(external_cancel)[0];
                var targContain = canEl.parentNode;
                targContain.insertBefore(goEl,canEl);/**/
              }//end if



    				}//end if

    			}else
    			{
    				//if the btn is there get rid of it
    				if(document.getElementById(go_btn_id))
    				{
    					var goEl = document.getElementById(go_btn_id);
    					var goPar = goEl.parentNode;
    					goPar.removeChild(goEl);

    				}//end if

    			}//end else

    		}//end giveItAGo

        //TODO add to template
        var validityCheck = function(objAry)
    		{
    			/********  sample use *********

    			var event_id_array = uNote.get_event_ids();
    			var targetElement = document.getElementById(event_id_array[0]);
    			targetElement.onclick = function(){

    			targetElement.onclick = function(){

    				var form_id_Ary = [];
    					//alert("id additions work")
    					//check group for validity
    					form_id_Ary.push(dataInp.get_event_ids().join());
    					form_id_Ary.push(testTag.get_event_ids().join());
    					form_id_Ary.push(txAre.get_event_ids().join());
    					console.log(form_id_Ary);

    					var isReady = validityCheck(form_id_Ary);

    					if(isReady == true)
    					{
    					...

    			********  sample use *********/

    			var id_Array = objAry;
    			var readyForm = true;

    			for(var r = 0; r < id_Array.length; r++)
    			{
    				var targEl = document.getElementById(id_Array[r]);
    				targEl.checkValidity();
    				targEl.validity.valid;

    				if(targEl.checkValidity() == false || targEl.validity.valid == false){readyForm = "invalid"; return readyForm;}

    				if(targEl.dataset.required == "true" && targEl.style.display != "none")
    				{
    					if(targEl.value == ""){readyForm = "incomplete"; return readyForm;}
    				}

    			}//end for

    			return readyForm;

    		}//end validityCheck

        //TODO add to template
        function wait_a_minute(mod,txt)
        {
          //global scope function

          var modify = mod || "show";
          var display_txt = txt || "Uploading Data...";

          if(modify == "show"){
            $.mobile.loading("show",{theme:"a",textVisible:true,"text":"loading...",
            html:"<div class='L7loader'><img id='L7img' class='L7img' src='"
            + COMP_IMG_URL + "cloud.gif' /><p id='loaderMsg'>" + display_txt + "</p></div>"});
            document.ondblclick = function(){$.mobile.loading("hide");}
          }else{

            $.mobile.loading("hide");
          }

        }//end wait_a_minute

        //TODO add to template
        var makeContact = function(tObj)
    		{

    			var uploadData = {};
    			var arc_input = {};

    			wait_a_minute("show");

            var pair_keys = Object.keys(database_pair);
            for(var i = 0; i < pair_keys.length; i++)
            {

              if(object_elements[pair_keys[i]] != undefined && database_pair[pair_keys[i]] != "none" && database_pair[pair_keys[i]] != "")
              {
                  //var check_it = object_elements[pair_keys[i]].runDataCheck();
                  var ql_db_str = database_pair[pair_keys[i]];
                  var ql_data = object_elements[pair_keys[i]].getCurrentValue();
                  arc_input[ql_db_str] = ql_data;
              }//end if

            }//end for

            var alt_keys = Object.keys(database_alt_pair);
            for(var x = 0; x < alt_keys.length; x++)
            {

              if(object_elements[alt_keys[x]] != undefined && database_alt_pair[alt_keys[x]] != "none" && database_alt_pair[alt_keys[x]] != "")
              {
                  //var check_it = object_elements[pair_keys[i]].runDataCheck();
                  var ql_alt_db_str = database_alt_pair[alt_keys[x]];

                  //if its an object type (obj or array) turn it into a string if not the use it as is
                  var ql_alt_data = (typeof(object_elements[alt_keys[x]]) == "object") ? JSON.stringify(object_elements[alt_keys[x]]) : object_elements[alt_keys[x]];

                  //replace double for single quotes
                  /*
                  while(ql_alt_data.indexOf('"') != -1)
                  {
                    ql_alt_data = ql_alt_data.replace("\"","'");
                  }//end while
                  */
                  arc_input[ql_alt_db_str] = ql_alt_data;
              }//end if

            }//end for


      			var dt = new Date();
      			var arc_time = dt.getTime();
      			arc_input.modified = arc_time;

            arc_input.category = "quick link";


      			uploadData.arc_input = JSON.stringify(arc_input);
      			uploadData.display_data = "media";
            console.log(uploadData);

    				var form_token = FORM_TOKEN;


    				var urlMod = "addMyInfo";

    				var ctrl_Url = "index.php?option=com_arc&task=" + urlMod + "&format=raw&" + form_token + "=1";//this works


    				$(document).ready(function()
    				{
    				   $.ajax(
    				   {
    					url:ctrl_Url,
    					data:uploadData,
    					type:'POST',
    					   success:function(result,textStatus,xhr)
    					   {
    						   //console.log("scan textStatus = " + textStatus);
    						   //console.log("scan xhr  = " + xhr);
    						   //console.info("scan xhr status = " + xhr.status);

    						   //alert("Ajax test result data = " + result);//string
    							//console.log("Ajax test result data = " + result);//string
    							//var makeMenu = new menuMaker(result);
    							//makeMenu.display();

    							//if upload is successful

    							//change the upload icon to successful
    							//if(result.indexOf("invalid token") == -1)
    							if(result != "Invalid Token")
    							{
    								if(result.indexOf("<!doctype html>") == -1 && result.indexOf("upload failed") == -1)
    								{
    									wait_a_minute("hide");

                      //close the form
                      var close_home = "ql_hidden_cont";
                      var view_cont =  (document.getElementById(close_home)) ? document.getElementById(close_home) : document.getElementsByClassName(close_home)[0];
                      view_cont.innerHTML = "";
    								}
    								else{
    									//this comes up if the entire page's html comes back in the request
    									alert("Give me moment...  Resubmit your entry by  \n pressing the go button again.");

    									//$.mobile.loading("hide");
    								}//end else
    							}else
    							{
    									alert("Its not you... its me. \n Your session timer has expired. \n Please reset the page and give \n \"us\" a little more time.")

    									window.location.replace(SITEURL);
    							}

    							//hide

    						}

    					})
    				})//end ajax

    		}//end makeContact

    }//end object_template
