let tracking: boolean = false;
let breathCount: number = 0;
let startTime: number;
let timerInterval: ReturnType<typeof setInterval> | undefined = undefined;

const breathCountEl = document.getElementById("breathCount")!;
const bpmEl = document.getElementById("bpm")!;
const timerValueEl = document.getElementById("timerValue")!;

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
  const elapsed = (Date.now() - startTime) / 1000;
  timerValueEl.textContent = elapsed.toFixed(1); // e.g. "3.4"
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

// KEY LISTENER

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();

    // Start
    if (!tracking) {
      tracking = true;
      startTime = Date.now();
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

    stopTimer();
  }
});
