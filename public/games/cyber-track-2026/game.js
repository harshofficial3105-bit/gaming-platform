(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('high-score');
  const speedEl = document.getElementById('speed');
  const gameOverScreen = document.getElementById('game-over-screen');
  const finalScoreEl = document.getElementById('final-score');
  const restartBtn = document.getElementById('restart-btn');

  const GAME_ID = 'cyber-track-2026';
  let isMuted = false;
  let score = 0;
  let highScore = 0;
  let speed = 6;
  let isGameOver = false;
  let animId = null;

  // Audio Context (Web Audio API Synthesizer)
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

  // Player Vehicle
  const player = {
    x: 400,
    y: 420,
    width: 36,
    height: 60,
    vx: 0,
    speed: 7,
  };

  // Road grid lines & Obstacles
  let roadLines = [];
  let obstacles = [];
  let particles = [];

  for (let i = 0; i < 15; i++) {
    roadLines.push({ y: i * 35, speed: 6 });
  }

  // PostMessage ArcadeHub Bridge Handshake
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

  // Announce SDK Ready
  window.parent?.postMessage({ type: 'SDK_READY', gameId: GAME_ID }, '*');

  // Input Handling
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

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    initAudio();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = ((touch.clientX - rect.left) / rect.width) * canvas.width;
    if (touchX < player.x) {
      player.vx = -player.speed;
    } else {
      player.vx = player.speed;
    }
    if (isGameOver) restartGame();
  });

  canvas.addEventListener('touchend', () => {
    player.vx = 0;
  });

  restartBtn.addEventListener('click', restartGame);

  function spawnObstacle() {
    if (isGameOver) return;
    const lanes = [220, 310, 400, 490, 580];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    obstacles.push({
      x: lane - 18,
      y: -70,
      width: 36,
      height: 60,
      color: Math.random() > 0.5 ? '#ff0055' : '#a855f7',
    });
  }

  setInterval(spawnObstacle, 900);

  function restartGame() {
    score = 0;
    speed = 6;
    isGameOver = false;
    obstacles = [];
    particles = [];
    player.x = 400;
    player.vx = 0;
    scoreEl.textContent = '0';
    gameOverScreen.classList.add('hidden');
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  function createExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.5 ? '#ff0055' : '#00f0ff',
        life: 1,
      });
    }
    playTone(150, 'sawtooth', 0.4);
  }

  function gameOver() {
    isGameOver = true;
    createExplosion(player.x + 18, player.y + 30);
    finalScoreEl.textContent = score;
    gameOverScreen.classList.remove('hidden');

    if (score > highScore) {
      highScore = score;
      highScoreEl.textContent = highScore;
    }

    // Send score to ArcadeHub Host
    window.parent?.postMessage({
      type: 'GAME_OVER',
      gameId: GAME_ID,
      score: score,
      payload: { score, highScore },
    }, '*');
  }

  function update() {
    if (isGameOver) return;

    // Movement
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      player.vx = -player.speed;
    } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      player.vx = player.speed;
    } else if (!canvas.matches(':active')) {
      player.vx *= 0.8;
    }

    player.x += player.vx;
    player.x = Math.max(190, Math.min(610 - player.width, player.x));

    // Road scroll
    roadLines.forEach((line) => {
      line.y += speed;
      if (line.y > canvas.height) line.y = 0;
    });

    // Score & Speed Progression
    score += 1;
    scoreEl.textContent = score;
    if (score % 250 === 0) {
      speed += 0.5;
      speedEl.textContent = Math.round(speed * 18);
      playTone(600, 'sine', 0.1);
    }

    // Report live score update to parent bridge
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
      obs.y += speed;

      // Collision Detection
      if (
        player.x < obs.x + obs.width &&
        player.x + player.width > obs.x &&
        player.y < obs.y + obs.height &&
        player.y + player.height > obs.y
      ) {
        gameOver();
        return;
      }

      if (obs.y > canvas.height) {
        obstacles.splice(i, 1);
      }
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

    // Track Perspective & Road
    ctx.fillStyle = '#0a0f24';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Neon Highway Boundaries
    ctx.fillStyle = '#111836';
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(160, canvas.height);
    ctx.lineTo(640, canvas.height);
    ctx.lineTo(620, 0);
    ctx.fill();

    // Road Borders
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(160, canvas.height);
    ctx.moveTo(620, 0);
    ctx.lineTo(640, canvas.height);
    ctx.stroke();

    // Dashed Lane Dividers
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 2;
    [270, 360, 450, 540].forEach((laneX) => {
      ctx.beginPath();
      roadLines.forEach((line) => {
        ctx.moveTo(laneX, line.y);
        ctx.lineTo(laneX, line.y + 18);
      });
      ctx.stroke();
    });

    ctx.shadowBlur = 0;

    // Obstacles
    obstacles.forEach((obs) => {
      ctx.fillStyle = obs.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = obs.color;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // Player Cyber Car
    if (!isGameOver) {
      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00f0ff';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Tail lights
      ctx.fillStyle = '#ff0055';
      ctx.shadowColor = '#ff0055';
      ctx.fillRect(player.x + 4, player.y + player.height - 6, 8, 4);
      ctx.fillRect(player.x + player.width - 12, player.y + player.height - 6, 8, 4);
    }

    // Particles
    particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
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

  loop();
})();