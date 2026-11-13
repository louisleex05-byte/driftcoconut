type FormSubmitDetails = {
  formId: string;
  formName: string;
  destination: string;
  result?: "matched" | "no_match" | "external_redirect";
  searchTerm?: string;
  submitText: string;
};

/**
 * Record successful programmatic form submissions in GA4.
 *
 * The site's React forms call preventDefault() and then navigate with the
 * Next.js router or window.location. GA4 enhanced measurement can observe the
 * first interaction (form_start), but it cannot reliably infer completion
 * when no native submit/navigation is allowed to finish. Sending the event
 * explicitly keeps the start/submit funnel accurate. Beacon transport gives
 * the external Booking.com redirect the best chance to flush the hit first.
 */
export function trackFormSubmit({
  formId,
  formName,
  destination,
  result,
  searchTerm,
  submitText,
}: FormSubmitDetails): void {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "form_submit", {
    form_id: formId,
    form_name: formName,
    form_destination: destination,
    form_result: result,
    form_submit_text: submitText,
    search_term: searchTerm,
    transport_type: "beacon",
  });
}

/** Record a completed hotel search before handing the tab to Booking.com. */
export function trackBookingSearch(details: FormSubmitDetails, navigate: () => void): void {
  if (!window.gtag) {
    navigate();
    return;
  }

  trackFormSubmit(details);

  let navigated = false;
  const finish = () => {
    if (navigated) return;
    navigated = true;
    window.clearTimeout(timeout);
    navigate();
  };
  const timeout = window.setTimeout(finish, 400);
  window.gtag("event", "affiliate_click", {
    affiliate_partner: "booking",
    affiliate_query: details.searchTerm ?? "",
    page_path: window.location.pathname,
    placement: details.formId === "header-destination-search" ? "header_search" : "hotel_search",
    event_callback: finish,
    event_timeout: 400,
  });
}
