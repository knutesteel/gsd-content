"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type LightboxAsset = {
  id: string;
  url: string;
  alt: string;
  label: string;
  storagePath: string;
};

export function AssetLightbox({ assets, identifier }: { assets: LightboxAsset[]; identifier: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [revisionRequest, setRevisionRequest] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const activeAsset = activeIndex === null ? null : assets[activeIndex];

  const move = useCallback((direction: -1 | 1) => {
    setActiveIndex((current) => current === null ? null : (current + direction + assets.length) % assets.length);
    setRevisionRequest("");
    setSubmitted(false);
  }, [assets.length]);

  const filename = useMemo(() => {
    const path = activeAsset?.storagePath ?? "";
    return decodeURIComponent(path.split("/").at(-1) || activeAsset?.label || "selected image");
  }, [activeAsset]);

  useEffect(() => {
    if (activeIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft" && assets.length > 1) move(-1);
      if (event.key === "ArrowRight" && assets.length > 1) move(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, assets.length, move]);

  function openAsset(index: number) {
    setActiveIndex(index);
    setRevisionRequest("");
    setSubmitted(false);
  }

  function requestRevision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeAsset || !revisionRequest.trim()) return;

    const revisionPrompt = `Use the current GSD Voice Guide, GSD Image Guide, GSD ICP, and relevant character references from the ChatGPT Library.

Revise the existing image identified below. Use the original image as the required visual reference.

ORIGINAL IMAGE
Content: GSD-${identifier}
Filename: ${filename}
Storage location: GSD Auto Assets / ${activeAsset.storagePath}

REQUESTED REVISION
${revisionRequest.trim()}

REVISION RULES
- Make only the requested change. Do not alter any other element.
- Preserve the original composition, style, characters, colors, dimensions, aspect ratio, and image quality unless the request explicitly says otherwise.
- Keep all unchanged text and branding exactly as shown.
- Do not create additional variants.

DELIVERY
Save the completed revision to the same GSD Auto Assets Google Drive location and replace the original image in place using the exact filename ${filename}.`;

    const bridge = document.getElementById("gsd-extension-bridge");
    if (document.documentElement.dataset.gsdExtensionInstalled === "true" && bridge) {
      bridge.dataset.prompt = revisionPrompt;
      bridge.dispatchEvent(new CustomEvent("gsd-generate-images"));
    } else {
      void navigator.clipboard.writeText(revisionPrompt);
      window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
    }
    setSubmitted(true);
  }

  return <>
    <span id="gsd-extension-bridge" hidden />
    <div className="asset-grid">
      {assets.map((asset, index) => <button type="button" onClick={() => openAsset(index)} key={asset.id} aria-label={`Open ${asset.label}`}>
        <Image src={asset.url} alt={asset.alt} width={360} height={360} unoptimized />
        <span>{asset.label}</span>
      </button>)}
    </div>
    {activeAsset ? <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={activeAsset.label} onClick={(event) => {
      if (event.currentTarget === event.target) setActiveIndex(null);
    }}>
      <button type="button" className="lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close image viewer">×</button>
      {assets.length > 1 ? <button type="button" className="lightbox-previous" onClick={() => move(-1)} aria-label="Previous image">‹</button> : null}
      <div className="lightbox-content">
        <div className="lightbox-image">
          <Image src={activeAsset.url} alt={activeAsset.alt} fill sizes="90vw" unoptimized />
        </div>
        <p>{activeAsset.label} · {(activeIndex ?? 0) + 1} of {assets.length}</p>
        <form className="image-revision-form" onSubmit={requestRevision}>
          <label htmlFor="image-revision-request">Request changes to this image</label>
          <div>
            <textarea id="image-revision-request" value={revisionRequest} onChange={(event) => {
              setRevisionRequest(event.target.value);
              setSubmitted(false);
            }} placeholder="Describe only the changes you want made…" rows={2} />
            <button type="submit" className="primary" disabled={!revisionRequest.trim()}>Request Revision</button>
          </div>
          <small>{submitted ? "Revision prompt sent. If the GSD extension is not installed, it was copied and ChatGPT opened." : `Targets ${filename}; all other image details will be preserved.`}</small>
        </form>
      </div>
      {assets.length > 1 ? <button type="button" className="lightbox-next" onClick={() => move(1)} aria-label="Next image">›</button> : null}
    </div> : null}
  </>;
}
