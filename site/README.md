# Belagavi Organic Millets — Website

A local-business ordering website for Belagavi Organic Millets (Super Food
Ambali): fresh millet ambali (orderable now), millet powders (showcased,
coming soon), and a WhatsApp-based order handoff that a single owner can
manage manually — delivery only, within Belagavi.

No build step, no framework, no backend — plain HTML/CSS/JS so it can be
opened directly, hosted on any static host (GitHub Pages, Netlify, etc.),
and edited by anyone comfortable with basic web files.

## How to run it locally

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

No `npm install` step — nothing here depends on a package registry.

## Project structure

```
index.html                    Markup only
css/styles.css                 All styles
js/
  data/
    config.js                    Business info, WhatsApp number, fixed charges
    payment-config.js            PUBLIC payment config only — no secrets
    products.js                  5 millet powders + combo pack (coming soon)
    ambali.js                    5 fresh Ambali products + prep-guide steps
    millet-info.js               "Know Your Five Millets" educational content
  lib/
    pricing.js                   Single source of truth for all price math
    whatsapp.js                  Builds the WhatsApp order message
    payment.js                   Payment gate — never fakes a successful payment
  app.js                        Rendering, cart state, checkout flow, UI wiring
assets/
  products/                      Powder packaging photos (real, supplied by owner)
  ambali/                        Ambali grain/glass images — currently clearly-
                                  labelled placeholders, see "Images" below
.env.example                    Placeholder env vars for a future payment backend
README.md
package.json
.gitignore
```

Scripts load as plain `<script>` tags in dependency order (see the bottom
of `index.html`) — no bundler, no ES modules.

## What changed in this revision

- Removed the "Why Organic" section entirely (markup, styles, content).
- Added **Know Your Five Millets** (`js/data/millet-info.js`) in roughly
  the same spot — short, source-checked nutrition info per grain, no
  farming/organic-certification claims invented.
- Millet powders now show a **"Coming Soon"** banner and each powder card
  is disabled (see `availability` below) — visible, not orderable.
- Ambali cards now use `<img>` (grain photo + glass photo) instead of the
  old canvas illustration — see "Images" below for what's real vs.
  placeholder.
- **Stall pickup removed completely** — delivery is the only fulfilment
  path; the address field is always shown and required.
- Checkout now generates an **order ID**, and is **payment-gated but not
  payment-faked** — see "Payment" below, this is the most important
  section to read before treating this as done.

## Where things live, and how to change them

### Prices, pack sizes, availability (millet powders)
`js/data/products.js`. Every powder/combo card is rendered from this
data — nothing is duplicated elsewhere.

`availability` (not a plain boolean) drives the card badge and button:
- `"available"` — orderable as normal
- `"coming-soon"` — visible (image, info, price) but not orderable;
  shows "Coming Soon" and disables Add to Cart — **this is the current
  state for all 6 powder products**
- `"sold-out"` — visible, temporarily out of stock

To open ordering: change `availability: "coming-soon"` to
`availability: "available"` on each product. Nothing else needs to
change — the cart/pricing logic is already fully wired, per the original
request.

### Ambali data, pricing, images
`js/data/ambali.js`. `AMBALI_VARIANTS` holds the two shared sizes/prices
(200ml ₹39, 300ml ₹49) once, not duplicated per millet. Each of the 5
items has `grainImage` and `ambaliImage` paths (see "Images" below).

### Know Your Five Millets content
`js/data/millet-info.js`. Each entry has a short intro + 3–4 nutrition
points, sourced conservatively (source noted in a comment per item —
FAO, ICMR Indian Food Composition Tables, and peer-reviewed millet
composition studies). No disease-cure/treatment claims anywhere.

### Delivery charge, packing charge, delivery area, WhatsApp number
All in `js/data/config.js`:
```js
const CONFIG = {
  businessName: "Belagavi Organic Millets",
  whatsappNumber: "919164245475",
  deliveryAreaMessage: "Delivery available within Belagavi city and surrounding city range only.",
  ambaliDeliveryCharge: 30,
  ambaliPackingCharge: 10,
  powderShelfLife: "3 months"
};
```
Delivery (₹30) and packing (₹10) are fixed per order — they apply once
per order (when the cart contains any Ambali item) and never multiply by
quantity. See `js/lib/pricing.js`, `computeTotals()`.

### Images

**Powder packaging photos** (`assets/products/*.jpg`) are the real
packaging artwork supplied for the business — used as-is.

**Ambali grain/glass photos** (`assets/ambali/*.jpg`) are currently
**clearly-labelled placeholder graphics**, not real photos — each one
says so directly on the image ("Grain photo — placeholder"). Reliable,
correctly-labelled free stock photography for these five specific
botanical millet varieties doesn't exist (checked directly — most
"millet" stock results online are mislabeled rice/wheat/corn), and using
a wrong photo on a food product would misrepresent it. The card
architecture is fully image-based and ready for real photos — **to
activate them, replace the files in `assets/ambali/` with real photos,
same filenames, no code changes needed.**

## Checkout flow (delivery-only)

Product → select quantity/size → Add to Cart → Cart drawer → Name,
Phone, Delivery Address (all required) → order summary/totals →
"Pay ₹X & Place Order" → **see Payment below** → WhatsApp opens with the
full order pre-filled → owner confirms availability, timing, and
payment.

There is no stall-pickup option anywhere in the UI or checkout logic.

## Payment

The website uses Razorpay Standard Checkout for online payments.

The payment flow is:

1. Customer enters their name, phone number, and delivery address.
2. The frontend sends the cart items and customer details to `/api/create-order`.
3. The server validates the products, quantities, prices, delivery charge, and packing charge.
4. The server creates a Razorpay order using the server-side Razorpay credentials.
5. Razorpay Checkout opens for the customer to complete payment.
6. After payment, the frontend sends the Razorpay payment details to `/api/verify-payment`.
7. The server verifies the Razorpay signature and confirms that the payment is captured.
8. Only after successful server-side verification is the order treated as paid.
9. The verified order is then prepared for WhatsApp confirmation.

### Razorpay credentials

Razorpay credentials must never be placed in frontend JavaScript.

The server uses:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

These must be configured as server-side environment variables.

The Key Secret must never be committed to Git or exposed to the browser.

### Before going live

The website can be prepared and tested without committing live credentials.

Once the Razorpay merchant account is activated and Live API credentials are available:

1. Add the Live Razorpay Key ID and Key Secret to the server environment.
2. Deploy the website/API.
3. Confirm that the Razorpay Live Key ID is being returned by `/api/create-order`.
4. Complete a real low-value payment test.
5. Confirm that `/api/verify-payment` reports the payment as captured.
6. Confirm that the WhatsApp order is sent only after successful verification.

The production website must never use fake or invented payment credentials.