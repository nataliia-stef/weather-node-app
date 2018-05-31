const yargs = require('yargs');
const axios = require('axios');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true,
            default: '208 Blackthorn Avenue Toronto Ontario'
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

let encodedAddress = encodeURIComponent(argv.address);

let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;


let getNextWeekForecast = (forecast) => {
    console.log(`Here is the forecast for the next week: ${forecast.summary}`);
    forecast.data.forEach(day => {
        console.log();
        console.log(new Date(day.time * 1000).toDateString());
        console.log(day.summary);
        console.log(`The lowest temperature is ${day.temperatureLow}. The highest temperature ${day.temperatureHigh}.`)
    });
};

axios.get(geocodeUrl).then((response) => {
    if(response.data.status === 'ZERO_RESULTS'){
        throw new Error('Unable to find that address.')
    }

    let latitude = response.data.results[0].geometry.location.lat;
    let longitude = response.data.results[0].geometry.location.lng;
    let weatherUrl = `https://api.darksky.net/forecast/bde40aa65c03bb4472aa0ac506000651/${latitude},${longitude}`;

    console.log(response.data.results[0].formatted_address);
    return axios.get(weatherUrl);
}).then((response) => {
    let temperature = response.data.currently.temperature;
    let apparentTemperature = response.data.currently.apparentTemperature;
    let summary = response.data.currently.summary;
    console.log(`It's curretly ${temperature}. It feels like ${apparentTemperature}. We can see that the sky is ${summary}.`)

    getNextWeekForecast(response.data.daily);
}).catch((e) => {
    if(e.code === 'ENOTFOUND'){
        console.log('Unable to connect to API Service');
    } else {
        console.log(e.message);
    }
});