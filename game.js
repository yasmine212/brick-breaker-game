var can = document.getElementById('casse_brique');
var ctx = can.getContext('2d');

const paddleHeight = 14;
const paddleWidth = 180;
const ballHeight = 60;
const margin =25;
const margin1 = 60;
const brickColumnCount = 5;
const brickRowCount = 4;
const bricksWidth = 102;
const bricksHeight = 22;
let score=0;
let livesLeft=3;
let gameOver=false;

class BriqueBonus {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 100;  
      this.height = 20; 
      this.couleur = 'yellow'; 
      this.effet = 'PADDLE'; 
      }
    }
    class BriqueBonus2 {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.width = 100;  
          this.height = 20; 
          this.couleur = 'green'; 
          this.effet = 'BALL'; 
        }
    }

const paddle = {
    x: can.width / 2 - paddleWidth / 2,
    y: can.height - paddleHeight -margin ,
    width: paddleWidth,
    height: paddleHeight,
    dx: 12,
    
};

const ball = {
    x: can.width / 2,
    y: can.height - margin1,
    radius: 13,
    dx: 2,
    dy: -2,
};

let bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: c * (bricksWidth + 13) + 20,
            y: r * (bricksHeight + 10) + 70,
            vis: 1, 
            color :"rgb(70, 51, 82)",
        }
      }
    }

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];
            if (brick.vis === 1) {
                let brickX = brick.x;
                let brickY = brick.y;
                let grad = ctx.createLinearGradient(brickX, brickY, brickX + bricksWidth, brickY + bricksHeight);
                grad.addColorStop(0, 'rgba(231,206,255,0.9)'); 
                grad.addColorStop(1, 'rgb(217,176,255)'); 
                ctx.fillStyle = grad;
                const radius = 10;

                ctx.beginPath();
                ctx.moveTo(brickX + radius, brickY); 
                ctx.arcTo(brickX + bricksWidth, brickY, brickX + bricksWidth, brickY + bricksHeight, radius); 
                ctx.arcTo(brickX + bricksWidth, brickY + bricksHeight, brickX, brickY + bricksHeight, radius); 
                ctx.arcTo(brickX, brickY + bricksHeight, brickX, brickY, radius); 
                ctx.arcTo(brickX, brickY, brickX + bricksWidth, brickY, radius); 
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(brickX, brickY + 3); 
                ctx.lineTo(brickX + bricksWidth, brickY + 3); 
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'; 
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y); 
    ctx.arcTo(x + width, y, x + width, y + height, radius); 
    ctx.arcTo(x + width, y + height, x, y + height, radius); 
    ctx.arcTo(x, y + height, x, y, radius); 
    ctx.arcTo(x, y, x + width, y, radius); 
    ctx.closePath();
    ctx.fill(); 
}

function dPaddle() {
    ctx.fillStyle = "rgb(217,176,255)"; 
    drawRoundedRect(paddle.x, paddle.y, paddle.width, paddle.height, 10); 

    const gradient = ctx.createRadialGradient(
        paddle.x + paddle.width / 2, paddle.y + paddle.height / 4, 0, 
        paddle.x + paddle.width / 2, paddle.y + paddle.height / 4, paddle.width / 3 
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)'); 
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); 

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(paddle.x + 10, paddle.y); 
    ctx.arcTo(paddle.x + paddle.width, paddle.y, paddle.x + paddle.width, paddle.y + paddle.height, 10); 
    ctx.arcTo(paddle.x + paddle.width, paddle.y + paddle.height, paddle.x, paddle.y + paddle.height, 10); 
    ctx.arcTo(paddle.x, paddle.y + paddle.height, paddle.x, paddle.y, 10); 
    ctx.arcTo(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y, 10); 
    ctx.closePath();
    ctx.fill(); 

    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'; 
    ctx.fillRect(paddle.x, paddle.y + paddle.height, paddle.width, 3); 
}
  
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    
    const gradient = ctx.createRadialGradient(ball.x, ball.y, ball.radius / 4, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)'); 
    gradient.addColorStop(1, 'rgb(217,176,255)'); 

    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ball.x - ball.radius / 3, ball.y - ball.radius / 3, ball.radius / 3, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; 
    ctx.fill();
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    
    ctx.closePath();
}


function draw() {
    ctx.clearRect(0, 0, can.width, can.height);
    drawBricks();
    drawBriquesBonus();
    dPaddle();
    drawBall();
}

let briquesBonus2 = [];
function drawBriquesB(briques, gradientColors) {
    briques.forEach(brique => {
        const gradient = ctx.createLinearGradient(brique.x, brique.y, brique.x + brique.width, brique.y + brique.height);
        if (brique.effet === 'PADDLE') {
            gradient.addColorStop(0, 'purple');
            gradient.addColorStop(1, 'steelblue');
        } else if (brique.effet === 'BALL') {
            gradient.addColorStop(0, 'palevioletred');
            gradient.addColorStop(1, 'steelblue');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(brique.x, brique.y, brique.width, brique.height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(brique.x, brique.y, brique.width, brique.height);
    });
}

function drawBriquesBonus() {
    drawBriquesB(briquesBonus, ['purple', 'green']); 
}

function appliquerEffetBonus(brique) {
    switch(brique.effet) {
        case 'PADDLE':
            paddle.width += can.width; // Augmente la largeur de la raquette
            // Après 10 secondes, retire l'effet
            setTimeout(() => {
                paddle.width = paddleWidth ;
            }, 5000);
            break;
            
        case 'BALL':
            // ralentit la balle
            const oldDx = ball.dx;
            const oldDy = ball.dy;
            ball.dx *= 0.7;
            ball.dy *= 0.7;
            ball.radius+=5;
            // Après 10 secondes, remet la vitesse normale
            setTimeout(() => {
                ball.dx = oldDx;
                ball.dy = oldDy;
                ball.radius-=5;
            },5000);
            break;
    }
}

let timerId; 

function stopBonusTimer() {
    if (bonusTimerId) {
        clearInterval(bonusTimerId);
    }
    if (disappearTimerId) {
        clearTimeout(disappearTimerId);
    }
    briquesBonus = [];
}

let briquesBonus = [];
let bonusTimerId;
let disappearTimerId;


function startBonusTimer() {
    stopBonusTimer();
    
    ajouterBriqueBonus();
    
    bonusTimerId = setInterval(() => {
        ajouterBriqueBonus();
    }, 10000);
}

function ajouterBriqueBonus() {
    const yPosition = (brickRowCount - 1) * (bricksHeight + 10) + 70 + bricksHeight + 20;
    const x = Math.random() * (can.width - 100);
    const BriqueClass = Math.random() < 0.5 ? BriqueBonus : BriqueBonus2;
    const briqueBonus = new BriqueClass(x, yPosition);

    if (!Array.isArray(briquesBonus)) {
        briquesBonus = [];
    }

    briquesBonus.push(briqueBonus);

    console.log("Brique ajoutée :", briqueBonus); // Debug
    setTimeout(() => {
        briquesBonus = briquesBonus.filter(b => b !== briqueBonus);
    }, 5000);
}

function verifierCollisionAvecBonus() {
    briquesBonus.forEach((brique, index) => {
        if (ball.x > brique.x &&
            ball.x < brique.x + brique.width &&
            ball.y > brique.y &&
            ball.y < brique.y + brique.height) {
            // Appliquez l'effet du bonus
            appliquerEffetBonus(brique);
            // Supprimez la brique bonus du tableau
            briquesBonus.splice(index, 1);
        }
    });
    briquesBonus2.forEach((brique, index) => {
        if (
            ball.x > brique.x &&
            ball.x < brique.x + brique.width &&
            ball.y > brique.y &&
            ball.y < brique.y + brique.height
        ) {
            // Appliquez l'effet du bonus
            appliquerEffetBonus(brique);
            // Supprimez la brique bonus du tableau
            briquesBonus2.splice(index, 1);
        }
    });
}

function miseAJourJeu() {
    verifierCollisionAvecBonus();
    // Dessiner toutes les briques, y compris les briques bonus
    
    briques.forEach(brique => brique.dessiner(ctx));
}

let gameWon=false;

function collisionBallBrick() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let brick = bricks[c][r];
            if (brick.vis === 1) {
                if ((ball.x > brick.x)&&(ball.x < brick.x + bricksWidth)&&(ball.y > brick.y) && (ball.y < brick.y + bricksHeight)) {
                    brick.vis = 0;
                    ball.dy = -ball.dy;
                    score++;;
                    updateScore();
                    hitSound.play(); 
                    if (score===20){
                        gameWon=true;
                        winSound.play();
                        setTimeout(() => {
                            window.location.href = "win.html";  
                        }, 2000);  
                        
                    }
                    
                }
            }      
    }
  }
}

let gameoverscore=0;
let i=0;
let isPaused = false;

function collisionBallWall() {
  if ((ball.x + ball.radius > can.width) || (ball.x - ball.radius < 0)) {
      ball.dx = -ball.dx;
  }
  if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
  }
  if (ball.y + ball.radius > can.height) {
      resetPaddle();
      resetBall();
      i++;
      livesLeft = 3 - i;
      const scoreBoard = document.getElementById("scoreBoard"); 

      switch(livesLeft) {
          case 2:
              scoreBoard.innerText = "Lives Left: 💜💜";
              break;
          case 1:
            scoreBoard.innerText = "Lives Left: 💜";
              break;
          case 0:
            scoreBoard.innerText = "Game Over!";
            gameOver= true;
            loseSound.play()
            showGameOverModal(score) ;
            break;
      }
      isPaused = true;
      cancelAnimationFrame(animationFrameId); 
      setTimeout(() => {
          isPaused = false; 
          gameLoop(); 
      }, 650);

  }
}

function resetPaddle(){
    paddle.x=can.width / 2 - paddleWidth / 2;
    paddle.y= can.height - paddleHeight -margin ;
}


function resetgame(){
    i=0;
    gameOver= false;
    isPaused=true;
    livesLeft=3;
    score=0;
    
    resetBall();
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].vis=1;}
          }
    drawBricks();
  }


function resetBall() {
  ball.x = can.width / 2;
  ball.y = can.height - margin1;
  ball.dx = 2.5;
  ball.dy = -2.5;
  updateScore();  
}



document.addEventListener('keydown', function (event) {
    if (event.key === "ArrowRight") {
        paddle.x += paddle.dx;
    } else if (event.key === "ArrowLeft") {
        paddle.x -= paddle.dx;
    }

    if (paddle.x + paddle.width > can.width) {
        paddle.x = can.width - paddle.width;
    } else if (paddle.x < 0) {
        paddle.x = 0;
    }
});


document.addEventListener('mousemove', function(event) {
    let canvasRect = can.getBoundingClientRect();
    let mouseX = event.clientX - canvasRect.left;
    
    paddle.x = mouseX - (paddle.width / 2);
    
    if (paddle.x + paddle.width > can.width) {
        paddle.x = can.width - paddle.width;
    } else if (paddle.x < 0) {
        paddle.x = 0;
    }
});

let lastAngles = []; 
const maxStoredAngles = 3; 
const BALL_SPEED = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy); 

function collisionBallPaddle() {
    if ((ball.y + ball.radius >= paddle.y) && 
        (ball.y + ball.radius <= paddle.y + paddle.height) && 
        (ball.x > paddle.x) && 
        (ball.x < paddle.x + paddle.width)) {
        
        const relativeIntersectX = (ball.x - (paddle.x + paddle.width/2)) / (paddle.width/2);
        
        const angle = relativeIntersectX * (Math.PI / 3); 
        
        const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
    }
}


function moveBall() {
    if (gameWon) return;
    ball.x += ball.dx;
    ball.y += ball.dy;
}

let animationFrameId;

function updateScore() {
    let scoreElement = document.getElementById("currentScore");
    if (scoreElement) {
        scoreElement.innerText = score;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const pauseButton = document.getElementById("pauseButton");
    const buttonImage = document.getElementById("buttonImage");
    
    if (pauseButton && buttonImage) {
        buttonImage.src = "pausee.png";
        
        pauseButton.addEventListener("click", () => {
            if (!isPaused) {
                pauseGame();
            } else {
                resumeGame();
            }
        });
      }
});


function pauseGame() {
    isPaused = true;
    const buttonImage = document.getElementById("buttonImage");
    if (buttonImage) {
        buttonImage.src = "pausee.png"; 
    }
    cancelAnimationFrame(animationFrameId);
    stopBonusTimer();  
}

function resumeGame() {
    isPaused = false;
    const buttonImage = document.getElementById("buttonImage");
    if (buttonImage) {
        buttonImage.src = "reprendre.png"; 
    }
    startBonusTimer();  
    animationFrameId = requestAnimationFrame(gameLoop);
}

isPaused = true;  


function drawInitialElements() {
    ctx.clearRect(0, 0, can.width, can.height);  
    drawBricks();  
    dPaddle();  
    drawBall();  
    drawBriquesBonus();  
    updateScore();
    document.getElementById("scoreBoard").innerText = `Lives Left: 💜💜💜`;
}


document.addEventListener('DOMContentLoaded', () => {
    drawInitialElements();  
});


document.addEventListener('keydown', () => {
    if (isPaused &&!gameOver) {  
        isPaused = false;  
        initGame();  
        document.removeEventListener('keydown', arguments.callee);  
    }
});


function initGame() {
    isPaused = false;
    gameOver = false;
    gameLoop();  
    startBonusTimer();  
}


function gameLoop() {
    if (!isPaused && !gameOver) {  
        ctx.clearRect(0, 0, can.width, can.height); 
        moveBall();
        collisionBallWall();
        collisionBallPaddle();
        collisionBallBrick();
        verifierCollisionAvecBonus();
        draw(); 
        animationFrameId = requestAnimationFrame(gameLoop);  
    } else if(gameOver){
        cancelAnimationFrame(animationFrameId);

    }
}


let currentLevel = 'medium'; 

function setLevel(level) {
    currentLevel = level;
    
    switch (level) {
        case 'easy':
            paddle.width = 200;
            ball.dx = 2;
            ball.dy = -2;
            break;
        case 'medium':
            paddle.width = 150;
            ball.dx = 3;
            ball.dy = -3;
            break;
        case 'hard':
            paddle.width = 100;
            ball.dx = 4;
            ball.dy = -4;
            break;
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const level = localStorage.getItem('selectedLevel') || 'medium'; 
    setLevel(level); 
    drawInitialElements(); 
    initGame(); 
});


const backgroundSound = document.getElementById("background-sound");
const loseSound = document.getElementById("lose-sound");
loseSound.preload = 'auto';
const winSound= document.getElementById("win-sound");
winSound.preload = 'auto';
const hitSound= document.getElementById("hit-sound");
hitSound.preload = 'auto';

function showGameOverModal(score) {
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverModal").style.display = "flex";
}

  
function restartGame() {
    gameWon = false;
    gameOver = false;
    isPaused = false;
    livesLeft = 3;
    score = 0;
    i = 0;
  
    resetPaddle();
    resetBall();
  
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r].vis = 1;
      }
    }
  
    updateScore();
    document.getElementById("scoreBoard").innerText = `Lives Left: 💜💜💜`;
  
    document.getElementById("gameOverModal").style.display = "none";
  
    initGame();
}

function quitGame() {
    window.location.href = "brickbreaker1.html";
}

function playWinSound() {
    winSound.play();
}


function playLoseSound() {
    loseSound.play();
}
