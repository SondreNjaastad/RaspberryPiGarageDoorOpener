require('./consoleTimestamp')();

var Gpio = require('onoff').Gpio;
var express = require('express');
var app = express();
var portController = new Gpio(18, 'out');
var portClosed = new Gpio(23, 'in');
var portOpen = new Gpio(24, 'in');
var port = 3000;

const PORTSTATE = {
  OPEN: 'open',
  CLOSED: 'closed',
  OPENING: 'opening',
  CLOSING: 'closing',
  UNKNOWN: 'unknown'
}

valuesOpen = [];
valuesClosed = [];
var portState = PORTSTATE.UNKNOWN;
var lastValidState = PORTSTATE.UNKNOWN;
var open = false;
var closed = false;

//Toggle the garagedoor
function toggleGarageDoor(){
    portController.writeSync(1); //set pin state to 1 (turn relay on)
    setTimeout(stopController, 250); //Power off the relay after 500ms
}

function checkState() {
  //Reduce noise from the sensor
  if(valuesOpen.length > 4)
    valuesOpen.shift();
  
  //On both sensors
  if(valuesClosed.length > 4)
    valuesClosed.shift();

  valuesOpen.push(portOpen.readSync());
  valuesClosed.push(portClosed.readSync());

  open = sumArray(valuesOpen) > 3;
  closed = sumArray(valuesClosed) > 3;

  if(closed && !open){
    lastValidState = portState = PORTSTATE.CLOSED;
  } else if (open && !closed){
    lastValidState = portState = PORTSTATE.OPEN;
  } else if(!open && !closed && lastValidState == PORTSTATE.CLOSED) {
    portState = PORTSTATE.OPENING;
  } else if(!open && !closed && lastValidState == PORTSTATE.OPEN) {
    portState = PORTSTATE.CLOSING;
  } else {
    portState = PORTSTATE.UNKNOWN;
  }

  //Should be removed once you get good data from the sensors
  //console.log('The port is  ' + portState);
}

function sumArray(arr){
  var sum = 0;
  arr.forEach(function(element){
    sum += element;
  });
  return sum;
}

function stopController() { 
  portController.writeSync(0);
}

app.get('/api/open', (req, res) => { 
  var ip = req.connection.remoteAddress;

  if(portState === PORTSTATE.CLOSED){
    toggleGarageDoor();
    console.log(`[${ip}] Opening the garage`);
    res.send('SUCCESS');
  }
  else if(portState === PORTSTATE.OPEN){
    console.log(`[${ip}] Garage already open`);
    res.send('NOCHANGE'); 
  } else {
    console.log(`[${ip}] Unable to determin door state`);
    res.send('UNKNOWN'); 
  }
})

app.get('/api/close', (req, res) => { 
  var ip = req.connection.remoteAddress;
  
  if(portState === PORTSTATE.OPEN){
    toggleGarageDoor();
    console.log(`[${ip}] Closing the garage`);
    res.send('SUCCESS');
  }
  else if(portState === PORTSTATE.CLOSED){
    console.log(`[${ip}] Garage already closed`);
    res.send('NOCHANGE'); 
  } else {
    console.log(`[${ip}] Unable to determin door state`);
    res.send('UNKNOWN'); 
  }
})

app.get('/api/nudge', (req, res) => { 
  var ip = req.connection.remoteAddress;
  console.log(`[${ip}] Nudge initiated`);
  toggleGarageDoor();
  res.send('NUDGE OK'); 
})

app.get('/api/status', (req, res) => { 
    res.send(portState);
})

setInterval(checkState, 250);
app.listen(port, () => console.log(`Garage server listening on port ${port}!`))