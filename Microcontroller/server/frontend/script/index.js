let sensorNodeArray = []




function loadGauges(nodeArray) {
  let nodeListContainer = document.getElementById("nodeListContainer")
  for (let i=0; i < nodeArray.length; i++) {
    nodeListContainer.appendChild(nodeArray[i].htmlElement)
  }
}

function mapSensorNode(sensorNode) {
  let outputObject = new FeSensorNode(sensorNode.id, sensorNode.location, sensorNode.description)
  outputObject.enable = sensorNode.enable;
  for (let i = 0; i < sensorNode.sensorArray.length; i++ ) {
    outputObject.addGauge(sensorNode.sensorArray[i].type)
    outputObject.gaugeArray.rate = sensorNode.sensorArray[i].rate
    outputObject.gaugeArray.value = sensorNode.sensorArray[i].value
    outputObject.gaugeArray.enable = sensorNode.sensorArray[i].enable
    outputObject.gaugeArray.description = sensorNode.sensorArray[i].description
  }
  return outputObject
}

function loadSensorsToPage() {
  fetch('http://localhost:3000/', {cache: 'no-store'})
  .then(response => response.json())
  .then(data => {
    sensorNodeArray = data.map(mapSensorNode)
    loadGauges(sensorNodeArray)
  })
  // fetch('http://localhost:3000/get/node/all', {cache: 'no-store'})
  // .then(response => response.json())
  // .then(data => {
  //   sensorNodeArray = data.map(mapSensorNode)
  //   loadGauges(sensorNodeArray)
  // })
}

function loadFunction() {
  debugger
  loadSensorsToPage()
  setInterval(updateGaugesValues, 1000)
}