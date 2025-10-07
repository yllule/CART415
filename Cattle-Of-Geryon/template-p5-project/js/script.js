let boids = [];
let walls = [];

function setup() {
  createCanvas(1920, 1080);
  noCursor(); //no mouse cursor visible

  //all the labyrinth walls (to be changed)
  walls.push(new Wall(100, 100, 1700, 20)); //top wall
  walls.push(new Wall(100, 980, 1700, 20)); //bottom wall
  walls.push(new Wall(100, 100, 20, 880));  //left wall
  walls.push(new Wall(1780, 100, 20, 880)); //right wall
  walls.push(new Wall(400, 400, 20, 600));  //vertical interior wall
  walls.push(new Wall(800, 300, 20, 600));  //vertical interior wall
  walls.push(new Wall(1200, 400, 20, 600));  //vertical interior wall
  walls.push(new Wall(1500, 300, 20, 600));  //vertical interior wall
  walls.push(new Wall(200, 300, 1600, 20)); //horizontal interior wall

  for (let i = 0; i < 50; i++) { //50 boids
    boids.push(new Boid(1650, 500)); //boid spawn point
  }
}

function draw() {
  background(0);

  //draw the maze walls
  for (let wall of walls) {
    wall.show();
  }

  for (let boid of boids) {
    boid.flockWithMouse();
    boid.vibrate();
    boid.update();
    boid.bounceOffWalls(walls);
    boid.edges();
    boid.show();
  }
  
}


class Wall {
  //setting up wall parameters
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  //walls look
  show() {
    fill(100);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }

}

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.3; //how much they swerve
    this.maxSpeed = 3; //how fast they move
  }

  flockWithMouse() {
    ellipse(mouseX,mouseY,10,10); //makes the mouse an ellipse
    let mouse = createVector(mouseX, mouseY);
    let distance = p5.Vector.dist(mouse, this.position); //distance between mouse and boid
    let mouseInfluenceRadius = 100;

    //if the distance btwn the mouse and boid is smaller than the influence radius, the boid will follow the mouse
    if (distance < mouseInfluenceRadius) {
      let steer = p5.Vector.sub(mouse, this.position);
      steer.setMag(this.maxSpeed);
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  }

  //makes the boids jitter a bit so they have some individual movement
  vibrate() {
    let vibrationStrength = 0.5;
    let jitter = p5.Vector.random2D().mult(vibrationStrength);
    this.applyForce(jitter);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  bounceOffWalls(walls) {
  for (let wall of walls) {
    let x = wall.x;
    let y = wall.y;
    let w = wall.w;
    let h = wall.h;

    // Simple AABB (axis-aligned bounding box) collision detection (??)
    if (
      this.position.x > x &&
      this.position.x < x + w &&
      this.position.y > y &&
      this.position.y < y + h
    ) {
      // Determine which side the boid hit by checking distances
      let left = abs(this.position.x - x);
      let right = abs(this.position.x - (x + w));
      let top = abs(this.position.y - y);
      let bottom = abs(this.position.y - (y + h));

      let minDist = min(left, right, top, bottom);

      if (minDist === left || minDist === right) {
        this.velocity.x *= -1;
        if (minDist === left) this.position.x = x - 1;
        else this.position.x = x + w + 1;
      } else {
        this.velocity.y *= -1;
        if (minDist === top) this.position.y = y - 1;
        else this.position.y = y + h + 1;
      }
    }
  }
}

//makes the boids stop at the edges of the canvas
edges() {
  if (this.position.x < 0 || this.position.x > width) {
    this.velocity.x *= -1;
    this.position.x = constrain(this.position.x, 0, width);
  }
  if (this.position.y < 0 || this.position.y > height) {
    this.velocity.y *= -1;
    this.position.y = constrain(this.position.y, 0, height);
  }
}

//the look of the boid
  show() {
    stroke(255);
    strokeWeight(10);
    point(this.position.x, this.position.y);
  }
}