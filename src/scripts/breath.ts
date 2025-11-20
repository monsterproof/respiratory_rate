// State Variables
let tracking: boolean = false;
let breathCount: number = 0;
let startTime: number;
let timerInterval: ReturnType<typeof setInterval> | undefined = undefined;
let lastTapTime: number | null = null;
let intervals: number[] = [];

const Z = 4; // Set Size
const ThC = 13; // Consistency Threshold in Percent

//DOM Elements
const breathCountEl = document.getElementById("breathCount")!;
const bpmEl = document.getElementById("bpm")!;
const timerValueEl = document.getElementById("timerValue")!;
const bpmCardEl = document.getElementById("bpmCard")!;

// FUNCTIONS

// Calculate median of an array of numbers
function median(arr: number[]) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// Handle tap event
function onTap() {
  const now = Date.now();

  if (lastTapTime !== null) {
    const interval = now - lastTapTime;
    intervals.push(interval);

    // keep only the last Z intervals
    if (intervals.length > Z) {
      intervals.shift();
    }

    console.log(`Intervals recorded: ${intervals} ms`);

    if (intervals.length === Z) {
      // calculate median
      const med = median(intervals);
      console.log(`Median of last ${Z} intervals: ${med} ms`);

      // max deviation from median
      const maxDeviation = Math.max(
        ...intervals.map((i) => (Math.abs(i - med) / med) * 100)
      );

      console.log(`Max deviation from median: ${maxDeviation.toFixed(2)} %`);

      if (maxDeviation <= ThC) {
        // median interval (ms) → convert to seconds → BPM
        return 60 / (med / 1000);
      }
      lastTapTime = now;
      return null;
    }
  }

  lastTapTime = now;
  return null;
}

// Update breath count display
function updateBreathCount() {
  breathCountEl.textContent = breathCount.toString();
}

// TIMER FUNCTIONS
function updateTimer() {
  const elapsedTime = (Date.now() - startTime) / 1000;
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

// KEY LISTENER - Main Function
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();

    const rr = onTap();
    if (rr !== null) {
      console.log(`Consistent BPM detected: ${rr.toFixed(2)}`);
      bpmEl.textContent = Math.round(rr).toString();
      stopTimer();
      tracking = false;
      bpmCardEl.classList.remove("invisible");
      return;
    }

    // Start
    if (!tracking) {
      tracking = true;
      startTime = Date.now();
      breathCount = 1;

      updateBreathCount();
      bpmEl.textContent = "0";
      timerValueEl.textContent = "0.0";

      startTimer();
      return;
    }

    // Count breath
    breathCount++;
    updateBreathCount();
  }

  // Reset
  if (event.code == "Escape") {
    event.preventDefault();

    tracking = false;
    breathCount = 0;
    startTime = 0;
    lastTapTime = null;
    intervals = [];

    updateBreathCount();
    bpmEl.textContent = "0";
    timerValueEl.textContent = "0.0";
    bpmCardEl.classList.add("invisible");

    stopTimer();
  }
});
