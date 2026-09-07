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

## Payment — read this before treating checkout as "done"

**This is the single most important thing to understand about this
revision.** The request asked for payment to be verified *before* an
order is sent, and explicitly forbade inventing payment credentials or
faking a successful payment. Both of those instructions are followed
literally, which has a real consequence:

**Online payment is not actually live.** `js/data/payment-config.js` has
no real provider/key — `PAYMENT_CONFIG.configured` is `false`. There are
no credentials to invent, and there's no backend in this project to
verify a payment signature even if there were a public key (a static
site cannot safely verify payment server-side on its own — that's not a
gap I could close by writing more frontend code; it requires a real
backend/serverless function connected to a real payment-gateway account,
which only the business owner can set up).

So today, `js/lib/payment.js` takes the **honest fallback path**: it
does not claim a payment was verified. The customer can still complete
and send their order (exactly as before), but:
- the on-screen confirmation says *"Online payment isn't set up yet —
  please arrange payment (UPI or COD) with us directly on WhatsApp"*,
  never "Payment successful"
- the WhatsApp message says `PAYMENT: Not collected online — to arrange
  with you (UPI/COD)`, never `PAYMENT: PAID`

This keeps the business able to actually take orders today (blocking all
ordering entirely until a full payment-gateway integration existed would
leave a small local business with no way to sell anything), while never
pretending money changed hands when it didn't.

### To activate real online payment

1. The owner needs an account with a payment gateway (e.g. Razorpay,
   Cashfree) — this requires their own KYC/bank details; not something
   that can be set up on their behalf.
2. Set the **public** key in `js/data/payment-config.js`
   (`provider`, `keyId`, `configured: true`). Never put the **secret**
   key here or anywhere in frontend code.
3. Build a small backend or serverless function (Vercel/Netlify
   functions, or similar) that creates a gateway order and verifies the
   payment signature server-side, using `PAYMENT_KEY_SECRET` from a real
   `.env` file (see `.env.example` — copied, never committed).
4. Replace the body of `initiatePayment()` in `js/lib/payment.js` to call
   that backend and only report `"paid"` once the backend confirms a
   verified payment. Everything downstream (WhatsApp message, order
   confirmation screen) already branches correctly on that status — no
   other file needs to change.

This is genuinely a separate small project (a backend + hosting + a real
merchant account), not something addable inside this static-site repo
alone — flagging that clearly rather than shipping something that only
looks like it works.

## Order ID

A simple, human-readable order ID (e.g. `AMB-20260907-482`) is generated
client-side per order (`js/lib/payment.js`, `generateOrderId()`) for
display and for the WhatsApp message. It is **not guaranteed globally
unique** — there's no backend/database to check against. Once a real
backend exists (see Payment above), have it assign the authoritative
order ID instead.

## Delivery area

Belagavi-only delivery is shown near the Ambali ordering area and in the
checkout address field, driven from one string in `config.js`
(`deliveryAreaMessage`) — never hardcoded twice.

## Known placeholders / things to confirm with the owner

- `whatsappNumber` in `config.js` is the number already used elsewhere on
  the site (`+91 91642 45475`) — confirm this is still correct.
- Ambali grain/glass images are placeholders (see "Images" above) —
  real photos needed.
- Payment is not live (see "Payment" above) — needs a gateway account +
  backend before it can be.
