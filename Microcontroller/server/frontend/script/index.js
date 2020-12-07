let sensorNodeArray = []
sensorNodeArray = [
  createSensorNode(1, "My Home", "Sensor Node 1"), 
  createSensorNode(2, "My Office", "Sensor Node 2"),
  createSensorNode(3, "Warehouse", "Sensor Node 3")
  ]
  

function createSensorNode(nodeId, location, description) {
  let sensorNode = new FeSensorNode(nodeId, location, description)
  // sensorNode.location = "My Home"
  sensorNode.pageId = "nodeContainer" + nodeId

  sensorNode.addGauge(createTemperatureGauge(nodeId))
  sensorNode.addGauge(createPressureGauge(nodeId))

  sensorNodeArray.push(sensorNode)

  return sensorNode
}


function createTemperatureGauge(nodeId) {
  let temperatureGauge = new FeGauge(nodeId,
    new RadialGauge(
      {
        renderTo: document.createElement('canvas'),
        width:160,
        height:160,
        units:"°C",
        title:"Temperature",
        minValue:-30,
        maxValue:70,
        majorTicks:[-30,-20,-10,0,10,20,30,40,50,60,70],
        minorTicks:5,
        strokeTicks:true,
        highlights:[ {"from": -30, "to": -10, "color": "rgba(0,0, 255, .5)"},
                      {"from": -10, "to": 0, "color": "rgba(0,0, 255, .25)"},
                      {"from": 40, "to": 50, "color": "rgba(255, 0, 0, .25)"},
                      {"from": 50, "to": 70, "color": "rgba(255, 0, 0, .50)"} ],
        ticksAngle:225,
        startAngle:67.5,
        colorMajorTicks:'rgba(0 ,0 ,0 ,0.4)',
        colorMinorTicks:'#ddd',
        colorTitle:'rgba(0 ,0 ,0 ,0.8)',
        colorUnits:'rgba(0 ,0 ,0 ,0.8)',
        colorNumbers:'rgba(0 ,0 ,0 ,0.8)',
        colorPlate:"white",
        borderShadowWidth:0,
        borders:true,
        needleType:"arrow",
        needleWidth:2,
        needleCircleSize:7,
        needleCircleOuter:true,
        needleCircleInner:false,
        colorBorderOuter:'rgba(192, 192, 192, 1)',
        colorBorderOuterEnd:'#111',
        colorBorderMiddle:'rgba(192, 192, 192, 1)',
        colorBorderMiddleEnd:'#111',
        colorBorderInner:'rgba(192, 192, 192, 1)',
        colorBorderInnerEnd:"#333",
        colorNeedleShadowDown:'#333',
        colorNeedleCircleOuter:'#333',
        colorNeedleCircleOuterEnd:'#111',
        colorNeedleCircleInner:'#111',
        colorNeedleCircleInnerEnd:'#222',
        valueBoxBorderRadius:0,
        colorValueBoxRect:'#222',
        colorValueBoxRectEnd:'#333',
        valueBox: true,
        animationRule: 'bounce',
        animationDuration: 500,
        value: 20.5
      }
    )
  )
  temperatureGauge.description = "Temperature sensor " + nodeId
  temperatureGauge.pageId = "temperatureGauge" + nodeId
  temperatureGauge.setValue(generateRandomTemperature(22.6))

  return temperatureGauge
}

function createPressureGauge(nodeId) {
  let pressureGauge = new FeGauge(nodeId,
    new RadialGauge(
      {
        renderTo: document.createElement('canvas'),
        width:160,
        height:160,
        units:"kPa",
        title:"Pressure",
        minValue:65,
        maxValue:105,
        majorTicks:[65, 75, 85, 95, 105],
        minorTicks:5,
        strokeTicks:true,
        highlights:[{"from":65 , "to": 105, "color": "rgba(0,100, 255, .3)"}],
        ticksAngle:225,
        startAngle:67.5,
        colorMajorTicks:'rgba(0 ,0 ,0 ,0.4)',
        colorMinorTicks:'#ddd',
        colorTitle:'rgba(0 ,0 ,0 ,0.4)',
        colorUnits:'rgba(0 ,0 ,0 ,0.4)',
        colorNumbers:'rgba(0 ,0 ,0 ,0.4)',
        colorPlate:"white",
        borderShadowWidth:0,
        borders:true,
        needleType:"arrow",
        needleWidth:2,
        needleCircleSize:7,
        needleCircleOuter:true,
        needleCircleInner:false,
        colorBorderOuter:'rgba(192, 192, 192, 1)',
        colorBorderOuterEnd:'#111',
        colorBorderMiddle:'rgba(192, 192, 192, 1)',
        colorBorderMiddleEnd:'#111',
        colorBorderInner:'rgba(192, 192, 192, 1)',
        colorBorderInnerEnd:"#333",
        colorNeedleShadowDown:'#333',
        colorNeedleCircleOuter:'#333',
        colorNeedleCircleOuterEnd:'#111',
        colorNeedleCircleInner:'#111',
        colorNeedleCircleInnerEnd:'#222',
        valueBoxBorderRadius:0,
        colorValueBoxRect:'#222',
        colorValueBoxRectEnd:'#333',
        valueBox: true,
        animationRule: 'bounce',
        animationDuration: 500,
        // fontValueSize: 28,
        // valueBoxWidth: 1,
        valueDec: 3,
        value: 88.786
      }
    )
  )
  pressureGauge.description = "Presure sensor " + nodeId
  pressureGauge.pageId = "pressureGauge" + nodeId
  pressureGauge.setValue(generateRandomPressure(87.257))

  return pressureGauge
}

function createNodeContainerHeading(nodeId) {
  let nodeContainerHeading = document.createElement("div")
  nodeContainerHeading.id = "nodeContainerHeading" + nodeId
  nodeContainerHeading.classList.add("row")
  nodeContainerHeading.classList.add("no-gutters")
  nodeContainerHeading.setAttribute("data-toggle", "collapse")
  nodeContainerHeading.setAttribute("role", "button")
  nodeContainerHeading.setAttribute("aria-expanded", "true")
  nodeContainerHeading.setAttribute("aria-controls", "nodeGaugesContainer" + nodeId)
  nodeContainerHeading.setAttribute("style", "display: flex; justify-content: space-around; font-size: x-large;")
  nodeContainerHeading.setAttribute("href", "#nodeGaugesContainer" + nodeId)
  let p1 = document.createElement("p")
  p1.textContent = sensorNodeArray[nodeId].description
  nodeContainerHeading.appendChild(p1)
  let p2 = document.createElement("p")
  p2.textContent = sensorNodeArray[nodeId].location
  nodeContainerHeading.appendChild(p2)
  return nodeContainerHeading
}

function createNodeGaugesContainer(nodeId) {
  let nodeGaugesContainter = document.createElement("div")
  nodeGaugesContainter.id = "nodeGaugesContainer" + nodeId
  nodeGaugesContainter.classList.add("row")
  nodeGaugesContainter.classList.add("collapse")
  nodeGaugesContainter.appendChild(createTemperatureGaugeContainer(nodeId))
  nodeGaugesContainter.appendChild(createPressureGaugeContainer(nodeId))
  return nodeGaugesContainter
}

function createTemperatureGaugeContainer(nodeId) {
  let temperatureGaugeContainer = document.createElement("div")
  temperatureGaugeContainer.id = "temperatureGaugeContainer" + nodeId
  temperatureGaugeContainer.classList.add("col-sm-6")
  temperatureGaugeContainer.appendChild(sensorNodeArray[nodeId].gaugeArray[0].gauge.options.renderTo)
  sensorNodeArray[nodeId].gaugeArray[0].gauge.draw()
  return temperatureGaugeContainer
}

function createPressureGaugeContainer(nodeId) {
  let pressureGaugeContainer = document.createElement("div")
  pressureGaugeContainer.id = "pressureGaugeContainer" + nodeId
  pressureGaugeContainer.classList.add("col-sm-6")
  pressureGaugeContainer.appendChild(sensorNodeArray[nodeId].gaugeArray[1].gauge.options.renderTo)
  sensorNodeArray[nodeId].gaugeArray[1].gauge.draw()
  return pressureGaugeContainer
}

function createNodeContainer(nodeId) {
  let nodeContainerCol = document.createElement("div")
  nodeContainerCol.classList.add("col-sm-12")
  nodeContainerCol.appendChild(createNodeContainerHeading(nodeId))
  nodeContainerCol.appendChild(createNodeGaugesContainer(nodeId))

  let nodeContainer = document.createElement("div")
  nodeContainer.id = "nodeContainer" + nodeId
  nodeContainer.classList.add("row")
  nodeContainer.classList.add("no-gutters")
  nodeContainer.appendChild(nodeContainerCol)
  return nodeContainer
}

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
}


function loadGauges() {
  let nodeListContainer = document.getElementById("nodeListContainer")
  for (let i=0; i < sensorNodeArray.length; i++) {
    // debugger
    nodeListContainer.appendChild(createNodeContainer(i))
  }
}

function loadSensorsToPage() {
  fetch('http://localhost:3000/nodes', {cache: 'no-store'})
  .then(response => response.json())
  .then(sensorNodes => loadSensorNodes(sensorNodes))
}

function loadSensors(nodeSensors)

function loadFunction() {
  loadGauges()
  setInterval(updateGaugesValues, 5000)
}