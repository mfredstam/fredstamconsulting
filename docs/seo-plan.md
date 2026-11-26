# SEO Plan — fredstamconsulting.se

Agreed strategy and tracking doc. Decisions recorded here were confirmed with Marcus
in the planning session; revisit and update as data comes in.

## Strategy

Three-tier keyword approach:

1. **Local** — Linköping queries (high intent, low volume, winnable fast)
2. **National** — Sweden-wide service queries (homepage targets these)
3. **Remote/EU** — remote-work intent queries (homepage targets these too)

Long-tail queries are captured later by articles (see backlog below).

Timeline expectation: organic SEO compounds over ~3–6 months; local queries often
faster. Current leads come via broker / word of mouth — SEO is the long game.

## Target query list (tracking list — NOT entered into Google)

This is our own instrument. Google Search Console (GSC) has no field for target
keywords; it only *reports* the queries people actually used to find the site.
Compare this list monthly against GSC → Performance (queries, impressions, clicks,
average position).

1. `embedded software consultant Linköping`
2. `safety-critical embedded software consultant Sweden`
3. `DO-178C consultant Sweden`
4. `ISO 26262 consultant Sweden`
5. `MISRA C secure coding consultant Sweden`
6. `remote safety-critical software consultant EU`

## Search engine registration checklist

Owner: Marcus. Status tracked inline.

- [x] Google Search Console: add **Domain** property `fredstamconsulting.se` (done 2026-11-26)
- [x] Verify via **DNS TXT record** at the domain registrar (done 2026-11-26)
- [x] Submit sitemap: `https://fredstamconsulting.se/sitemap.xml` (done 2026-11-26)
- [x] Request indexing of `https://fredstamconsulting.se/` (URL Inspection, done 2026-11-26)
- [x] Bing Webmaster Tools (`webmaster.bing.com`): import from GSC (done 2026-11-26)
- [ ] First data expected in GSC within ~2–3 days; meaningful query data in weeks

Live-site sanity check 2026-11-26: `/`, `/robots.txt`, `/sitemap.xml` all return HTTP 200.

If a Bing verification meta tag is ever needed, add it to `<head>` in
`index.html` (one line) — not needed when verifying via GSC import.

## Monthly review routine

1. GSC → Performance: check impressions/clicks/position for each query in the
   target list above.
2. Note the top *actual* queries people used — adjust the target list and
   future on-page copy to match real search language.
3. Check for indexing issues (Coverage report) and Core Web Vitals.
4. Update this doc with findings and next actions.

## Parked: content & articles (phase 1, not started)

Articles-only approach (no YouTube for now; possible phase 2 = videos embedded
in articles so Google indexes the transcript). Publishing plan (topics, cadence,
dates) to be designed in a future session.

Article backlog:

1. "DO-178C vs ISO 26262 — which standard applies to your product?"
2. "What DO-178C DAL A actually requires — a practical walkthrough"
3. "How to evaluate a safety-critical embedded software consultant"

## Deliberately not doing (for now)

- **Google Business Profile**: skipped; revisit in ~6 months. If ever claimed,
  use the service-area business option so no street address is shown publicly.
- **`courses.html`**: stays `noindex, nofollow` and out of `sitemap.xml`.
  Revisit if courses become a real offer.
- **Deploy**: nothing is pushed to the `deploy` branch unless explicitly requested.

## Current technical state (verified good, no action needed)

- Meta description, canonical, robots meta, OG/Twitter cards, JSON-LD
  (Organization, LocalBusiness, 3 Services), theme-color, favicon — all present
  in `index.html`.
- `robots.txt` allows all and points to the sitemap; `sitemap.xml` lists `/`.
- Semantic HTML with a single H1; self-hosted fonts; GoatCounter analytics.
