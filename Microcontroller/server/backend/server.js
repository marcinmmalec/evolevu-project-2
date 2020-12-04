const { response, json } = require('express')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

const mongoose = require('mongoose')

// console.log('Try to connect to database...')
mongoose.connect("mongodb://localhost:27017/sensor-data", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
  // ,useFindAndModify: false
}).catch(error => {
  console.log("Unable to connect to database");
  // console.log(error);
  process.exit(1)
})

const Schema = mongoose.Schema;

const sensorDataSchema = new Schema({
  sensorId: Number,
  time: Date,
  temperature: Number,
  pressure: Number
})

let sensorDataModel = mongoose.model("sensordatas", sensorDataSchema)

let sensorDataArray = []
let newData = {};

app.get('/', function(req, res) {
  res.status(200).send('Sensor is not available yet');
})


app.get('/getdata/:sensorId', async function(req, res) {
  const id = req.params.sensorId
  // console.log('requested sensor id ', sensorId)
  // const filter = {$and: [{"sensorId" : {$lte: 2}}, {"sensorId" : {$gte: 1}}]}
  const filter = { "sensorId" : id}
  const allsensordata = await sensorDataModel.find(filter)
  // console.log(allsensordata);

  res.send(allsensordata)

  // console.log('Sending last sensor data')
  // if (Object.keys(newData).length != 0) {
  //   res.send(newData)
  // } else {
  //   res.send('Will fetch data from database')
  //   console.log("Will fetch data from database");
  // }
})


app.post('/postdata', function(req, res) {
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