const {removeSomething} = require('./remove_something');

export const capitalize = (s,sentence_case = false) => {
  s = s.toLowerCase();// start by making everything lowercase
  switch (sentence_case) {
    case false:
      let text_array = [];
      if (typeof s !== 'string') return ''
      s = removeSomething(s," ");// remove extra spaces
      text_array = s.split(" ");
      text_array = text_array.map((entry) => {
        return entry.charAt(0).toUpperCase() + entry.slice(1);
      })

      return text_array.join(" ");
    break;
    case true:
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
      break;
  }// switch
}

// to upper case is pretty easy to do
