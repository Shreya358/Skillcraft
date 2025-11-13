let startTime, updatedTime, difference = 0, tInterval, running = false, lapCount = 0;

const display = document.getElementById("display");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const lapBtn = document.getElementById("lap");
const laps = document.getElementById("laps");

startBtn.onclick = () => {
  if (!running) {
    startTime = new Date().getTime() - difference;
    tInterval = setInterval(runTimer, 10);
    running = true;
  }
};

pauseBtn.onclick = () => {
  if (running) {
    clearInterval(tInterval);
    difference = new Date().getTime() - startTime;
    running = false;
  }
};

resetBtn.onclick = () => {
  clearInterval(tInterval);
  display.innerHTML = "00:00:00.00";
  running = false;
  difference = 0;
  laps.innerHTML = "";
  lapCount = 0;
};

lapBtn.onclick = () => {
  if (running) {
    lapCount++;
    const li = document.createElement("li");
    li.textContent = `Lap ${lapCount}: ${display.innerHTML}`;
    laps.appendChild(li);
  }
};

function runTimer() {
  updatedTime = new Date().getTime() - startTime;
  const centiseconds = Math.floor((updatedTime % 1000) / 10);
  const seconds = Math.floor((updatedTime / 1000) % 60);
  const minutes = Math.floor((updatedTime / (1000 * 60)) % 60);
  const hours = Math.floor((updatedTime / (1000 * 60 * 60)) % 24);
  display.innerHTML = 
    `${String(hours).padStart(2, '0')}:` +
    `${String(minutes).padStart(2, '0')}:` +
    `${String(seconds).padStart(2, '0')}.` +
    `${String(centiseconds).padStart(2, '0')}`;
}