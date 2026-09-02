(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('high-score');
  const gravStateEl = document.getElementById('grav-state');
  const gameOverScreen = document.getElementById('game-over-screen');
  const finalScoreEl = document.getElementById('final-score');
  const restartBtn = document.getElementById('restart-btn');

  const GAME_ID = 'void-runner';
  let isMuted = false;
  let score = 0;
  let highScore = 0;
  let isGameOver = false;
  let animId = null;
  let speed = 6;

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

  // Player & Gravity
  const player = {
    x: 120,
    y: 390,
    width: 32,
    height: 32,
    vy: 0,
    gravity: 0.6,
    isGrounded: true,
    inverted: false,
  };

  const floorY = 420;
  const ceilingY = 80;

  let obstacles = [];
  let stars = [];

  for (let i = 0; i < 40; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: Math.random() * 2 + 1,
      size: Math.random() * 2 + 1,
    });
  }

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

  function flipGravity() {
    if (isGameOver) return;
    initAudio();
    player.inverted = !player.inverted;
    player.gravity = player.inverted ? -0.6 : 0.6;
    gravStateEl.textContent = player.inverted ? 'INVERTED' : 'NORMAL';
    gravStateEl.style.color = player.inverted ? '#a855f7' : '#34d399';
    playTone(player.inverted ? 500 : 350, 'triangle', 0.1);
  }

  window.addEventListener('keydown', (e) => {
    if ([' ', 'ArrowUp', 'ArrowDown', 'w', 'W'].includes(e.key)) {
      e.preventDefault();
      if (isGameOver) {
        restartGame();
      } else {
        flipGravity();
      }
    }
  });

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (isGameOver) {
      restartGame();
    } else {
      flipGravity();
    }
  });

  canvas.addEventListener('mousedown', (e) => {
    if (isGameOver) {
      restartGame();
    } else {
      flipGravity();
    }
  });

  restartBtn.addEventListener('click', restartGame);

  function spawnObstacle() {
    if (isGameOver) return;
    const isTop = Math.random() > 0.5;
    obstacles.push({
      x: canvas.width + 40,
      y: isTop ? ceilingY : floorY - 40,
      width: 30,
      height: 40,
      color: '#ff0055',
    });
  }

  setInterval(spawnObstacle, 1100);

  function restartGame() {
    score = 0;
    speed = 6;
    isGameOver = false;
    obstacles = [];
    player.inverted = false;
    player.gravity = 0.6;
    player.y = 390;
    player.vy = 0;
    gravStateEl.textContent = 'NORMAL';
    gravStateEl.style.color = '#34d399';
    scoreEl.textContent = '0';
    gameOverScreen.classList.add('hidden');
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function gameOver() {
    isGameOver = true;
    playTone(120, 'sawtooth', 0.3);
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

    // Gravity Physics
    player.vy += player.gravity;
    player.y += player.vy;

    if (!player.inverted && player.y + player.height >= floorY) {
      player.y = floorY - player.height;
      player.vy = 0;
    } else if (player.inverted && player.y <= ceilingY) {
      player.y = ceilingY;
      player.vy = 0;
    }

    // Star parallax
    stars.forEach((s) => {
      s.x -= s.speed;
      if (s.x < 0) s.x = canvas.width;
    });

    score += 1;
    scoreEl.textContent = score;
    if (score % 25 === 0) {
      window.parent?.postMessage({
        type: 'SCORE_UPDATE',
        gameId: GAME_ID,
        score: score,
      }, '*');
    }

    // Obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.x -= speed;

      if (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
      ) {
        gameOver();
        return;
      }

      if (obs.x + obs.width < 0) {
        obstacles.splice(i, 1);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#fff';
    stars.forEach((s) => {
      ctx.fillRect(s.x, s.y, s.size, s.size);
    });

    // Ceiling & Floor Rails
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, ceilingY);
    ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#34d399';
    ctx.beginPath();
    ctx.moveTo(0, ceilingY);
    ctx.lineTo(canvas.width, ceilingY);
    ctx.moveTo(0, floorY);
    ctx.lineTo(canvas.width, floorY);
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Obstacles
    obstacles.forEach((obs) => {
      ctx.fillStyle = obs.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = obs.color;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Player Neon Runner
    ctx.fillStyle = player.inverted ? '#a855f7' : '#34d399';
    ctx.shadowBlur = 12;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.shadowBlur = 0;
  }

  function loop() {
    update();
    draw();
    if (!isGameOver) {
      animId = requestAnimationFrame(loop);
    }
  }

  loop();
})();