const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

class Stickman {
  constructor(x, color, facing = 1, controls = {}) {
    this.x = x;
    this.y = 300;
    this.size = 40;
    this.color = color;
    this.facing = facing;
    this.action = "idle";
    this.frame = 0;
    this.isJumping = false;
    this.vy = 0;
    this.hp = 1000;
    this.isHit = false;
    this.speed = 4;
    this.controls = controls;
  }

  draw() {
    ctx.strokeStyle = this.isHit ? "#ff0000" : this.color;
    ctx.lineWidth = 4;

    // đầu
    ctx.beginPath();
    ctx.arc(this.x, this.y - this.size, this.size / 3, 0, Math.PI * 2);
    ctx.stroke();

    if (this.action === "kick") this.drawKick();
    else if (this.action === "punch") this.drawPunch();
    else if (this.action === "jump") this.drawJump();
    else this.drawIdle();
  }

  drawIdle() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - this.size / 1.5);
    ctx.lineTo(this.x, this.y);
    ctx.moveTo(this.x - 20 * this.facing, this.y - 50);
    ctx.lineTo(this.x + 20 * this.facing, this.y - 50);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 15, this.y + 25);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 15, this.y + 25);
    ctx.stroke();
  }

  drawPunch() {
    ctx.beginPath();
    ctx.moveTo(this.x - 20 * this.facing, this.y - 50);
    ctx.lineTo(this.x + 35 * this.facing, this.y - 50);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 15, this.y + 25);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 15, this.y + 25);
    ctx.stroke();
  }

  drawKick() {
    ctx.beginPath();
    ctx.moveTo(this.x - 20 * this.facing, this.y - 50);
    ctx.lineTo(this.x + 20 * this.facing, this.y - 50);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 35 * this.facing, this.y + 5);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 15, this.y + 25);
    ctx.stroke();
  }

  drawJump() {
    ctx.beginPath();
    ctx.moveTo(this.x - 20, this.y - 60);
    ctx.lineTo(this.x + 20, this.y - 70);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - 10, this.y + 10);
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + 10, this.y + 10);
    ctx.stroke();
  }

  update(keys) {
    if (this.isJumping) {
      this.y += this.vy;
      this.vy += 0.5;
      if (this.y >= 300) {
        this.y = 300;
        this.isJumping = false;
        this.vy = 0;
        this.action = "idle";
      }
    }

    // di chuyển
    if (keys[this.controls.left]) {
      this.x -= this.speed;
      this.facing = -1;
    }
    if (keys[this.controls.right]) {
      this.x += this.speed;
      this.facing = 1;
    }

    // giới hạn trong khung
    this.x = Math.max(50, Math.min(canvas.width - 50, this.x));

    this.frame++;
  }

  useSkill(skill) {
    if (skill === "kick") this.action = "kick";
    if (skill === "punch") this.action = "punch";
    if (skill === "jump" && !this.isJumping) {
      this.action = "jump";
      this.isJumping = true;
      this.vy = -10;
    }
    if (skill !== "jump") {
      setTimeout(() => {
        if (!this.isJumping) this.action = "idle";
      }, 400);
    }
  }

  hit(dmg) {
    this.hp -= dmg;
    this.isHit = true;
    setTimeout(() => (this.isHit = false), 150);
  }
}

const keys = {};

// 👇 2 người chơi
const player1 = new Stickman(200, "#00aaff", 1, {
  left: "a",
  right: "d",
  jump: "w",
  kick: "s",
  punch: "f",
});

const player2 = new Stickman(700, "#ff4444", -1, {
  left: "ArrowLeft",
  right: "ArrowRight",
  jump: "ArrowUp",
  kick: "ArrowDown",
  punch: "Enter",
});

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === player1.controls.kick) player1.useSkill("kick");
  if (e.key === player1.controls.punch) player1.useSkill("punch");
  if (e.key === player1.controls.jump) player1.useSkill("jump");

  if (e.key === player2.controls.kick) player2.useSkill("kick");
  if (e.key === player2.controls.punch) player2.useSkill("punch");
  if (e.key === player2.controls.jump) player2.useSkill("jump");
});

document.addEventListener("keyup", (e) => (keys[e.key] = false));

function detectHit(attacker, defender) {
  const dist = Math.abs(attacker.x - defender.x);
  if (dist < 70 && defender.y >= 290) {
    if (attacker.action === "kick") defender.hit(100);
    if (attacker.action === "punch") defender.hit(150);
  }
}

function drawHP() {
  // HP player 1
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("PLAYER 1", 50, 40);
  ctx.strokeRect(130, 25, 300, 10);
  ctx.fillStyle = "#00aaff";
  ctx.fillRect(130, 25, (player1.hp / 1000) * 300, 10);

  // HP player 2
  ctx.fillStyle = "#fff";
  ctx.fillText("PLAYER 2", 650, 40);
  ctx.strokeRect(780 - 300, 25, 300, 10);
  ctx.fillStyle = "#ff4444";
  ctx.fillRect(780 - 300 + (1 - player2.hp / 1000) * 300, 25, (player2.hp / 1000) * 300, 10);
}

function checkGameOver() {
  if (player1.hp <= 0 || player2.hp <= 0) {
    ctx.font = "60px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("💥 KO! 💥", canvas.width / 2, canvas.height / 2);
    cancelAnimationFrame(gameLoopID);
    return true;
  }
  return false;
}

function update() {
  player1.update(keys);
  player2.update(keys);
  detectHit(player1, player2);
  detectHit(player2, player1);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 340, canvas.width, 10);
  drawHP();
  player1.draw();
  player2.draw();
}

let gameLoopID;
function loop() {
  update();
  draw();
  if (!checkGameOver()) gameLoopID = requestAnimationFrame(loop);
}
loop();
