/* ===========================
   TO-DO APP LOGIC (LEVEL 3)
   =========================== */

function addTask() {
    const taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value;

    if (taskText.trim() === "") {
        alert("Please enter a task first!");
        return;
    }

    const timeStamp = new Date().toLocaleString();
    const li = document.createElement("li");

    li.innerHTML = `
        <div class="task-text">
            <b>${escapeHtml(taskText)}</b>
            <small>Added: ${timeStamp}</small>
        </div>
        <div class="action-btns">
            <button class="complete-btn" onclick="completeTask(this)">✔</button>
            <button class="edit-btn" onclick="editTask(this)">✎</button>
            <button class="delete-btn" onclick="deleteTask(this)">✖</button>
        </div>
    `;

    document.getElementById("pendingList").appendChild(li);
    taskInput.value = "";
    taskInput.focus();
}

// simple sanitization
function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}

function completeTask(btn) {
    const li = btn.closest("li");
    const smallEl = li.querySelector("small");
    const completedTime = new Date().toLocaleString();

    // FIXED — missing backticks
    smallEl.innerHTML += `<br>Completed: ${completedTime}`;
    li.classList.add("completed-item");

    btn.remove(); // remove complete button

    document.getElementById("completedList").appendChild(li);
}

function editTask(btn) {
    const li = btn.closest("li");
    const textEl = li.querySelector("b");
    const currentText = textEl.innerText;

    const updated = prompt("Edit your task:", currentText);
    if (updated !== null && updated.trim() !== "") {
        textEl.innerText = updated;
    }
}

function deleteTask(btn) {
    const li = btn.closest("li");
    li.remove();
}

/* Allow pressing Enter to add task */
document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    taskInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            addTask();
        }
    });
});


/* ===========================
   SHOOTING STARS BACKGROUND
   =========================== */

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
const STAR_COUNT = 120;
const SHOOTING_STAR_INTERVAL = 1500; // ms

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Star {
    constructor(isShooting = false) {
        this.reset(isShooting);
    }

    reset(asShooting = false) {
        const w = canvas.width;
        const h = canvas.height;

        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.radius = Math.random() * 1.8 + 0.3;
        this.baseAlpha = Math.random() * 0.5 + 0.4;
        this.alpha = this.baseAlpha;
        this.alphaChange = (Math.random() * 0.02) - 0.01;

        this.isShooting = asShooting;

        if (asShooting) {
            this.x = Math.random() * w * 0.4;
            this.y = Math.random() * h * 0.4;

            const speed = Math.random() * 6 + 5;
            const angle = (Math.PI / 2.5) + (Math.random() * 0.4 - 0.2);

            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.radius = 2.5;
        } else {
            this.vx = (Math.random() * 0.2) - 0.1;
            this.vy = Math.random() * 0.35 + 0.05;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.alpha += this.alphaChange;
        if (this.alpha <= 0.1 || this.alpha >= this.baseAlpha + 0.3) {
            this.alphaChange *= -1;
        }

        if (this.isShooting) {
            if (this.x > canvas.width + 50 || this.y > canvas.height + 50) {
                this.reset(false);
            }
        } else {
            if (this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset(false);
                this.y = -10;
            }
        }
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius * 4
        );

        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.4, "rgba(200, 240, 255, 0.8)");
        gradient.addColorStop(1, "rgba(0, 150, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        if (this.isShooting) {
            ctx.globalAlpha *= 0.8;
            ctx.beginPath();
            ctx.moveTo(this.x - this.vx * 1.8, this.y - this.vy * 1.8);
            ctx.lineTo(this.x, this.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "rgba(180, 240, 255, 0.9)";
            ctx.stroke();
        }

        ctx.restore();
    }
}

function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star(false));
    }
}
initStars();

setInterval(() => {
    const idx = Math.floor(Math.random() * stars.length);
    stars[idx].reset(true);
}, SHOOTING_STAR_INTERVAL);

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
        star.update();
        star.draw();
    }

    requestAnimationFrame(animate);
}
animate();
