const mongoose = require('mongoose');
const validator = require('validator');

const Weather = mongoose.model('Forecasts', {
    //Location: String
    //Temperature: Number
    //Description: String
    //Icon: String
    //UTC: Number
    location: {
        type: String,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    pressure: {
        type: Number,
        required: true
    },    
    windSpeed: {
        type: Number,
        required: true
    },
    feelTemp: {
        type: Number,
        required: true
    },
    minTemp: {
        type: Number,
        required: true
    },
    maxTemp: {
        type: Number,
        required: true
    },
    cloud: {
        type: Number,
        required: true
    },
    utc: {
        type: Number,
        required: true
    }
});

module.exports = Weather;