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
  temperature: Number,
  pressure: Number,
  time: Date
})

const sensorSchema = new Schema({
  type: String,
  rate: Number,
  status: Boolean,
  description: String,
})

const sensorNodeSchema = new Schema({
  id: Number,
  location: String,
  sensors: [sensorSchema],
  description: String,
  status: Boolean
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

assignNodesFromDbToSensorNodes()

let server = app.listen(port, function() {
  console.log('Sensor data server started on ', port)
})

app.get('/node/all', function(req, res) {
  try {
    console.log(sensorNodes);
    res.send(sensorNodes)
  } catch(error) {
    res.status(400).send('Cannot find sensor node')
  }
})

app.get('/node/data',function(req, res) {
  let datas = []
  for (let i = 0; i < sensorNodes.length; i++) {
    datas.push({temperature : sensorNodes[i].sensors[0].value, pressure : sensorNodes[i].sensors[1].value})
  }
  try {
    res.send(datas)
  } catch(error) {
    console.log(error)
    res.status(400).send('Cannot find sensor data')
  }
})

app.get('/node/:id', function(req, res) {
  try {
    let nodeInformation = sensorNodeArray[sensorNodeArray.findIndex(id => {id === nodeId})]
    res.send(nodeInformation)
  } catch(error) {
    console.log(error);
    res.status(400).send(`Cannot find sensor node ${nodeId}`)
  }
})

app.get('/node/:id/data', function(req, res) {
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

app.get('/node/:id/:at', async function(req, res) {

})

app.get('/node/:id/:from-:to', async function(req, res) {
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


app.post('/node/data', function(req, res) {
  try {
    console.log('Receive sensor data');
    console.log(sensorDataModel(req.body));
    let {id, time, temperature, pressure} = sensorDataModel(req.body)
    updateSensorNode(id, temperature, pressure)
    sensorDataModel(req.body)
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

app.post('/node/add', function(req, res) {
  try {
    addSensorNodes(sensorNodeModel(req.body))
    sensorNodeModel(req.body)
    .save()
    .then(() => res.send("new Node saved"))
    .then(console.log("new node is saved"))
  } catch(error) {
    res.send("unable to save new node")
    console.log("undable to save new node")
  }
})

app.patch('/node/update/:id', function(req, res) {
  try {
    const filter = {"id" : id}
    const updatedNode = new sensorNodeModel(req.body)
    
    .updateOne()
    .then(() => res.send("node") )
  } catch(error) {
    res.send("unable to update node ", id)
    console.log("unable to update node ", id);
  }
})

app.delete('node/delete/:id', function(req, res) {
  try {

  } catch(error) {
    res.send("unable to delete node ", id)
    console.log("unable to delete node ", id);
  }
})

async function assignNodesFromDbToSensorNodes() {
  let receivedNodes = await sensorNodeModel.find()
  
  for (let i = 0; i < receivedNodes.length; i++) {
    addSensorNodes(createSensorNodeFromModel(receivedNodes[i]))
  }
}

function createSensorNodeFromModel(nodeDbObject) {
  let newNode = new SensorNode(nodeDbObject.id, nodeDbObject.location, nodeDbObject.description)
  newNode.enable()
  for (let i = 0; i < nodeDbObject.sensors.length; i++) {
    newNode.addSensor(createSensorFromModel(nodeDbObject.sensors[i]))
  }
  return newNode
}

function createSensorFromModel(sensorDbObject) {
  let newSensor = new Sensor(sensorDbObject.type, sensorDbObject.rate)
  newSensor.setValue(0)
  if (sensorDbObject.status) {
    newSensor.enable()
  } else {
    newSensor.disable()
  }
  newSensor.setDescription(sensorDbObject.description)
  return newSensor
}

function printSensors(node) {
  for (let i = 0; i < node.sensors.length; i++) {
    console.log(node.sensors[i]);
  }
}

function getSensorNodeIndex(nodeId) {
  let index = 0
  for (let i = 0; i < sensorNodes.length; i++) {
    if (sensorNodes[i].id === nodeId)
      index = i
  }
  return index
}



function updateSensorNode(nodeId, temperature, pressure) {
  let index = getSensorNodeIndex(nodeId)
  updateTemperatureSensorNodeValue(index, temperature)
  updatePressureSensorNodeValue(index, pressure)
}

function updateTemperatureSensorNodeValue(index, temperature) {
  sensorNodes[index].sensors[0].value = temperature
}

function updatePressureSensorNodeValue(index, pressure) {
  sensorNodes[index].sensors[1].value = pressure
}

function findSensorNodesIndex(nodeId) {
  return (sensorNodes.find(id => (id == nodeId)))
}

function addSensorNodes(newSensorNodeObject) {
  sensorNodes.push(newSensorNodeObject)
}

function deleteSensorNodes(nodeId) {
  sensorNodes.splice(findSensorNodesIndex(nodeId), 1)
}

function updateSensorNodes(nodeId, newSensorNodeObject) {
  let index = findSensorNodesIndex(nodeId)
  Object.assign(sensorNodes[index], newSensorNodeObject)
}