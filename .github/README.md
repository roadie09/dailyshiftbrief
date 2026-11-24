# Daily Shift Brief

Marketing site for Daily Shift Brief (dailyshiftbrief.net), a daily 10 to 15 minute pre-shift briefing for manufacturing plants. It covers more than safety. Plain HTML and CSS. No build step. No backend.

## Run it locally

From the repo root:

```bash
python3 -m http.server 8741
```

Open http://127.0.0.1:8741/

## Host it

Any static host can serve this repo root: Cloudflare Pages, Netlify, GitHub Pages, or Vercel.

GitHub Pages: publish the repository root. The `CNAME` file is `dailyshiftbrief.net`. `.nojekyll` is here so Pages serves the files as they are.

## Card checkout

Card checkout is open at $90/month per computer. There is no annual plan. The live Stripe Payment Link is `STRIPE_MONTHLY_URL` in `config.js`. Plants that go through accounts payable can request a net-30 invoice, paid by bank transfer (ACH).

`pricing.js` rewrites the subscribe button when `STRIPE_MONTHLY_URL` is a live `https://buy.stripe.com/...` link and `CHECKOUT_OPEN` is true. With JavaScript off, the pricing page still shows the same monthly Stripe link and a net-30 invoice mailto. The subscription amount is written in one block in `pricing.html`, marked `PRICE-BLOCK`.

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
