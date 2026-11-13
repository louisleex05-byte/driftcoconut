"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

const TP_DRIVE_SRC =
  process.env.NEXT_PUBLIC_TRAVELPAYOUTS_SRC ||
  "https://emrld.ltd/NTYxMTY4.js?t=561168";

export default function TravelpayoutsDrive() {
  const pathname = usePathname();

  // Homepage offers already have direct affiliate URLs. Skip the auto-converter
  // there so its script bundle cannot compete with the first hero paint.
  if (pathname === "/" || pathname === "/zh") return null;

  return (
    <Script
      id="travelpayouts-drive"
      src={TP_DRIVE_SRC}
      strategy="lazyOnload"
      data-cmp-ab="2"
    />
  );
}
