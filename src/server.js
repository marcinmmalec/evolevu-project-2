require('dotenv').config();
// Set port variable to the environment variable or 8080
let port = process.env.PORT || 3000;
// Get modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
// Get utilities
// Geocode: Mapbox API
const geocode = require('./utils/geocode');
// Forecast: Openweather API
const forecast = require('./utils/forecast');

require('./db/mongoose');

const Weather = require('./models/weather-data');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
// Views are where the template files (our dynamic HTML) are located
app.set('views', viewsPath);
// Partials are where reusable fields are kept such as headers and footers
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));
// Serve index.hbs
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Marcin M. Malec, Wijoyo Utomo, Koeswanto Polim, Andrei Vedeshkin'
    });
});
// Serve about.hbs
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Marcin M. Malec, Wijoyo Utomo, Koeswanto Polim, Andrei Vedeshkin'
    });
});
// Serve help.hbs
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Marcin M. Malec, Wijoyo Utomo, Koeswanto Polim, Andrei Vedeshkin'
    });
});
// Handle weather request
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address' 
        });
    }
    
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error});
        }
        
        //console.log(Math.round(Date.now()/1000));
        // Check database
        Weather.findOne({location: location, utc: {$gte: Math.round(Date.now()/1000)-3600}}).then((a) => {
            //console.log(a);
            if(a) {
                const forecastData = {
                    actualTemp: a.temperature,
                    weatherDescription: a.description,
                    weatherIcon: a.icon,
                    utc: a.utc
                };
                //console.log(forecastData);
                return res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
                });
            }
            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({error});
                } 

                res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address
                });
                // Add database stuff           
                const weather = new Weather({
                    location: location,
                    temperature: forecastData.actualTemp,
                    description: forecastData.weatherDescription,
                    icon: forecastData.weatherIcon,
                    utc: forecastData.utc
                });

                weather.save().then(() => {
                    console.log(weather);   
                }).catch((error) => {
                    console.log(error); 
                });
            });
        }).catch((error) => {
            res.status(500).send(error);
        });
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        message: 'Help article not found.',
        name: 'Marcin M. Malec, Wijoyo Utomo, Koeswanto Polim, Andrei Vedeshkin',
        title: '404'
    });
    //res.send('Help article not found');
});
// Serve 404.hbs
app.get('*', (req, res) => {
    res.render('404', {
        message: 'Page not found.',
        name: 'Marcin M. Malec, Wijoyo Utomo, Koeswanto Polim, Andrei Vedeshkin',
        title: '404'
    });
    //res.send('My 404 page');
});
// Launch server
app.listen(port, () => {
    console.log(`Server is up to port ${port}.`);
});