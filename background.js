const RULESET_ID = "ruleset_1";

async function setRulesetEnabled(enabled) {
  await browser.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: enabled ? [RULESET_ID] : [],
    disableRulesetIds: enabled ? [] : [RULESET_ID],
  });
}

async function syncRulesetWithStorage() {
  const { enabled = true } = await browser.storage.local.get("enabled");
  await setRulesetEnabled(enabled);
}

browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && "enabled" in changes) {
    setRulesetEnabled(changes.enabled.newValue);
  }
});

browser.runtime.onInstalled.addListener(async () => {
  await browser.storage.local.set({ enabled: true });
});

syncRulesetWithStorage();
