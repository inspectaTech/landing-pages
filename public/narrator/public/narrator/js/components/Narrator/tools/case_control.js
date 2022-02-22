  const {cycle} =  require('./cycle');


const case_options = ["sentence","title","lower","upper"];

export const change_case = ({text, curr_case}) => {

        let new_case = cycle({array: case_options, value: curr_case});

        // ["Sentence","Title","lower","upper"];
        switch (new_case) {
          case "upper":
              text = upper_case(text);
            break;
          case "lower":
            text = lower_case(text);
          break;
          case "sentence":
            text = sentence_case(text);
          break;
          case "title":
            text = title_case(text);
          break;
          default:
            // do nothing
        }

        return [ text, new_case];
      }// change_case

      export const check_case = (text) => {
        let case_value = "default";

        if(text == "") return case_value;

        case_options.some((value) => {
          let callback = case_fns[value];
          let is_true = callback(text, true);

          if(is_true) case_value = value;

          return is_true;
        });

        return case_value;
      }

      const upper_case = (text, compare = false) => {
        let new_txt = text.toUpperCase();

        return (compare) ? new_txt == text : new_txt;
      }// upper_case

      const lower_case = (text, compare = false) => {
        let new_txt = text.toLowerCase();

        return (compare) ? new_txt == text : new_txt;
      }// lower_case

      const sentence_case = (text, compare = false) => {
        let txt = lower_case(text);
        // take the first letter in the string and replace it with a capital letter
        let fst = txt.charAt(0);
        let the_rest = txt.substring(1);
        let new_txt = `${fst.toUpperCase()}${the_rest}`;

        return (compare) ? new_txt == text : new_txt;
      }// sentence_case

      const title_case = (text, compare = false) => {
        let txt = lower_case(text);
        let title_array = txt.split(" ");
        title_array = title_array.map((value) => {
          // take the first letter in the string and replace it with a capital letter
          let fst = value.charAt(0);
          let the_rest = value.substring(1);
          value = `${fst.toUpperCase()}${the_rest}`;
          return value;
        });

        let new_txt = title_array.join(" ");

        return (compare) ? new_txt == text : new_txt;
      }// title_case

      const case_fns = {
        sentence: sentence_case,
        title: title_case,
        lower: lower_case,
        upper: upper_case,
      }// case_fns

// INPUTS
// const { change_case, check_case } = require('../../../../../tools/case_control');

// METHOD
// const toggle_case = () => {
//   // desc_init.current = true;// initial display showed the desc_cont collapsing - i need it to start hidden
//   // setShowDesc(!showDesc);
//   let value_obj = getValues();
//   let input_name = `title_data_${iUN}`;// title_ref.current.name
//   let title_data = value_obj[input_name];
//   let new_case;

//   if (title_data == "") return;// do nothing

//   [title_data, new_case] = change_case({ text: title_data, curr_case: title_case });

//   // FormStore.setData("title_data",title_data);
//   setValue(input_name, title_data);// update the inputs display data (react-hook-forms)
//   setTitleCase(new_case);

//   let toast_data = {
//     home: `.toaster_home`,
//     name: "caseMsg",
//     message: `Case successfully changed to: ${new_case} case`,
//     auto: true,
//     close: true,
//     sec: 5
//   }

//   // pin find message
//   toaster(toast_data);
// }// toggle_case

// DOM ELEMENT
// <div className={`toggle_case_icon d3-ico icon-font-size d3-disc-outer ${iconClass}`}
//   onClick={toggle_case}
//   title={`toggle case`}
// ></div>