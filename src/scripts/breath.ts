let tracking: boolean = false;
let breathCount: number = 0;
let startTime: number;
let lastTime: number;
let elapsedTime: number = 0;
let timerInterval: ReturnType<typeof setInterval> | undefined = undefined;

const breathCountEl = document.getElementById("breathCount")!;
const bpmEl = document.getElementById("bpm")!;
const timerValueEl = document.getElementById("timerValue")!;
const intervalTimeEl = document.getElementById("intervalTime")!;
const intervalMeanEl = document.getElementById("intervalMean")!;

function updateUI() {
  breathCountEl.textContent = breathCount.toString();
}

function updateBPM() {
  const seconds = (Date.now() - startTime) / 1000;
  if (seconds <= 0) return;

  const bpm = breathCount / (seconds / 60);
  bpmEl.textContent = Math.round(bpm).toString();
}

function updateTimer() {
  elapsedTime = (Date.now() - startTime) / 1000;
  timerValueEl.textContent = elapsedTime.toFixed(1); // e.g. "3.4"
}

function startTimer() {
  timerInterval = setInterval(() => {
    if (!tracking) return;
    updateTimer();
  }, 100);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = undefined;
}

function updateIntervall() {
  const interval = Date.now() - lastTime;
  const meanInterval = (Date.now() - startTime) / breathCount;
  lastTime = Date.now();
  intervalTimeEl.textContent = `${interval.toString()} ms`;
  intervalMeanEl.textContent = `Ø ${meanInterval} ms`;
}

// KEY LISTENER

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();

    // Start
    if (!tracking) {
      tracking = true;
      startTime = Date.now();
      lastTime = startTime;
      breathCount = 0;

      updateUI();
      bpmEl.textContent = "0";
      timerValueEl.textContent = "0.0";

      startTimer();
      return;
    }

    // Count breath
    breathCount++;
    updateUI();
    updateIntervall();
    updateBPM();
  }

  // Stop
  if (event.code === "Enter" && tracking) {
    event.preventDefault();

    updateBPM();
    stopTimer();

    tracking = false;
  }

  // Reset
  if (event.code == "Escape") {
    event.preventDefault();

    tracking = false;
    breathCount = 0;
    startTime = 0;

    updateUI();
    bpmEl.textContent = "0";
    timerValueEl.textContent = "0.0";
    intervalTimeEl.textContent = "0";
    intervalMeanEl.textContent = "0";

    stopTimer();
  }
});
