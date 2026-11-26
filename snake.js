(() => {
  const canvas = document.getElementById("snake");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const msg = document.getElementById("msg");
  const startBtn = document.getElementById("start");

  const N = 20;                       // tabuleiro N x N
  const S = canvas.width / N;         // tamanho de cada célula
  const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

  let snake, dir, queued, food, score, timer, running = false;
  let best = 0;
  try { best = Number(localStorage.getItem("snakeBest")) || 0; } catch (e) {}
  bestEl.textContent = best;

  const rand = (n) => Math.floor(Math.random() * n);

  function placeFood() {
    do { food = { x: rand(N), y: rand(N) }; }
    while (snake.some((s) => s.x === food.x && s.y === food.y));
  }

  function reset() {
    snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    dir = queued = DIRS.right;
    score = 0;
    scoreEl.textContent = 0;
    placeFood();
    draw();
  }

  function turn(name) {
    const d = DIRS[name];
    if (!d || !running) return;
    // impede inverter 180 graus
    if (d[0] === -dir[0] && d[1] === -dir[1]) return;
    queued = d;
  }

  function step() {
    dir = queued;
    const head = { x: snake[0].x + dir[0], y: snake[0].y + dir[1] };
    const hitWall = head.x < 0 || head.y < 0 || head.x >= N || head.y >= N;
    if (hitWall || snake.some((s) => s.x === head.x && s.y === head.y)) return gameOver();

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      scoreEl.textContent = score;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
    timer = setTimeout(step, Math.max(60, 140 - score * 3));
  }

  function gameOver() {
    running = false;
    startBtn.textContent = "Jogar de novo";
    if (score > best) {
      best = score;
      bestEl.textContent = best;
      try { localStorage.setItem("snakeBest", best); } catch (e) {}
      msg.textContent = "Novo recorde: " + score + " pontos!";
    } else {
      msg.textContent = "Fim de jogo com " + score + " pontos. Tente de novo.";
    }
  }

  function draw() {
    ctx.fillStyle = "#0f1a16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#f87171";
    ctx.beginPath();
    ctx.arc(food.x * S + S / 2, food.y * S + S / 2, S / 2.6, 0, Math.PI * 2);
    ctx.fill();

    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? "#34d399" : "#10b981";
      ctx.fillRect(s.x * S + 1, s.y * S + 1, S - 2, S - 2);
    });
  }

  function start() {
    clearTimeout(timer);
    reset();
    running = true;
    startBtn.textContent = "Reiniciar";
    msg.textContent = "Boa sorte!";
    timer = setTimeout(step, 140);
  }

  // Teclado
  const keys = {
    ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
    w: "up", s: "down", a: "left", d: "right",
  };
  window.addEventListener("keydown", (e) => {
    const name = keys[e.key];
    if (!name) return;
    if (running) e.preventDefault();
    turn(name);
  });

  // Botões na tela
  document.querySelectorAll(".dpad button").forEach((b) =>
    b.addEventListener("click", () => turn(b.dataset.dir))
  );

  // Deslizar o dedo no tabuleiro
  let tx, ty;
  canvas.addEventListener("touchstart", (e) => {
    tx = e.touches[0].clientX;
    ty = e.touches[0].clientY;
  }, { passive: true });
  canvas.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? "right" : "left");
    else turn(dy > 0 ? "down" : "up");
  }, { passive: true });

  startBtn.addEventListener("click", start);
  reset();
})();
