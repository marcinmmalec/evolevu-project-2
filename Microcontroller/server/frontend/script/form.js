function hideNodeId() {
  document.getElementById("nodeId").hidden = true
}

function showNodeId() {
  document.getElementById("nodeId").hidden = false
}

function hideNodeIdDropDown() {
  document.getElementById("nodeIdDropDown").hidden = true
}

function showNodeIdDropDown() {
  document.getElementById("nodeIdDropDown").hidden = false
}

function hideNodeFormArea() {
  document.getElementById("addNodeFormArea").hidden = true
}

function showNodeFormArea() {
  document.getElementById("addNodeFormArea").hidden = false
}

function hideAddNodeButton() {
  document.getElementById("addNodeButton").hidden = true
}

function showAddNodeButton() {
  let x = document.getElementById("addNodeButton").hidden = false
}

function hideDeleteNodeButton() {
  let x = document.getElementById("deleteNodeButton").hidden = true
  console.log("deleteNodeButton element = ", x);
}

function showDeleteNodeButton() {
  document.getElementById("deleteNodeButton").hidden = false
}

function hideUpdateNodeButton() {
  document.getElementById("updateNodeButton").hidden = true
}

function showUpdateNodeButton() {
  document.getElementById("updateNodeButton").hidden = false
}

function hideNodeButtons() {
  hideAddNodeButton()
  hideDeleteNodeButton()
  hideUpdateNodeButton()
}

function onMouseUpAddNode() {
  hideDeleteNodeButton()
  hideUpdateNodeButton()
  enableInputs()
  hideNodeIdDropDown()
  showNodeId()
  showAddNodeButton()
  showNodeFormArea()
}

function onMouseUpDeleteNode() {
  hideAddNodeButton()
  hideUpdateNodeButton()
  showDeleteNodeButton()
  disableInputs()
  hideNodeId()
  populateNodeIdDropDown()
  populateNodeForm(1)
  showNodeIdDropDown()
  showNodeFormArea()
}

function onMouseUpUpdateNode() {
  hideAddNodeButton()
  hideDeleteNodeButton()
  enableInputs()
  hideNodeId()
  populateNodeIdDropDown()
  populateNodeForm(1)
  showNodeIdDropDown()
  showUpdateNodeButton()
  showNodeFormArea()
}

function disableInputs() {
  document.getElementById("location").disabled = true
  document.getElementById("nodeDescription").disabled = true
  document.getElementById("inlineRadio1").disabled = true
  document.getElementById("inlineRadio2").disabled = true
  document.getElementById("sensor0Type").disabled = true
  document.getElementById("sensor0Rate").disabled = true
  document.getElementById("sensor0Description").disabled = true
  document.getElementById("sensor1Type").disabled = true
  document.getElementById("sensor1Rate").disabled = true
  document.getElementById("sensor1Description").disabled = true
}

function enableInputs() {
  document.getElementById("location").disabled = false
  document.getElementById("nodeDescription").disabled = false
  document.getElementById("inlineRadio1").disabled = false
  document.getElementById("inlineRadio2").disabled = false
  document.getElementById("sensor0Type").disabled = false
  document.getElementById("sensor0Rate").disabled = false
  document.getElementById("sensor0Description").disabled = false
  document.getElementById("sensor1Type").disabled = false
  document.getElementById("sensor1Rate").disabled = false
  document.getElementById("sensor1Description").disabled = false
}

function populateNodeIdDropDown() {
  let nodeIdDropDown = document.getElementById("nodeIdDropDown")
  nodeIdDropDown.innerHTML = ""
  for (let i = 0; i < gaugeNodes.length; i++) {
    let option = document.createElement("option")
    option.value = gaugeNodes[i].id
    option.textContent = gaugeNodes[i].id
    nodeIdDropDown.appendChild(option)
  }
}

function populateNodeForm(id) {
  let foundNode = gaugeNodes.find(node => (node.id == id))
  console.log(foundNode)
  document.getElementById("location").value = foundNode.location
  document.getElementById("nodeDescription").innerText = foundNode.description
  if (foundNode.status === true)
    document.getElementById("inlineRadio1").value = true
  else
    document.getElementById("inlineRadio2").value = true

  document.getElementById("sensor0Type").value = foundNode.gauges[0].type
  document.getElementById("sensor0Rate").value = foundNode.gauges[0].rate
  document.getElementById("sensor0Description").textContent = foundNode.gauges[0].description

  document.getElementById("sensor1Type").value = foundNode.gauges[1].type
  document.getElementById("sensor1Rate").value = foundNode.gauges[1].rate
  document.getElementById("sensor1Description").textContent = foundNode.gauges[1].description

}

function selectedDropDownId() {
  populateNodeForm(document.getElementById("nodeIdDropDown").value)
}

function clickAddButton() {
  gaugeNodes.push()
}

function clickDeleteButton() {
  let idToBeDeleted = document.getElementById("nodeIdDropDown").value
  let index = findGaugeNodesIndex(idToBeDeleted)
  gaugeNodes.splice(index, 1)
}

function clickUpdateButton() {

}

function clickCancelButton() {
  hideNodeFormArea()
}