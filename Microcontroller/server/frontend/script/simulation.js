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
  // gaugeNodeArray[0].gaugeArray[1].gauge.disable()
  let oldTemp = gaugeNodes[0].gauges[0].getValue()
  let oldPress = gaugeNodes[0].gauges[1].getValue()
  gaugeNodes[0].gauges[0].setValue(generateRandomTemperature(oldTemp))
  gaugeNodes[0].gauges[1].setValue(generateRandomTemperature(oldPress))
  oldTemp = gaugeNodes[1].gauges[0].getValue()
  oldPress = gaugeNodes[1].gauges[1].getValue()
  gaugeNodes[1].gauges[0].setValue(generateRandomTemperature(oldTemp))
  gaugeNodes[1].gauges[1].setValue(generateRandomTemperature(oldPress))
  oldTemp = gaugeNodes[2].gauges[0].getValue()
  oldPress = gaugeNodes[2].gauges[1].getValue()
  gaugeNodes[2].gauges[0].setValue(generateRandomTemperature(oldTemp))
  gaugeNodes[2].gauges[1].setValue(generateRandomTemperature(oldPress))
  oldTemp = gaugeNodes[3].gauges[0].getValue()
  oldPress = gaugeNodes[3].gauges[1].getValue()
  gaugeNodes[3].gauges[0].setValue(generateRandomTemperature(oldTemp))
  gaugeNodes[3].gauges[1].setValue(generateRandomTemperature(oldPress))

}
