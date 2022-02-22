const request = require('request');
const chalk = require('chalk');

const forecast = ({url, place_name}, callout) => {
  let return_data = "forecast data";
  request({url,json:true},(error, {body}) => {
    if (error) {
      console.log(chalk.red('an error occured'));
      callout('a forecast error occured',undefined)
    }else if(body.error)
    {
      console.log(chalk.red('location could not be found'));
      callout('location could not be found',undefined)
    }else{
      // console.log(response);
      // const data = JSON.parse(response.body);
      // console.log(data.currently);
      // console.log(response.body.currently);
      let temp_str = `It is currently ${body.currently.temperature} degrees out.`;
      let precip_str = `There is a ${body.currently.precipProbability * 100}% chance of rain.`;

      console.log(place_name);
      console.log(body.daily.data[0].summary);
      console.log(temp_str);
      console.log(precip_str);

      return_data = {
        location:place_name,
        summary:body.daily.data[0].summary,
        temperature:temp_str,
        probability:precip_str
      };

      callout(undefined,return_data)
    }//else

  });
}

module.exports = forecast;
