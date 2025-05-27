let interval = null;
let seconds = 25 * 60;
let isRunning = false;
let workOrRest = "work"

window.addEventListener('DOMContentLoaded', () => {
  const work_time = 25 * 60 // Update to get from localStorage
  const rest_time = 5 * 60

  const timer_minutes = document.getElementById('timer_minutes');
  const timer_seconds = document.getElementById('timer_seconds');
  const btn_start = document.getElementById('btn_start');
  const btn_work = document.getElementById('btn_work');
  const btn_rest = document.getElementById('btn_break');

  updateDisplay(seconds)

  function formatTime(sec) {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return { mins, secs }
  }

  function updateDisplay(seconds) {
    time = formatTime(seconds)
    timer_minutes.value = time.mins;
    timer_seconds.value = time.secs;
    updateTrayIcon(`${timer_minutes.value}:${timer_seconds.value}`)
  }

  function toggleTimer() {
    isRunning = !isRunning;

    if (isRunning) {
      interval = setInterval(() => {
        seconds--;
        updateDisplay(seconds);
        if (seconds == 0) {
          //if time runs out
          setTimeout(() => {
            isRunning = false
            clearInterval(interval)
            btn_work.disabled = false
            btn_rest.disabled = false
            timer_minutes.disabled = false
            timer_seconds.disabled = false

            if (workOrRest == "work") {
              alert("Time for a break!")
              clickRest();
            } else {
              alert("Time to start work!")
              clickWork();
            }
          }, 500)
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (isRunning) {
      btn_work.disabled = true
      btn_rest.disabled = true
      timer_minutes.disabled = true
      timer_seconds.disabled = true
    } else {
      btn_work.disabled = false
      btn_rest.disabled = false
      timer_minutes.disabled = false
      timer_seconds.disabled = false
    }
  }

  btn_start.onclick = toggleTimer

  const clickWork = () => {
    seconds = work_time
    updateDisplay(seconds)
    btn_work.classList.add("active_tab")
    btn_rest.classList.remove("active_tab")
    workOrRest = "work"
  }

  const clickRest = () => {
    seconds = rest_time;
    updateDisplay(seconds);
    btn_rest.classList.add("active_tab");
    btn_work.classList.remove("active_tab");
    workOrRest = "rest"
  }

  btn_work.onclick = clickWork
  btn_rest.onclick = clickRest

  function updateTime() {
    const input_minutes = Number(timer_minutes.value)
    const input_seconds = Number(timer_seconds.value)

    if (isNaN(input_minutes)
      || isNaN(input_seconds)
      || input_seconds > 59
    ) {
      alert("Invalid Time Format")
      updateDisplay(seconds)
      return
    }

    seconds = 60 * input_minutes + input_seconds
    // update for the icon
    updateDisplay(seconds)
  }

  timer_minutes.addEventListener("focusout", updateTime)
  timer_seconds.addEventListener("focusout", updateTime)
});

//Canvas stuff
// Function to generate tray icon from text
function updateTrayIcon(text) {
  const size = 32;
  const scaleFactor = 4;
  const canvas = document.createElement('canvas');
  canvas.width = size * scaleFactor;
  canvas.height = size * scaleFactor;
  const ctx = canvas.getContext('2d');

  ctx.scale(scaleFactor, scaleFactor);

  // Clear transparent background
  ctx.clearRect(0, 0, size, size);

  // Draw centered text
  ctx.font = '10px Monospace';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, size / 2, size / 2);

  // Convert to PNG buffer and send to main
  canvas.toBlob(blob => {
    const reader = new FileReader();
    reader.onload = function() {
      const arrayBuffer = this.result;
      window.electronAPI.updateTrayIcon(arrayBuffer);
    };
    reader.readAsArrayBuffer(blob);
  }, 'image/png');
}

