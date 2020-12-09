const { response, json } = require('express')
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000


const Sensor = require('./class/sensor')
const SensorNode = require('./class/sensor_node')

let sensorNodes = []

app.use(express.json())
app.use(express.static('../frontend'))

const mongoose = require('mongoose')
const { restart } = require('nodemon')
const Schema = mongoose.Schema;

const sensorDataSchema = new Schema({
  id: Number,
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
  sensors: [sensorSchema],
  description: String,
  enable: Boolean
})

let sensorDataModel = mongoose.model("sensordatas", sensorDataSchema)
let sensorModel = mongoose.model("sensorModels", sensorSchema)
let sensorNodeModel = mongoose.model("nodes", sensorNodeSchema)


mongoose.connect("mongodb://localhost:27017/sensor_database", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
  ,useFindAndModify: false
}).catch(error => {
  console.log("Unable to connect to database");
  console.log(error);
  process.exit(1)
})

getNodeFromDB()




let server = app.listen(port, function() {
  console.log('Sensor data server started on ', port)
})




app.get('/get/node/all', function(req, res) {
  try {
    console.log(sensorNodes);
    res.send(sensorNodes)
  } catch(error) {
    res.status(400).send('Cannot find sensor node')
  }
})

app.get('/get/node/data',function(req, res) {
  let datas = []
  for (let i = 0; i < sensorNodes.length; i++) {
    datas.push({temperature : sensorNodes[i].sensors[0].value, pressure : sensorNodes[i].sensors[1].value})
  }
  console.log(datas);
  try {
    res.send(datas)
  } catch(error) {
    console.log(error)
    res.status(400).send('Cannot find sensor data')
  }
})

app.get('/get/node/:id', function(req, res) {
  try {
    let nodeInformation = sensorNodeArray[sensorNodeArray.findIndex(id => {id === nodeId})]
    res.send(nodeInformation)
  } catch(error) {
    console.log(error);
    res.status(400).send(`Cannot find sensor node ${nodeId}`)
  }
})

app.get('/get/node/:id/data', function(req, res) {
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

app.get('/get/node/:id/:at', async function(req, res) {

})

app.get('/get/node/:id/:from-:to', async function(req, res) {
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
      newSensorData = new sensorDataModel(req.body)
      let {id, time, temperature, pressure} = newSensorData
      updateSensorNodes(id, temperature, pressure)
      newSensorData
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


async function getNodeFromDB() {
  let receivedNodes = await sensorNodeModel.find()
  for (let i = 0; i < receivedNodes.length; i++) {
    let newNode = new SensorNode(receivedNodes[i].id, receivedNodes[i].location, receivedNodes[i].description)
    newNode.enable = receivedNodes[i].enable
    for (let j = 0; j < receivedNodes[i].sensors.length; j++) {
      let sensor = new Sensor(receivedNodes[i].sensors[j].type, receivedNodes[i].sensors[j].rate)
      sensor.value = 0
      sensor.enable = receivedNodes[i].sensors[j].enable
      sensor.description = receivedNodes[i].sensors[j].description
      newNode.sensors.push(sensor)
      
    }
    // printSensors(newNode)
    sensorNodes.push(newNode)
  }
  // console.log(sensorNodes[3]);
}


function printSensors(node) {
  for (let i = 0; i < node.sensors.length; i++) {
    console.log(node.sensors[i]);
  }
}

function getSensorNodesIndex(nodeId) {
  let index = 0
  for (let i = 0; i < sensorNodes.length; i++) {
    if (sensorNodes[i].id === nodeId)
      index = i
  }
  return index
}


function updateSensorNodes(nodeId, temperature, pressure) {
  // console.log(nodeId, temperature, pressure );
  let index = getSensorNodesIndex(nodeId)
  // console.log(index)
  sensorNodes[index].sensors[0].value = temperature
  sensorNodes[index].sensors[1].value = pressure
  console.log(sensorNodes[index].sensors);
}