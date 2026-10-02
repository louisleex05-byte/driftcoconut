# driftcoconut editorial voice

This is the canonical writing guide for destination content. Apply it to new English guides and use it as the meaning and tone reference when reviewing translations.

## Voice

Write like a Thailand-based traveler who knows Asia-Pacific destinations firsthand: warm, unhurried, specific, and practical. The named author is Mr. Padthai Jaidee, founder of driftcoconut.

- Address the reader in the second person.
- Sound conversational and experienced, without performing expertise.
- Prefer concrete details: streets, neighborhoods, restaurants, stations, journey times, local prices, and useful tradeoffs.
- Give a clear recommendation when the evidence supports one.
- Explain who a place suits and why. Avoid generic praise.
- Let personal notes add judgment and texture, but never turn an unsupported impression into fact.
- Keep the coastal-drift feeling through calm pacing and selective sensory detail, not repeated beach metaphors.

## Accuracy and sourcing

- Base every factual claim on the supplied research. Never invent missing details.
- Cite a source URL for prices, dates, regulations, schedules, safety claims, and other facts that can change.
- Prefer official tourism and government sources, recent reputable travel reporting, and current firsthand community reports where appropriate.
- Use local currency and a USD equivalent for prices when the research supports both.
- State the time basis for volatile facts. Flag unresolved claims with `[UNCERTAIN]` for editorial review.
- Treat visa, political, health, weather, transport, exchange-rate, and safety information as time-sensitive.

## Style rules

- Start directly with a one-line italic subtitle that captures the destination's feel. Do not add an H1 or introductory meta-commentary.
- Prefer varied paragraphs and natural lists. Do not use repeated, symmetric constructions such as “whether you're X, Y, or Z.”
- Avoid inflated claims, filler transitions, and copy that could describe any destination.
- Use specific comparisons instead of superlatives such as “the best” or “world-class” unless the research establishes them.
- Keep affiliate recommendations useful and contextual. The sentence should still help the reader if the link is removed.
- Preserve valid MDX components exactly. Do not wrap an existing `<AffiliateLink>` inside another link or rewrite it as plain text.
- Do not prefix affiliate components with `->` or `→`.

## Banned AI and travel-copy phrases

Remove these phrases during drafting and review, including close variants used as generic filler:

- vibrant tapestry
- hidden gem
- something for everyone
- must-visit
- bustling metropolis
- charming
- picturesque
- at your fingertips
- in the heart of
- look no further
- nestled in
- boasts a
- delve into
- unlock the
- a myriad of
- unparalleled
- world-class
- a stone's throw

Also avoid generic constructions such as “where X meets Y,” “you'll be spoiled for choice,” and “there's no shortage of.” Replace them with a detail that is unique to the place.

## Guide structure

Use this order unless an existing guide requires a compatible local variation:

1. Italic one-line subtitle.
2. `## Quick facts` — compact, scannable facts from the research.
3. `## When to go` — about 300 words covering month-by-month weather, seasonality, prices, and exact festival dates when available.
4. `## Where to stay` — about 500 words covering four useful areas, who each suits, price range, named hotels, walkable landmarks, and transport.
5. `## Things to do` — about 400 words covering eight activities across half-day, full-day, and multi-day options.
6. `## Getting around` — about 200 words covering airport transfers, local transport, realistic journey times, and prices.
7. `## Local tips + scams` — about 250 words covering etiquette, active scams, and one genuinely useful insider tip.
8. `## FAQ` — questions as `###` headings with concise 40–60 word answers, including solo-female safety, trip length, budget, first-timer area, cash versus cards, and one destination-specific question.
9. `## Related destinations` — a short closing line with three relevant alternatives.

Target 1,900–2,200 words. Treat the range as an editorial target rather than permission to pad thin research.

## Affiliate component patterns

Use natural anchor text and preserve these component shapes:

```mdx
<AffiliateLink type="booking" query="Sukhumvit Bangkok">Browse Sukhumvit hotels on Booking.com</AffiliateLink>

<AffiliateLink type="makemytrip" query="Bangkok">India readers: browse Bangkok hotels on MakeMyTrip</AffiliateLink>

<AffiliateLink type="goibibo" query="Bangkok">India readers: browse Bangkok hotels on Goibibo</AffiliateLink>

<AffiliateLink type="klook" query="Ayutthaya day tour Bangkok">book the Ayutthaya day tour on Klook</AffiliateLink>

<AffiliateLink type="welcomePickups">book Welcome Pickups ahead</AffiliateLink>

<AffiliateLink type="airalo">Grab an Airalo eSIM before you land</AffiliateLink>
```

Do not fabricate a query. Use the destination or activity name a traveler would actually search for.

## Final editorial pass

Before publishing, verify that the draft:

- follows the required section order and contains no H1;
- contains none of the banned phrases or symmetric filler patterns;
- makes no unsupported claim and leaves no unresolved `[UNCERTAIN]` marker;
- uses consistent currencies, dates, place names, and spelling;
- keeps every affiliate and photo component syntactically intact;
- reads like advice from a specific, observant traveler rather than generated destination copy.
