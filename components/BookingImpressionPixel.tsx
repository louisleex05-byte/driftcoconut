import { bookingImpressionPixelUrl } from "@/lib/booking";

/**
 * CJ 1×1 impression pixel for Booking.com.
 * Loads once per page — required so CJ can reconcile EPC.
 * Rendered offscreen (aria-hidden, lazy-loaded, tabbed-out).
 *
 * Placement: near the bottom of every page (SiteFooter).
 */
export default function BookingImpressionPixel() {
  return (
    <img
      src={bookingImpressionPixelUrl("evergreen")}
      width={1}
      height={1}
      alt=""
      loading="lazy"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    />
  );
}
