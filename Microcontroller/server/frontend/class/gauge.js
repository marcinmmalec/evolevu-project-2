// const { debug } = require("request");

class Gauge {
  constructor(nodeId, type){
    this.type = type;
    this.rate = 0;
    this.value = 0;
    this.status = true;
    this.description = "";
    if (type === "Temperature") {
      this.gauge = this.createTemperatureGauge();
      this.htmlElement = this.createTemperatureGaugeContainer(nodeId)
    } else if (type === "Pressure") {
      this.gauge = this.createPressureGauge()
      this.htmlElement = this.createPressureGaugeContainer(nodeId)
    }
  }

  updateValue(value) {
    this.value = value
    this.gauge.value = value;
  }

  enable() {
    this.status = true;
  }

  disable() {
    this.status = false;
  }

  setValue(Value) {
    this.value = Value
    this.gauge.value = Value;
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

  createTemperatureGauge() {
    let temperatureGauge = new RadialGauge(
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
        value: 0
      }
    )
    return temperatureGauge
  }

  createPressureGauge() {
    let pressureGauge = new RadialGauge(
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
    return pressureGauge
  }

  createTemperatureGaugeContainer(nodeId) {
    let temperatureGaugeContainer = document.createElement("div")
    temperatureGaugeContainer.id = "temperatureGaugeContainer" + nodeId
    temperatureGaugeContainer.classList.add("col-sm-6")
    temperatureGaugeContainer.appendChild(this.gauge.options.renderTo)
    this.gauge.draw()
    return temperatureGaugeContainer
  }  

  createPressureGaugeContainer(nodeId) {
    let pressureGaugeContainer = document.createElement("div")
    pressureGaugeContainer.id = "pressureGaugeContainer" + nodeId
    pressureGaugeContainer.classList.add("col-sm-6")
    pressureGaugeContainer.appendChild(this.gauge.options.renderTo)
    this.gauge.draw()
    return pressureGaugeContainer
  }

}


// module.exports = Gauge;