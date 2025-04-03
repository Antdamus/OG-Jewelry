function generateRandomCode(length = 6) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

const amountBox = document.getElementById('amountBox');
const codeValue = document.getElementById('codeValue');
const codeBox = document.querySelector('.code-box');
const spinButton = document.getElementById('spinButton');
const coinContainer = document.getElementById('coin-container');

spinButton.addEventListener('click', () => {
  // 🧽 Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Disable button & show spinner
  spinButton.disabled = true;
  spinButton.innerHTML = `<span class="loader"></span> Spinning...`;

  // Reset visuals
  codeBox.classList.add('hidden');
  amountBox.textContent = '$--';
  codeValue.textContent = '------';
  amountBox.style.color = '#f5d7a3';
  amountBox.style.textShadow = '0 0 12px rgba(255, 215, 140, 0.7)';
  amountBox.style.transform = 'scale(1)';

  let spinCount = 0;
  const totalSpins = 50;
  const easingOut = t => 1 - Math.pow(1 - t, 3);

  function spinStep() {
    const progress = spinCount / totalSpins;
    const delay = 10 + (300 - 10) * easingOut(progress);
    const tempAmount = Math.floor(Math.random() * 50) + 1;
    amountBox.textContent = `$${tempAmount}`;

    if (spinCount < totalSpins) {
      spinCount++;
      setTimeout(spinStep, delay);
    } else {
      const finalAmount = Math.floor(Math.random() * 6) + 45;
      amountBox.textContent = `$${finalAmount}`;
      amountBox.style.transform = 'scale(1.3)';
      setTimeout(() => {
        amountBox.style.transform = 'scale(1)';
      }, 500);

      codeValue.textContent = generateRandomCode();
      codeBox.classList.remove('hidden');

      triggerJackpotEffect();
      launchConfetti();
      launchFireworks(6);
      launchCoinRain(30);

      setTimeout(() => {
        spinButton.disabled = false;
        spinButton.innerHTML = 'Spin Now!';
      }, 1800);
    }
  }

  spinStep();
});

function triggerJackpotEffect() {
  amountBox.style.color = '#FFD700';
  amountBox.style.textShadow = '0 0 25px #FFD700, 0 0 40px gold';
}

// --- Confetti ---
function launchConfetti() {
  const duration = 1000;
  const end = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 6 };

  const interval = setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);
    const particleCount = 30 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: Math.random(), y: Math.random() * 0.5 }
    }));
  }, 200);
}

// --- Coin Rain ---
function launchCoinRain(amount = 30) {
  for (let i = 0; i < amount; i++) {
    const coin = document.createElement('div');
    coin.classList.add('coin');

    // 🎲 Random size between 20px and 40px
    const size = 20 + Math.random() * 20;
    coin.style.width = `${size}px`;
    coin.style.height = `${size}px`;

    // 🎲 Random animation duration (fall speed)
    const duration = (1 + Math.random()).toFixed(2);
    coin.style.animationDuration = `${duration}s`;

    // 🎲 Random horizontal position
    coin.style.left = Math.random() * 100 + 'vw';

    // 🎲 Random starting rotation angle
    coin.style.transform = `rotate(${Math.random() * 360}deg)`;

    document.getElementById('coin-container').appendChild(coin);
    setTimeout(() => coin.remove(), 2000);
  }
}


// --- Fireworks ---
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let fireworks = [];
let animationRunning = false;

function createFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height / 2;
  const particles = [];

  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    particles.push({
      x,
      y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life: 100,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
      trail: []
    });
  }

  fireworks.push(particles);
  if (!animationRunning) {
    animationRunning = true;
    animateFireworks();
  }
}

function animateFireworks() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  fireworks.forEach((particles, index) => {
    particles.forEach(p => {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 10) p.trail.shift();

      ctx.beginPath();
      for (let i = 0; i < p.trail.length - 1; i++) {
        const a = p.trail[i];
        const b = p.trail[i + 1];
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
      ctx.stroke();

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.05;
      p.life--;
    });

    fireworks[index] = particles.filter(p => p.life > 0);
  });

  fireworks = fireworks.filter(p => p.length > 0);

  if (fireworks.length > 0) {
    requestAnimationFrame(animateFireworks);
  } else {
    animationRunning = false;
  }
}

function launchFireworks(times = 6) {
  for (let i = 0; i < times; i++) {
    setTimeout(createFirework, i * 300);
  }
}
