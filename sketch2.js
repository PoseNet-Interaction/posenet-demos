import * as p from 'p5';
import {adjacentBool} from './demo_util';
// import {videoWidth, videoHeight} from './camera';
// import {snowConstructor, snowRender, snowUpdate } from './snowflake';

let width = 720;
let height = 450;
let bool = adjacentBool;

var sketch = function(p) {
  let canvasp;
  let snowflakes = [];

  p.setup = function() {
    canvasp = p.createCanvas(width, height).parent('sketchDiv');
    p.background('rgba(0,0,0, 0.5)');
    canvasp.position(0, 0);
    canvasp.style('z-index', '-1');
  };

  p.draw = function() {
    p.background(0);
    let t = p.frameCount / 80;

    // create a random number of snowflakes each frame
   for (var i = 0; i < p.random(3); i++) {
     snowflakes.push(new snowflake()); // append snowflake object
   }

   // loop through snowflakes with a for..of loop
   for (let flake of snowflakes) {
     flake.update(t); // update snowflake position
     flake.display(); // draw snowflake
   };
  }

  // snowflake class
  var snowflake = function() {
    // initialize coordinates
    this.posX = 0;
    this.posY = p.random(-50, 0);
    this.initialangle = p.random(0, 2 * p.PI);
    this.size = p.random(4, 7);
    this.speed = 0.3; // w: angular speed
    this.newAngle = 0;

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
      let opacity = p.random(0.4, 0.5);
      p.stroke(255, 0.4);
      p.ellipse(this.posX, this.posY, this.size);
    };
  }
}


var myp5 = new p5(sketch, document.getElementById('sketchDiv'));

// console: <canvas id="defaultCanvas0" class="p5Canvas" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
