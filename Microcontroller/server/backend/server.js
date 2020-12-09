const { response, json } = require('express')
const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

const Sensor = require('./Microcontroller/backend/class/sensor')
const SensorNode = require('./Microcontroller/backend/class/sensor_node')

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