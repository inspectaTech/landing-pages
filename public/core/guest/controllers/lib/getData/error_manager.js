
const replaceErrors = (key, value) => {
  if (value instanceof Error) {
    var error = {};
    
    Object.getOwnPropertyNames(value).forEach(function (key) {
      error[key] = value[key];
    });

    return error;
  }
  
  return value;
}

const getPureError = (error) => {
  return JSON.parse(JSON.stringify(error, replaceErrors));
}

module.exports = {getPureError}

// [Express Js not sending error object on res.json()](https://stackoverflow.com/questions/47329632/express-js-not-sending-error-object-on-res-json)