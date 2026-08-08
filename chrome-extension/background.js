const pendingKey = "pendingGsdImagePrompt";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "GSD_GENERATE_IMAGES" && typeof message.prompt === "string") {
    chrome.storage.local.set({
      [pendingKey]: { prompt: message.prompt, createdAt: Date.now() },
    }).then(() => chrome.tabs.create({ url: "https://chatgpt.com/" }))
      .then(() => sendResponse({ ok: true }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  if (message?.type === "GSD_GET_PENDING_PROMPT") {
    chrome.storage.local.get(pendingKey).then((stored) => {
      const pending = stored[pendingKey];
      if (!pending || Date.now() - pending.createdAt > 10 * 60 * 1000) {
        chrome.storage.local.remove(pendingKey);
        sendResponse({ prompt: null });
        return;
      }
      sendResponse({ prompt: pending.prompt });
    });
    return true;
  }

  if (message?.type === "GSD_PROMPT_SUBMITTED") {
    chrome.storage.local.remove(pendingKey).then(() => sendResponse({ ok: true }));
    return true;
  }
});
