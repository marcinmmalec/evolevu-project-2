class FeGauge {
  constructor(pageId, gaugeObject){
    this.type = "";
    this.rate = 0;
    this.value = 0;
    this.enable = true;
    this.description = "";
    this.pageId = pageId;
    this.gauge = gaugeObject;
  }

  updateValue(value) {
    this.value = value
    this.gauge.value = value;
  }

  enable() {
    this.enable = true;
  }

  disable() {
    this.enable = false;
  }

  setValue(newValue) {
    this.value = newValue
    this.gauge.value = newValue;
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


// module.exports = FeGauge;