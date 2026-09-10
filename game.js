(function () {
  const canvas = document.getElementById("game");
  const statusEl = document.getElementById("status");
  const ctx = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;

  const player = { x: width / 2 - 15, y: height - 40, w: 30, h: 30, speed: 22 };
  let score = 0;

  const lanes = [80, 150, 220, 290, 360];
  const cars = lanes.map((y, i) => ({
    x: i % 2 === 0 ? -60 : width + 20,
    y,
    w: 60,
    h: 28,
    speed: (i % 2 === 0 ? 1 : -1) * (2 + i * 0.4),
    color: i % 2 === 0 ? "#ff5a5a" : "#ff9f43",
  }));

  function resetPlayer() {
    player.x = width / 2 - player.w / 2;
    player.y = height - 40;
  }

  function intersects(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function moveCars() {
    for (const car of cars) {
      car.x += car.speed;
      if (car.speed > 0 && car.x > width + 80) car.x = -80;
      if (car.speed < 0 && car.x < -80) car.x = width + 80;
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#8ddf7d";
    ctx.fillRect(0, 0, width, 50);
    ctx.fillRect(0, height - 50, width, 50);

    ctx.fillStyle = "#555";
    ctx.fillRect(0, 50, width, height - 100);

    for (const car of cars) {
      ctx.fillStyle = car.color;
      ctx.fillRect(car.x, car.y, car.w, car.h);
    }

    ctx.fillStyle = "#2d6cdf";
    ctx.fillRect(player.x, player.y, player.w, player.h);
  }

  function tick() {
    moveCars();

    for (const car of cars) {
      if (intersects(player, car)) {
        resetPlayer();
        break;
      }
    }

    if (player.y <= 20) {
      score += 1;
      statusEl.textContent = `分數：${score}`;
      resetPlayer();
    }

    draw();
    requestAnimationFrame(tick);
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") player.y -= player.speed;
    if (e.key === "ArrowDown") player.y += player.speed;
    if (e.key === "ArrowLeft") player.x -= player.speed;
    if (e.key === "ArrowRight") player.x += player.speed;

    player.x = Math.max(0, Math.min(width - player.w, player.x));
    player.y = Math.max(0, Math.min(height - player.h, player.y));
  });

  draw();
  requestAnimationFrame(tick);
})();
