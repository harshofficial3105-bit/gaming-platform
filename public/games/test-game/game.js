const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- GAME STATE ---
let score = 0;
let gameOver = false;

// Player Object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 6,
  color: '#38bdf8' // Cyan ship
};

// Collectible Gem Object
const gem = {
  x: Math.random() * (canvas.width - 40) + 20,
  y: Math.random() * (canvas.height - 40) + 20,
  size: 12,
  color: '#f59e0b' // Gold gem
};

// Keyboard Input Tracking
const keys = {};
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

// Mouse / Touch Input Tracking (follows pointer)
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  player.x = (e.clientX - rect.left) * scaleX;
  player.y = (e.clientY - rect.top) * scaleY;
});

// --- UPDATE LOGIC ---
function update() {
  // Arrow key movement
  if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= player.speed;
  if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += player.speed;
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;

  // Keep player inside canvas boundaries
  player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

  // Collision Detection (Circle vs Circle distance formula: dx^2 + dy^2 < radiusSum^2)
  const dx = player.x - gem.x;
  const dy = player.y - gem.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < player.size + gem.size) {
    score += 10;
    // Respawn gem at random position
    gem.x = Math.random() * (canvas.width - 40) + 20;
    gem.y = Math.random() * (canvas.height - 40) + 20;
  }
}

// --- RENDER LOGIC ---
function draw() {
  // 1. Clear previous frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. Draw Collectible Gem (with glow effect)
  ctx.save();
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 15;
  ctx.fillStyle = gem.color;
  ctx.beginPath();
  ctx.arc(gem.x, gem.y, gem.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Draw Player Ship (Triangle)
  ctx.save();
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Draw Score HUD
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(`SCORE: ${score}`, 24, 36);
}

// --- 60 FPS GAME LOOP ---
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the loop
requestAnimationFrame(gameLoop);
