"use client";

// Loads one Travelpayouts embed widget (a <script src="https://tpemb.com/content?...">)
// into a container, only when this component is mounted. The trip planner mounts it
// on click, so no third-party script runs (and no third-party cookies are set)
// until a visitor asks for the search box.
//
// The tpemb script renders its widget next to the <script> tag, so we append the tag
// inside our own container and remove everything again on unmount.

import { useEffect, useRef } from "react";

export default function TpWidget({ src, minHeight = 220 }: { src: string; minHeight?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const s = document.createElement("script");
    s.async = true;
    s.charset = "utf-8";
    s.src = src;
    host.appendChild(s);
    return () => {
      host.innerHTML = "";
    };
  }, [src]);

  // Reserve space so the page doesn't jump when the widget finishes loading.
  return <div ref={ref} style={{ minHeight }} className="w-full overflow-hidden" />;
}
