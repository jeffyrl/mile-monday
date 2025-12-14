const API_URL = "https://script.google.com/macros/s/AKfycbyL-8hKSx2QflbkvnfzwghIX8mMvUgSN0Vl0yqYNva-WfZZimSRGG9GdhRFQLtnZl83iw/exec";

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

refreshBtn.addEventListener("click", loadLeaderboard);
loadLeaderboard();
