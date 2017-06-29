// the group that manages existing chords
function Chords() {
  this.chords = [];

  for (var i = 0; i < 7; i++) {
    this.chords[i] = new Chord();
  }
  print("Chords initialized.");
}

Chords.prototype.update = function() {
  for (var i = 0; i < this.chords.length; i++) {
    this.chords[i].update();
    
    // reproduce
    if (this.chords[i].significance == 100) {
      this.chords[i].significance -= 10;
      this.reproduce(this.chords[i]);
    }
    
    // mouseover
    if (this.chords[i].mouseOver()) {
      //this.chords[i].play();
    }
    
    // die
    if (this.chords[i].significance == 0) {
      this.chords.splice(i, 1);
    }
  }
}

Chords.prototype.reproduce = function(parent) {
  for (var i = 0; i < 2; i++) {
    var chord = new Chord(parent);
    this.chords.push(chord);
  }
}


Chords.prototype.show = function() {
  // draw baselines first
  hMid = height/2 + this.chords[0].radius;
  stroke(128);
  line(0, hMid, width, hMid);
  
  for (var i = 0; i < this.chords.length; i++) {
    this.chords[i].show();
  }
}

Chords.prototype.new = function() {
  for (var i = 0; i < 7; i++) {
    var newChord = new Chord();
    this.chords.push(newChord);
  }
  print("Added 7 new chords");
}