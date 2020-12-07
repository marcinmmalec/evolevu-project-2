// import Sensor from './fe_gauge';
// const Sensor = require('./fe_gauge')

// const Sensor = require("../../backend/class/sensor");

class FeSensorNode {
  constructor(nodeId, location, description) {
    this.nodeId = nodeId;
    this.location = location;
    this.gaugeArray = []
    this.description = description;
    this.enable = true;
    this.htmlElement = "";
  }

  addGauge(type) {
    let gaugeObj = new FeGauge(this.nodeId, type)
    this.gaugeArray.push(gaugeObj)
    this.htmlElement = this.createNodeContainer()
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

  createNodeHeadingContainer() {
    let nodeContainerHeading = document.createElement("div")
    nodeContainerHeading.id = "nodeContainerHeading" + this.nodeId
    nodeContainerHeading.classList.add("row")
    nodeContainerHeading.classList.add("no-gutters")
    nodeContainerHeading.setAttribute("data-toggle", "collapse")
    nodeContainerHeading.setAttribute("role", "button")
    nodeContainerHeading.setAttribute("aria-expanded", "true")
    nodeContainerHeading.setAttribute("aria-controls", "nodeGaugesContainer" + this.nodeId)
    nodeContainerHeading.setAttribute("style", "display: flex; justify-content: space-around; font-size: x-large;")
    nodeContainerHeading.setAttribute("href", "#nodeGaugesContainer" + this.nodeId)
    let p1 = document.createElement("p")
    p1.textContent = this.description
    nodeContainerHeading.appendChild(p1)
    let p2 = document.createElement("p")
    p2.textContent = this.location
    nodeContainerHeading.appendChild(p2)
    return nodeContainerHeading
  }

  createNodeGaugesContainer() {
    let nodeGaugesContainter = document.createElement("div")
    nodeGaugesContainter.id = "nodeGaugesContainer" + this.nodeId
    nodeGaugesContainter.classList.add("row")
    nodeGaugesContainter.classList.add("collapse")
    for (let i = 0; i < this.gaugeArray.length; i++) {
      nodeGaugesContainter.appendChild(this.gaugeArray[i].htmlElement)
    }
    return nodeGaugesContainter
  }

  createNodeContainer() {
    let nodeContainerCol = document.createElement("div")
    nodeContainerCol.classList.add("col-sm-12")
    nodeContainerCol.appendChild(this.createNodeHeadingContainer(this.nodeId))
    nodeContainerCol.appendChild(this.createNodeGaugesContainer(this.nodeId))
  
    let nodeContainer = document.createElement("div")
    nodeContainer.id = "nodeContainer" + this.nodeId
    nodeContainer.classList.add("row")
    nodeContainer.classList.add("no-gutters")
    nodeContainer.appendChild(nodeContainerCol)
    return nodeContainer
  }

}

// module.exports = FeSensorNode