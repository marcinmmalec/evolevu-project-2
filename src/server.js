// Module that enables the .env file
require('dotenv').config();
// Set port variable to the environment variable or 3000
let port = process.env.PORT || 3000;
// Get modules
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const chalk = require('chalk');
const cors = require('cors');
// Get utilities
// Geocode: Mapbox API
const geocode = require('./utils/geocode');
// Forecast: Openweather API
const forecast = require('./utils/forecast');
// Run mongoose file that connects to MongoDB
require('./db/mongoose');
// Get Weather model
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
        title: 'Weather APP',
        name: 'Marcin M. Malec, Wijoyo Utomo, Koeswanto Polim, Andrei Vedeshkin'
    });
});
// Serve about.hbs
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Us',
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
    // If no address is provided
    if (!req.query.address) {
        // Return error that an address must be provided
        return res.send({
            error: 'You must provide an address' 
        });
    }
    console.log(chalk.white.inverse.bold(`Getting Geocode For ${req.query.address}`));
    /*
    * Function: Gets the latitude, longitude, and full name of the address provided by the request
    * Returns: error message, object {latitude, longitude, location} or empty object
    */
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        // If an error was passed (not empty)
        if (error) {
            console.log(chalk.red.bold('Failed to Get Geocode'));
            console.log(chalk.red.bold(`/**********\n${error}\n/**********`));
            // Return error (probably something wrong with the API)
            return res.status(503).send({error: 'Our services are unavailable, please try again later'});
        }
        console.log(chalk.green.bold(`Got Geocode:\nLatitude: ${latitude}\nLongitude: ${longitude}\nLocation: ${location}`));
        // Check database
        console.log(chalk.white.inverse.bold(`Checking Database For ${location} since ${new Date(Date.now()-(1000*60*60))}`));
        Weather.findOne({location: location, utc: {$gte: Math.round(Date.now()/1000)-3600}})
            .then((a) => {
            // If we find the result
            if(a) {
                console.log(chalk.green.bold('Database Record Found'));
                // Create forecast object
                const forecastData = {
                    actualTemp: a.temperature,
                    weatherDescription: a.description,
                    weatherIcon: a.icon,
                    humidity: a.humidity,
                    pressure: a.pressure,
                    windSpeed: a.windSpeed,
                    feelTemp: a.feelTemp,
                    minTemp: a.minTemp,
                    maxTemp: a.maxTemp,
                    cloud: a.cloud, 
                    utc: a.utc,
                };
                console.log(chalk.green.bold(JSON.stringify(forecastData,null,2)));
                console.log(chalk.white.inverse.bold("Send Results To Sender"));
                console.log(chalk.white.inverse.bold("END REQUEST"));
                // Return forecast data, location from Geocode, and the original address provided by request
                return res.send({
                    forecast: forecastData,
                    location,
                    address: req.query.address,
                    _id: a._id
                });
            }
            // Otherwise,
            console.log(chalk.green.bold("No Database Record Found"));
            console.log(chalk.white.bold.inverse(`Get Forecast for ${location}`));
            /*
            * Function: Gets the weather information from the provided latitude and longitude
            * Returns: error message, forecastData
            */
            forecast(latitude, longitude, (error, forecastData) => {
                // If error
                if (error) {
                    console.log(chalk.red.bold('Failed to Get Forecast'));
                    // Return error
                    return res.send({error});
                }
                // Otherwise,
                console.log(chalk.green.bold(`Got Forecast for ${location}`));
                // Add database stuff           
                const weather = new Weather({
                    location: location,
                    temperature: forecastData.actualTemp,
                    description: forecastData.weatherDescription,
                    icon: forecastData.weatherIcon,
                    humidity: forecastData.humidity,
                    pressure: forecastData.pressure,
                    windSpeed: forecastData.windSpeed,
                    feelTemp: forecastData.feelTemp,
                    minTemp: forecastData.minTemp,
                    maxTemp: forecastData.maxTemp,
                    cloud: forecastData.cloud,                    
                    utc: forecastData.utc
                });
                console.log(chalk.white.inverse.bold('Create Database Object'));
                console.log(chalk.green.bold(`${JSON.stringify(weather,null,2)}`));
                console.log(chalk.white.inverse.bold('Store Forecast in Database'));
                // Add forecast into database
                weather.save().then(() => {
                    console.log(chalk.green.bold(`Database Store Successful`));
                    console.log(chalk.green.bold(`${JSON.stringify(weather,null,2)}`));
                    console.log(chalk.white.inverse.bold('Send Results to Sender'));
                    // Send results to requester
                    res.send({
                        forecast: forecastData,
                        location,
                        address: req.query.address,
                        _id: weather.id
                    });
                }).catch((error) => {
                    console.log(chalk.red.bold(error)); 
                });
            });
        }).then(() => {
            // Delete all outdated forecasts
            console.log(chalk.white.inverse.bold(`Delete All Outdated Forecasts`));
            Weather.deleteMany({utc: {$lt: Math.round(Date.now()/1000)-3600}}).then((a) => {
                console.log(chalk.green.bold(`${JSON.stringify(a,null,2)}`));
            }).catch((error) => {
                console.log(chalk.red.bold(error)); 
            });
        });
    });
});

app.put('/updateweather', (req, res) => {
    
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        message: 'Help article not found.',
        name: 'Marcin M. Malec, Wijoyo Utomo, Koeswanto Polim, Andrei Vedeshkin',
        title: '404'
    });
    //res.send('Help article not found');
});
/*
* Sensor Code
*/
const Sensor = require('../Microcontroller/server/backend/class/sensor')
const SensorNode = require('../Microcontroller/server/backend/class/sensor_node')

let sensorNode1 = new SensorNode(1, "My Home", "Sensor Node 1")
sensorNode1.addSensor(new Sensor("Temperature", 5))
sensorNode1.addSensor(new Sensor("Pressure", 5))
sensorNode1.sensorArray[0].setValue(20.4)
sensorNode1.sensorArray[1].setValue(88.741)

let sensorNode2 = new SensorNode(2, "My Office", "Sensor Node 2")
sensorNode2.addSensor(new Sensor("Temperature", 5))
sensorNode2.addSensor(new Sensor("Pressure", 5))
sensorNode2.sensorArray[0].setValue(22.3)
sensorNode2.sensorArray[1].setValue(89.365)

let sensorNode3 = new SensorNode(3, "Warehouse", "Sensor Node 3")
sensorNode3.addSensor(new Sensor("Temperature", 5))
sensorNode3.addSensor(new Sensor("Pressure", 5))
sensorNode3.sensorArray[0].setValue(21.7)
sensorNode3.sensorArray[1].setValue(86.217)

let sensorNode4 = new SensorNode(4, "Mom's Home", "Sensor Node 4")
sensorNode4.addSensor(new Sensor("Temperature", 5))
sensorNode4.addSensor(new Sensor("Pressure", 5))
sensorNode4.sensorArray[0].setValue(21.7)
sensorNode4.sensorArray[1].setValue(86.217)

let sensorNodeArray = [sensorNode1, sensorNode2, sensorNode3, sensorNode4]

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const sensorDataSchema = new Schema({
  nodeId: Number,
  time: Date,
  temperature: Number,
  pressure: Number
})

const sensorSchema = new Schema({
  type: String,
  rate: Number,
  enable: Boolean,
  description: String,
})

const sensorNodeSchema = new Schema({
  id: Number,
  location: String,
  sensorArray: [sensorSchema],
  description: String,
  enable: Boolean
})

let sensorDataModel = mongoose.model("sensordatas", sensorDataSchema)
let sensorModel = mongoose.model("sensorModels", sensorSchema)
let sensorNodeModel = mongoose.model("sensornodes", sensorNodeSchema)

app.get('/nodes', function(req, res) {
  res.send(sensorNodeArray);
})

app.get('/getdata/:nodeId', async function(req, res) {
  const id = req.params.nodeId
  const filter = { "nodeId" : id}
  const allsensordata = await sensorDataModel.find(filter)
  res.send(allsensordata)
})

app.post('/postdata', function(req, res) {
  try {
      console.log('Receive sensor data');
      newData = new sensorDataModel(req.body)
      console.log(newData)
      newData
      .save()
      .then(() => res.send("data saved"))
      .catch((err) => {
        res.send("unable to save to database");
        console.log("unable to save to database")
      }) 
    } catch(error) {
      console.log(error);
      res.status(400).send();
    }
})

// Serve microcontroller index.hbs
app.get('/sensor/', (req, res) => {
    res.render('sensor', {
        title: 'Sensor',
        name: 'Marcin M. Malec, Wijoyo Utomo, Koeswanto Polim, Andrei Vedeshkin'
    });
});

function loadSensorNodeData() {
  sensorNodes = sensorNodeModel.find()
  for (let i = 0; i < sensorNodes.length; i++) {
    let newSensorNodeArray = []
    newSensorNodeArray.id = sensorNodes.id
    newSensorNodeArray.location = sensorNodes.location
    newSensorNodeArray.description = sensorNode.description
    newSensorNodeArray.enable = sensorNode.enable

    for (let j = 0; j < sensorNode.sensorArray.length; j++) {
      newSensorNodeArray.sensorArray.push(sensorNode.sensorArray[j])
    }
  }
}

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
