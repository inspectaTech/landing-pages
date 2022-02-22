// const {removeSomething} = require('./getData/remove_something');
const chalk = require('chalk');

const display_console = false;

  const removeSomething = function(targ,char,repl)
  {
    /*
    //sample
    ShowData.removeSomething(ShowData.edit.title,' ');//unnessesary spaces
    //control the spaces
    pal = ShowData.removeSomething(pal,' ','-');
    //replace slashes with dashes
    pal = ShowData.removeSomething(pal,'/','-');
    //make sure there are no double dashes
    pal = ShowData.removeSomething(pal,'-');
    */
    //removes multiple spaces leading and trailing
    let curVal = targ;
    //let pattern1 =
    let multi_converter = new RegExp(char + '+','g');//  '/'+ char + '+/g or / +/g
    curVal = curVal.replace(multi_converter,char); //convert all multispaces to space

    if(display_console) console.log(chalk.yellow("[removeSomething] multi"),curVal);

    if(char == " "){
      // let start_converter = new RegExp('^' + char,'g');
      // curVal = curVal.replace (start_converter,"");  //remove space from start /^ /g
      // let end_converter = new RegExp(char + '$','g');
      // curVal = curVal.replace (end_converter,"");  //and end / $/g
      curVal = curVal.trim();
      if(display_console) console.log(chalk.yellow("[removeSomething] trim"),curVal);
    }//if

    if(repl != undefined && repl != ""){
      let replacer = new RegExp(char,'g');
      curVal = curVal.replace(replacer,repl);
      if(display_console) console.log(chalk.yellow("[removeSomething] repl"),curVal);
    }

    if(display_console) console.log(chalk.yellow("[removeSomething] final"),curVal);
    return curVal;
  };//end removeSomething

  module.exports = removeSomething;
