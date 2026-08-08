document.documentElement.dataset.gsdExtensionInstalled = "true";

function connectBridge() {
  const bridge = document.getElementById("gsd-extension-bridge");
  if (!bridge || bridge.dataset.gsdExtensionConnected === "true") return;
  bridge.dataset.gsdExtensionConnected = "true";
  bridge.addEventListener("gsd-generate-images", () => {
    const prompt = bridge.dataset.prompt;
    if (prompt) chrome.runtime.sendMessage({ type: "GSD_GENERATE_IMAGES", prompt });
  });
}

connectBridge();
new MutationObserver(connectBridge).observe(document.documentElement, { childList: true, subtree: true });
