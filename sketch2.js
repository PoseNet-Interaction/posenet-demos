import * as p from 'p5';
import {videoWidth, videoHeight} from './camera';
import {adjacentBool, boxLeftArray} from './demo_util';


let width = videoWidth;
let height = videoHeight;
let bool = adjacentBool;
var sketch = function(p) {
  let canvasp;
  let snowflakes = [];
  let singleFlake;
  // let ele = document.getElementById("boolean"); // GET p id
  // let bool; // GET changing innerHTML value
  // let noseX;
  // let noseCoordXY = document.getElementById("noseCoordXY");

  p.preload = function() {
    singleFlake = p.loadImage('sakuraCo1.png');
  }

  p.setup = function() {
    canvasp = p.createCanvas(width, height).parent('sketchDiv');
    p.background('rgba(0,0,0, 0.5)');
    canvasp.position(0, 0);
    canvasp.style('z-index', '-1');
    // bool = ele.innerHTML;
    // console.log("initial", bool);


  };

  p.draw = function() {
    // GRAB html element to check boolean value from demo_util.js

    // UPDATE background
    p.background(0);
    let t = p.frameCount / 60;

    // CREATE a random number of snowflakes each frame
    bool = adjacentBool;
    if (bool === true) {
     // console.log("p5js: ",bool);
     // for (var i = 0; i < p.random(3); i++) {
     //   snowflakes.push(new snowflake(singleFlake)); // append snowflake object
     // }
    };

    for (var i = 0; i < p.random(3); i++) {
      snowflakes.push(new snowflake(singleFlake)); // append snowflake object
    }

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
    this.lifespan = 255.0;

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

      this.lifespan -= 3.0;
      // delete snowflake if past end of screen
        if (this.lifespan < 0.0) {
          let index = snowflakes.indexOf(this);
          snowflakes.splice(index, 1);
        }
    };

    this.display = function() {
      p.imageMode(p.CENTER);
      p.tint(this.lifespan*2);
      p.push();
      p.translate(this.posX, this.posY);
      p.rotate(Math.sin(this.lifespan/2)*2);
      p.imageMode(p.CENTER);
      p.image(this.img, 0, 0, 48, 48);
      p.pop();
    };
  }
}


var myp5 = new p5(sketch, document.getElementById('sketchDiv'));
// console: <canvas id="defaultCanvas0" class="p5Canvas" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
