let boids = [];
let walls = [];
let adPopups = []; //stores PopupImgs objects
let adSounds = []; //stores popup sounds
let popupSoundMap = {}; //this will link specific images to sounds
let popupHasButton = []; //if the popup has an extra button
let popupButtonTexts = []; //text of the extra button
let nextAdTime = 0;
let overlayBuffer;

let gameStartTime = 0;
let timeLimit = 120000; //2mins
let score = 0;
let timeRemaining = timeLimit;
let maxRawScore = (50 * 10) + 120; //max score is 620
let finalTimeTaken = 0;

let adCursor; 
let flagCursor;

let holdStartTime = null;
let holdDuration = 1000; //1 secs

//some ads will give you a small powerup
//mouse influence
let baseInfluenceRadius = 80;
let currentInfluenceRadius = baseInfluenceRadius;
let influenceBoostEndTime = 0;

//overlay transparency
let baseOverlayAlpha = 252;
let currentOverlayAlpha = baseOverlayAlpha;
let overlayDimEndTime = 0;

//ad spawn control
let adsBlockedUntil = 0; // timestamp until no new popups should spawn

let gameState = "start"; // "start", "credits", "game", "end"

//img variables
let mazeImg;
let cattleImg;
let startImg;
let endImg;
let popupImgs = [];
let flagImg;
let flagX = 1375;
let flagY = 335;

function preload() {
  
  mazeImg = loadImage("assets/images/bg-img.png");
  cattleImg = loadImage("assets/images/cattle.png");
  flagImg = loadImage("assets/images/flag.png");
  adCursor = loadImage("assets/images/cursor1.png");
  flagCursor = loadImage("assets/images/cursor2.png");
  startImg = loadImage("assets/images/start-img.png");
  endImg = loadImage("assets/images/end-screen.png");

//loading all the popup images
  popupImgs.push(loadImage("assets/images/ad1.gif"));
  popupImgs.push(loadImage("assets/images/ad2.gif"));
  popupImgs.push(loadImage("assets/images/ad3.gif"));
  popupImgs.push(loadImage("assets/images/ad4.gif"));
  popupImgs.push(loadImage("assets/images/ad5.gif"));
  popupImgs.push(loadImage("assets/images/ad6.gif"));
  popupImgs.push(loadImage("assets/images/ad7.gif"));
  popupImgs.push(loadImage("assets/images/ad8.gif"));
  popupImgs.push(loadImage("assets/images/ad9.gif"));
  popupImgs.push(loadImage("assets/images/ad10.gif"));

//which popups have buttons
popupHasButton = [
  true,   // ad1
  false,  // ad2
  true,   // ad3
  true,  // ad4
  true,   // ad5
  false,  // ad6
  true,  // ad7
  true,   // ad8
  true,  // ad9
  true    // ad10
];

//button text per popup
popupButtonTexts = [
  "Pray now!!",
  "—",
  "Recount the cattle",
  "EXPLODE RN",
  "TURN BACK",
  "—",
  "BOOST BRAIN",
  "Boost brain!",
  "GIVE ME MORE",
  "Break time!"
];

  //loading all the sounds
  bgm = loadSound('assets/sounds/bgm.wav');
  clickSound = loadSound('assets/sounds/click.mp3');

  let ad6Sound = loadSound('assets/sounds/ancient_greek_music.mp3');
  let ad9Sound = loadSound('assets/sounds/greek_tavern_music.wav');

  popupSoundMap[5] = ad6Sound;
  popupSoundMap[8] = ad9Sound;

  //loading all the ad sounds
  adSounds.push(loadSound('assets/sounds/UI1.wav'));
  adSounds.push(loadSound('assets/sounds/UI2.flac'));
  adSounds.push(loadSound('assets/sounds/UI3.wav'));
  adSounds.push(loadSound('assets/sounds/UI4.wav'));
  adSounds.push(loadSound('assets/sounds/UI5.mp3'));
  adSounds.push(loadSound('assets/sounds/UI6.wav'));
  adSounds.push(loadSound('assets/sounds/UI8.mp3'));
  
}

function setup() {
  createCanvas(1920, 1080);
  noCursor(); //no mouse cursor visible

  userStartAudio(); //ensure browser allows audio
  bgm.setVolume(0.03);
  bgm.loop();

  for (let i = 0; i < 50; i++) { //boid amt
    boids.push(new Boid(150, 950)); //boid spawn point
  }

  overlayBuffer = createGraphics(width, height);
}

function draw() {

  if (gameState === "start") {
    drawHomeScreen();
    return;
  }

  if (gameState === "credits") {
    drawCreditsScreen();
    return;
  }

  if (gameState === "end") {
    drawEndScreen();
    return;
  }

  // update time remaining
  timeRemaining = max(0, timeLimit - (millis() - gameStartTime));

  // if time runs out -> end game
  if (timeRemaining <= 0) {
    gameState = "end";
  }

  background(0);
  image(mazeImg, 0, 0);
  //flag
  image(flagImg, flagX, flagY);

  //check if cursor is inside the flag area
  let insideFlag = (
    mouseX >= flagX &&
    mouseX <= flagX + flagImg.width &&
    mouseY >= flagY &&
    mouseY <= flagY + flagImg.height
  );

  if (insideFlag && mouseIsPressed) {
    if (holdStartTime === null) {
      holdStartTime = millis(); //start timing
    } else {
      let heldTime = millis() - holdStartTime;
    if (heldTime > holdDuration) {
      let elapsed = millis() - gameStartTime; // how long the player took
      let timeTaken = elapsed / 1000; // convert to seconds

      let timeBonus = max(0, (timeLimit - elapsed) / 1000);

      //count boids near the flag
      let boidsNearFlag = 0;
      for (let b of boids) {
        let d = dist(b.position.x, b.position.y, flagX + flagImg.width / 2, flagY + flagImg.height / 2);
        if (d < currentInfluenceRadius) {
          boidsNearFlag++;
        }
      }

      //raw score
      let rawScore = boidsNearFlag * 10 + timeBonus;

      //convert to percentage
      let maxRawScore = (50 * 10) + (timeLimit / 1000);
      score = constrain(map(rawScore, 0, maxRawScore, 0, 100), 0, 100);
      score = round(score);

      //store for display later
      finalTimeTaken = timeTaken;

      gameState = "end";
    }
      }
  } else {
    holdStartTime = null; //reset if released or moved away
  }

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

  //spawn a popup at random intervals (btw 7-15 secs)
  if (millis() > nextAdTime) {
    spawnAdPopup();
    nextAdTime = millis() + random(7000, 15000);
  }


  overlayBuffer.clear(); //clear the entire buffer (fully transparent)

  //fill fully black
  overlayBuffer.noStroke();
  overlayBuffer.fill(0, currentOverlayAlpha);
  overlayBuffer.rect(0, 0, width, height);

  //erase spotlight areas completely
  overlayBuffer.erase();
  for (let boid of boids) {
    overlayBuffer.ellipse(boid.position.x, boid.position.y, 150, 150);
  }
  overlayBuffer.noErase();
  

  //draw the buffer
  image(overlayBuffer, 0, 0);

  for (let ad of adPopups) {
  ad.show();
  }

  //effect timers
  //reset influence boost
  if (millis() > influenceBoostEndTime && currentInfluenceRadius !== baseInfluenceRadius) {
    currentInfluenceRadius = baseInfluenceRadius;
  }

  //reset overlay transparency
  if (millis() > overlayDimEndTime && currentOverlayAlpha !== baseOverlayAlpha) {
    currentOverlayAlpha = baseOverlayAlpha;
  }

  // display timer
  push();
  fill(255);
  textAlign(LEFT, TOP);
  textSize(32);
  text(`Time: ${nf(floor(timeRemaining / 1000), 2)}s`, 50, 30);
  pop();

  //cursor visuals
  let hoveringPopup = false;
  let hoveringFlag = false;

    for (let ad of adPopups) {
      if (
        mouseX >= ad.x &&
        mouseX <= ad.x + ad.img.width &&
        mouseY >= ad.y &&
        mouseY <= ad.y + ad.img.height
      ) {
        hoveringPopup = true;
        break;
      }
    }

    // Check if hovering the flag
      if (
        mouseX >= flagX &&
        mouseX <= flagX + flagImg.width &&
        mouseY >= flagY &&
        mouseY <= flagY + flagImg.height
      ) {
        hoveringFlag = true;
      }

    if (hoveringPopup) {
        image(adCursor, mouseX, mouseY);
    } 
    else if (hoveringFlag) {
        image(flagCursor, mouseX, mouseY);
          push();
          fill(255);
          textAlign(CENTER);
          textSize(20);
          textStyle(BOLD);
          text("Hold the flag for one second to lock in your task!", width / 2, 50);
          pop();
    }
    else {
        push();
        noStroke()
        ellipse(mouseX,mouseY, 15, 15);
        pop();
    }

  if (currentInfluenceRadius > baseInfluenceRadius) {
  displayEffectMessage("Your area of effect has expanded!");
  }
  if (currentOverlayAlpha < baseOverlayAlpha) {
    displayEffectMessage("The gods have granted you clarity over your task.");
  }
  if (millis() < adsBlockedUntil) {
    displayEffectMessage("You've cleared your mind for 30 seconds!");
  }

  //message on top of screen
  function displayEffectMessage(msg) {
    push();
    fill(255);
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(32);
    text(msg, width / 2, 50);
    pop();
  }

}

function drawHomeScreen() {

  // Reset game-related variables when entering start screen
  adPopups = [];
  score = 0;
  timeRemaining = timeLimit;
  finalTimeTaken = 0;
  currentInfluenceRadius = baseInfluenceRadius;
  currentOverlayAlpha = baseOverlayAlpha;
  influenceBoostEndTime = 0;
  overlayDimEndTime = 0;
  adsBlockedUntil = 0;

  image(startImg, 0, 0);

  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(35);
  text("Guide the cattle/braincells with your cursor", 500, 375);
  text("to the end to complete your work!", 500, 425);
  pop();

  //draw start button
  push();
  fill(255);
  rectMode(CENTER);
  noStroke();
  rect(500, 600, 200, 60, 10);
  pop();

  push();
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Start", 500, 600);
  pop();

  //draw credit button
  push();
  fill(255);
  rectMode(CENTER);
  noStroke();
  rect(500, 750, 200, 60, 10);
  pop();

  push();
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Credits", 500, 750);
  pop();

  push();
  noStroke()
  ellipse(mouseX,mouseY, 15, 15); //makes the mouse an ellipse
  pop();
}

function drawCreditsScreen() {

  background(0);
  push();
  fill(255);
  textAlign(CENTER, CENTER);

  textSize(48);
  text("Credits", width / 2, 150);

  textSize(28);
  text("Aegean Dreams - Ancient Greek Music by Farya Faraji on Youtube", width / 2, 300);
  text("Audios by lietoofine, nickcase, Seth_Makes_Sounds, olivertravian,", width / 2, 350);
  text("TheBuilder15, Marevnik, BeezleFM, stwime, Timbre,", width / 2, 400);
  text("EminYILDIRIM and inkedflorist on Freesound.org", width / 2, 450);
  pop();

  //Back button
  push();
  fill(255);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noStroke();
  rect(width / 2, 800, 200, 60, 10);

  fill(0);
  textSize(32);
  text("Back", width / 2, 800);
  pop();

  push();
  noStroke()
  ellipse(mouseX,mouseY, 15, 15); //makes the mouse an ellipse
  pop();

}

function startGame() {
  gameState = "game";
  nextAdTime = millis() + random(5000, 10000);
  gameStartTime = millis();
  score = 0;

  boids = [];
  for (let i = 0; i < 50; i++) {
    boids.push(new Boid(150, 950));
  }

  adPopups = []; // clear old popups
  spawnAdPopup(); // start first ad

  if (!bgm.isPlaying()) {
    bgm.setVolume(0.03);
    bgm.loop();
  }
}

function drawEndScreen() {
  image(endImg, 0, 0);

  push();
  fill(255);
  textSize(48);
  text(`Final Score: ${score}%`, 200, 550);

  textSize(32);
  text(`Time taken: ${finalTimeTaken.toFixed(1)}s`, 200, 600);

  //grade text
  let grade;
  if (score >= 90) grade = "Amazing! You've passed with flying colors!";
  else if (score >= 80) grade = "Grade : A — Excellent work!";
  else if (score >= 70) grade = "Grade : B — Respectable effort!";
  else if (score >= 60) grade = "Grade : C — You passed, sometimes that's all that matters!";
  else if (score >= 50) grade = "Grade : D — You tried.";
  else grade = "Grade : E - The gods shall not be pleased..."
  textSize(36);
  text(grade, 200, 650);

  pop();

  //draw start button
  push();
  fill(255);
  rectMode(CENTER);
  noStroke();
  rect(500, 750, 200, 60, 10);
  pop();

  push();
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Restart", 500, 750);
  pop();

  push();
  noStroke();
  ellipse(mouseX, mouseY, 15, 15);
  pop();
}

function spawnAdPopup() {
  if (millis() < adsBlockedUntil) return;
  let randomIndex = floor(random(popupImgs.length));
  let randomImg = popupImgs[randomIndex];
  let adSound;

  // check for special sound
  if (popupSoundMap[randomIndex]) {
    adSound = popupSoundMap[randomIndex];
  } else {
    adSound = random(adSounds);
  }

  let hasButton = popupHasButton[randomIndex];
  let buttonText = popupButtonTexts[randomIndex];

  let ad = new PopupImgs(randomImg, adSound, hasButton, buttonText);
  adPopups.push(ad);
}

function isWall(x, y) {
  //avoid reading outside the image boundaries
  if (x < 0 || x >= width || y < 0 || y >= height) return true;

  let c = mazeImg.get(floor(x), floor(y));
  return (c[0] === 21 && c[1] === 10 && c[2] === 9); //dark walls
}

function mousePressed() {
  if (gameState === "start") {
    let btnX = 500;
    let btnY = 600;
    let btnW = 200;
    let btnH = 60;

    //start button
    if (
      mouseX >= btnX - btnW / 2 &&
      mouseX <= btnX + btnW / 2 &&
      mouseY >= btnY - btnH / 2 &&
      mouseY <= btnY + btnH / 2
    ) {
      startGame();
      return;
    }

    //credits button
    let creditsBtnY = 750;
    if (
      mouseX >= btnX - btnW / 2 &&
      mouseX <= btnX + btnW / 2 &&
      mouseY >= creditsBtnY - btnH / 2 &&
      mouseY <= creditsBtnY + btnH / 2
    ) {
      gameState = "credits";
      return;
    }
  }

      //back button on credits page
      if (gameState === "credits") {
      let btnX = width / 2;
      let btnY = 800;
      let btnW = 200;
      let btnH = 60;

      if (
        mouseX >= btnX - btnW / 2 &&
        mouseX <= btnX + btnW / 2 &&
        mouseY >= btnY - btnH / 2 &&
        mouseY <= btnY + btnH / 2
      ) {
        gameState = "start";
        return;
      }
    }

    //restart button on end page
    if (gameState === "end") {
      let btnX = 500;
      let btnY = 750;
      let btnW = 200;
      let btnH = 60;

      if (
        mouseX >= btnX - btnW / 2 &&
        mouseX <= btnX + btnW / 2 &&
        mouseY >= btnY - btnH / 2 &&
        mouseY <= btnY + btnH / 2
      ) {
      gameState = "start"; // go back to the start screen
      return;
      }
    }

  if (gameState === "game") {

    clickSound.play(); //click sound when pressing mouse

    for (let i = adPopups.length - 1; i >= 0; i--) {
      let ad = adPopups[i];

      //check if the X (close) was clicked
      if (ad.isClicked(mouseX, mouseY)) {
        ad.stopSound();
        adPopups.splice(i, 1);
        break;
      }

      //check if the optional orange button was clicked
      if (ad.hasButton && ad.isButtonClicked(mouseX, mouseY)) {
        let popupIndex = popupImgs.indexOf(ad.img);

        // Handle specific ad effects
        if (popupIndex === 7) { 
          currentInfluenceRadius = baseInfluenceRadius * 2.5;
          influenceBoostEndTime = millis() + 7000;
        } 
        else if (popupIndex === 9) { 
          currentInfluenceRadius = baseInfluenceRadius * 2.5;
          influenceBoostEndTime = millis() + 7000;
        } 
        else if (popupIndex === 0) { 
          currentOverlayAlpha = 100;
          overlayDimEndTime = millis() + 7000;
        } 
        else if (popupIndex === 6) { 
          adsBlockedUntil = millis() + 30000;
        } 
        else {
          for (let j = 0; j < 10; j++) {
            spawnAdPopup();
          }
        }

        // Remove the popup after button click
        ad.stopSound();
        adPopups.splice(i, 1);

        break;
      }
    }
  }
}


class PopupImgs {
  constructor(img, sound = null, hasButton = false, buttonText = "") {
    this.img = img;
    this.sound = sound;
    this.hasButton = hasButton;
    this.buttonText = buttonText;

    this.x = random(width - img.width);
    this.y = random(height - img.height);
    this.closeSize = 40; // size of the 'X' button
    // pick a random corner: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right
    this.corner = floor(random(4));

    //button setup
    if (this.hasButton) {
      this.buttonW = 180;
      this.buttonH = 60;
      this.buttonX = this.x + this.img.width / 2 - this.buttonW / 2;
      this.buttonY = this.y + this.img.height - this.buttonH - 20;
    }

    // play sound if there is one
    if (this.sound) {
      this.sound.setVolume(0.3);
      this.sound.play();
    }
  }

  show() {
    image(this.img, this.x, this.y);

    // determine button position based on corner
    let bx, by;
    switch (this.corner) {
      case 0: // top-left
        bx = this.x;
        by = this.y;
        break;
      case 1: // top-right
        bx = this.x + this.img.width - this.closeSize;
        by = this.y;
        break;
      case 2: // bottom-left
        bx = this.x;
        by = this.y + this.img.height - this.closeSize;
        break;
      case 3: // bottom-right
        bx = this.x + this.img.width - this.closeSize;
        by = this.y + this.img.height - this.closeSize;
        break;
    }

    // draw the x button bg
    push();
    fill(255, 0, 0);
    noStroke();
    rect(bx, by, this.closeSize, this.closeSize);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(30);
    text('X', bx + this.closeSize / 2, by + this.closeSize / 2);
    pop();

    // Draw the optional orange button
    if (this.hasButton) {
      push();
      fill(255, 140, 0); // orange
      noStroke();
      rect(this.buttonX, this.buttonY, this.buttonW, this.buttonH, 10);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(20);
      text(this.buttonText, this.buttonX + this.buttonW / 2, this.buttonY + this.buttonH / 2);
      pop();
    }
  }

  isClicked(px, py) {
    let bx, by;
    switch (this.corner) {
      case 0:
        bx = this.x;
        by = this.y;
        break;
      case 1:
        bx = this.x + this.img.width - this.closeSize;
        by = this.y;
        break;
      case 2:
        bx = this.x;
        by = this.y + this.img.height - this.closeSize;
        break;
      case 3:
        bx = this.x + this.img.width - this.closeSize;
        by = this.y + this.img.height - this.closeSize;
        break;
    }

    return (
      px >= bx &&
      px <= bx + this.closeSize &&
      py >= by &&
      py <= by + this.closeSize
    );
  }

  isButtonClicked(px, py) {
  if (!this.hasButton) return false;
  return (
    px >= this.buttonX &&
    px <= this.buttonX + this.buttonW &&
    py >= this.buttonY &&
    py <= this.buttonY + this.buttonH
  );
}

    stopSound() {
    if (this.sound && this.sound.isPlaying()) {
      this.sound.stop();
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

  // If the mouse is over a wall, do nothing
  if (isWall(mouseX, mouseY)) return;

  let mouse = createVector(mouseX, mouseY);
  let distance = p5.Vector.dist(mouse, this.position); //distance between mouse and boid
  let mouseInfluenceRadius = 80;

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
  this.velocity.limit(2.5);
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