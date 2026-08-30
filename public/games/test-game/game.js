const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- GAME STATE ---
let score = 0;
let highScore = 0;
let isLoaded = false;
let gameOver = false;
let touchActive = false;
let touchPos = { x: 0, y: 0 };

// 1. Receive restored progress from Portal
window.addEventListener('message', (e) => {
  const envelope = e.data;
  const data = envelope?.data || envelope;
  if (data?.type === 'LOAD_PROGRESS_RESPONSE' && data.payload) {
    isLoaded = true;
    if (typeof data.payload.highScore === 'number') {
      highScore = Math.max(highScore, data.payload.highScore);
    }
  }
});

// 2. Announce SDK readiness to Portal and request saved state
function sendHandshake() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'SDK_READY', version: '1.0' }, '*');
    window.parent.postMessage({ type: 'REQUEST_LOAD_PROGRESS' }, '*');
  }
}
sendHandshake();
// Retry handshake until acknowledged
const handshakeInterval = setInterval(() => {
  if (isLoaded) {
    clearInterval(handshakeInterval);
  } else {
    sendHandshake();
  }
}, 200);

// Player Object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 6,
  color: '#38bdf8'
};

// Collectible Gem Object
const gem = {
  x: Math.random() * (canvas.width - 40) + 20,
  y: Math.random() * (canvas.height - 40) + 20,
  size: 12,
  color: '#f59e0b'
};

// Keyboard Input Tracking (Capture Phase Scroll Lock)
const keys = {};
window.addEventListener(
  'keydown',
  (e) => {
    if (
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Space'].includes(e.key) ||
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)
    ) {
      e.preventDefault();
    }
    keys[e.key] = true;
  },
  { capture: true, passive: false }
);
window.addEventListener('keyup', (e) => (keys[e.key] = false));

// Prevent mouse wheel scrolling
window.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });
document.addEventListener('wheel', (e) => e.preventDefault(), { passive: false });

// Pointer / Touch Handlers
function handlePointer(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const targetX = (clientX - rect.left) * scaleX;
  const targetY = (clientY - rect.top) * scaleY;

  player.x = Math.max(player.size, Math.min(canvas.width - player.size, targetX));
  player.y = Math.max(player.size, Math.min(canvas.height - player.size, targetY));
  
  touchPos.x = player.x;
  touchPos.y = player.y;
}

// Mouse Listeners
canvas.addEventListener('mousemove', (e) => handlePointer(e.clientX, e.clientY));

// Touch Listeners (for Mobile / Tablets)
canvas.addEventListener('touchstart', (e) => {
  touchActive = true;
  if (e.touches.length > 0) {
    handlePointer(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (e.touches.length > 0) {
    handlePointer(e.touches[0].clientX, e.touches[0].clientY);
  }
}, { passive: false });

canvas.addEventListener('touchend', () => {
  touchActive = false;
});

// --- UPDATE LOGIC ---
function update() {
  if (keys['ArrowUp'] || keys['w'] || keys['W']) player.y -= player.speed;
  if (keys['ArrowDown'] || keys['s'] || keys['S']) player.y += player.speed;
  if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
  if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;

  player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

  const dx = player.x - gem.x;
  const dy = player.y - gem.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // When player collects a gem:
  if (distance < player.size + gem.size) {
    score += 10;
    
    // Only update high score if current score exceeds previous all-time best
    if (score > highScore) {
      highScore = score;
    }

    gem.x = Math.random() * (canvas.width - 40) + 20;
    gem.y = Math.random() * (canvas.height - 40) + 20;

    // Send score and save high score to Guest Vault
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'SCORE_UPDATE',
          payload: { score: score },
          timestamp: Date.now()
        },
        '*'
      );

      // Auto-save high score to local vault
      window.parent.postMessage(
        {
          type: 'SAVE_PROGRESS',
          payload: { data: { highScore: highScore } },
          timestamp: Date.now()
        },
        '*'
      );
    }
  }
}

// --- RENDER LOGIC ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Touch Ring on Mobile
  if (touchActive) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(touchPos.x, touchPos.y, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 2. Draw Collectible Gem (with glow)
  ctx.save();
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 15;
  ctx.fillStyle = gem.color;
  ctx.beginPath();
  ctx.arc(gem.x, gem.y, gem.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Draw Player Ship
  ctx.save();
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Draw Score HUD (Live Score + Persistent Best Score)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(`SCORE: ${score}`, 24, 36);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText(`BEST: ${highScore}`, 24, 62);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
