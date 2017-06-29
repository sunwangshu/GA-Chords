function Chord(parent) {
  if (parent != undefined) {
    this.noteNum = random([2, 4]);
    this.notes = this.inherit(parent);
    this.significance = parent.significance;
  } else {
    this.noteNum = random([2, 4]);
    this.notes = this.initialize();
    this.significance = 60; // 0 ~ 100, > 100 then generates a new generation and decreases 10.
  }

  this.oscs = this.sonify();
  this.envelope = new p5.Env();
  this.envelope.setADSR(0.4, 0.3, 0.2, 0.3);
  this.envelope.setRange(1, 0);

  this.color = map(this.significance, 0, 100, 50, 255);

  this.radius = 40;
  var x = random(this.radius, width - this.radius);
  var y = map(this.significance, 0, 100, height - this.radius, this.radius);
  this.location = createVector(x, y);

}

Chord.prototype.initialize = function() {
  var notes = [];
  var newNote = floor(random(60, 72));
  notes.push(newNote);
  for (var i = 1; i < this.noteNum; i++) {
    var inc = floor(random(1, 8)); // create a new note higher than before
    newNote += inc;
    notes.push(newNote);
  }
  return notes;
}

Chord.prototype.inherit = function(parent) {
  var notes = [];
  // if fewer notes than parent then randomly splice
  // copy first
  if (this.noteNum <= parent.noteNum) {
    for (var i = 0; i < parent.noteNum; i++) {
      notes[i] = parent.notes[i] + random([-2, 0, 0, 0, 0, 2]); // more 0s to retain original note
    }
    while (notes.length > this.noteNum) {
      var ind = floor(random(0, notes.length));
      notes.splice(ind, 1);
    }
    
    // managements: sorting
    notes.sort();
    return notes;
  }
  // if more notes than parent then randomly add new note to last, and reorder.
  else {
    for (var i = 0; i < parent.noteNum; i++) {
      notes[i] = parent.notes[i] + random([-2, 0, 0, 0, 0, 2]);
    }
    while (notes.length < this.noteNum) {
      var newNote = floor(random(60, 72));
      // avoid same note
      var unique = true;
      for (var i = 0; i < notes.length; i++) {
        if (newNote == notes[i]) {
          unique = false;
        }
      }
      if (unique) {
        notes.push(newNote);
      }
    }
    // managements: sorting and deleting duplicate
    notes.sort();
    return notes;
  }

}

Chord.prototype.sonify = function() {
  var oscs = [];
  for (var i = 0; i < this.noteNum; i++) {
    var osc = new p5.SinOsc();
    osc.amp(0);
    osc.start();
    oscs.push(osc);
  }
  return oscs;
}

Chord.prototype.play = function() {
  for (var i = 0; i < this.noteNum; i++) {
    var osc = this.oscs[i];
    var freqValue = midiToFreq(this.notes[i]);
    osc.freq(freqValue);
    osc.amp(0.03);
    this.envelope.play(osc, 0, 0.1);
  }
}

Chord.prototype.update = function() {
  // falling down
  // if significance is greater than 50, keep it above the 50 line, unless right click to decrease it.
  var speed = map(this.significance, 0, 100, 0.07, 0.02);
  if (!this.mouseOver()) { // so that mouse over halts falling
    if (this.significance > 50) {
      this.significance -= speed;
      this.significance = constrain(this.significance, 50, 100);
    } else if (this.significance < 49) {
      this.significance -= speed;
      this.significance = constrain(this.significance, 0, 50);
    }
  }

  // mapping significance to the color and location
  this.color = map(this.significance, 0, 100, 50, 255);
  this.location.y = map(this.significance, 0, 100, height - this.radius, this.radius);
}

Chord.prototype.show = function() {
  fill(0);
  stroke(this.color);
  ellipse(this.location.x, this.location.y, this.radius * 2, this.radius * 2);
  // numbers then stacking up
  fill(this.color);
  noStroke();
  textAlign(CENTER, CENTER);
  var para = "";
  for (var i = this.noteNum - 1; i >= 0; i--) {
    para += this.notes[i];
    if (i != 0) {
      para += "\n";
    }
  }
  text(para, this.location.x, this.location.y);
}

Chord.prototype.mouseOver = function() {
  if (dist(mouseX, mouseY, this.location.x, this.location.y) < this.radius) {
    this.significance += 0.01;
    if (mouseIsPressed) {
      if (mouseButton == LEFT) {
        if (mouseY > this.location.y) {
          this.play();
          this.significance += 0.2;
          // also dragging...
          if (mouseX - this.location.x > 10) {
            this.location.x += 1;
          } else if (mouseX - this.location.x < -10) {
            this.location.x -= 1;
          }
        } else {
          this.significance -= 0.2;
          // also dragging...
          if (mouseX - this.location.x > 10) {
            this.location.x -= 1;
          } else if (mouseX - this.location.x < -10) {
            this.location.x += 1;
          }
        }
      }
        
    }
    return true;
  }
  else {
    for (var i = 0; i < this.oscs.length; i++) {
      this.oscs[i].amp(0);
    }
    return false;
  }
}