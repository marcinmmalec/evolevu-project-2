class Sensor {
  constructor(type, rate){
    this.type = type;
    this.rate = rate;
    this.value = 0;
    this.status = true;
    this.description = "";
  }

  enable() {
    this.state = true;
  }

  disable() {
    this.state = false;
  }

  setValue(newvalue) {
    this.value = newvalue;
  }

  getValue() {
    return this.value;
  }

  setType(type) {
    this.type = type;
  }

  getType() {
    return this.type;
  }

  setRate(rate) {
    this.rate = rate;
  }

  getRate() {
    return this.rate;
  }

  setDescription(newDescription) {
    this.description = newDescription;
  }

  getDescription() {
    return (this.description);
  }
}


module.exports = Sensor;