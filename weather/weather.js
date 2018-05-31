const request = require('request');

let getWeather = (latitude, longitude, callback) => {
    request({
        url:`https://api.darksky.net/forecast/bde40aa65c03bb4472aa0ac506000651/${latitude},${longitude}`,
        json: true 
        }, (error, response, body) => {
            if(!error && response.statusCode === 200){
                callback(undefined, {
                    temperature: body.currently.temperature,
                    apparentTemperature: body.currently.apparentTemperature
                });
            } else {
                callback('Unable to fetch the weather.');
            }
    });
}

module.exports.getWeather = getWeather;

