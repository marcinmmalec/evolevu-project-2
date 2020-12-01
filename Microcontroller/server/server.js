const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const sensorDataSchema = new Schema({
  sensorId: Number,
  date: Date,
  time: Date,
  temperature: Number,
  pressure: Number
})




let sensorData = []

app.post('/data', function(req, res) {
  console.log('Receive sensor data');
  const newId = getNewId();
  const newData = {
    id : newId,
    sensorId : req.body.sensorId,
    date : req.body.date,
    time : req.body.time,
    temperature : req.body.temperature,
    pressure : req.body.pressure }
    sensorData.push(newData)
    res.send('Data saved')
    console.log(sensorData[sensorData.length-1])

    function getNewId() {
      if (sensorData.length === 0) {
        return 1;
      } else {
        return sensorData.reduce((max, cur)=> max>cur.id ? max : cur.id, 1) + 1
      }
    }
})

let server = app.listen(port, function() {
  console.log('Sensor data server started on ', port)
})