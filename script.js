$(document).ready(function(){
  var instructions_list = $('#instructions_list');
  var closeModal = $('.close');
  var transfer_form = $('#transfer_form');
  var distribute_form = $("#distribute_form");
  var pipette_config = $("#pipette_config");
  var containers = [];
  var currentShowing = null;
  var allInstructions = [];
  var current_instructions = $("#current_instructions");
  var $container = $("<li></li>", {id: "foo", "class": "a"});
  var showPipette = $("#showPipette");
  var showInstructions = $("#showInstructions");
  var containerButtons = $(".con-buttons");
  var finishButton = $("#finishAll");
  showPipette.hide();
  showInstructions.hide();

  function instructionObj(name, details, pythonCode){
    this.name = name;
    this.details = details;
    this.pythonCode = pythonCode;
  }
  finishButton.on('click', function(e){
    var string = "";
    for(const i of allInstructions){
      string += "\n";
      string += i.pythonCode;
      console.log(string);
    }
  });
  function addInstruction(instructionName, details, pythonCode){
    console.log("added instruction: " + instructionName);
    var thisInstruction = new instructionObj(instructionName, details, pythonCode);
    allInstructions.push(thisInstruction);
    var newContainer = document.createElement("li");
    newContainer.innerHTML = details;
    document.getElementById("current_instructions").appendChild(newContainer);
    console.log(allInstructions);
  }
  $("#submitPipette").on('click', function(e){
    var channels, axis, tipsrack, trash, maxvol, minvol;
    channels = $("#pipette_channels").val();
    axis = $("#pipette_axis").val();
    tipsrack = $("pipette_tiprack").val();
    trash = $("pipette_trash").val();
    maxvol = $("pipette_maxvol").val();
    minvol = $("pipette_minvol").val();
    var pythonCode = "m200 = instruments.Pipette(name=\"m200\", trash_container=";
    pythonCode += trash+", tip_racks=["+tipsrack+"],min_volume=";
    pythonCode += minvol+",max_volume="+maxvol+",axis="+axis+",channels="+channels+")";
    addInstruction("Add Pipette", "Add pipette with ", pythonCode);
    showPipette.hide();
    showInstructions.show();
  });
  $("#goToPipette").on('click', function(e){
    containerButtons.hide();
    for(const cont of containers){

    }
    showPipette.show();
  });
  $('#pipette_configBtn').on('click', function(e){
    if(currentShowing){
          hideCurrent();
    }
    currentShowing = pipette_config;
    pipette_config.show();
  });
  $('#new_instruction').on('click', function(e){
    e.preventDefault();
    instructions_list.show();
    currentShowing = instructions_list;
    console.log("Adding new instruction...");
  });
  $(".selectInstruction").on('click', function(e){
    e.preventDefault();
    instructions_list.hide();
    if(e.target.id === "transfer"){
      currentShowing = transfer_form;
      transfer_form.show();
    }
    else if(e.target.id === "distribute"){
      currentShowing = distribute_form;
      distribute_form.show();
    }
    console.log("Instruction selected: " + e.target.id);
  });
  function hideCurrent(){
    currentShowing.hide();
    currentShowing = null;
  }
  $(".addInstructionButton").on('click', function(e){
    e.preventDefault();
    if(e.target.id === "transfer_submit"){
      //transfer_form;
      var amount, fromType, fromVal, toType, toVal;
      amount = $("#transfer_amount").val();
      fromType = $("#transfer_from_type").val();
      fromVal = $("#transfer_from_val").val();
      toType = $("#transfer_to_type").val();
      toVal = $("#transfer_to_val").val();
      if(fromVal == "" || toVal == ""){
        alert("Please enter values for FROM and TO");
        return;
      }
      console.log("Amount: " + amount + "\n From Type: " + fromType + " \n From Value: " + fromVal
        + "\n To Type: " + toType + " \n To Value: " + toVal);
      var details = "Transferring: " + amount + "uL from: " + fromType + " " + fromVal + " to " + toType +
      " " + toVal;
      var pythonLine = "pipette.transfer(" + amount + ", plate." + fromType+ "('" + fromVal + "'), plate."
        + toType + "('" + toVal + "'))";
      addInstruction("Transfer", details, pythonLine);
      console.log(pythonLine);
    }
    else if(e.target.id === "distribute_submit"){
      var amount, fromType, fromVal, toType, toVal;
      amount = $("#distribute_amount").val();
      fromType = $("#distribute_from_type").val();
      fromVal = $("#distribute_from_val").val();
      toType = $("#distribute_to_type").val();
      toVal = $("#distribute_to_val").val();
      console.log("Amount: " + amount + "\n From Type: " + fromType + " \n From Value: " + fromVal
        + "\n To Type: " + toType + " \n To Value: " + toVal);

      var pythonLine = "pipette.transfer(" + amount + ", plate." + fromType+ "('" + fromVal + "'), plate."
        + toType + "('" + toVal + "'))";
      console.log(pythonLine);
      hideCurrent();
    }
  });
  closeModal.on('click', function(e){
    hideCurrent();
  });
  $(".goBackToInstructions").on("click", function(e){
    hideCurrent();
    instructions_list.show();
    currentShowing = instructions_list;
  });
  $(window).click(function(e){
    if(e.target == instructions_list){
      hideCurrent();
    }
  });
  $('a[href^="#"]').on('click', function(e){
    e.preventDefault();
    var target = this.hash;
    var $target = $(target);

    $('html, body').stop().animate({
      'scrollTop': $target.offset().top - 148
    }, 900, 'swing', function() {
      window.location.has = target;
    });
  });


// Handles actions when box is clicked
function changeToClicked(event) {
  const container = event.currentTarget;
  const clickedChoice = container.dataset.choiceId;
  for (const box of boxes) {
    if (box.dataset.choiceId == clickedChoice) {
      container.style.backgroundColor = "#7aa8e8";
      choice = box.dataset.choiceId;
    }
    else {
      box.style.backgroundColor = "#5391e8";
    }
  }
  openNav();
}

function containerClicked(event) {
  const button = event.currentTarget;
  const clickedCont = button.dataset.container;
  const theThird = button.dataset.third;
  const myContainers = document.querySelectorAll('.container-button');
  for (const cont of myContainers) {
    if (cont.dataset.container == clickedCont) {
      button.style.backgroundColor = "#7aa8e8";
      well = clickedCont;
      thirdVal = theThird;
      containers.add(well);
      pythonString = "thisContainer = container.load(\'" + well + "\', \'" + choice + "\', \'" + thirdVal + "\');";
      addInstruction("loadContainer", "Assigned container (" + well + ") to " + choice , pythonString);
    }
    else {
      cont.style.backgroundColor = "#5391e8";
    }
  }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    const myContainers = document.querySelectorAll('.container-button');
    for (const singleContainer of myContainers) {
      singleContainer.addEventListener('click', containerClicked);
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
}
//Disables clicking on all boxes
/*function disableAll() {
  for (const box of boxes) {
    box.removeEventListener('click', changeToClicked);
  }
}*/

var choice;
const boxes = document.querySelectorAll('.choice-grid div');
var well;
var thirdVal;
var pythonString;
const wells = ["12-Well-Plate", "24-Vial-Rack", "48-Vial-Plate", "6-Well-Plate"]
var numbers = new Map();
numbers.set("1", 1);
numbers.set("2", 2);
numbers.set("3", 3);
numbers.set("4", 4);
//Attach click listener to all boxes
for (const box of boxes) {
  box.addEventListener('click', changeToClicked);
}
});
