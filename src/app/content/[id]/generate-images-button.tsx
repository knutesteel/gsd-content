"use client";

import { queueImageGeneration } from "@/app/actions";

export function GenerateImagesButton({ id, identifier, prompt }: { id: string; identifier: string; prompt: string }) {
  const imagePrompt = `${prompt}\n\nDELIVERY INSTRUCTIONS\nCreate the requested image or full carousel now. Save each completed image to the GSD Auto Assets Google Drive folder. Use the exact filename GSD-${identifier}-Image-1.png for a single image, or GSD-${identifier}-Carousel-1.png, GSD-${identifier}-Carousel-2.png, and so on for a carousel. Do not omit the content identifier from any filename.`;
  return <form action={queueImageGeneration} onSubmit={() => {
    const bridge = document.getElementById("gsd-extension-bridge");
    if (document.documentElement.dataset.gsdExtensionInstalled === "true" && bridge) {
      bridge.dataset.prompt = imagePrompt;
      bridge.dispatchEvent(new CustomEvent("gsd-generate-images"));
    } else {
      void navigator.clipboard.writeText(imagePrompt);
      window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
    }
  }}>
    <span id="gsd-extension-bridge" hidden />
    <input type="hidden" name="id" value={id} />
    <input type="hidden" name="identifier" value={identifier} />
    <input type="hidden" name="prompt" value={imagePrompt} />
    <button className="primary" disabled={!prompt}>Generate Images</button>
  </form>;
}
