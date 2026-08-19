"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type LightboxAsset = {
  id: string;
  url: string;
  alt: string;
  label: string;
};

export function AssetLightbox({ assets }: { assets: LightboxAsset[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeAsset = activeIndex === null ? null : assets[activeIndex];

  function move(direction: -1 | 1) {
    setActiveIndex((current) => current === null ? null : (current + direction + assets.length) % assets.length);
  }

  useEffect(() => {
    if (activeIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft" && assets.length > 1) move(-1);
      if (event.key === "ArrowRight" && assets.length > 1) move(1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, assets.length]);

  return <>
    <div className="asset-grid">
      {assets.map((asset, index) => <button type="button" onClick={() => setActiveIndex(index)} key={asset.id} aria-label={`Open ${asset.label}`}>
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
      </div>
      {assets.length > 1 ? <button type="button" className="lightbox-next" onClick={() => move(1)} aria-label="Next image">›</button> : null}
    </div> : null}
  </>;
}
