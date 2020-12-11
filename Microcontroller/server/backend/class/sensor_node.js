const Sensor = require('./sensor')

class SensorNode {
  constructor(id, location, description) {
    this.id = id;
    this.location = location;
    this.sensors = []
    this.description = description;
    this.status = true
  }

  addSensor(sensorObj) {
    this.sensors.push(sensorObj)
  }

  enable() {
    this.status = true;
  }

  disable() {
    this.status = false;
  }

  status() {
    return this.status
  }

  setLocation(location) {
    this.location = location;
  }

  getLocation() {
    return this.location;
  }

  setDescription(newDescription) {
    this.description = newDescription;
  }

  getDescription() {
    return this.description
  }
}

module.exports = SensorNode