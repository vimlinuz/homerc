// Clock
function updateTime() {
  const now = new Date();
  let h = now.getHours();
  let m = now.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;
  h = h ? h : 12;
  m = m.toString().padStart(2, "0");

  document.getElementById("time").textContent = `${h}:${m} ${ampm}`;
}

setInterval(updateTime, 1000);
updateTime();

// Google Search

// listens for Enter in search box

// Google Search
// Listen for Enter key in search box
// Redirect to Google search with query

document.getElementById("search").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const q = e.target.value.trim();
    if (q !== "") {
      window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
    }
  }
});
