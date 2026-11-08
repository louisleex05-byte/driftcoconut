import assert from "node:assert/strict";
import test from "node:test";
import { inspectGuideHtml } from "./verify-related-guide-cards.mjs";

const card = (slug, withImage = true) => `<a href="/guides/${slug}">${withImage ? `<img src="/_next/image?url=%2Fguides%2F${slug}%2Fhero.jpg&amp;w=640&amp;q=75" />` : ""}${slug}</a>`;
const cards = `<section id="related-destination-cards">${card("ayutthaya")}${card("chiang-mai")}${card("krabi")}</section>`;
const guide = `<h2>Related destinations</h2><p>Try these places.</p>${cards}<div aria-label="Trip planner"></div>`;

test("accepts related photo cards beside destination links", () => {
  assert.deepEqual(inspectGuideHtml(guide, "bangkok", "en"), {
    errors: [],
    images: ["/guides/ayutthaya/hero.jpg", "/guides/chiang-mai/hero.jpg", "/guides/krabi/hero.jpg"],
  });
});

test("fails when cards disappear or move below the trip planner", () => {
  assert.match(inspectGuideHtml(guide.replace(cards, ""), "bangkok", "en").errors[0], /expected one related card section/);
  const moved = guide.replace(cards, "").replace('</div>', `</div>${cards}`);
  assert.ok(inspectGuideHtml(moved, "bangkok", "en").errors.some((error) => error.includes("trip planner")));
});

test("fails when cards lose their images or use wrong-language links", () => {
  const noImage = guide.replace(card("ayutthaya"), card("ayutthaya", false));
  assert.ok(inspectGuideHtml(noImage, "bangkok", "en").errors.some((error) => error.includes("no local hero image")));
  assert.ok(inspectGuideHtml(guide, "bangkok", "zh").errors.some((error) => error.includes("invalid or duplicate related link")));
});

test("accepts the five-guide Thai route and rejects English links there", () => {
  const thaiCards = ["nan", "chiangrai", "khao-kho"].map((slug) => card(slug).replace('href="/guides/', 'href="/th/guides/')).join("");
  const thaiGuide = `<h2>เที่ยวต่อที่ไหนดี</h2><section id="related-destination-cards">${thaiCards}</section><div aria-label="Trip planner"></div>`;
  assert.deepEqual(inspectGuideHtml(thaiGuide, "khao-yai", "th").errors, []);
  assert.ok(inspectGuideHtml(guide.replace("Related destinations", "เที่ยวต่อที่ไหนดี"), "khao-yai", "th")
    .errors.some((error) => error.includes("invalid or duplicate related link")));
});
