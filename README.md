# SafetyBrief

Marketing site for SafetyBrief (dailyshiftbrief.com), a daily 10 to 15 minute pre-shift briefing for manufacturing plants. It covers more than safety. Plain HTML and CSS. No build step. No backend.

## Run it locally

From the repo root:

```bash
python3 -m http.server 8741
```

Open http://127.0.0.1:8741/

## Host it

Any static host can serve this repo root: Cloudflare Pages, Netlify, GitHub Pages, or Vercel.

GitHub Pages: publish the repository root. The `CNAME` file is `dailyshiftbrief.com`. `.nojekyll` is here so Pages serves the files as they are.

## Card checkout

Stripe Payment Links are not connected yet. Both URLs live in `config.js`:

- `STRIPE_MONTHLY_URL`
- `STRIPE_ANNUAL_URL`

Leave them empty until each value is a real `https://buy.stripe.com/...` link. Until then, the card buttons on `pricing.html` say "Coming soon - contact us" and go to `contact.html`. That is also what you get with JavaScript off. `pricing.js` only rewrites a button when the matching value is a live Stripe Payment Link.

The subscription amounts are written in one block in `pricing.html`, marked `PRICE-BLOCK`.

## Business mailing address

There is no build step. The mailing address is the one `BUSINESS_ADDRESS` line in `config.js`. Do not copy the address into the HTML. Each element marked `data-field="business-address"` is filled from that line in the browser. With JavaScript off, the page says the address is that line in `config.js`.

## Pages

- `index.html` — home
- `how-it-works.html` — morning flow and the sample brief slot
- `pricing.html` — price, card, invoice
- `security.html` — one-page sheet for IT
- `contact.html` — email, no form
- `attendance-sheet.html` — printable toolbox-talk attendance sheet
- `terms.html` — draft terms
- `privacy.html` — draft privacy policy
- `404.html` — missing page

The sample brief on `how-it-works.html` is the approved conveyor-roller briefing. The PDF is `assets/sample/sample-briefing-conveyor.pdf`.
