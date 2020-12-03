const { response, json } = require('express')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/sensor-data",{useNewUrlParser: true, useUnifiedTopology: true})
const Schema = mongoose.Schema;

const sensorDataSchema = new Schema({
  sensorId: Number,
  time: Date,
  temperature: Number,
  pressure: Number
})

let sensorData = mongoose.model("sensorData", sensorDataSchema)

let sensorDataArray = []
let newData = {};


app.get('/getdata/last', function(req, res) {
  console.log('Sending last sensor data')
  if (Object.keys(newData).length != 0) {
    res.send(newData)
  } else {
    res.send('Will fetch data from database')
    console.log("Will fetch data from database");
  }
})


app.post('/postdata', function(req, res) {
  console.log('Receive sensor data');
  newData = new sensorData(req.body)
  console.log(newData)
  newData
      .save()
      .then(() => res.send("data saved"))
      .catch((err) => {
        res.send("unable to save to database");
        console.log("unable to save to database")
      }) 
  // const newId = getNewId();
  // const newData = {
  //   id : newId,
  //   sensorId : req.body.sensorId,
  //   date : req.body.date,
  //   time : req.body.time,
  //   temperature : req.body.temperature,
  //   pressure : req.body.pressure }
  //   sensorDataArray.push(newData)
  //   res.send('Data saved')
  //   console.log(sensorDataArray[sensorDataArray.length-1])

  //   function getNewId() {
  //     if (sensorDataArray.length === 0) {
  //       return 1;
  //     } else {
  //       return sensorDataArray.reduce((max, cur)=> max>cur.id ? max : cur.id, 1) + 1
  //     }
  //   }
})

let server = app.listen(port, function() {
  console.log('Sensor data server started on ', port)
})