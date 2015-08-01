

var formResolution = 15;
var stepSize = 3;
var distortionFactor = 2;
var initRadius = 25;
var centerX, centerY;
var x = [formResolution];
var y = [formResolution];

var filled = false;
var freeze = false

var milkcocoa = new MilkCocoa("flagict7c50v.mlkcca.com");
var mouseDataStore = milkcocoa.dataStore('mouse');

var propKey;
var centerProps = {};


function uuid() {
  var uuid = "", i, random;
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;

    if (i == 8 || i == 12 || i == 16 || i == 20) {
      uuid += "-"
    }
    uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
}

mouseDataStore.on("send",function(sent){
  drawLines(sent);
});

function setup(){
  centerX = windowWidth/2;
  centerY = windowHeight/2;
  createCanvas(windowWidth, windowHeight);
  // smooth();

  // init form
  var angle = radians(360/float(formResolution));
  for (var i=0; i<formResolution; i++){
    x[i] = cos(angle*i) * initRadius;
    y[i] = sin(angle*i) * initRadius;
  }

  stroke(0, 50);
  background(255);
  propKey = uuid();

  centerProps[propKey] = {centerX: centerX, centerY: centerY};

}



function draw(){
  mouseDataStore.send({key:propKey, x:mouseX, y:mouseY, centerX: centerX, centerY:centerY});
}

function drawLines(sent){

  var v = sent.value;
  var c = centerProps[v.key];
  if(!c){
    centerProps[v.key] = {centerX: v.centerX, centerY: v.centerY};
    c = centerProps[v.key];
  }

  // floating towards mouse position
  if (mouseX != 0 || mouseY != 0) {
    c.centerX += (v.x- c.centerX) * 0.01;
    c.centerY += (v.y- c.centerY) * 0.01;
  }

  // calculate new points
  for (var i=0; i<formResolution; i++){
    x[i] += random(-stepSize,stepSize);
    y[i] += random(-stepSize,stepSize);
    // ellipse(x[i], y[i], 5, 5);
  }

  strokeWeight(0.75);
  if (filled){
    fill(random(255));
  }else{
   noFill();
 }
  beginShape();
  // start controlpoint
  curveVertex(x[formResolution-1]+c.centerX, y[formResolution-1]+c.centerY);

  // only these points are drawn
  for (var i=0; i<formResolution; i++){
    curveVertex(x[i]+c.centerX, y[i]+c.centerY);
  }
  curveVertex(x[0]+c.centerX, y[0]+c.centerY);

  // end controlpoint
  curveVertex(x[1]+c.centerX, y[1]+c.centerY);
  endShape();

}
// events
function mousePressed() {
  //init form on mouse position
  centerProps[propKey].centerX = mouseX;
  centerProps[propKey].centerY = mouseY;
  var angle = radians(360/formResolution);
  var radius = initRadius * random(0.5,1.0);
  for (var i=0; i<formResolution; i++){
    x[i] = cos(angle*i) * radius;
    y[i] = sin(angle*i) * radius;
  }
}
