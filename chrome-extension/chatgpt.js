const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function composer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const element = document.querySelector("#prompt-textarea, div.ProseMirror[contenteditable='true']");
    if (element) return element;
    await wait(500);
  }
  return null;
}

function insertPrompt(element, prompt) {
  element.focus();
  if (element instanceof HTMLTextAreaElement) {
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
    setter?.call(element, prompt);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }
  element.textContent = prompt;
  element.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: prompt }));
}

async function submitPrompt() {
  const { prompt } = await chrome.runtime.sendMessage({ type: "GSD_GET_PENDING_PROMPT" });
  if (!prompt) return;
  const element = await composer();
  if (!element) return;
  insertPrompt(element, prompt);
  await wait(750);
  const send = document.querySelector("button[data-testid='send-button'], button[aria-label='Send prompt']");
  if (send instanceof HTMLButtonElement && !send.disabled) send.click();
  else element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true }));
  await chrome.runtime.sendMessage({ type: "GSD_PROMPT_SUBMITTED" });
}

void submitPrompt();
