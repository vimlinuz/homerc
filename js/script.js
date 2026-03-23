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

document.addEventListener("DOMContentLoaded", function () {
  // Settings modal logic
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const settingsClose = document.getElementById("settingsClose");
  const shortcutForm = document.getElementById("shortcutForm");
  const shortcutName = document.getElementById("shortcutName");
  const shortcutValue = document.getElementById("shortcutValue");
  const shortcutsList = document.getElementById("shortcutsList");
  const linksDiv = document.querySelector(".links");
  const bgInput = document.getElementById("bgImageInput");
  const bgPreview = document.getElementById("bgPreview");
  const removeBgBtn = document.getElementById("removeBgBtn");

  function getShortcuts() {
    const raw = localStorage.getItem("userShortcuts");
    return raw ? JSON.parse(raw) : [];
  }
  function setShortcuts(shortcuts) {
    localStorage.setItem("userShortcuts", JSON.stringify(shortcuts));
  }
  function renderShortcuts() {
    const shortcuts = getShortcuts();
    shortcutsList.innerHTML = "";
    if (shortcuts.length === 0) {
      shortcutsList.innerHTML =
        '<div style="color: var(--muted); text-align:center;">No shortcuts added yet.</div>';
      return;
    }
    shortcuts.forEach((s, idx) => {
      const item = document.createElement("div");
      item.className = "shortcut-item";
      item.innerHTML = `
        <div style="flex:1">
          <strong>${s.name}</strong><br>
          <span style=\"color:var(--muted); font-size: 13px;\">${s.value}</span>
        </div>
        <div class="shortcut-actions">
          <button class="links-btn edit-btn" data-idx="${idx}">Edit</button>
          <button class="links-btn delete-btn" data-idx="${idx}" style="background:#ee4444; color:#fff;">Delete</button>
        </div>
      `;
      shortcutsList.appendChild(item);
    });
    Array.from(shortcutsList.getElementsByClassName("edit-btn")).forEach(
      (btn) => {
        btn.addEventListener("click", function (e) {
          const i = this.getAttribute("data-idx");
          beginEditShortcut(i);
        });
      },
    );
    Array.from(shortcutsList.getElementsByClassName("delete-btn")).forEach(
      (btn) => {
        btn.addEventListener("click", function (e) {
          const i = Number(this.getAttribute("data-idx"));
          let shortcuts = getShortcuts();
          shortcuts.splice(i, 1);
          setShortcuts(shortcuts);
          renderShortcuts();
          renderMainShortcuts();
        });
      },
    );
  }
  function beginEditShortcut(index) {
    const shortcuts = getShortcuts();
    const s = shortcuts[index];
    shortcutsList.innerHTML = "";
    const editForm = document.createElement("form");
    editForm.className = "shortcut-form";
    editForm.innerHTML = `
      <input type="text" id="editShortcutName" value="${s.name}" required />
      <input type="text" id="editShortcutValue" value="${s.value}" required />
      <button type="submit" class="links-btn">Save</button>
      <button type="button" id="cancelEdit" class="links-btn" style="background:#aaa;">Cancel</button>
    `;
    shortcutsList.appendChild(editForm);
    document.getElementById("editShortcutName").focus();
    editForm.addEventListener("submit", function (event) {
      event.preventDefault();
      shortcuts[index] = {
        name: document.getElementById("editShortcutName").value.trim(),
        value: document.getElementById("editShortcutValue").value.trim(),
      };
      setShortcuts(shortcuts);
      renderShortcuts();
      renderMainShortcuts();
    });
    document
      .getElementById("cancelEdit")
      .addEventListener("click", function () {
        renderShortcuts();
      });
  }
  function createShortcutLink(name, value) {
    const a = document.createElement("a");
    a.href = value;
    a.title = name;
    a.textContent = name;
    a.style.display = "flex";
    a.style.alignItems = "center";
    a.style.gap = "6px";
    return a;
  }
  function renderMainShortcuts() {
    const shortcuts = getShortcuts();
    // Remove previously added shortcut links
    Array.from(linksDiv.querySelectorAll(".user-shortcut")).forEach((el) =>
      el.remove(),
    );
    shortcuts.forEach((s) => {
      const el = createShortcutLink(s.name, s.value);
      el.classList.add("user-shortcut");
      linksDiv.appendChild(el);
    });
  }

  // ---- BACKGROUND IMAGE MGMT ----
  function setBackgroundImage(imgData) {
    document.body.style.backgroundImage = imgData ? `url('${imgData}')` : "";
    document.body.style.backgroundSize = imgData ? "cover" : "";
    document.body.style.backgroundPosition = imgData ? "center" : "";
    document.body.style.backgroundRepeat = imgData ? "no-repeat" : "";
  }
  function showBgPreview(imgData) {
    if (bgPreview) {
      if (imgData) {
        bgPreview.innerHTML = `<img src="${imgData}" alt="bg preview" style="max-width:120px; max-height:80px; border-radius: 7px; box-shadow:0 2px 8px #0003;">`;
      } else {
        bgPreview.innerHTML = "";
      }
    }
  }
  // On load, check saved bg
  const savedBg = localStorage.getItem("userBg");
  if (savedBg) {
    setBackgroundImage(savedBg);
    showBgPreview(savedBg);
  }
  if (bgInput) {
    bgInput.addEventListener("change", function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (evt) {
        const result = evt.target.result;
        localStorage.setItem("userBg", result);
        setBackgroundImage(result);
        showBgPreview(result);
      };
      reader.readAsDataURL(file);
    });
  }
  if (removeBgBtn) {
    removeBgBtn.addEventListener("click", function () {
      localStorage.removeItem("userBg");
      setBackgroundImage("");
      showBgPreview("");
      if (bgInput) bgInput.value = "";
    });
  }

  if (settingsBtn && settingsModal && settingsClose) {
    settingsBtn.addEventListener("click", function () {
      settingsModal.style.display = "block";
      renderShortcuts();
    });
    settingsClose.addEventListener("click", function () {
      settingsModal.style.display = "none";
    });
    // Close modal on click outside content
    window.addEventListener("click", function (event) {
      if (event.target == settingsModal) {
        settingsModal.style.display = "none";
      }
    });
  }
  // Add shortcut
  if (shortcutForm) {
    shortcutForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = shortcutName.value.trim();
      const value = shortcutValue.value.trim();
      if (!name || !value) return;
      let shortcuts = getShortcuts();
      shortcuts.push({ name, value });
      setShortcuts(shortcuts);
      shortcutForm.reset();
      renderShortcuts();
      renderMainShortcuts();
    });
  }
  // Render user shortcuts on startup
  renderMainShortcuts();
  // Google Search
  const searchBox = document.getElementById("search");
  if (searchBox) {
    searchBox.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = e.target.value.trim();
        if (q !== "") {
          window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
        }
      }
    });
  }
});
