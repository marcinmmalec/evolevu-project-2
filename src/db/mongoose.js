const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/weather-data-api', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});