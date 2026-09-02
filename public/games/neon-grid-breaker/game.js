(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('high-score');
  const livesEl = document.getElementById('lives');
  const gameOverScreen = document.getElementById('game-over-screen');
  const overTitle = document.getElementById('over-title');
  const finalScoreEl = document.getElementById('final-score');
  const restartBtn = document.getElementById('restart-btn');

  const GAME_ID = 'neon-grid-breaker';
  let isMuted = false;
  let score = 0;
  let highScore = 0;
  let lives = 3;
  let isGameOver = false;
  let animId = null;

  // Audio Context Synthesizer
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, type, duration) {
    if (isMuted || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {}
  }

  // Paddle & Ball
  const paddle = {
    width: 100,
    height: 14,
    x: 350,
    y: 460,
    speed: 8,
    vx: 0,
  };

  const ball = {
    x: 400,
    y: 440,
    radius: 7,
    dx: 4,
    dy: -4,
  };

  // Brick Matrix
  let bricks = [];
  const rows = 5;
  const cols = 9;
  const brickWidth = 72;
  const brickHeight = 22;
  const padding = 10;
  const offsetTop = 50;
  const offsetLeft = 36;
  const colors = ['#a855f7', '#00f0ff', '#ff0055', '#fbbf24', '#34d399'];

  function initBricks() {
    bricks = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: offsetLeft + c * (brickWidth + padding),
          y: offsetTop + r * (brickHeight + padding),
          color: colors[r % colors.length],
          points: (rows - r) * 10,
          status: 1,
        });
      }
    }
  }

  let particles = [];

  // Handshake Listeners
  window.addEventListener('message', (e) => {
    if (!e.data) return;
    if (e.data.type === 'MUTE_AUDIO') {
      isMuted = !!e.data.isMuted;
    }
    if (e.data.type === 'ARCADEHUB_LOAD_BEST_SCORE') {
      if (typeof e.data.score === 'number') {
        highScore = Math.max(highScore, e.data.score);
        highScoreEl.textContent = highScore;
      }
    }
  });

  window.parent?.postMessage({ type: 'SDK_READY', gameId: GAME_ID }, '*');

  // Input Listeners
  const keys = {};
  window.addEventListener('keydown', (e) => {
    initAudio();
    keys[e.key] = true;
    if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D', ' '].includes(e.key)) {
      e.preventDefault();
    }
    if (isGameOver && (e.key === ' ' || e.key === 'Enter')) {
      restartGame();
    }
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, mouseX - paddle.width / 2));
  });

  canvas.addEventListener('touchmove', (e) => {
    initAudio();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = ((touch.clientX - rect.left) / rect.width) * canvas.width;
    paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, touchX - paddle.width / 2));
  });

  restartBtn.addEventListener('click', restartGame);

  function restartGame() {
    score = 0;
    lives = 3;
    isGameOver = false;
    particles = [];
    scoreEl.textContent = '0';
    livesEl.textContent = '❤❤❤';
    gameOverScreen.classList.add('hidden');
    paddle.x = 350;
    ball.x = 400;
    ball.y = 440;
    ball.dx = 4;
    ball.dy = -4;
    initBricks();
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function createParticles(x, y, color) {
    for (let i = 0; i < 12; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.5) * 6,
        color,
        size: Math.random() * 3 + 2,
        life: 1,
      });
    }
  }

  function gameOver(won) {
    isGameOver = true;
    overTitle.textContent = won ? 'GRID CLEARED!' : 'GRID DECONSTRUCTED';
    overTitle.style.color = won ? '#34d399' : '#a855f7';
    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove('hidden');

    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
    }

    window.parent?.postMessage({
      type: 'GAME_OVER',
      gameId: GAME_ID,
      score: score,
      payload: { score, highScore },
    }, '*');
  }

  function update() {
    if (isGameOver) return;

    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      paddle.x = Math.max(0, paddle.x - paddle.speed);
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      paddle.x = Math.min(canvas.width - paddle.width, paddle.x + paddle.speed);
    }

    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall bounce
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
      playTone(300, 'sine', 0.05);
    }
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
      playTone(300, 'sine', 0.05);
    }

    // Bottom loss
    if (ball.y + ball.radius > canvas.height) {
      lives--;
      livesEl.textContent = '❤'.repeat(Math.max(0, lives));
      playTone(150, 'sawtooth', 0.2);

      if (lives <= 0) {
        gameOver(false);
        return;
      } else {
        ball.x = paddle.x + paddle.width / 2;
        ball.y = paddle.y - 15;
        ball.dx = 4;
        ball.dy = -4;
      }
    }

    // Paddle bounce
    if (
      ball.y + ball.radius >= paddle.y &&
      ball.y - ball.radius <= paddle.y + paddle.height &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      ball.dx = hitPos * 6;
      ball.dy = -Math.abs(ball.dy);
      playTone(440, 'triangle', 0.06);
    }

    // Brick Collision
    let remaining = 0;
    bricks.forEach((b) => {
      if (b.status === 1) {
        remaining++;
        if (
          ball.x > b.x &&
          ball.x < b.x + brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          score += b.points;
          scoreEl.textContent = score;
          createParticles(b.x + brickWidth / 2, b.y + brickHeight / 2, b.color);
          playTone(550, 'sine', 0.08);

          window.parent?.postMessage({
            type: 'SCORE_UPDATE',
            gameId: GAME_ID,
            score: score,
          }, '*');
        }
      }
    });

    if (remaining === 0) {
      gameOver(true);
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Grid
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Bricks
    bricks.forEach((b) => {
      if (b.status === 1) {
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = b.color;
        ctx.fillRect(b.x, b.y, brickWidth, brickHeight);
      }
    });

    // Paddle
    ctx.fillStyle = '#a855f7';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#a855f7';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Ball
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;

    // Particles
    particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });
  }

  function loop() {
    update();
    draw();
    if (!isGameOver) {
      animId = requestAnimationFrame(loop);
    }
  }

  initBricks();
  loop();
})();