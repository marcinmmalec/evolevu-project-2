const { response, json } = require('express')
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000


const Sensor = require('./class/sensor')
const SensorNode = require('./class/sensor_node')

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

app.use(express.json())
app.use(express.static('../frontend'))

const mongoose = require('mongoose')
const { restart } = require('nodemon')
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


// console.log('Try to connect to database...')
// mongoose.connect("mongodb://localhost:27017/sensor-data", {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   useCreateIndex: true
//   // ,useFindAndModify: false
// }).catch(error => {
//   console.log("Unable to connect to database");
//   // console.log(error);
//   process.exit(1)
// })

// app.get('/', function(req, res) {
//   res.status(200).sendFile(index.html)
// })

app.get(['/', '/get/node/all'], function(req, res) {
  // try {
    res.send(sensorNodeArray);
  // } catch(error) {
    // console.log(error)
    // res.status(400).send('Cannot find any sensor node')
  // }
})

app.get('/get/node/:nodeId', function(req, res) {
  try {
    let nodeInformation = sensorNodeArray[sensorNodeArray.findIndex(id => {id === nodeId})]
    res.send(nodeInformation)
  } catch(error) {
    console.log(error);
    res.status(400).send(`Cannot find sensor node ${nodeId}`)
  }
})

app.get('/get/node/:nodeId/data', function(req, res) {
  try {
    let nodeInformation = sensorNodeArray[sensorNodeArray.findIndex(id => {id === nodeId})]
    let temperature = nodeInformation.sensorArray.temperature;
    let pressure = nodeInformation.sensorArray.pressure
    res.send({temperature, pressure})
  } catch(error) {
    console.log(error);
    res.status(400).send('Cannot find temperature and pressure data')
  }
})

app.get('/get/node/:nodeId/:at', async function(req, res) {

})

app.get('/get/node/:nodeId/:from-:to', async function(req, res) {
  const id = req.params.nodeId
  // console.log('requested sensor id ', nodeId)
  // const filter = {$and: [{"nodeId" : {$lte: 2}}, {"nodeId" : {$gte: 1}}]}
  const filter = { "nodeId" : id}
  // let allsensordata = sensorDataModel.find(filter).then(res.send(allsensordata))
  // filter.then(filter => allsensordata = sensorDataModel.find(filter))
  const allsensordata = await sensorDataModel.find(filter)
  // allsensordata.forEach(dataObject => {
  //   let {nodeId, time, temperature, pressure} = dataObject;
  //   console.log(`Sensor ID : ${nodeId}`);
  //   console.log(`Date and Time : ${time}`);
  //   console.log(`Temperature : ${temperature}C`);
  //   console.log(`Pressure : ${pressure}kPa`);
  // })
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


app.post('/post/node/data', function(req, res) {
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
  // const newId = getNewId();
  // const newData = {
  //   id : newId,
  //   nodeId : req.body.nodeId,
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