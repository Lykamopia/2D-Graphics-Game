// Global variables
var runStart = 0;
var runWorkerId = 0;
var jumpWorkerId = 0;
var backgroundWorkerId = 0;
var createBlockWorkerId = 0;
var moveBlockWorkerId = 0;
var scoreWorkerId = 0;
var deadWorkerId = 0;

// Elements
var player = document.getElementById("player");
var background = document.getElementById("background");
var score = document.getElementById("score");

// Sounds
var music = new Audio("sounds/game_music.mp3");
var runSound = new Audio("sounds/run.mp3");
var jumpSound = new Audio("sounds/jump.mp3");
var deadSound = new Audio("sounds/dead.mp3");
var trySound = new Audio("sounds/newlevel.mp3");

// Constants
var MAX_RUN_IMAGES = 12;
var MAX_JUMP_IMAGES = 13;
var BLOCK_MIN_MARGIN_LEFT = 400;
var BLOCK_MAX_MARGIN_LEFT = 1000;
var BLOCK_MOVE_STEP = 20;
var JUMP_MOVE_STEP = 20;
var PLAYER_START_MARGIN_TOP = 150;
var PLAYER_JUMP_MARGIN_TOP = 120;
var GAME_OVER_IMAGE_NUMBER = 17;

// Elements
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Set the canvas dimensions
canvas.width = 800; 
canvas.height = 400; 


function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw multiple small Christmas stars
  ctx.fillStyle = "#E7E6DD";

  // Draw two large stars
  drawStar(150, 100);
  drawStar(300, 200);
  

  // Draw 10 small stars randomly positioned

  for (let i = 0; i < 10; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    drawSmallStar(x, y);
  }
}

// Draw a large Christmas star
function drawStar(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x + 10, y - 5);
  ctx.lineTo(x + 35, y - 5);
  ctx.lineTo(x + 15, y + 10);
  ctx.lineTo(x + 25, y + 35);
  ctx.lineTo(x, y + 20);
  ctx.lineTo(x - 25, y + 35);
  ctx.lineTo(x - 15, y + 10);
  ctx.lineTo(x - 35, y - 5);
  ctx.lineTo(x - 10, y - 5);
  ctx.closePath();
  ctx.fill();
}

// Draw a small Christmas star
function drawSmallStar(x, y) {
  ctx.beginPath();
  ctx.moveTo(x, y - 15);
  ctx.lineTo(x + 3, y - 2);
  ctx.lineTo(x + 10, y - 2);
  ctx.lineTo(x + 4, y + 4);
  ctx.lineTo(x + 7, y + 10);
  ctx.lineTo(x, y + 7);
  ctx.lineTo(x - 7, y + 10);
  ctx.lineTo(x - 4, y + 4);
  ctx.lineTo(x - 10, y - 2);
  ctx.lineTo(x - 3, y - 2);
  ctx.closePath();
  ctx.fill();
}

// Call the draw function to initially render the canvas
draw();

// Event listener for key presses
function keyCheck(event) {
  if (event.which == 13) {
    if (runWorkerId == 0) {
      runGame();
    }
  }

  if (event.which == 32) {
    if (runStart == 1) {
      if (jumpWorkerId == 0) {
        clearInterval(runWorkerId);
        runSound.pause();
        runWorkerId = -1;
        jumpWorkerId = setInterval(jump, 100);
        jumpSound.play();
      }
    }
  }
}

// Run the game
function runGame() {
  runWorkerId = setInterval(run, 100);
  runStart = 1;
  runSound.loop = true;
  runSound.play();
  backgroundWorkerId = setInterval(moveBackground, 100);
  scoreWorkerId = setInterval(updateScore, 100);
  createBlockWorkerId = setInterval(createBlock, 100);
  moveBlockWorkerId = setInterval(moveBlocks, 100);
  music.loop = true;
  music.play();
}

// Run animation
var runImageNumber = 1;
function run() {
  runImageNumber++;
  if (runImageNumber > MAX_RUN_IMAGES) {
    runImageNumber = 1;
  }
  player.src = "/Run/Run (" + runImageNumber + ").png";
}

// Jump animation
var jumpImageNumber = 1;
var playerMarginTop = PLAYER_START_MARGIN_TOP;
function jump() {
  jumpImageNumber++;

  if (jumpImageNumber <= 7) {
    playerMarginTop -= JUMP_MOVE_STEP;
  }

  if (jumpImageNumber >= 8) {
    playerMarginTop += JUMP_MOVE_STEP;
  }

  if (jumpImageNumber == MAX_JUMP_IMAGES) {
    jumpImageNumber = 1;
    clearInterval(jumpWorkerId);
    jumpWorkerId = 0;
    runWorkerId = setInterval(run, 100);
    runSound.play();
  }

  player.style.marginTop = playerMarginTop + "px";
  player.src = "/Jump/jump (" + jumpImageNumber + ").png";
}

// Move background
var backgroundX = 0;
function moveBackground() {
  backgroundX -= BLOCK_MOVE_STEP;
  background.style.backgroundPositionX = backgroundX + "px";
}

// Update score
var newScore = 0;
function updateScore() {
  newScore += 5;
  score.innerHTML = newScore;
}

// Create blocks
var playerMarginLeft = 600;
var blockId = 1;
function createBlock() {
  var block = document.createElement("div");
  block.className = "block";
  block.id = "block" + blockId;
  blockId++;

  var gap = Math.random() * (BLOCK_MAX_MARGIN_LEFT - BLOCK_MIN_MARGIN_LEFT) + BLOCK_MIN_MARGIN_LEFT;
  playerMarginLeft += gap;
  block.style.marginLeft = playerMarginLeft + "px";
  background.appendChild(block);
}

// Move blocks
function moveBlocks() {
  for (var i = 1; i < blockId; i++) {
    var currentBlock = document.getElementById("block" + i);
    var currentMarginLeft = parseInt(currentBlock.style.marginLeft);
    var newMarginLeft = currentMarginLeft - BLOCK_MOVE_STEP;
    currentBlock.style.marginLeft = newMarginLeft + "px";

    if (newMarginLeft <= 181 && newMarginLeft >= 81 && playerMarginTop <= PLAYER_START_MARGIN_TOP && playerMarginTop >= PLAYER_JUMP_MARGIN_TOP) {
      clearInterval(runWorkerId);
      runSound.pause();
      clearInterval(jumpWorkerId);
      jumpWorkerId = -1;
      clearInterval(backgroundWorkerId);
      clearInterval(scoreWorkerId);
      clearInterval(createBlockWorkerId);
      clearInterval(moveBlockWorkerId);
      deadWorkerId = setInterval(dead, 100);
      deadSound.play();
    }
  }
}

// Game over animation
var deadImageNumber = 1;
function dead() {
  deadImageNumber++;
  if (deadImageNumber >= GAME_OVER_IMAGE_NUMBER) {
    deadImageNumber = GAME_OVER_IMAGE_NUMBER;
    player.style.marginTop = PLAYER_START_MARGIN_TOP + "px";
    document.getElementById("gameOver").style.visibility = "visible";
    document.getElementById("endScore").innerHTML = newScore;
    music.pause();
  }

  player.src = "/Dead/Dead (" + deadImageNumber + ").png";
}

var vid = document.getElementById("myVideo");
vid.playbackRate = 3.0;

// Restart the game
function restart() {
  location.reload();
}
