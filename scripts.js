const API_URL = "https://script.google.com/macros/s/AKfycbyzxQRfeu0mxwlHomD8h80Zjo-cFn8yZDPhzJrrfs04Ws12ByaFCxyWDZd7_lJbNS8wDw/exec";

const form = document.getElementById("timeForm");
const msg = document.getElementById("msg");
const tbody = document.getElementById("leaderboard");
const refreshBtn = document.getElementById("refreshBtn");

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

async function loadLeaderboard() {
  tbody.innerHTML = `<tr><td colspan="3">Loading...</td></tr>`;
  const res = await fetch(API_URL);
  const data = await res.json();

  const lb = data.leaderboard || [];
  if (lb.length === 0) {
    tbody.innerHTML = `<tr><td colspan="3">No times yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = lb.map((row, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${row.name}</td>
      <td>${formatTime(row.timeSeconds)}</td>
    </tr>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.className = "msg";
  msg.textContent = "";

  const name = document.getElementById("name").value.trim();
  const min = Number(document.getElementById("min").value);
  const sec = Number(document.getElementById("sec").value);

  if (!name || !Number.isFinite(min) || !Number.isFinite(sec) || sec < 0 || sec > 59) {
    msg.className = "msg err";
    msg.textContent = "Enter a valid name + time (seconds 0–59).";
    return;
  }

  const timeSeconds = min * 60 + sec;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, timeSeconds })
    });

    if (!res.ok) throw new Error("Failed to submit.");

    msg.className = "msg ok";
    msg.textContent = "Submitted! ✅";
    form.reset();
    await loadLeaderboard();
  } catch (err) {
    msg.className = "msg err";
    msg.textContent = "Error submitting. Check your API URL + deployment access.";
  }
});

refreshBtn.addEventListener("click", loadLeaderboard);

// initial load
loadLeaderboard();
