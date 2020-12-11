// import Sensor from './fe_gauge';
// const Sensor = require('./fe_gauge')

// const Sensor = require("../../backend/class/sensor");

class GaugeNode {
  constructor(id, location, description) {
    this.id = id;
    this.location = location;
    this.gauges = []
    this.description = description;
    this.status = true;
    this.htmlElement = "";
  }

  addGauge(gaugeObj) {
    this.gauges.push(gaugeObj)
    this.htmlElement = this.createNodeContainer()
  }

  enable() {
    this.status = true;
  }

  disable() {
    this.status = false;
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
    nodeContainerHeading.id = "nodeContainerHeading" + this.id
    nodeContainerHeading.classList.add("row")
    nodeContainerHeading.classList.add("no-gutters")
    nodeContainerHeading.setAttribute("data-toggle", "collapse")
    nodeContainerHeading.setAttribute("role", "button")
    nodeContainerHeading.setAttribute("aria-expanded", "true")
    nodeContainerHeading.setAttribute("aria-controls", "nodeGaugesContainer" + this.id)
    nodeContainerHeading.setAttribute("style", "display: flex; justify-content: space-around; font-size: x-large;")
    nodeContainerHeading.setAttribute("href", "#nodeGaugesContainer" + this.id)
    let p1 = document.createElement("p")
    p1.textContent = this.description
    nodeContainerHeading.appendChild(p1)
    let p2 = document.createElement("p")
    p2.textContent = this.location
    nodeContainerHeading.appendChild(p2)
    return nodeContainerHeading
  }

  createNodeGaugesContainer() {
    let nodeGaugesContainer = document.createElement("div")
    nodeGaugesContainer.id = "nodeGaugesContainer" + this.id
    nodeGaugesContainer.classList.add("row")
    nodeGaugesContainer.classList.add("collapse")
    for (let i = 0; i < this.gauges.length; i++) {
      nodeGaugesContainer.appendChild(this.gauges[i].htmlElement)
    }
    return nodeGaugesContainer
  }

  createNodeContainer() {
    let nodeContainerCol = document.createElement("div")
    nodeContainerCol.classList.add("col-sm-12")
    nodeContainerCol.appendChild(this.createNodeHeadingContainer(this.id))
    nodeContainerCol.appendChild(this.createNodeGaugesContainer(this.id))
  
    let nodeContainer = document.createElement("div")
    nodeContainer.id = "nodeContainer" + this.id
    nodeContainer.classList.add("row")
    nodeContainer.classList.add("no-gutters")
    nodeContainer.appendChild(nodeContainerCol)
    return nodeContainer
  }

}

// module.exports = GaugeNode