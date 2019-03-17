import * as p from 'p5';
import {videoWidth, videoHeight} from './camera';
import {adjacentBool, boxLeftArray, boxRightArray} from './demo_util';

let width = videoWidth;
let height = videoHeight;
let bool = adjacentBool;

var sketch = function(p) {
  let canvasp;
  let ps;
  let sakura;

  p.preload = function() {
    sakura = p.loadImage('sakuraCo1.png');
  }

  p.setup = function() {
    canvasp = p.createCanvas(width, height).parent('sketchDiv');
    ps = new ParticleSystem(sakura);
    p.background('rgba(0,0,0, 0.5)');
    canvasp.position(0, 0);
    canvasp.style('z-index', '-1');
  };

  p.draw = function() {
    // Box coordinate arrays from demo_util.js
    if (boxLeftArray.length === 20 && boxRightArray.length === 20) {
      // console.log("boxLeft: ", boxLeftArray);
      // console.log("boxRight: ", boxRightArray);
    }
    bool = adjacentBool;

    // UPDATE background
    p.background(0);
    let t = p.frameCount / 60;

    // CREATE a random number of snowflakes each frame
    if (bool === true) {
     console.log("p5js: ",bool);
     ps.addParticle(300, 640);
     let up = p.createVector(p.map(Math.cos(p.frameCount), -1, 1, -2, 2), -0.2);
     ps.applyForce(up);
     ps.update();
    }
  };


  var Particle = function(x, y, img){
      // constructor
      this.pos = p.createVector(x, y);
      this.vel = p5.Vector.random2D();
      this.acc = p.createVector(0, 0.02);
      this.lifespan = 255.0;
      this.img = img;
      this.angle = Math.cos(this.vel.x)*1.5;

    this.run = function() {
      this.update();
      this.render();
    }

    this.applyForce = function(f) {
      this.acc.add(f);
    }

    // update position
    this.update = function() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.lifespan -= 3.0;
    }

    this.render = function() {
      p.imageMode(p.CENTER);
      p.tint(this.lifespan*2);
      p.push();
      p.translate(this.pos.x, this.pos.y);
      p.rotate(Math.sin(this.lifespan/2)*2);
      p.imageMode(p.CENTER);
      p.image(this.img, 0, 0, 48, 48);
      p.pop();
    }

    this.isDead = function() {
      if (this.lifespan < 0.0) {
        return true;
      } else {
        return false;
      }
    }
  }

  var ParticleSystem = function(img) {
      this.particles = [];
      this.texture = img;


    this.addParticle = function(x, y) {
      this.particles.push(new Particle(x, y, this.texture));
    }

    this.applyForce = function (f) {
      for (let particle of this.particles) {
        particle.applyForce(f);
      }
    }

    this.update = function() {
      for (let p of this.particles) {
        p.run();
      }
      this.particles = this.particles.filter(p => !p.isDead());
    }
  }
}

var myp5 = new p5(sketch, document.getElementById('sketchDiv'));
// console: <canvas id="defaultCanvas0" class="p5Canvas" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
