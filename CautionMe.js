// Caution Me — an interactive art piece about mental warmth

let cautionImages = [];
let backgroundImage;
let cautionLines = [];
let maxCautionLines = 40;
let frameInterval = 5;
let timer = 0;
let isMouseClicked = false;
let stopGenerating = false;

let state = 'intro';  // 'intro' | 'playing' | 'ending'
let win = false;

// Buttons for navigation
let startBtn = { x: 0, y: 0, w: 260, h: 64 };
let restartBtn = { x: 0, y: 0, w: 260, h: 64 };
let startHover = false;
let restartHover = false;

let previewLines = [];
const PREVIEW_COUNT = 8;

let warmWhite = [255, 248, 240];
let softRed = [220, 120, 120];
let warmBlue = [120, 180, 220];
let warmYellow = [255, 215, 50]; // bright yellow

function preload() {
  for (let i = 0; i < 6; i++) {
    cautionImages[i] = loadImage("images/caution" + (i + 1) + ".PNG");
  }
  backgroundImage = loadImage("images/Background.png");
}

function setup() {
  createCanvas(640, 480);
  
  // Centre buttons
  startBtn.x = width / 2 - startBtn.w / 2;
  startBtn.y = height / 2 + 110;
  restartBtn.x = width / 2 - restartBtn.w / 2;
  restartBtn.y = height / 2 + 110;
  
  // Build preview lines
  for (let i = 0; i < PREVIEW_COUNT; i++) {
    previewLines.push({
      x: random(width),
      y: random(height),
      angle: random(TWO_PI),
      img: random(cautionImages),
      speed: random(0.003, 0.015),
      dx: random(-0.3, 0.3),
      dy: random(-0.3, 0.3),
      scale: random(1.0, 1.8)
    });
  }
}

function draw() {
  if (state === 'intro') drawIntro();
  else if (state === 'playing') drawPlaying();
  else if (state === 'ending') drawEnding();
}

function drawIntro() {
  background(backgroundImage);
  
  // Floating preview shapes
  for (let line of previewLines) {
    push();
    translate(line.x, line.y);
    rotate(line.angle);
    imageMode(CENTER);
    let w = line.img.width * line.scale;
    let h = line.img.height * line.scale;
    image(line.img, 0, 0, w, h);
    pop();
    
    line.x += line.dx;
    line.y += line.dy;
    line.angle += line.speed;
    if (line.x < -30 || line.x > width + 30) line.dx *= -1;
    if (line.y < -30 || line.y > height + 30) line.dy *= -1;
    line.x = constrain(line.x, -30, width + 30);
    line.y = constrain(line.y, -30, height + 30);
  }
  
  noStroke();
  fill(0, 0, 0, 170);
  rect(0, 0, width, height);
  
  push();
  textSize(58);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  
  // Shadow
  fill(0, 0, 0, 200);
  text('Caution Me', width/2 + 3, height/2 - 130 + 3);
  
  // Main title
  fill(warmYellow[0], warmYellow[1], warmYellow[2]);
  text('Caution Me', width/2, height/2 - 130);
  pop();
  
  // Subtitle
  noStroke();
  fill(255, 250, 240);
  textSize(22);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  text('A gentle journey through quiet thoughts and warm presence.', width/2, height/2 - 60);
  
  // Description
  fill(220, 215, 210);
  textSize(17);
  let desc = 'Sometimes we carry heavy feelings that slowly close us off.\n'
           + 'Here, you can gently tap away the shadows — but be kind,\n'
           + 'for pushing too hard may invite more. This is a space to\n'
           + 'notice, not to conquer.';
  text(desc, width/2, height/2 + 10);
  
  // Start button – with improved clarity
  drawButton(startBtn, 'Begin', startHover, softRed, [180, 80, 80]);
}

function drawPlaying() {
  background(backgroundImage);

  for (let i = cautionLines.length - 1; i >= 0; i--) {
    cautionLines[i].display();
  }

  // Clicking accelerates the arrival of new thoughts
  if (isMouseClicked && frameInterval < 100) {
    frameInterval += 0.05;
  }

  timer += 1;
  if (!stopGenerating && cautionLines.length < maxCautionLines && timer >= frameInterval) {
    cautionLines.push(new CautionLine());
    timer = 0;
  }
  
  // Win / lose conditions
  if (cautionLines.length === 0 && stopGenerating === true) {
    win = true;
    state = 'ending';
  }
  if (cautionLines.length >= maxCautionLines) {
    win = false;
    state = 'ending';
  }
  
  drawHUD();
}

function drawHUD() {
  noStroke();
  fill(0, 0, 0, 170);
  rect(10, 10, 190, 42, 14);
  fill(255, 250, 240);
  textSize(18);
  textAlign(LEFT, CENTER);
  text('💭 thoughts: ' + cautionLines.length + '/' + maxCautionLines, 22, 30);
  
  let speed = map(frameInterval, 5, 100, 0, 100);
  let mood = speed < 30 ? 'calm' : speed < 60 ? 'rippling' : 'swirling';
  fill(0, 0, 0, 170);
  rect(210, 10, 140, 42, 14);
  fill(220, 215, 210);
  textSize(15);
  text('🌊 ' + mood, 220, 30);
}

function drawEnding() {
  background(backgroundImage);
  for (let i = cautionLines.length - 1; i >= 0; i--) {
    cautionLines[i].display();
  }
  
  // Strong overlay for readability
  noStroke();
  fill(0, 0, 0, 190);
  rect(0, 0, width, height);
  
  // Result title: yellow if win, soft red if lose
  let titleCol = win ? warmYellow : [255, 180, 180];
  push();
  textSize(48);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  // Shadow
  fill(0, 0, 0, 200);
  text(win ? '✨ You listened ✨' : '🌧️ A quiet weight remains', width/2 + 2, height/2 - 110 + 2);
  // Main
  fill(titleCol[0], titleCol[1], titleCol[2]);
  text(win ? '✨ You listened ✨' : '🌧️ A quiet weight remains', width/2, height/2 - 110);
  pop();
  
  // Message
  fill(0, 0, 0, 180);
  rect(width/2 - 240, height/2 - 50, 480, 100, 14);
  fill(255, 250, 240);
  textSize(20);
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  let message = win ? 
    'You gently acknowledged each thought.\n'
    + 'That warmth can reach farther than you know.' :
    'Sometimes we cannot carry it all alone.\n'
    + 'Reach out, or simply stay near.\n'
    + 'Your presence matters more than you think.';
  text(message, width/2, height/2 - 5);
  
  fill(200, 195, 190);
  textSize(17);
  let cleared = maxCautionLines - cautionLines.length;
  text('💚 cleared: ' + cleared + '  ·  left: ' + cautionLines.length, width/2, height/2 + 65);
  
  // Restart button
  drawButton(restartBtn, 'To Save Next One...', restartHover, warmBlue, [80, 140, 180]);
}

function drawButton(btn, label, hover, baseCol, hoverCol) {
  let c = hover ? hoverCol : baseCol;
  noStroke();
  // Button shadow
  fill(0, 0, 0, 80);
  rect(btn.x + 3, btn.y + 3, btn.w, btn.h, 18);
  // Main button
  fill(c[0], c[1], c[2]);
  rect(btn.x, btn.y, btn.w, btn.h, 18);
  if (hover) {
    // Glow
    fill(c[0], c[1], c[2], 60);
    rect(btn.x - 4, btn.y - 4, btn.w + 8, btn.h + 8, 22);
    fill(c[0], c[1], c[2]);
    rect(btn.x, btn.y, btn.w, btn.h, 18);
  }
  fill(255, 252, 248);
  textSize(24);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(label, btn.x + btn.w/2, btn.y + btn.h/2 + 1);
}

function mousePressed() {
  if (state === 'intro') {
    if (mouseX > startBtn.x && mouseX < startBtn.x + startBtn.w &&
        mouseY > startBtn.y && mouseY < startBtn.y + startBtn.h) {
      resetGame();
      state = 'playing';
    }
    return;
  }
  
  if (state === 'ending') {
    if (mouseX > restartBtn.x && mouseX < restartBtn.x + restartBtn.w &&
        mouseY > restartBtn.y && mouseY < restartBtn.y + restartBtn.h) {
      resetGame();
      state = 'playing';
    }
    return;
  }
  
  if (state === 'playing') {
    if (!isMouseClicked) isMouseClicked = true;
    for (let i = cautionLines.length - 1; i >= 0; i--) {
      let line = cautionLines[i];
      if (line.isClicked(mouseX, mouseY)) {
        cautionLines.splice(i, 1);
        break;
      }
    }
    if (cautionLines.length === 0) {
      stopGenerating = true;
    }
  }
}

function mouseMoved() {
  if (state === 'intro') {
    startHover = (mouseX > startBtn.x && mouseX < startBtn.x + startBtn.w &&
                  mouseY > startBtn.y && mouseY < startBtn.y + startBtn.h);
  }
  if (state === 'ending') {
    restartHover = (mouseX > restartBtn.x && mouseX < restartBtn.x + restartBtn.w &&
                    mouseY > restartBtn.y && mouseY < restartBtn.y + restartBtn.h);
  }
}

function resetGame() {
  cautionLines = [];
  stopGenerating = false;
  timer = 0;
  frameInterval = 5;
  isMouseClicked = false;
  win = false;
  startHover = false;
  restartHover = false;
}

class CautionLine {
  constructor() {
    this.img = random(cautionImages);
    this.scaleFactor = 1.3;
    this.len = this.img.width * this.scaleFactor;
    this.wid = this.img.height * this.scaleFactor;
    this.angle = random(TWO_PI);
    this.calcPosition();
  }

  calcPosition() {
    let edge = floor(random(4));
    if (edge === 0) { // top
      this.x = random(-10, width + 10);
      this.y = -10;
    } else if (edge === 1) { // bottom
      this.x = random(-10, width + 10);
      this.y = height + 10;
    } else if (edge === 2) { // left
      this.x = -10;
      this.y = random(-10, height + 10);
    } else { // right
      this.x = width + 10;
      this.y = random(-10, height + 10);
    }
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.img, 0, 0, this.len, this.wid);
    pop();
  }

  isClicked(mx, my) {
    let dx = mx - this.x;
    let dy = my - this.y;
    let localX = cos(-this.angle) * dx - sin(-this.angle) * dy;
    let localY = sin(-this.angle) * dx + cos(-this.angle) * dy;
    return abs(localX) < this.len / 2 && abs(localY) < this.wid / 2;
  }
}
