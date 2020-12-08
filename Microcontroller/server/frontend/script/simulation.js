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
