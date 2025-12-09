/**
Dress to Repress
Catherine Zaloshnja

bgm music by : https://freesound.org/people/Seth_Makes_Sounds/sounds/666720/
whispers sfx by : https://freesound.org/people/IENBA/sounds/656439/
 */

"use strict";

let gameState = "dressup" //can be "start", "dressup", "critique" "end"

//array of all clothing items + their properties
let clothes = {

  overalls: { img:null, uiX:1310, uiY:175, bodyX:728, bodyY:404, category:"dress",
              comment: "'Those overalls make you look like a clown.'" },

  dress:    { img:null, uiX:1310, uiY:480, bodyX:727, bodyY:385, category:"dress",
              comment: "'Where did you find that dress? In the trash?'" },

  dress2:   { img:null, uiX:1100, uiY:620, bodyX:730, bodyY:395, category:"dress",
              comment: "'That dress isn't very flattering on you..'" },

  top:      { img:null, uiX:1100, uiY:380, bodyX:724, bodyY:320, category:"tops",
              comment: "'Aren't you showing too much?'" },

  top2:     { img:null, uiX:990, uiY:300, bodyX:725, bodyY:307, category:"tops",
              comment: "'That top is inappropriate.'" },

  shirt:    { img:null, uiX:445, uiY:100, bodyX:726, bodyY:316, category:"tops",
              comment: "'Why don't you wear more feminine clothes?'" },

  sweater:   { img:null, uiX:375, uiY:580, bodyX:728, bodyY:325, category:"tops",
              comment: "'That sweater looks so old, you should throw it away.'" },

  hat:      { img:null, uiX:1000, uiY:150, bodyX:724, bodyY:150, category:"hats",
              comment: "'That hat makes you look like a nerd.'" },

  hat2:     { img:null, uiX:1146, uiY:230, bodyX:724, bodyY:150, category:"hats",
              comment: "'Aren't hats like that meant for kids?'" },

  hat3:     { img:null, uiX:1146, uiY:110, bodyX:726, bodyY:150, category:"hats",
              comment: "'That hat makes you look like a boy.'" },

  shorts:   { img:null, uiX:350, uiY:394, bodyX:727, bodyY:430, category:"bottoms",
              comment: "'Those shorts look ridiculous.'" },

  pants:    { img:null, uiX:115, uiY:186, bodyX:730, bodyY:495, category:"bottoms",
              comment: "'Aren't those pants too wide on you?.'" },
  
  pants2:   { img:null, uiX:280, uiY:175, bodyX:725, bodyY:495, category:"bottoms",
              comment: "'Why are you wearing saggy pants...it doesn't suit you..'" },

  skirt:    { img:null, uiX:150, uiY:510, bodyX:721, bodyY:495, category:"bottoms",
              comment: "'You have the fashion taste of a grandma.'" }
};

//list of all the girl's dialogue lines
let dialogueLines = [
  "I can't wait to go out tonight, and I've got just the outfit for it!",
  "This time I'm going out to the parc! No way I can mess up my outfit.",
  "Hmm… maybe this time I'll nail the look.",
  "Is there really something wrong with the way I dress?",
  "I hope they won’t judge me again…",
  "I don't feel like going out...",
  "..."
];

let lastState = "";

let dialogueIndex = 0;

//stores the comments the players will receive
let endComments = [];

let commentStartTime = 0;

let critiqueVisuals = []; 

let critiqueFadeDuration = 2000;   // 1 second fade-in
let critiqueTextFadeIn = 800;      // text appears after fade
let critiqueTextFadeOutStart = 3000; // start fading out
let critiqueTotalDuration = 4000;  // whole sequence

//comments that appear on dressup screen
let popupMessage = "";
let popupStartTime = 0;

//ui img assets
let bgImg;
let headOutBtnImg;
let girlSpriteImg;
let girlPortraitImg;
let eyeImg;

let dressupMusic;
let whisper;


//clothing img assets
let overallsImg;
let dressImg;
let dress2Img;
let hatImg;
let hat2Img;
let hat3Img;
let pantsImg;
let pants2Img;
let shortsImg;
let skirtImg;
let topImg;
let top2Img;
let shirtImg;
let sweaterImg;


//keeps track of what clothing items are equipped
let equipped = {
    hat: false,
    hat2: false,
    hat3: false,
    top: false,
    top2: false,
    pants: false,
    pants2: false,
    skirt: false,
    shorts: false,
    overalls: false,
    dress: false,
    dress2: false,
    shirt: false,
    sweater: false
};

//keeps track of the clothing items that were previously criticized, once true the player can no longer equip them
let banned = {
    hat: false,
    hat2: false,
    hat3: false,
    top: false,
    top2: false,
    pants: false,
    pants2: false,
    skirt: false,
    shorts: false,
    overalls: false,
    dress: false,
    dress2: false,
    shirt: false,
    sweater: false
};

function preload() {

    //loading all img assets
    bgImg = loadImage("assets/images/bgp.png");
    girlSpriteImg = loadImage("assets/images/girl2.png");
    headOutBtnImg = loadImage("assets/images/headout.png");
    girlPortraitImg = loadImage("assets/images/test.gif");
    eyeImg = loadImage("assets/images/eye.gif");

    overallsImg = loadImage("assets/images/overalls2.png");
    hatImg = loadImage("assets/images/hat.png");
    hat2Img = loadImage("assets/images/buckethat.png");
    hat3Img = loadImage("assets/images/tuque.png");
    pantsImg = loadImage("assets/images/pants3.png");
    pants2Img = loadImage("assets/images/pants2.png");
    shortsImg = loadImage("assets/images/shorts.png");
    skirtImg = loadImage("assets/images/skirt.png");
    topImg = loadImage("assets/images/top.png");
    top2Img = loadImage("assets/images/top2.png");
    dressImg = loadImage("assets/images/dress3.png");
    dress2Img = loadImage("assets/images/dress2.png");
    shirtImg = loadImage("assets/images/shirt2.png");
    sweaterImg = loadImage("assets/images/sweater2.png");

    dressupMusic = loadSound("assets/sounds/bgm.wav");
    whisper = loadSound("assets/sounds/whispers.wav");


    clothes.overalls.img = overallsImg;
    clothes.top.img = topImg;
    clothes.top2.img = top2Img;
    clothes.hat.img = hatImg;
    clothes.hat2.img = hat2Img;
    clothes.hat3.img = hat3Img;
    clothes.shorts.img = shortsImg;
    clothes.pants.img = pantsImg;
    clothes.pants2.img = pants2Img;
    clothes.skirt.img = skirtImg;
    clothes.dress.img = dressImg;
    clothes.dress2.img = dress2Img;
    clothes.shirt.img = shirtImg;
    clothes.sweater.img = sweaterImg;

}

function setup() {
    createCanvas(1440, 960);

}

function draw() {

  background(0);

  if (gameState !== lastState) {
    onEnterState(gameState);
    lastState = gameState;
  }

  if (gameState === "start") {
     // title screen stuff
  }

  else if (gameState === "dressup") {
     drawDressup();

         if (whisper.isPlaying()) {
        whisper.stop(); // stop whispers immediately
    }

         // restart music
    if (!dressupMusic.isPlaying()) {
        dressupMusic.setVolume(1);
        dressupMusic.loop();   // continually loop
    }
  }

  else if (gameState === "critique") {
    drawCritiqueSequence();
  }

  else if (gameState === "end") {
     drawEndScreen();
  }

}

function drawDressup() {

    image(bgImg, 0, 0);

    //displaying all ui assets
    girlPortraitImg.resize(200, 200);
    image(girlPortraitImg, 16, 744);
    image(girlSpriteImg, 600, 130);
    image(headOutBtnImg, 1160, 834);

    //displaying all clothing "buttons" + head out button
    push();
    imageMode(CENTER);

    for (let item in clothes) {
      let c = clothes[item];
      image(c.img, c.uiX, c.uiY);
    }
    pop();

    //displaying all clothing on the girl
    push();
    imageMode(CENTER);
    for (let item in clothes) {
      if (equipped[item]) {
        let c = clothes[item];
        image(c.img, c.bodyX, c.bodyY);
      }
    }
    pop();

    //displaying comments
    if (popupMessage) {
      push();
      textAlign(CENTER, CENTER);
      textSize(28);
      textStyle(BOLD);
      fill(232, 78, 160);
      text(popupMessage, 680, 876);
      pop();
    }

}

function drawCritiqueSequence() {
  

  let t = millis() - commentStartTime;

  // Fade to black (0 → 255)
  let fadeAmount = constrain(map(t, 0, critiqueFadeDuration, 0, 255), 0, 255);

    // Draw background eyes that fade with the screen
    push();
    
    tint(255, fadeAmount * 1);// slightly dimmer than full fade

    let tileW = 355;
    let tileH = 261;

    for (let x = 0; x < width; x += tileW) {
        for (let y = 0; y < height; y += tileH) {
            image(eyeImg, x, y);
        }
    }

    pop();


  // Background fade
  push();
  fill(0, fadeAmount);
  rect(0, 0, width, height);
  pop();

  // Draw comments after fade-in begins
  for (let i = 0; i < endComments.length; i++) {

    let c = endComments[i];
    let pos = critiqueVisuals[i];

    let alpha = 0;

    // Fade-in phase
    if (t > critiqueTextFadeIn && t < critiqueTextFadeOutStart) {
        alpha = map(t, critiqueTextFadeIn, critiqueTextFadeIn + 500, 0, 255);  
    }

    // Fade-out phase
    if (t > critiqueTextFadeOutStart) {
        alpha = map(t, critiqueTextFadeOutStart, critiqueTotalDuration, 255, 0);
    }


    alpha = constrain(alpha, 0, 255);

    push();
    fill(255, alpha);
    textAlign(CENTER, CENTER);
    textSize(32);
    text(c, pos.x, pos.y);
    pop();
  }
  

  if (t > critiqueTotalDuration) {

      // Check if game should end
      if (allCoreClothingBanned()) {
        gameState = "end";
      } else {
        gameState = "dressup";
      }
  }
}

function drawEndScreen() {

    push();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Maybe I'll just stay home instead...", width/2, height/2);
    text("(the end)", width/2, height/2+40);
    pop();

}

//checks if the mouse is inside the clothing "button"
function isClicked(img, imgX, imgY) {

  let w = img.width;
  let h = img.height;

  return mouseX > imgX - w/2 &&
         mouseX < imgX + w/2 &&
         mouseY > imgY - h/2 &&
         mouseY < imgY + h/2;
}

function onEnterState(state) {
  if (state === "dressup") {
    popupMessage = dialogueLines[dialogueIndex];
    popupStartTime = millis();

    //move to next dialogue line for next loop
    dialogueIndex++;
    if (dialogueIndex >= dialogueLines.length) {
      dialogueIndex = dialogueLines.length - 1; //stay on last line
    }
  }
}

//makes sure that the player is dressed enough to head out
function outfitCheck() {
  let hasTop = equipped.top || equipped.shirt || equipped.top2 || equipped.sweater;
  let hasBottom = equipped.shorts || equipped.pants || equipped.skirt || equipped.pants2;
  let hasDress = equipped.overalls || equipped.dress || equipped.dress2;
  //let hasShoes = false; // add later when you make shoes

  //Must have either a dress OR top + bottom
  if (!hasDress && !(hasTop && hasBottom)) {
    if (!hasTop && !hasBottom) return "I'm not going out basically naked!";
    if (!hasTop) return "I'm not heading out without a top!";
    if (!hasBottom) return "I'm not heading out without any bottoms!";
  }

  //Shoes rule (add later)
  // if (!hasShoes) {
  //   // return "I need shoes if I'm heading out!";
  // }

  return null; //valid outfit
}

function allCoreClothingBanned() {
  let anyTop = false;
  let anyBottom = false;
  let anyDress = false;

  for (let item in clothes) {
    let cat = clothes[item].category;

    if (cat === "tops" && !banned[item]) anyTop = true;
    if (cat === "bottoms" && !banned[item]) anyBottom = true;
    if (cat === "dress" && !banned[item]) anyDress = true;
  }

  //If none of these categories have at least one wearable item → end state
  return !anyTop && !anyBottom && !anyDress;
}

function mousePressed() {
  for (let item in clothes) {
    let c = clothes[item];

    if (isClicked(c.img, c.uiX, c.uiY)) {

      if (banned[item]) {
        //show the specific comment for this banned item
        popupMessage = clothes[item].comment;
        popupStartTime = millis();
        return; //doesn't equipe the item
      }
      
      //unequips the item if it is already equipped
      if (equipped[item]) {
        equipped[item] = false;
        return; //done
      }

      //dresses clear tops + bottoms + dresses
      if (c.category === "dress") {
        for (let other in clothes) {
          let cat = clothes[other].category;
          if (cat === "tops" || cat === "bottoms" || cat === "dress") {
            equipped[other] = false;
          }
        }
      }
      else {
        //remove all clothing in the same category
        for (let other in clothes) {
          if (clothes[other].category === c.category) {
            equipped[other] = false;
          }
        }

        //clear any dress if equipping a top or bottom
        if (c.category === "tops" || c.category === "bottoms") {
          for (let other in clothes) {
            if (clothes[other].category === "dress") {
              equipped[other] = false;
            }
          }
        }
      }

      //equip the clicked item
      equipped[item] = true;
    }
  }

  //checks if head out button is clicked
  if (isClicked(headOutBtnImg, 1286, 870)) {

    //checks if player is clothed enough, if not, display appropriate message
    let failReason = outfitCheck();

    if (failReason) {
        popupMessage = failReason;
        popupStartTime = millis();
        return;
    }

    //if clothed, continue normally

    endComments = []; // clear previous

    //collect comments from equipped items
    for (let item in equipped) {
      if (equipped[item] && clothes[item].comment) {
        endComments.push(clothes[item].comment);

      //can't wear the same item again
      banned[item] = true;

      //unequip it for the next round
      equipped[item] = false;
      }
    }

    //generate random positions for each criticism line
    critiqueVisuals = endComments.map(() => ({
        x: random(400, width - 400),
        y: random(300, height - 300),
    }));

    // Go to insult sequence
    commentStartTime = millis();
    gameState = "critique";
    dressupMusic.stop();
        // Start whisper fade-in
    if (!whisper.isPlaying()) {
        whisper.loop(); // start looping the whisper sound immediately
    }
  }
}