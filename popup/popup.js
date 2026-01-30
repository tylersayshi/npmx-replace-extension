const toggle = document.getElementById("enabled");
const status = document.getElementById("status");

function updateUI(enabled) {
  toggle.checked = enabled;
  status.textContent = enabled ? "Redirects active" : "Redirects paused";
  status.classList.toggle("disabled", !enabled);
}

async function init() {
  const { enabled = true } = await browser.storage.local.get("enabled");
  updateUI(enabled);
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && "enabled" in changes) {
    updateUI(changes.enabled.newValue);
  }
});

toggle.addEventListener("change", () => {
  browser.storage.local.set({ enabled: toggle.checked });
});

init();
