import * as p from 'p5';
// import * as box2d from 'box2d-helper';
const box2d = window.box2d-helper;
// const dwolla = window.dwolla;

// import { box2d-helper } as box2d from 'p5/lib/box2d-helper';
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// A rectangular box
let world;

// A list we'll use to track fixed objects
let boundaries = [];
// A list for all of our rectangles
let pops = [];
let width = 720;
let height = 450;

var sketch = function(p) {
  let canvasp;
  let snowflakes = [];
  // let bool = adjacentBool; // boolean value from demo_util

  p.setup = function() {
    canvasp = p.createCanvas(720, 450).parent('sketchDiv');
    p.background('rgba(0,0,0, 0.5)');
    canvasp.position(0, 0);
    canvasp.style('z-index', '-1');

    world = createWorld();

  // Add a bunch of fixed boundaries
    boundaries.push(new Boundary(width, height - 10, width*2, 10, 0));
  };

  p.draw = function() {
    p.background(0);

    // We must always step through time!
    let timeStep = 1.0 / 30;
    // 2nd and 3rd arguments are velocity and position iterations
    world.Step(timeStep, 10, 10);

    // Display all the boundaries
    for (let i = 0; i < boundaries.length; i++) {
      boundaries[i].display();
    }

    // Display all the boxes
    for (let i = pops.length - 1; i >= 0; i--) {
      pops[i].display();
      if (pops[i].done()) {
        pops.splice(i, 1);
      }
    }
  };
  p.mousePressed = function() {
    let p = new Lollipop(p.mouseX, p.mouseY);
    pops.push(p);
  };
  // end of sketch.js

  // Lollipop Constructor
  var Lollipop = function(x, y) {
      this.w = 3;
      this.h = 3;
      this.r = 3;

      // Define a body
      let bd = new p.box2d.b2BodyDef();
      bd.type = box2d.b2BodyType.b2_dynamicBody;
      bd.position = p.scaleToWorld(x, y);


      // Define fixture #2
      let fd2 = new p.box2d.b2FixtureDef();
      fd2.shape = new p.box2d.b2CircleShape();
      fd2.shape.m_radius = p.scaleToWorld(this.r);
      let offset = p.scaleToWorld(new p.box2d.b2Vec2(0, -this.h / 2));
      fd2.shape.m_p = new p.box2d.b2Vec2(offset.x, offset.y);
      fd2.density = 1.0;
      fd2.friction = 0.5;
      fd2.restitution = 0.2;

      // Create the body
      this.body = world.CreateBody(bd);
      // Attach the fixture
      this.body.CreateFixture(fd2);

      // Some additional stuff
      this.body.SetLinearVelocity(new p.box2d.b2Vec2(p.random(-5, 5), p.random(2, 5)));
      this.body.SetAngularVelocity(p.random(-5, 5));

    // This function removes the particle from the box2d world
    this.killBody = function() {
      world.DestroyBody(this.body);
    }

    // Is the particle ready for deletion?
    this.done = function() {
      // Let's find the screen position of the particle
      let pos = scaleToPixels(this.body.GetPosition());
      // Is it off the bottom of the screen?
      if (pos.y > height + this.w * this.h) {
        this.killBody();
        return true;
      }
      return false;
    }

    // Drawing the box
    this.display = function() {
      // Get the body's position
      let pos = scaleToPixels(this.body.GetPosition());
      // Get its angle of rotation
      let a = this.body.GetAngleRadians();

      // Draw it!
      p.rectMode(CENTER);
      p.push();
      p.translate(pos.x, pos.y);
      p.rotate(a);
      p.fill(127);
      p.stroke(200);
      p.strokeWeight(2);

      p.ellipse(0, -this.h / 2, this.r * 2, this.r * 2);
      p.pop();
    }
  }

  // boundary Constructor
  // The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// A fixed boundary class

// A boundary is a simple rectangle with x,y,width,and height
  var Boundary = function(x, y, w, h) {
      // But we also have to make a body for box2d to know about it
      // Body b;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;

      let fd = new box2d.b2FixtureDef();
      fd.density = 1.0;
      fd.friction = 0.5;
      fd.restitution = 0.2;

      let bd = new p.box2d.b2BodyDef();

      bd.type = box2d.b2BodyType.b2_staticBody;
      bd.position.x = p.scaleToWorld(this.x);
      bd.position.y = p.scaleToWorld(this.y);
      fd.shape = new p.box2d.b2PolygonShape();
      fd.shape.SetAsBox(this.w / (p.scaleFactor * 2), this.h / (p.scaleFactor * 2));
      this.body = world.CreateBody(bd).CreateFixture(fd);

    // Draw the boundary, if it were at an angle we'd have to do something fancier
    this.display = function() {
      p.fill(127);
      p.stroke(200);
      p.rectMode(CENTER);
      p.rect(this.x, this.y, this.w, this.h);
    }
  }

  // end of instance
}

var myp5 = new p5(sketch, document.getElementById('sketchDiv'));
