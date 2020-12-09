const Sensor = require('./sensor')

class SensorNode {
  constructor(id, location, description) {
    this.id = id;
    this.location = location;
    this.sensors = []
    this.description = description;
    this.enable = true
  }

  addSensor(sensorObj) {
    this.sensors.push(sensorObj)
  }

  enable() {
    this.enable = true;
  }

  disable() {
    this.enable = false;
  }

  setLocation(location) {
    this.location = location;
  }

  getLocation() {
    return this.location;
  }

  setDescription(description) {
    this.description = description;
  }

  getDescription() {
    return this.description
  }
}

module.exports = SensorNode