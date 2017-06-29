var chords;

function setup() {
  createCanvas(windowWidth, windowHeight);
  chords = new Chords();
  
  //exampleNote.play();
}

function draw() {
  background(0);
  chords.update();
  chords.show();
}

function keyTyped() {
  if (key == " ") {
    chords.new();
  }
}