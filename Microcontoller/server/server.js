const express = require('express')
const app = express()
const port = process.port || 3000

app.use(express.json())

let sensorData = []

app.post('/data', function(req, res) {
  console.log('Receive sensor data');
  const newId = sensorData.reduce((max, cur)=> max>cur.id ? max : cur.id, 1) + 1
  const newData = {
    id : newId,
    sensorID : req.body.sensorID,
    date : req.body.date,
    time : req.body.time,
    temperature : req.body.temperature,
    pressure : req.body.pressure }
    sensorData.push(newData)
    res.send('Data saved')
})

let server = app.listen(port, function() {
  console.log('Sensor data server started on ', port)
})