let sensorNodeArray = []

function generateRandomTemperature(initialTemp) {
  let x = (Math.round(Math.random() * 200) - 100) / 100
  let newValue = initialTemp + x
  let returnValue = 0
  if (newValue > -30 || newValue < 70) {
    returnValue = newValue
  }
  else {
    returnValue =  initialTemp - x
  }
  return returnValue
}


function generateRandomPressure(initialPress) {
  let x = (Math.round(Math.random() *2000) - 1000) / 1000
  let newValue = initialPress + x
  let returnValue = 0
  if (newValue > 65 || newValue < 105) {
    returnValue = newValue
  }
  else {
    returnValue = initialPress - x
  }
  return returnValue
}


function updateGaugesValues() {
  // sensorNodeArray[0].gaugeArray[1].gauge.disable()
  let oldTemp = sensorNodeArray[0].gaugeArray[0].getValue()
  let oldPress = sensorNodeArray[0].gaugeArray[1].getValue()
  sensorNodeArray[0].gaugeArray[0].setValue(generateRandomTemperature(oldTemp))
  sensorNodeArray[0].gaugeArray[1].setValue(generateRandomTemperature(oldPress))
  oldTemp = sensorNodeArray[1].gaugeArray[0].getValue()
  oldPress = sensorNodeArray[1].gaugeArray[1].getValue()
  sensorNodeArray[1].gaugeArray[0].setValue(generateRandomTemperature(oldTemp))
  sensorNodeArray[1].gaugeArray[1].setValue(generateRandomTemperature(oldPress))
  oldTemp = sensorNodeArray[2].gaugeArray[0].getValue()
  oldPress = sensorNodeArray[2].gaugeArray[1].getValue()
  sensorNodeArray[2].gaugeArray[0].setValue(generateRandomTemperature(oldTemp))
  sensorNodeArray[2].gaugeArray[1].setValue(generateRandomTemperature(oldPress))
  oldTemp = sensorNodeArray[3].gaugeArray[0].getValue()
  oldPress = sensorNodeArray[3].gaugeArray[1].getValue()
  sensorNodeArray[3].gaugeArray[0].setValue(generateRandomTemperature(oldTemp))
  sensorNodeArray[3].gaugeArray[1].setValue(generateRandomTemperature(oldPress))

}


function loadGauges(nodeArray) {
  console.log(nodeArray)
  let nodeListContainer = document.getElementById("nodeListContainer")
  for (let i=0; i < nodeArray.length; i++) {
    nodeListContainer.appendChild(nodeArray[i].htmlElement)
  }
}

function mapSensorNode(sensorNode) {
  let outputObject = new FeSensorNode(sensorNode.id, sensorNode.location, sensorNode.description)
  outputObject.enable = sensorNode.enable;

  outputObject.addGauge(sensorNode.sensorArray[0].type)
  outputObject.gaugeArray[0].rate = sensorNode.sensorArray[0].rate
  outputObject.gaugeArray[0].value = sensorNode.sensorArray[0].value
  outputObject.gaugeArray[0].enable = sensorNode.sensorArray[0].enable
  outputObject.gaugeArray[0].description = sensorNode.sensorArray[0].description
  
  outputObject.addGauge(sensorNode.sensorArray[1].type)
  outputObject.gaugeArray[1].rate = sensorNode.sensorArray[1].rate
  outputObject.gaugeArray[1].value = sensorNode.sensorArray[1].value
  outputObject.gaugeArray[1].enable = sensorNode.sensorArray[1].enable
  outputObject.gaugeArray[1].description = sensorNode.sensorArray[1].description

  return outputObject
}

function loadSensorsToPage() {
  fetch('http://localhost:8080/nodes', {cache: 'no-store'})
  .then(response => response.json())
  .then(data => {
    sensorNodeArray = data.map(mapSensorNode)
    loadGauges(sensorNodeArray)
  })
}

function loadFunction() {
  loadSensorsToPage()
  setInterval(updateGaugesValues, 1000)
}