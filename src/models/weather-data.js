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
    utc: {
        type: Number,
        required: true
    }
});

module.exports = Weather;