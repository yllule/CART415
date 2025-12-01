/**
Dress to Repress
Catherine Zaloshnja
 */

"use strict";

let gameState = "dressup" //can be "start", "dressup", "critique" "end"

//array of all clothing items + their properties
let clothes = {

  overalls: { img:null, uiX:655, uiY:194, bodyX:365, bodyY:202, category:"dress",
              comment: "Those overalls make you look like a clown." },

  top:      { img:null, uiX:550, uiY:183, bodyX:362, bodyY:163, category:"tops",
              comment: "That top looks weird on you." },

  hat:      { img:null, uiX:573, uiY:94, bodyX:362, bodyY:75, category:"hats",
              comment: "That hat doesn't suit you." },

  shorts:   { img:null, uiX:175, uiY:197, bodyX:365, bodyY:225, category:"bottoms",
              comment: "Those shorts look ridiculous." },

  pants:    { img:null, uiX:98, uiY:93, bodyX:366, bodyY:252, category:"bottoms",
              comment: "Those pants don't look good on you." },

  skirt:    { img:null, uiX:75, uiY:255, bodyX:361, bodyY:250, category:"bottoms",
              comment: "Haha you have the fashion taste of a grandma!" }
};

//list of all the girl's dialogue lines
let dialogueLines = [
  "I can't wait to go out tonight, and I've got just the outfit for it!",
  "Hmm… maybe this time I'll nail the look.",
  "Okay… new outfit, new chance. I've got this!",
  "They won’t judge me *again*… right?",
  "Alright… back at it. Third time’s the charm?"
];

let lastState = "";

let dialogueIndex = 0;

//stores the comments the players will receive
let endComments = [];

let commentStartTime = 0;

//comments that appear on dressup screen
let popupMessage = "";
let popupStartTime = 0;

//ui img assets
let bgImg;
let girlSpriteImg;
let headOutBtnImg;
let mirrorImg;
let uibordersImg;
let girlPortraitImg;


//clothing img assets
let overallsImg;
let hatImg;
let pantsImg;
let shortsImg;
let skirtImg;
let topImg;


//keeps track of what clothing items are equipped
let equipped = {
    hat: false,
    top: false,
    pants: false,
    skirt: false,
    shorts: false,
    overalls: false
};

//keeps track of the clothing items that were previously criticized, once true the player can no longer equip them
let banned = {
    hat: false,
    top: false,
    pants: false,
    skirt: false,
    shorts: false,
    overalls: false
};

function preload() {

    //loading all img assets
    bgImg = loadImage("assets/images/bg.png");
    girlSpriteImg = loadImage("assets/images/girl.png");
    headOutBtnImg = loadImage("assets/images/headout.png");
    mirrorImg = loadImage("assets/images/mirror.png");
    uibordersImg = loadImage("assets/images/uiborders.png");
    girlPortraitImg = loadImage("assets/images/test.gif");

    overallsImg = loadImage("assets/images/overalls.png");
    hatImg = loadImage("assets/images/hat.png");
    pantsImg = loadImage("assets/images/pants.png");
    shortsImg = loadImage("assets/images/shorts.png");
    skirtImg = loadImage("assets/images/skirt.png");
    topImg = loadImage("assets/images/top.png");

    clothes.overalls.img = overallsImg;
    clothes.top.img       = topImg;
    clothes.hat.img       = hatImg;
    clothes.shorts.img    = shortsImg;
    clothes.pants.img     = pantsImg;
    clothes.skirt.img     = skirtImg;

}

function setup() {
    createCanvas(720, 480);

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
    image(uibordersImg, 0, 0);
    girlPortraitImg.resize(100, 100);
    image(girlPortraitImg, 8, 372);
    image(mirrorImg, 220, 40);
    image(girlSpriteImg, 300, 65);
    image(headOutBtnImg, 577, 352);

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
    if (popupMessage && millis() - popupStartTime < 3000) {
      push();
      textAlign(CENTER, CENTER);
      textSize(18);
      fill(0);
      text(popupMessage, 340, 438);
      pop();
    }

}

function drawCritiqueSequence() {

  background(0);

  push();
  fill(255);
  textSize(20);
  textAlign(CENTER, TOP);

  let y = 120;
  for (let c of endComments) {
    text(c, width/2, y);
    y += 40;
  }

  pop();

  // You can play your animation here:
  // image(doorAnimationFrame, ...)

  // AFTER 3 SECONDS → return to dressup
  if (millis() - commentStartTime > 4000) {
    gameState = "dressup";
  }
}

function drawEndScreen() {

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
  let hasTop = equipped.top;
  let hasBottom = equipped.shorts || equipped.pants || equipped.skirt;
  let hasDress = equipped.overalls; // your dress category
  // let hasShoes = false; // add later when you make shoes

  // 1. Must have either a dress OR top + bottom
  if (!hasDress && !(hasTop && hasBottom)) {
    if (!hasTop && !hasBottom) return "You can't go out basically naked!";
    if (!hasTop) return "You can't go out without a top!";
    if (!hasBottom) return "You can't go out without bottoms!";
  }

  // // 2. Shoes rule (add this later when you have shoes)
  // if (!hasShoes) {
  //   // return "You can't go out barefoot!";
  // }

  return null; // Valid outfit
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
        return; // done
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
  if (isClicked(headOutBtnImg, 640, 370)) {

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

      //un-equip it for the next round
      equipped[item] = false;
      }
    }

    // Go to insult sequence
    commentStartTime = millis();
    gameState = "critique";
    }
}