import * as p from 'p5';
import {videoWidth, videoHeight} from './camera';


let width = videoWidth;
let height = videoHeight;

var sketch = function(p) {
  let canvasp;
  let snowflakes = [];
  let singleFlake;
  let ele = document.getElementById("boolean"); // GET p id
  let bool; // GET changing innerHTML value
  
  p.preload = function() {
    singleFlake = p.loadImage('snowflake.png');
  }

  p.setup = function() {
    canvasp = p.createCanvas(width, height).parent('sketchDiv');
    p.background('rgba(0,0,0, 0.5)');
    canvasp.position(0, 0);
    canvasp.style('z-index', '-1');
    bool = ele.innerHTML;
    console.log("initial", bool);


  };

  p.draw = function() {
    // GRAB html element to check boolean value from demo_util.js
    bool = ele.innerHTML;
    // UPDATE background
    p.background(0);
    let t = p.frameCount / 60;
    // console.log("bool is", adjacentBool);
    // CREATE a random number of snowflakes each frame
    if (bool === 'adjacent') {
     console.log(bool);
     for (var i = 0; i < p.random(3); i++) {
       snowflakes.push(new snowflake(singleFlake)); // append snowflake object
     }
  };

   // LOOP through snowflakes with a for..of loop
   for (let flake of snowflakes) {
     flake.update(t); // update snowflake position
     flake.display(); // draw snowflake
   };
  }

  // snowflake class
  var snowflake = function(img) {
    // initialize coordinates
    this.posX = 0;
    this.posY = p.random(-50, 0);
    this.initialangle = p.random(0, 2 * p.PI);
    this.size = p.random(4, 7);
    this.speed = 0.3; // w: angular speed
    this.newAngle = 0;
    this.img = img;

    // radius of snowflake spiral
    // chosen so the snowflakes are uniformly spread out in area
    this.radius = p.sqrt(p.random(p.pow(width / 2, 2)));

    this.update = function(time) {
      // x position follows a circle
      // let w = 0.6;
      this.newAngle = this.speed * time + this.initialangle;
      this.posX = width / 2 + this.radius * p.sin(this.newAngle);

      // different size snowflakes fall at slightly different y speeds
      this.posY += p.pow(this.size, 0.3);

      // delete snowflake if past end of screen
        if (this.posY > height) {
          let index = snowflakes.indexOf(this);
          snowflakes.splice(index, 1);
        }
    };

    this.display = function() {
      // ellipse
      // let opacity = p.random(0.4, 0.5);
      // p.stroke(255, 0.4);
      // p.ellipse(this.posX, this.posY, this.size);
      
      // image
      p.imageMode(p.CENTER);
      let sizeVar = p.random(20, 30);
      p.image(this.img, this.posX, this.posY, sizeVar, sizeVar);
    };
  }
}


var myp5 = new p5(sketch, document.getElementById('sketchDiv'));
// console: <canvas id="defaultCanvas0" class="p5Canvas" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
