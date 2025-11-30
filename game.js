const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Joueur
const player = {
  x: 50,
  y: 300,
  w: 30,
  h: 40,
  velX: 0,
  velY: 0,
  speed: 3,
  jumpStrength: 10,
  grounded: false
};

// Plateformes
const platforms = [
  { x: 0, y: 380, w: 600, h: 20 },
  { x: 100, y: 320, w: 100, h: 10 },
  { x: 250, y: 260, w: 120, h: 10 },
  { x: 420, y: 200, w: 100, h: 10 }
];

// But du jeu
const goal = { x: 500, y: 150, w: 30, h: 30 };

let keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Gravité
function applyPhysics() {
  player.velY += 0.5;
  player.grounded = false;

  player.x += player.velX;
  player.y += player.velY;

  platforms.forEach(p => {
    if (
      player.x < p.x + p.w &&
      player.x + player.w > p.x &&
      player.y < p.y + p.h &&
      player.y + player.h > p.y
    ) {
      if (player.velY > 0) {
        player.y = p.y - player.h;
        player.velY = 0;
        player.grounded = true;
      }
    }
  });

  if (player.x < 0) player.x = 0;
  if (player.x + player.w > canvas.width) player.x = canvas.width - player.w;
  if (player.y > canvas.height) gameOver();
}

function handleInput() {
  if (keys["ArrowRight"]) player.velX = player.speed;
  else if (keys["ArrowLeft"]) player.velX = -player.speed;
  else player.velX = 0;

  if (keys["Space"] && player.grounded) {
    player.velY = -player.jumpStrength;
    player.grounded = false;
  }
}

function gameOver() {
  ctx.fillStyle = "white";
  ctx.font = "32px Arial";
  ctx.fillText("GAME OVER", 200, 200);
  cancelAnimationFrame(animation);
}

function checkVictory() {
  if (
    player.x < goal.x + goal.w &&
    player.x + player.w > goal.x &&
    player.y < goal.y + goal.h &&
    player.y + player.h > goal.y
  ) {
    ctx.fillStyle = "yellow";
    ctx.font = "32px Arial";
    ctx.fillText("VICTOIRE !", 220, 200);
    cancelAnimationFrame(animation);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#444";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, p.h));

  ctx.fillStyle = "gold";
  ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
}

let animation;
function gameLoop() {
  handleInput();
  applyPhysics();
  draw();
  checkVictory();

  animation = requestAnimationFrame(gameLoop);
}

gameLoop();
