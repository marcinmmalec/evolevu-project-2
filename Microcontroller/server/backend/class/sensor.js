class Sensor {
  constructor(type, rate){
    this.type = type;
    this.rate = rate;
    this.value = 22;
    this.enable = true;
    this.description = "";
  }
  // constructor(type, rate) {
  //   this.type = type;
  //   this.rate = rate;
  //   this.value = 0;
  //   this.enable = true;
  //   this.description = "";
  // }
  // constructor(type, rate, initialValue) {
  //   this.type = type;
  //   this.rate = rate;
  //   this.value = initialValue;
  //   this.enable = true;
  //   this.description = "";
  // }

  enable() {
    this.enable = true;
  }

  disable() {
    this.enable = false;
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

  setDescription(description) {
    this.description = description;
  }

  getDescription() {
    return this.description;
  }
}


module.exports = Sensor;