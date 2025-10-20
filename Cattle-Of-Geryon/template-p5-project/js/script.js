let boids = [];
let walls = [];
let adPopups = []; //stores PopupImgs objects
let nextAdTime = 0;
let overlayBuffer;

//img variables
let mazeImg;
let cattleImg;
let popupImgs = [];
let flagImg;

function preload() {
  
  mazeImg = loadImage("assets/images/bg-img.png");
  cattleImg = loadImage("assets/images/cattle.png");
  flagImg = loadImage("assets/images/flag.png");

//loading all the popup images
  popupImgs.push(loadImage("assets/images/ad.png"));
  popupImgs.push(loadImage("assets/images/ad2.png"));
}

function setup() {
  createCanvas(1920, 1080);
  noCursor(); //no mouse cursor visible

  for (let i = 0; i < 50; i++) { //boid amt
    boids.push(new Boid(150, 950)); //boid spawn point
  }

  spawnAdPopup();
}

function draw() {
  background(0);
  image(mazeImg, 0, 0);
  image(flagImg, 1375, 335);
  // overlayBuffer = createGraphics(width, height);

  for (let boid of boids) {
    boid.flockWithMouse();
    boid.vibrate();
    boid.update();
    boid.edges();
    boid.show();
  }

for (let i = 0; i < adPopups.length; i++) {
  adPopups[i].show();
}

// Spawns a popup at random intervals (5 to 10 seconds)
if (millis() > nextAdTime) {
  spawnAdPopup();
  nextAdTime = millis() + random(7000, 15000); // Wait 5–10 sec for next
}


//   overlayBuffer.clear(); // Clear the entire buffer (fully transparent)

//   // Fill fully black — this time with full alpha
//   overlayBuffer.noStroke();
//   overlayBuffer.fill(0, 252); // Full black
//   overlayBuffer.rect(0, 0, width, height);

//   // Erase spotlight areas completely
//   overlayBuffer.erase();
//   for (let boid of boids) {
//     overlayBuffer.ellipse(boid.position.x, boid.position.y, 150, 150);
//   }
//   overlayBuffer.noErase();

//   // Now draw the buffer
//   image(overlayBuffer, 0, 0);

//   for (let ad of adPopups) {
//   ad.show();
// }

}

function spawnAdPopup() {
  let randomImg = random(popupImgs); // Pick image from adImages
  let ad = new PopupImgs(randomImg); // Create popup instance
  adPopups.push(ad); // Store in adPopups
}

function isWall(x, y) {
  // Avoid reading outside the image boundaries
  if (x < 0 || x >= width || y < 0 || y >= height) return true;

  let c = mazeImg.get(floor(x), floor(y));
  return (c[0] === 21 && c[1] === 10 && c[2] === 9); //dark walls
}

function mousePressed() {
  for (let i = adPopups.length - 1; i >= 0; i--) {
    if (adPopups[i].isClicked(mouseX, mouseY)) {
      adPopups.splice(i, 1); // Remove ad on click
      break;
    }
  }
}

class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.maxForce = 0.3; //how much they swerve
    this.maxSpeed = 2.5; //how fast they move
  }

  flockWithMouse() {

  push();
  noStroke()
  ellipse(mouseX,mouseY, 15, 15); //makes the mouse an ellipse
  pop();

  // If the mouse is over a wall, do nothing
  if (isWall(mouseX, mouseY)) return;

  let mouse = createVector(mouseX, mouseY);
  let distance = p5.Vector.dist(mouse, this.position); //distance between mouse and boid
  let mouseInfluenceRadius = 75;

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
  let nextPos = p5.Vector.add(this.position, this.velocity);

  // If next position is a wall, reflect the boid or stop it
  if (!isWall(nextPos.x, nextPos.y)) {
    this.position = nextPos;
  } else {
    // Simple bounce-back effect
    this.velocity.mult(-1);
  }

  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxSpeed);
  this.acceleration.mult(0);
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
  push();

  //move to the boid's position
  translate(this.position.x, this.position.y);

  //flip image if moving left (negative x velocity)
  if (this.velocity.x < 0) {
    scale(-1, 1); //flip horizontally
    image(cattleImg, -cattleImg.width / 2, -cattleImg.height / 2);
  } else {
    //normal image (facing right)
    image(cattleImg, -cattleImg.width / 2, -cattleImg.height / 2);
  }

  pop();
}
}

class PopupImgs {
  constructor(img) {
    this.img = img;
    this.x = random(width - img.width);
    this.y = random(height - img.height);
    this.closeSize = 40; // Size of the 'X' button
  }

  show() {
    //draw the ad image
    image(this.img, this.x, this.y);

    //draw the X button in the top-right corner
    push();
    fill(255, 0, 0);
    noStroke();
    rect(this.x + this.img.width - this.closeSize, this.y, this.closeSize, this.closeSize);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text('X', this.x + this.img.width - this.closeSize / 2, this.y + this.closeSize / 2);
    pop();
  }

  isClicked(px, py) {
    // Check if the player clicked inside the close box
    let bx = this.x + this.img.width - this.closeSize;
    let by = this.y;
    return (px >= bx && px <= bx + this.closeSize && py >= by && py <= by + this.closeSize);
  }
}