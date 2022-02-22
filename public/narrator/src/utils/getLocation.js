const request = require('request');
const chalk = require('chalk');

let url = "";
let place_name = "";
let lattitude = 37.8267;
let longitude = -122.4233;

const getLocation = (place, callout) => {
  // console.log('new geoLocation running!');
  const location_url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?limit=1&access_token=pk.eyJ1IjoiaW5zcGVjdGF0ZWNoIiwiYSI6ImNqdXd2dWw1ZjBncWc0M3MwdnMycjRxMXYifQ.MYuiIUUZAXH9L0p4xp_21A`

  console.log("location url = ",location_url);

  request({url:location_url,json:true},(error, {body}) => {
    if(error){
      console.log(chalk.red('an error occured'))
      return callout('a geolocation error occured: unable to find location',undefined)
    }else if(body.features.length < 1){
      console.log(chalk.red('an error occured'))
      return callout('a geolocation error occured: unable to find location',undefined)
    }
    else{
      // console.log("body = ", body);
      // console.log(`response keys: ${Object.keys(response)}`);
      // console.log(`body keys: ${Object.keys(response.body)}`);
      // console.log(`features keys: ${Object.keys(response.body.features)}`);
      // console.log(response.body.features.center);
      let place_name = body.features[0].place_name;
      let lattitude = body.features[0].center[1];
      let longitude = body.features[0].center[0];

      url = `https://api.darksky.net/forecast/b3de7543e6d9a2ed65493b4b3d677988/${lattitude},${longitude}`;
      callout(undefined,{url,place_name});
    }//else
  });
}


module.exports = getLocation;
