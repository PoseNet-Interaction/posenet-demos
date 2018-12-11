import * as p from 'p5';
import {adjacentBool} from './demo_util';
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


var sketch = function(p) {
  let canvasp;
  let snow = [];
  let gravity;
  let bool = adjacentBool; // boolean value from demo_util

  p.setup = function() {
    canvasp = p.createCanvas(720, 450).parent('sketchDiv');
    p.background('rgba(0,0,0, 0.5)');
    canvasp.position(0, 0);
    canvasp.style('z-index', '-1');
    gravity = p.createVector(0, 0.025);
    // canvasp.position(0,0);
    // canvasp.style('z-index', '-1');
  };

  p.draw = function() {
    p.background(0);
    // p.fill(205);
    // p.rect(100,100,50,50);
    if (bool === false) {
      snow.push(new Snowflake());
      for(var flake of snow) {
        flake.update();
        flake.render();
        flake.checkEdges();
      }
    }

    for (let i = snow.legnth -1; i>= 0; i--) {
      // if (snow[i].offScreen()) {
      //   snow.splice(i, 1);
      // }
      snow[i].checkEdges();
    }

    // for (let flake in snow) {
    //   console.log(flake);
    //   flake.snowUpdate();
    //   flake.snowRender();
    // }

    // console.log("hello");
  };

  var getRandomSize = function() {
    let r = p.pow(p.random(0, 1), 3);
    return p.constrain(r * 32, 2, 32);
  }

  var Snowflake = function() {
    let x = p.random(0, 720);
    let y = p.random(-10, -50);
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector();
    this.r = getRandomSize();

    this.update = function () {
      this.acc = gravity;  // gravity is force. force is vector
      this.vel.add(this.acc);
      this.pos.add(this.vel);
    }

    this.render = function () {
      p.stroke('rgba(255,255,255,0.8)');
      p.strokeWeight(5);
      p.point(this.pos.x, this.pos.y);
    }

    this.offScreen = function () {
      return (this.pos.y > 400)
    }

    this.checkEdges = function() {
      if(this.pos.y > (450 - 5)) {
        this.vel.y *= -0.5;
        this.pos.y = (450 - 2);
      }
    }
  }

};


var myp5 = new p5(sketch, document.getElementById('sketchDiv'));

// console: <canvas id="defaultCanvas0" class="p5Canvas" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
