// Openweathermap API key
const apiKey = process.env.FORECASTAPIKEY;

const request = require('request');
const chalk = require('chalk');

const forecast = (latitude, longitude, callback) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    
    console.log(chalk.yellow.bold(url));
    
    request({url, json: true}, (error, {body} = {}) => {
        if (error) {
            console.log(error);
            callback('Unable to connect to weather services!', undefined);
        } else if (body.error) {
            callback(body.error.info, undefined);
        } else {
            let actualTemp = Math.round(body.main.temp);                                
            let feelTemp = Math.round(body.main.feels_like);
            let minTemp = Math.round(body.main.temp_min);
            let maxTemp = Math.round(body.main.temp_max);
            //let feelTemp = Math.round(body.main.feels_like);
            //let utcSeconds = body.dt;
            //let d = new Date(utcSeconds * 1000);
            //callback(undefined, `It is currently ${actualTemp} degrees out. It feels like ${feelTemp} degress out. It is ${body.weather[0].description}`);
            callback(undefined, {
                actualTemp: actualTemp,                 
                weatherDescription: body.weather[0].description,
                weatherIcon: body.weather[0].icon,            
                humidity: body.main.humidity,
                pressure: body.main.pressure,
                windSpeed: body.wind.speed,
                feelTemp: feelTemp,
                minTemp: minTemp,
                maxTemp: maxTemp,
                cloud: body.clouds.all,
                utc: body.dt                          
            });
        }
    });
}

module.exports = forecast;
