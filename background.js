// Background script for npmx Redirect extension
// Uses browser.* API (polyfilled for Chrome compatibility)

const RULESET_ID = 'ruleset_1';

// Toggle the redirect on/off
async function toggleRedirect(enabled) {
  try {
    if (enabled) {
      await browser.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: [RULESET_ID]
      });
    } else {
      await browser.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: [RULESET_ID]
      });
    }
    await browser.storage.local.set({ enabled });
    return true;
  } catch (error) {
    console.error('Failed to toggle redirect:', error);
    return false;
  }
}

// Get current enabled state
async function getEnabled() {
  try {
    const result = await browser.storage.local.get('enabled');
    // Default to enabled if not set
    return result.enabled !== false;
  } catch (error) {
    console.error('Failed to get enabled state:', error);
    return true;
  }
}

// Listen for messages from popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'toggle') {
    toggleRedirect(message.enabled).then(sendResponse);
    return true; // Indicates async response
  }
  if (message.type === 'getStatus') {
    getEnabled().then(enabled => sendResponse({ enabled }));
    return true;
  }
});

// Initialize on install
browser.runtime.onInstalled.addListener(async () => {
  await browser.storage.local.set({ enabled: true });
});
