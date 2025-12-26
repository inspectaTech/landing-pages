const removeSomething = require("../core/check-make/remove_something");
const { exists } = require("./exists");


/**
 * @desc get_date_value reads a timestamp and returns desired data value
 * @param {string} mode type of value you want processed out of timestamp [datetime, date, time]
 * @param {number} timestamp *required - timestamp date will be extracted from
 * @param {boolean} ext write an extended date
 * @returns 
 */


const get_date_value = ({date = Date.now(), timestamp, zone = false, military = false, ampm = false} = {}) => {
  let ready_timestamp;
  let has_date = exists(date);
  let has_timestamp = exists(timestamp);

  try {
    ready_timestamp = () => isNaN(timestamp) ? timestamp : Number(timestamp);
    ready_timestamp = has_date ? new Date(date).getTime() : has_timestamp ? ready_timestamp() : Date.now().getTime();
    
    // ready_timestamp = new Date(initDate).getTime();// set to timestamp
  } catch (error) {
    console.error(`[get_date_value] an error occured`, error);
  }// catch
  return{
    datetime(){
      // return outputs
      return new Date(ready_timestamp).toISOString();
    },
    dateAndTime() {
      // return outputs
      return new Date(ready_timestamp);
    },
    date(ext = false){
      t = new Date(ready_timestamp);
      let m_calc = t.getMonth() + 1;
      let my_month = m_calc < 10 ? `0${m_calc}` : `${m_calc}`;
      let d_calc = t.getDate();// returns day of the month
      let my_day = d_calc < 10 ? `0${d_calc}` : `${d_calc}`;

      return ext ? t.toDateString() : `${t.getFullYear()}-${my_month}-${my_day}`;
    },
    time(){
      t = new Date(ready_timestamp);
      // return `${t.getHours()}:${t.getMinutes()}`;
      return to12Hrs(t,{military, ampm});
    },
    timestamp(){
      return ready_timestamp;
    },
    add(value) {
      var matches = value.match(/-?\d+/);// /-?\d+/g
      let nbr = Number(matches[0]);// time measurement
      r = new RegExp(/(\d+)/, 'g')// removes numbers from a string
      let value_str = removeSomething(value.replace(r, ""), " ");// unit of time
      let unit = value_str.split(" ")[0];
      let td;// test_date

      if(0) console.log(`[nbr]`,nbr);

      switch (unit) {
        case "year":
        case "years":
          td = new Date(ready_timestamp);
          let year = Number(td.getFullYear());
          let month = td.getMonth();
          let day = td.getDate();
          let hours = td.getHours();
          let minutes = td.getMinutes();
          let seconds = td.getSeconds()
          td = new Date(year + nbr, month, day, hours, minutes, seconds);
          ready_timestamp = td.getTime();
          break;
        case "month":
        case "months":
          td = new Date(ready_timestamp);
          let cur_date = td.getDate();
          td.setMonth(td.getMonth() + +nbr);
          if (td.getDate() != cur_date) {
            td.setDate(0);
          }
          ready_timestamp = td.getTime();
          break;
        case "week":
        case "weeks":
          td = new Date(ready_timestamp);
          td.setDate(td.getDate() + nbr * 7);

          ready_timestamp = td.getTime();
          break;
        case "day":
        case "days":
          console.log(`[get_date_value] adding days`);
          td = new Date(ready_timestamp + (nbr * 24 * 60 * 60 * 1000));
          ready_timestamp = td.getTime();
          break;
        case "hour":
        case "hours":
          td = new Date(ready_timestamp + (nbr * 60 * 60 * 1000));
          ready_timestamp = td.getTime();
          break;
        case "minute":
        case "minutes":
          td = new Date(ready_timestamp + (nbr * 60 * 1000));
          ready_timestamp = td.getTime();
          console.log(`[get_date_value] adding minutes`);
          break;
        case "second":
        case "seconds":

          break;
        case "millisecond":
        case "milliseconds":

          break;

        default:
          break;
      }

    }// add
  }// return
}//get_date_value

//[How do you display JavaScript datetime in 12 hour AM/PM format?](https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format)
const to12Hrs = (date, {military = false, ampm = true} = {}) => { 
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let time_of_day = "";
  if(!military){
    time_of_day = ampm && hours >= 12 ? 'pm' : ampm ? 'am' : "";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
  }

  hours = hours < 10 ? '0'+hours : hours;
  minutes = minutes < 10 ? '0'+minutes : minutes;

  // let strTime = hours + ':' + minutes + ' ' + time_of_day;
  let strTime = `${hours}:${minutes} ${time_of_day}`.trim();
  return strTime;
}

// example usage:
// const default_date = useRef(get_date_value({ mode: "date", timestamp: event_date }));
// const default_time = useRef(get_date_value({ mode: "time", timestamp: event_date }));
// const default_datetime = useRef(get_date_value({ mode: "datetime", timestamp: event_date }));

const days_from_now = ({days = 1, date, timestamp}, full = false) => { 
  let has_date = exists(date);
  let has_timestamp = exists(timestamp);

  let ready_timestamp = () => isNaN(timestamp) ? timestamp : Number(timestamp);
  let millisecs = has_date ? new Date(date).valueOf() : has_timestamp ? ready_timestamp() : Date.now();
  
  millisecs += 1000 * 60 * 60 * 24 * days;// calculates x days from now ( += 1000 * 60 * 60 * 24 * x)
  // GOTCHA: somehow my day calc is giving me back eastern daylight time with some day numbers
  //  its not a big issue but it can be when i do need accuracy

  let full_date = new Date(millisecs);

  return full ?  full_date:  millisecs;
}

const get_datetime = ({timestamp, date}) => { 
  let has_date = exists(date);
  let has_timestamp = exists(timestamp);

  let ready_timestamp = () => isNaN(timestamp) ? timestamp : Number(timestamp);
  let millisecs = has_date ? new Date(date).valueOf() : has_timestamp ? ready_timestamp() : Date.now();

  let my_date = get_date_value({mode:"date", timestamp: millisecs}).date();
  let my_time = get_date_value({mode:"time", timestamp: millisecs, military: true}).time();

  let ready_value = `${my_date}T${my_time}`;

  return ready_value;
}


module.exports = {
  get_date_value,
  days_from_now,
  get_datetime,
}


// https://medium.com/onexlab/node-js-javascript-extract-negative-and-positive-numbers-from-the-string-3dfc5f128dcd
// https://www.geeksforgeeks.org/extract-a-number-from-a-string-using-javascript/
// https://stackoverflow.com/questions/42131900/add-5-minutes-to-current-time-javascript/42132083
// https://stackoverflow.com/questions/2706125/javascript-function-to-add-x-months-to-a-date
// https://stackoverflow.com/questions/9710136/in-javascript-why-do-date-objects-have-both-valueof-and-gettime-methods-if-they

/**
 * usage:
 * d = get_date_value()
 * d.add("3 minutes");
 * d.date();
 * d.time();
 * d.datetime();
 * d.dateAndTime();
 */