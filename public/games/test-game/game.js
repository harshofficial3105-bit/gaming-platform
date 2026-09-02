const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- STABLE PER-GAME KEY ---
const GAME_ID = 'space-gem-collector';
const BEST_SCORE_KEY = `arcadehub_game_${GAME_ID}_best_score`;

// --- GAME STATE ---
let score = 0; // Current session score (resets to 0 on launch & restart)
let bestScore = 0; // Persistent all-time high score

// 1. Synchronous attempt to read from local storage (if permitted in context)
try {
  const directScore = window.localStorage.getItem(BEST_SCORE_KEY);
  if (directScore && !isNaN(Number(directScore))) {
    bestScore = Number(directScore);
  }
} catch (e) {}

let touchActive = false;
let touchPos = { x: 0, y: 0 };

// 2. Continuous Listener: Synchronize best score from parent window
window.addEventListener('message', (event) => {
  if (!event.data || typeof event.data !== 'object') return;

  const msg = event.data;
  if (
    msg.type === 'ARCADEHUB_LOAD_BEST_SCORE' ||
    msg.type === 'LOAD_PROGRESS_RESPONSE' || 
    msg.type === 'LOAD_STATE_RESPONSE'
  ) {
    const incoming = 
      typeof msg.score === 'number'
        ? msg.score
        : typeof msg.highScore === 'number'
          ? msg.highScore
          : typeof msg.payload?.highScore === 'number'
            ? msg.payload.highScore
            : typeof msg.data?.highScore === 'number'
              ? msg.data.highScore
              : 0;

    if (incoming > bestScore) {
      bestScore = incoming;
      try {
        window.localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
      } catch (err) {}
    }
  }
});

// 3. Announce readiness & query parent storage
function syncWithParent() {
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(
      {
        type: 'SDK_READY',
        gameId: GAME_ID,
        version: '1.0',
      },
      '*'
    );
    window.parent.postMessage(
      {
        type: 'REQUEST_LOAD_PROGRESS',
        gameId: GAME_ID,
      },
      '*'
    );
  }
}
syncWithParent();

// Keep polling parent bridge at intervals until score is received
const syncInterval = setInterval(syncWithParent, 150);

// Player Ship Object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 20,
  speed: 6,
  color: '#38bdf8'
};

// Collectible Gem Object
const gem = {
  x: Math.random() * (canvas.width - 60) + 30,
  y: Math.random() * (canvas.height - 60) + 30,
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

// Touch Listeners (Mobile / Tablets)
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

// --- GAMEPLAY UPDATE LOOP ---
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
    
    // Update Best Score IMMEDIATELY when current score breaks the record
    if (score > bestScore) {
      bestScore = score;
      
      try {
        window.localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
      } catch (err) {}

      // Broadcast immediately to parent window
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: 'ARCADEHUB_BEST_SCORE',
            gameId: GAME_ID,
            score: bestScore,
          },
          '*'
        );
      }
    }

    gem.x = Math.random() * (canvas.width - 60) + 30;
    gem.y = Math.random() * (canvas.height - 60) + 30;

    // Send score update to parent bridge
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'SCORE_UPDATE',
          gameId: GAME_ID,
          score: score,
          payload: { score: score },
          timestamp: Date.now()
        },
        '*'
      );
      window.parent.postMessage(
        {
          type: 'SAVE_PROGRESS',
          gameId: GAME_ID,
          data: { highScore: bestScore },
          payload: { highScore: bestScore },
          timestamp: Date.now()
        },
        '*'
      );
    }
  }
}

// --- RENDER HUD ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Touch Ring on Mobile
  if (touchActive) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(touchPos.x, touchPos.y, 40, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 2. Gem with Amber Glow
  ctx.save();
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 15;
  ctx.fillStyle = gem.color;
  ctx.beginPath();
  ctx.arc(gem.x, gem.y, gem.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. Player Ship
  ctx.save();
  ctx.fillStyle = player.color;
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Horizontal Score & Best Score HUD
  ctx.save();
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  // Current Session Score
  const scoreText = `SCORE: ${score}`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(scoreText, 24, 34);
  
  const scoreMetrics = ctx.measureText(scoreText);
  const separatorX = 24 + scoreMetrics.width + 12;

  // Divider
  ctx.fillStyle = '#475569';
  ctx.fillText('•', separatorX, 33);

  // Persistent Best Score
  const bestX = separatorX + 16;
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`BEST: ${bestScore}`, bestX, 34);

  ctx.restore();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);