
const screens = document.querySelectorAll('.screen');
const startBtn = document.getElementById('start-btn');
const chooseBtns = document.querySelectorAll('.choose-btn');
const gameContainer = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
const flash = document.getElementById('flash');
const rizzFill = document.getElementById('rizz-fill');
const rizzLabel = document.getElementById('rizz-label');
const ending = document.getElementById('ending');
const endingTitle = document.getElementById('ending-title');
const endingText = document.getElementById('ending-text');
const restartBtn = document.getElementById('restart-btn');

const jensenImage = 'jensen.png';

let mode = '';
let score = 0;
let seconds = 0;
let gameActive = false;
let disguiseActivated = false;

let timerInterval;
let tumbleweedInterval;
let messageTimeout;
let gameTimeouts = [];

// Start Button

startBtn.addEventListener('click', () => {
  screens[0].classList.add('up');
});

// Selction

chooseBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    mode = btn.dataset.mode;

    screens[1].classList.add('up');

    startGame();
  });
});

//Start

function startGame() {
  score = 0;
  seconds = 0;
  gameActive = true;
  disguiseActivated = false;

  scoreEl.textContent = 'RECEIPTS: 0';
  timeEl.textContent = 'TIME: 00:00';
  rizzFill.style.width = '0%';

  gameContainer.classList.remove(
    'jacket-mode',
    'no-jacket-mode'
  );

  gameContainer.classList.add(mode + '-mode');

  timerInterval = setInterval(increaseTime, 1000);

  if (mode === 'jacket') {
    rizzLabel.textContent = 'RIZZ LEVEL';

    schedule(() => createJensen(), 800);
  } else {
    rizzLabel.textContent = 'RIZZ NOT FOUND';

    showMessage(
      'PLEASE INSTALL LEATHER JACKET.',
      3500
    );

    createTumbleweed();

    tumbleweedInterval = setInterval(
      createTumbleweed,
      3500
    );

    //no-jacket mode.
    schedule(() => createJensen(), 15000);
  }
}

// Tracks game time

function increaseTime() {
  seconds++;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const m = String(minutes).padStart(2, '0');
  const s = String(remainingSeconds).padStart(2, '0');

  timeEl.textContent = `TIME: ${m}:${s}`;
}

// Jensen

function createJensen() {
  if (!gameActive) return;

  const jensen = document.createElement('div');
  jensen.classList.add('jensen');

  if (disguiseActivated) {
    jensen.classList.add('disguised');
  }

  const { x, y } = getRandomLocation();

  jensen.style.left = `${x}px`;
  jensen.style.top = `${y}px`;

  jensen.innerHTML = `
    <img
      class="jensen-photo"
      src="${jensenImage}"
      alt="Jensen Huang"
      draggable="false"
    >
    <span class="disguise">🥸</span>
  `;

  jensen.addEventListener('click', catchJensen);

  gameContainer.appendChild(jensen);
}

// Random position

function getRandomLocation() {
  const width = gameContainer.clientWidth;
  const height = gameContainer.clientHeight;

  const padding = 70;

  const x = padding + Math.random() *
    Math.max(0, width - padding * 2);

  const y = 150 + Math.random() *
    Math.max(0, height - 230);

  return { x, y };
}

// Catch jensen

function catchJensen() {
  if (!gameActive || this.classList.contains('caught')) {
    return;
  }

  score++;
  scoreEl.textContent = `RECEIPTS: ${score}`;

  cameraFlash();

  this.classList.add('caught');

  schedule(() => this.remove(), 300);

  if (mode === 'jacket') {
    jacketGameplay();
  } else {
    noJacketGameplay();
  }
}

// JAcket mode

function jacketGameplay() {
  // Rizz increase
  const rizz = Math.min(score * 5, 100);
  rizzFill.style.width = `${rizz}%`;

  // more photo, more jensen
  let spawnCount = 2;

  if (score >= 5) {
    spawnCount = 3;
  }

  if (score >= 10) {
    spawnCount = 4;
  }

  if (score >= 20) {
    spawnCount = 5;
  }

  // faster spawn
  const spawnDelay = Math.max(
    120,
    1000 - score * 35
  );

  for (let i = 0; i < spawnCount; i++) {
    schedule(
      createJensen,
      spawnDelay + i * 120
    );
  }

  // Special headlines
  if (score === 5) {
    showMessage('Just networking...', 2500);
  }

  if (score === 10) {
    showMessage(
      'The jacket has become sentient.',
      3000
    );
  }

  if (score === 20) {
    disguiseActivated = true;

    // lol jensen
    document.querySelectorAll('.jensen').forEach(
      jensen => {
        jensen.classList.add('disguised');
      }
    );

    showMessage(
      "That wasn't me, it was AI.",
      4500
    );
  }
}

// No jacket mode

function noJacketGameplay() {
  showMessage(
    '...We should follow the jacket.',
    3000
  );

  // Just tumbleweeds
}

// Camera flash

function cameraFlash() {
  flash.classList.remove('active');

  // Restart animation
  void flash.offsetWidth;

  flash.classList.add('active');
}

// Headline

function showMessage(text, duration = 2500) {
  message.textContent = text;
  message.classList.add('visible');

  clearTimeout(messageTimeout);

  messageTimeout = setTimeout(() => {
    message.classList.remove('visible');
  }, duration);
}

// Tumbleweed

function createTumbleweed() {
  if (!gameActive || mode !== 'no-jacket') {
    return;
  }

  const tumbleweed = document.createElement('div');

  tumbleweed.classList.add('tumbleweed');

  tumbleweed.textContent = '🌾';

  const height = gameContainer.clientHeight;

  tumbleweed.style.top = `${
    height * 0.65 + Math.random() * height * 0.2
  }px`;

  gameContainer.appendChild(tumbleweed);

  schedule(() => tumbleweed.remove(), 8000);
}

// Track TO for Restart

function schedule(callback, delay) {
  const id = setTimeout(callback, delay);
  gameTimeouts.push(id);
}

// Restart

restartBtn.addEventListener('click', restartGame);

function restartGame() {
  gameActive = false;

  clearInterval(timerInterval);
  clearInterval(tumbleweedInterval);
  clearTimeout(messageTimeout);

  gameTimeouts.forEach(clearTimeout);
  gameTimeouts = [];

  document.querySelectorAll(
    '.jensen, .tumbleweed'
  ).forEach(element => element.remove());

  message.classList.remove('visible');
  ending.classList.add('hidden');

  screens.forEach(screen => {
    screen.classList.remove('up');
  });

  mode = '';
}

// R restart

document.addEventListener('keydown', event => {
  if (event.key.toLowerCase() === 'r' && gameActive) {
    restartGame();
  }
});
