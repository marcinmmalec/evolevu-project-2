let gaugeNodes = []

function loadGaugeNodesToPage(gaugeArray) {
  let nodeListContainer = document.getElementById("nodeListContainer")
  console.log(gaugeArray)
  for (let i = 0; i < gaugeArray.length; i++) {
    nodeListContainer.appendChild(gaugeArray[i].htmlElement)
  }
}

function createGaugeNodeFromSensorNode(sensorNode) {
  let gaugeNode = new GaugeNode(sensorNode.id, sensorNode.location, sensorNode.description)
  console.log("sensorNode = ", sensorNode);
  if (sensorNode.status) {
    gaugeNode.enable()
  } else {
    gaugeNode.disable()
  }
  for (let i = 0; i < sensorNode.sensors.length; i++) {
    gaugeNode.addGauge(createGaugeFromSensor(sensorNode.id, sensorNode.sensors[i]))
  }
  console.log("gaugeNode =  ", gaugeNode);
  return gaugeNode
}

function createGaugeFromSensor(id, sensor) {
  let gauge = new Gauge(id, sensor.type)
  gauge.setRate(sensor.rate)
  gauge.setValue(sensor.value)
  gauge.setDescription(sensor.description)
  if (sensor.status) {
    gauge.enable()
  } else {
    gauge.disable()
  }

  // console.log(gauge);
  return gauge
}

function fetchSensorNodesIntoGaugeNodes() {
  fetch('http://localhost:3000/node/all', { cache: 'no-store' })
    .then(response => response.json())
    .then(data => {
      gaugeNodes = data.map(createGaugeNodeFromSensorNode)
      loadGaugeNodesToPage(gaugeNodes)
    })
}

function updateGaugesValues() {
  fetch('http://localhost:3000/node/data', { cache: 'no-store' })
    .then(response => response.json())
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        gaugeNodes[i].gauges[0].setValue(data[i].temperature)
        gaugeNodes[i].gauges[1].setValue(data[i].pressure)
      }
    })
}

function onLoadFunction() {
  fetchSensorNodesIntoGaugeNodes()
  hideNodeButtons()
  hideNodeFormArea()
  setInterval(updateGaugesValues, 5000)
}

function findGaugeNodesIndex(nodeId) {
  return (gaugeNodes.find(id => (id == nodeId)))
}

function deleteGaugeNodes(nodeId) {
  gaugeNodes.splice(findGaugeNodesIndex(nodeId), 1)
}

function updateGaugeNodes(nodeId, newGaugeObject) {
  let index = findGaugeNodesIndex(nodeId)
  Object.assign(gaugeNodes[Index], newGaugeObject)
}
