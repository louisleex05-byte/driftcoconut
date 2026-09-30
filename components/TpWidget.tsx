"use client";

// Loads one Travelpayouts embed widget (a <script src="https://tpemb.com/content?...">)
// into a container.
//
// - Default: the script is added as soon as this component mounts. The trip planner
//   mounts it on click, so nothing third-party runs until a visitor asks for it.
// - `lazy`: the script is added only when the container is about to scroll into view.
//   Used for always-visible placements (homepage eSIM strip) so the widget shows by
//   default but does not slow down the first paint.
//
// The tpemb script renders its widget next to the <script> tag, so we append the tag
// inside our own container and remove everything again on unmount.

import { useEffect, useRef } from "react";

export default function TpWidget({
  src,
  minHeight = 220,
  lazy = false,
}: {
  src: string;
  minHeight?: number;
  lazy?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const load = () => {
      if (host.querySelector("script")) return;
      const s = document.createElement("script");
      s.async = true;
      s.charset = "utf-8";
      s.src = src;
      host.appendChild(s);
    };

    let io: IntersectionObserver | undefined;
    if (lazy && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            load();
            io?.disconnect();
          }
        },
        { rootMargin: "300px" }
      );
      io.observe(host);
    } else {
      load();
    }

    return () => {
      io?.disconnect();
      host.innerHTML = "";
    };
  }, [src, lazy]);

  // Reserve space so the page doesn't jump when the widget finishes loading.
  return <div ref={ref} style={{ minHeight }} className="w-full overflow-hidden" />;
}
