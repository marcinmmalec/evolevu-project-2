let gaugeNodes = []

function createGauges(nodeArray) {
  let nodeListContainer = document.getElementById("nodeListContainer")
  for (let i=0; i < nodeArray.length; i++) {
    nodeListContainer.appendChild(nodeArray[i].htmlElement)
  }
}

function mapSensorNode(sensorNode) {
  let outputObject = new GaugeNode(sensorNode.id, sensorNode.location, sensorNode.description)
  outputObject.enable = sensorNode.enable;
  for (let i = 0; i < sensorNode.sensors.length; i++ ) {
    outputObject.addGauge(sensorNode.sensors[i].type)
    outputObject.gauges[i].rate = sensorNode.sensors[i].rate
    outputObject.gauges[i].value = sensorNode.sensors[i].value
    outputObject.gauges[i].enable = sensorNode.sensors[i].enable
    outputObject.gauges[i].description = sensorNode.sensors[i].description
  }
  return outputObject
}

function loadGaugesToPage() {
  fetch('http://localhost:3000/get/node/all', {cache: 'no-store'})
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    gaugeNodes = data.map(mapSensorNode)
    // console.log(gaugeNodes)
    createGauges(gaugeNodes)
  })
}

function updateGaugesValues(){
  fetch('http://localhost:3000/get/node/data', {cache: 'no-store'})
  .then(response => response.json())
  .then(data => {
    console.log("Incoming data = ", data);
    // console.log("gaugeNodes data = ", gaugeNodes)
    for (let i = 0; i < data.length; i++) {
      gaugeNodes[i].gauges[0].setValue(data[i].temperature)
      gaugeNodes[i].gauges[1].setValue(data[i].pressure)
    }
    console.log(gaugeNodes)
  })
}

function onloadFunction() {
  loadGaugesToPage()
  setInterval(updateGaugesValues, 5000)
}