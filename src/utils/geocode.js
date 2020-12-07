// Mapbox API key
const apiKey = process.env.GEOAPIKEY;
// Get request module
const request = require('request');

const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=' + apiKey;

    request({url, json: true}, (error, {body} = {}) => {
        // If error
        if (error) {
            // Return error message, undefined for object
            callback('Unable to connect to location services!', undefined);
        // If no location information is provided
        } else if (body.features.length === 0) {
            // Return error message, undefined for object
            callback('Unable to find location. Try another search.', undefined);
        // Otherwise,
        } else {
            // Return undefined for error, and the object
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            });
        }
    });
}

module.exports = geocode;
