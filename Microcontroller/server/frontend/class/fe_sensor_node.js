// import Sensor from './fe_gauge';
// const Sensor = require('./fe_gauge')

class FeSensorNode {
  constructor(id, location, description) {
    this.id = id;
    this.location = location;
    this.gaugeArray = []
    this.description = description;
    this.enable = true;
    // this.pageId = ""
  }

  addGauge(gaugeObj) {
    this.gaugeArray.push(gaugeObj)
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

// module.exports = FeSensorNode