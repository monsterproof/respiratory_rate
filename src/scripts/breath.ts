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


// ALGORITHM VERSION
const Z = 4; // Set Size
const ThC = 13; // Consistency Threshold in Percent

let lastTapTime: number | null = null;
let intervals: number[] = [];

function median(arr: number[]) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return (s.length % 2 !== 0)
    ? s[mid]
    : (s[mid - 1] + s[mid]) / 2;
}

function onTap() {
  const now = Date.now();

  if (lastTapTime !== null) {
    const interval = now - lastTapTime;
    intervals.push(interval);
    console.log(`Interval recorded: ${interval} ms`);

    // keep only the last Z intervals
    if (intervals.length > Z) {
      intervals.shift();
    }

    if (intervals.length === Z) {

      // calculate median
      const med = median(intervals);
      console.log(`Median of last ${Z} intervals: ${med} ms`);

      // max deviation from median
      const maxDeviation = Math.max(
        ...intervals.map(i => Math.abs(i - med) / med * 100)
      );

      console.log(`Max deviation from median: ${maxDeviation.toFixed(2)} %`);

      if (maxDeviation <= ThC) {
        // median interval (ms) → convert to seconds → BPM
        return 60 / (med / 1000);
      }

      return null;
    }
  }

  lastTapTime = now;
  return null;
}

function updateBreathCount() {
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

    const rr = onTap();
    if (rr !== null) {
      console.log(`Consistent BPM detected: ${rr.toFixed(2)}`);
    }

    // Start
    if (!tracking) {
      tracking = true;
      startTime = Date.now();
      lastTime = startTime;
      breathCount = 0;

      updateBreathCount();
      bpmEl.textContent = "0";
      timerValueEl.textContent = "0.0";

      startTimer();
      return;
    }

    // Count breath
    breathCount++;
    updateBreathCount();
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
    lastTapTime = null;
    intervals = [];

    updateBreathCount();
    bpmEl.textContent = "0";
    timerValueEl.textContent = "0.0";
    intervalTimeEl.textContent = "0";
    intervalMeanEl.textContent = "0";

    stopTimer();
  }
});



