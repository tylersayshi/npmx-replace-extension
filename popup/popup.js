// Popup script for npmx Redirect extension

const toggle = document.getElementById('enabled');
const status = document.getElementById('status');

function updateStatus(enabled) {
  if (enabled) {
    status.textContent = 'Redirects active';
    status.classList.remove('disabled');
  } else {
    status.textContent = 'Redirects paused';
    status.classList.add('disabled');
  }
}

// Get initial state
browser.runtime.sendMessage({ type: 'getStatus' }).then(response => {
  toggle.checked = response.enabled;
  updateStatus(response.enabled);
});

// Handle toggle changes
toggle.addEventListener('change', async () => {
  const enabled = toggle.checked;
  updateStatus(enabled);
  await browser.runtime.sendMessage({ type: 'toggle', enabled });
});
