/**
Dress to Repress
Catherine Zaloshnja
 */

"use strict";

let gameState = "start" //can be "start", "dressup", "end"

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

}

function setup() {
    createCanvas(720, 480);

}



function draw() {

    background(0);
    image(bgImg, 0, 0);

    //displaying all ui assets
    image(uibordersImg, 0, 0);
    girlPortraitImg.resize(100, 100);
    image(girlPortraitImg, 8, 372);
    image(mirrorImg, 220, 40);
    image(girlSpriteImg, 300, 65);
    image(headOutBtnImg, 577, 352);

    //displaying all clothing "buttons"
    push();
    imageMode(CENTER);
    image(overallsImg, 655, 194);
    image(topImg, 550, 183);
    image(hatImg, 573, 94);
    image(shortsImg, 175, 197);
    image(pantsImg, 98, 93);
    image(skirtImg, 75, 255);
    pop();

    //displaying all clothing on the girl
    push();
    imageMode(CENTER);
    // image(overallsImg, 365, 202);
    image(topImg, 362, 163);
    // image(hatImg, 362, 75);
    // image(shortsImg, 365, 225);
    // image(pantsImg, 366, 252);
    image(skirtImg, 361, 250);
    pop();

}