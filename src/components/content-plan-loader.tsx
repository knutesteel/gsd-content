"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    GSD_CONTENT_PLAN_DATA?: unknown;
    mountGsdContentPlan?: () => boolean;
  }
}

function loadScript(src: string, id: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;

    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = false;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true },
    );
    script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
    document.body.appendChild(script);
  });
}

export function ContentPlanLoader() {
  useEffect(() => {
    let cancelled = false;

    async function mount() {
      if (!window.GSD_CONTENT_PLAN_DATA) {
        await loadScript("/content-plan-data.js", "content-plan-data-script");
      }

      if (!window.mountGsdContentPlan) {
        await loadScript("/content-plan-ui.js", "content-plan-ui-script");
      }

      if (!cancelled) {
        window.mountGsdContentPlan?.();
      }
    }

    mount().catch((error) => {
      console.error("Unable to load News Articles", error);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return <section className="main-content content-plan-host" data-content-plan-root />;
}
