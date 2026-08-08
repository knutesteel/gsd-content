const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function composer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const element = document.querySelector(
      "#prompt-textarea, [data-testid='prompt-textarea'], div.ProseMirror[contenteditable='true'], main [contenteditable='true'][role='textbox']",
    );
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
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  selection?.removeAllRanges();
  selection?.addRange(range);

  // ChatGPT's contenteditable composer must receive an editing operation. Setting
  // textContent changes the DOM but does not update the editor's internal state.
  const inserted = document.execCommand("insertText", false, prompt);
  if (!inserted) {
    element.replaceChildren();
    const lines = prompt.split("\n");
    lines.forEach((line, index) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = line || "\u200b";
      element.appendChild(paragraph);
      if (index === lines.length - 1 && !line) paragraph.appendChild(document.createElement("br"));
    });
    element.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: prompt }));
  }
}

function hasPrompt(element) {
  return (element.innerText || element.textContent || "").trim().length > 0;
}

async function submitPrompt() {
  const { prompt } = await chrome.runtime.sendMessage({ type: "GSD_GET_PENDING_PROMPT" });
  if (!prompt) return;
  const element = await composer();
  if (!element) return;
  insertPrompt(element, prompt);
  await wait(1000);
  if (!hasPrompt(element)) return;

  const send = document.querySelector(
    "button[data-testid='send-button'], button[data-testid='composer-submit-button'], button[aria-label='Send prompt'], button[aria-label='Send message']",
  );
  if (send instanceof HTMLButtonElement && !send.disabled) {
    send.click();
    await chrome.runtime.sendMessage({ type: "GSD_PROMPT_SUBMITTED" });
  }
}

void submitPrompt();
