import * as p from 'p5';
import {adjacentBool} from './demo_util';
// import {videoWidth, videoHeight} from './camera';
// import {snowConstructor, snowRender, snowUpdate } from './snowflake';

// function setup() {
//   canvas = createCanvas(100, 100);
//   canvas.parent('sketchDiv');
//   canvas.position(0,0);
//   canvas.style('z-index', '-1');
// }
//
// function draw() {
//   fill(204, 101, 192, 127);
//   ellipse(100, 100, 200, 200);
// }
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
     if (flake.checkEdges()) {
       flake.update(0);
       flake.speed = 0
       flake.newAngle = 0;
     }
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
      //   if (this.posY > height - 20) {
      //     let index = snowflakes.indexOf(this);
      //     snowflakes.splice(index, 1);
      //   }
    };

    this.display = function() {
      let opacity = p.random(0.4, 0.5);
      // p.fill(255, opacity) ;
      // p.noStroke();
      // p.noStroke();
      p.stroke(255, 0.4);
      // p.fill(255, opacity);
      p.ellipse(this.posX, this.posY, this.size);
    };

    this.checkEdges = function() {
      if(this.posY > (height - this.size)) {
        this.posY = (height - this.size);
        return true;
      };
    };
  }
}


var myp5 = new p5(sketch, document.getElementById('sketchDiv'));

// console: <canvas id="defaultCanvas0" class="p5Canvas" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
