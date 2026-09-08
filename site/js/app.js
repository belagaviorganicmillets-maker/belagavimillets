function generateOrderId() {
  const timestamp =
    Date.now()
      .toString(36)
      .toUpperCase();

  const random =
    Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase();

  return `BOM-${timestamp}-${random}`;
}
// ============================================================
// Theme colours per millet â€” drives card accents, badges, etc.
// One place to adjust brand colours.
// ============================================================
const THEME_COLORS = {
  gold:       { bg: "#F6ECC9", primary: "#B9862A", accent: "#8F6B1F" },
  teal:       { bg: "#DCEAE7", primary: "#2F6E68", accent: "#1F4D48" },
  mauve:      { bg: "#F3DEE6", primary: "#8A3B5D", accent: "#6B2A46" },
  olive:      { bg: "#E7EAD2", primary: "#5C6B2E", accent: "#455320" },
  terracotta: { bg: "#F1DCC8", primary: "#A65A32", accent: "#7C4022" },
  combo:      { bg: "#EFE7D2", primary: "#3E5A34", accent: "#2C4025" }
};

// ============================================================
// Cart â€” single source of truth for every line item
// ============================================================
const cart = {}; // lineId -> { id, name, sub, unitPrice, qty, isAmbali }

function addToCart(lineId, item, qty) {
  if (cart[lineId]) {
    cart[lineId].qty += qty;
  } else {
    cart[lineId] = { ...item, qty };
  }

  renderCart();
}

// ============================================================
// Millet Powder + Combo Pack rendering
// availability: "available" | "coming-soon" | "sold-out"
// ============================================================
const productGrid = document.getElementById("productGrid");

function productCardHTML(p, isCombo) {
  const t =
    THEME_COLORS[p.theme] ||
    THEME_COLORS.gold;

  const availability =
    p.availability ||
    (isCombo
      ? COMBO_PRODUCT.availability
      : "available");

  const orderable =
    availability === "available";

  const benefitsHTML =
    (isCombo ? [] : p.benefits)
      .map(b => `<li>${b}</li>`)
      .join("");

  let badgeHTML = "";

  if (availability === "coming-soon") {
    badgeHTML =
      `<span class="product-badge coming-soon-badge">Coming Soon</span>`;
  } else if (availability === "sold-out") {
    badgeHTML =
      `<span class="product-badge sold-out-badge">Sold out</span>`;
  } else if (isCombo) {
    badgeHTML =
      `<span class="product-badge combo-badge">${p.badge}</span>`;
  }

  const priceRow = `
    <div class="pcard-price-row">
      <div class="pcard-price">
        ${money(p.price)}
        <span> / ${p.packSize}</span>
      </div>

      <div class="pcard-shelf">
        Shelf life: ${p.shelfLife}
      </div>
    </div>
  `;

  const comboContents = isCombo
    ? `
      <ul class="combo-contents">
        ${p.includedProducts
          .map(i =>
            `<li>${i.name} <span>${i.size}</span></li>`
          )
          .join("")}
      </ul>
    `
    : "";

  const btnLabel =
    availability === "coming-soon"
      ? "Coming Soon"
      : availability === "sold-out"
        ? "Sold out"
        : "Add to cart";

  return `
    <article
      class="pcard ${isCombo ? "pcard-combo" : ""} ${orderable ? "" : "pcard-unavailable"}"
      style="--theme-bg:${t.bg};--theme-primary:${t.primary};--theme-accent:${t.accent};"
    >

      ${badgeHTML}

      <div class="pcard-image">
        <img
          src="${p.image}"
          alt="${p.name} packet"
          loading="lazy"
          width="700"
          height="700"
        >
      </div>

      <div class="pcard-body">

        <div class="pcard-kicker">
          ${isCombo ? "Combo Pack" : "Millet Powder"}
        </div>

        <h3>${p.name}</h3>

        <p class="pcard-desc">
          ${p.description}
        </p>

        ${
          isCombo
            ? comboContents
            : `<ul class="pcard-benefits">${benefitsHTML}</ul>`
        }

        ${priceRow}

        <div class="product-actions">

          <div class="qty-stepper">

            <button
              type="button"
              class="qty-dec"
              aria-label="Decrease ${p.name} quantity"
              ${orderable ? "" : "disabled"}
            >âˆ’</button>

            <span class="qty-val">1</span>

            <button
              type="button"
              class="qty-inc"
              aria-label="Increase ${p.name} quantity"
              ${orderable ? "" : "disabled"}
            >+</button>

          </div>

          <button
            type="button"
            class="add-btn"
            aria-label="Add ${p.name} to cart"
            ${orderable ? "" : "disabled"}
          >${btnLabel}</button>

        </div>

      </div>

    </article>
  `;
}

function renderProducts() {
  const all = [
    ...PRODUCTS,
    COMBO_PRODUCT
  ];

  productGrid.innerHTML =
    all
      .map(p =>
        productCardHTML(
          p,
          p.id === COMBO_PRODUCT.id
        )
      )
      .join("");

  productGrid
    .querySelectorAll(".pcard")
    .forEach((card, idx) => {

      const p = all[idx];

      if (p.availability !== "available") {
        return;
      }

      let qty = 1;

      const qtyVal =
        card.querySelector(".qty-val");

      card
        .querySelector(".qty-dec")
        .addEventListener("click", () => {
          qty = Math.max(1, qty - 1);
          qtyVal.textContent = qty;
        });

      card
        .querySelector(".qty-inc")
        .addEventListener("click", () => {
          qty = Math.min(20, qty + 1);
          qtyVal.textContent = qty;
        });

      const addBtn =
        card.querySelector(".add-btn");

      addBtn.addEventListener(
        "click",
        () => {

          addToCart(
            p.id,
            {
              id: p.id,
              name: p.name,
              sub: p.packSize,
              unitPrice: p.price,
              isAmbali: false
            },
            qty
          );

          addBtn.textContent =
            "Added âœ“";

          addBtn.classList.add(
            "added"
          );

          setTimeout(() => {
            addBtn.textContent =
              "Add to cart";

            addBtn.classList.remove(
              "added"
            );
          }, 1200);

          qty = 1;
          qtyVal.textContent = qty;
        }
      );
    });
}

// ============================================================
// Know Your Five Millets â€” educational section
// ============================================================
function milletInfoCardHTML(m) {
  const t =
    THEME_COLORS[m.theme] ||
    THEME_COLORS.gold;

  const pointsHTML =
    m.points
      .map(p => `<li>${p}</li>`)
      .join("");

  return `
    <article
      class="minfo-card"
      style="--theme-bg:${t.bg};--theme-primary:${t.primary};--theme-accent:${t.accent};"
    >

      <div class="minfo-image">
        <img
          src="${m.grainImage}"
          alt="${m.name} grains"
          loading="lazy"
          width="800"
          height="600"
        >
      </div>

      <div class="minfo-body">

        <h3>${m.name}</h3>

        <div class="kn-name">
          ${m.kn}
        </div>

        <p class="minfo-intro">
          ${m.intro}
        </p>

        <ul class="pcard-benefits">
          ${pointsHTML}
        </ul>

      </div>

    </article>
  `;
}

function renderMilletInfo() {
  const el =
    document.getElementById(
      "milletInfoGrid"
    );

  if (!el) return;

  el.innerHTML =
    MILLET_INFO
      .map(milletInfoCardHTML)
      .join("");
}

// ============================================================
// Fresh Millet Ambali rendering
// 200ml / 300ml as independent variants.
// ============================================================
const ambaliGrid =
  document.getElementById(
    "ambaliGrid"
  );

function ambaliCardHTML(a) {
  const t =
    THEME_COLORS[a.theme] ||
    THEME_COLORS.gold;

  const benefitsHTML =
    a.benefits
      .map(b => `<li>${b}</li>`)
      .join("");

  const variantsHTML =
    AMBALI_VARIANTS
      .map(v => `
        <div
          class="ambali-variant"
          data-size="${v.size}"
        >

          <div class="ambali-variant-label">
            ${v.size} glass
            <span>
              ${money(v.price)}
            </span>
          </div>

          <div class="qty-stepper">

            <button
              type="button"
              class="qty-dec"
              aria-label="Decrease ${a.name} ${v.size} quantity"
              ${a.available ? "" : "disabled"}
            >âˆ’</button>

            <span class="qty-val">
              0
            </span>

            <button
              type="button"
              class="qty-inc"
              aria-label="Increase ${a.name} ${v.size} quantity"
              ${a.available ? "" : "disabled"}
            >+</button>

          </div>

        </div>
      `)
      .join("");

  return `
    <article
      class="ambali-card2 ${a.available ? "" : "sold-out"}"
      style="--theme-bg:${t.bg};--theme-primary:${t.primary};--theme-accent:${t.accent};"
    >

      ${
        !a.available
          ? `<span class="product-badge sold-out-badge">Sold out today</span>`
          : ""
      }

      <div class="ambali-visual2">

        <img
          src="${a.ambaliImage}"
          alt="${a.name} in a glass"
          loading="lazy"
          width="800"
          height="600"
        >

        <img
          class="ambali-grain-thumb"
          src="${a.grainImage}"
          alt="${a.name.replace("Ambali", "grains")}"
          loading="lazy"
          width="120"
          height="120"
        >

      </div>

      <div class="ambali-body2">

        <span class="grain-tag">
          ${a.tag}
        </span>

        <h3>
          ${a.name}
        </h3>

        <div class="kn-name">
          ${a.kn}
        </div>

        <p class="ambali-benefits2">
          ${a.description}
        </p>

        <ul class="pcard-benefits">
          ${benefitsHTML}
        </ul>

        <div class="ambali-variants">
          ${variantsHTML}
        </div>

        <button
          type="button"
          class="add-btn add-btn-ambali"
          aria-label="Add ${a.name} to cart"
          ${a.available ? "" : "disabled"}
        >
          ${a.available
            ? "Add to cart"
            : "Sold out"}
        </button>

      </div>

    </article>
  `;
}

function renderAmbali() {
  ambaliGrid.innerHTML =
    AMBALI_PRODUCTS
      .map(ambaliCardHTML)
      .join("");

  ambaliGrid
    .querySelectorAll(".ambali-card2")
    .forEach((card, idx) => {

      const a =
        AMBALI_PRODUCTS[idx];

      if (!a.available) return;

      const variantQty = {};

      card
        .querySelectorAll(".ambali-variant")
        .forEach(row => {

          const size =
            row.dataset.size;

          variantQty[size] = 0;

          const qtyVal =
            row.querySelector(
              ".qty-val"
            );

          row
            .querySelector(".qty-dec")
            .addEventListener(
              "click",
              () => {

                variantQty[size] =
                  Math.max(
                    0,
                    variantQty[size] - 1
                  );

                qtyVal.textContent =
                  variantQty[size];
              }
            );

          row
            .querySelector(".qty-inc")
            .addEventListener(
              "click",
              () => {

                variantQty[size] =
                  Math.min(
                    20,
                    variantQty[size] + 1
                  );

                qtyVal.textContent =
                  variantQty[size];
              }
            );
        });

      card
        .querySelector(
          ".add-btn-ambali"
        )
        .addEventListener(
          "click",
          () => {

            const chosen =
              AMBALI_VARIANTS.filter(
                v =>
                  variantQty[v.size] > 0
              );

            if (chosen.length === 0) {
              return;
            }

            chosen.forEach(v => {

              const lineId =
                `${a.id}-ambali-${v.size}`;

              addToCart(
                lineId,
                {
                  id: lineId,
                  name: a.name,
                  sub: `${v.size} glass`,
                  unitPrice: v.price,
                  isAmbali: true
                },
                variantQty[v.size]
              );
            });

            card
              .querySelectorAll(
                ".ambali-variant"
              )
              .forEach(row => {

                variantQty[
                  row.dataset.size
                ] = 0;

                row.querySelector(
                  ".qty-val"
                ).textContent = "0";
              });

            const btn =
              card.querySelector(
                ".add-btn-ambali"
              );

            btn.textContent =
              "Added âœ“";

            setTimeout(() => {
              btn.textContent =
                "Add to cart";
            }, 1200);
          }
        );
    });
}

// ============================================================
// Preparation guide
// ============================================================
function renderPrepSteps() {
  const el =
    document.getElementById(
      "prepSteps"
    );

  if (!el) return;

  el.innerHTML =
    PREP_STEPS
      .map(s => `
        <div class="prep-step">

          <div class="prep-step-num">
            ${s.step}
          </div>

          <div class="prep-step-title">
            ${s.title}
          </div>

          <div class="prep-step-detail">
            ${s.detail}
          </div>

        </div>
      `)
      .join("");
}

// ============================================================
// Cart drawer
// ============================================================
const cartOverlay =
  document.getElementById(
    "cartOverlay"
  );

const cartDrawer =
  document.getElementById(
    "cartDrawer"
  );

const cartToggle =
  document.getElementById(
    "cartToggle"
  );

const cartClose =
  document.getElementById(
    "cartClose"
  );

const cartBody =
  document.getElementById(
    "cartBody"
  );

const cartFooter =
  document.getElementById(
    "cartFooter"
  );

const cartCount =
  document.getElementById(
    "cartCount"
  );

const cartSubtotal =
  document.getElementById(
    "cartSubtotal"
  );

const checkoutBtn =
  document.getElementById(
    "checkoutBtn"
  );

const checkoutError =
  document.getElementById(
    "checkoutError"
  );

function openCart() {
  cartOverlay.classList.add(
    "open"
  );

  cartDrawer.classList.add(
    "open"
  );
}

function closeCart() {
  cartOverlay.classList.remove(
    "open"
  );

  cartDrawer.classList.remove(
    "open"
  );
}

cartToggle.addEventListener(
  "click",
  openCart
);

cartClose.addEventListener(
  "click",
  closeCart
);

cartOverlay.addEventListener(
  "click",
  closeCart
);

document.addEventListener(
  "keydown",
  e => {
    if (e.key === "Escape") {
      closeCart();
    }
  }
);

// ============================================================
// Render cart
// ============================================================
function renderCart() {
  const items =
    Object.values(cart);

  const totalQty =
    items.reduce(
      (s, i) => s + i.qty,
      0
    );

  cartCount.textContent =
    totalQty;

  if (items.length === 0) {

    cartBody.innerHTML =
      '<p class="cart-empty">Your cart is empty. Add a fresh Ambali to get started.</p>';

    cartFooter.style.display =
      "none";

    updateCheckoutButtonLabel();

    return;
  }

  cartFooter.style.display =
    "block";

  const totals =
    computeTotals(items);

  document.getElementById(
    "freshNote"
  ).style.display =
    totals.hasAmbali
      ? "block"
      : "none";

  cartBody.innerHTML =
    items
      .map(item => `
        <div
          class="cart-item"
          data-id="${item.id}"
        >

          <div class="cart-item-info">

            <h4>
              ${item.name}
            </h4>

            <div class="sub">
              ${item.sub}
              Â·
              ${money(item.unitPrice)}
              each
            </div>

            <div class="cart-item-row">

              <div class="qty-stepper">

                <button
                  type="button"
                  class="cart-qty-dec"
                  aria-label="Decrease quantity"
                >âˆ’</button>

                <span class="qty-val">
                  ${item.qty}
                </span>

                <button
                  type="button"
                  class="cart-qty-inc"
                  aria-label="Increase quantity"
                >+</button>

              </div>

              <span class="cart-item-price">
                ${money(lineTotal(item))}
              </span>

            </div>

            <button
              type="button"
              class="remove-btn"
            >Remove</button>

          </div>

        </div>
      `)
      .join("");

  cartSubtotal.textContent =
    money(totals.subtotal);

  const chargesRow =
    document.getElementById(
      "cartCharges"
    );

  if (totals.hasAmbali) {

    chargesRow.style.display =
      "block";

    chargesRow.innerHTML = `
      <div class="cart-charge-row">
        <span>Delivery</span>
        <span>
          ${money(totals.delivery)}
        </span>
      </div>

      <div class="cart-charge-row">
        <span>Packing</span>
        <span>
          ${money(totals.packing)}
        </span>
      </div>

      <div class="cart-charge-row cart-grand-total">
        <span>Total</span>
        <span>
          ${money(totals.grandTotal)}
        </span>
      </div>
    `;

  } else {

    chargesRow.style.display =
      "none";

    chargesRow.innerHTML =
      "";
  }

  cartBody
    .querySelectorAll(".cart-item")
    .forEach(row => {

      const id =
        row.dataset.id;

      row
        .querySelector(
          ".cart-qty-dec"
        )
        .addEventListener(
          "click",
          () => {

            cart[id].qty =
              Math.max(
                1,
                cart[id].qty - 1
              );

            renderCart();
          }
        );

      row
        .querySelector(
          ".cart-qty-inc"
        )
        .addEventListener(
          "click",
          () => {

            cart[id].qty =
              Math.min(
                20,
                cart[id].qty + 1
              );

            renderCart();
          }
        );

      row
        .querySelector(
          ".remove-btn"
        )
        .addEventListener(
          "click",
          () => {

            delete cart[id];

            renderCart();
          }
        );
    });

  updateCheckoutButtonLabel();
}

// ============================================================
// Checkout button label
// ============================================================
function updateCheckoutButtonLabel() {
  const items =
    Object.values(cart);

  if (items.length === 0) {
    checkoutBtn.textContent =
      "Pay & Place Order";

    return;
  }

  const totals =
    computeTotals(items);

  checkoutBtn.textContent =
    `Pay ${money(totals.grandTotal)} & Place Order`;
}

// ============================================================
// Phone validation â€” 10-digit Indian mobile number
// ============================================================
function isValidPhone(phone) {
  const digits =
    phone.replace(
      /[\s-]/g,
      ""
    );

  return /^[6-9]\d{9}$/.test(
    digits
  );
}

// ============================================================
// Order confirmation panel
//
// IMPORTANT:
// An order is confirmed ONLY after payment.js reports
// a verified successful payment.
//
// No COD.
// No offline payment.
// No WhatsApp order is opened for unpaid orders.
// ============================================================
const orderConfirm =
  document.getElementById(
    "orderConfirm"
  );

const orderConfirmClose =
  document.getElementById(
    "orderConfirmClose"
  );

const checkoutFieldsEl =
  document.querySelector(
    ".checkout-fields"
  );

const paymentNoticeEl =
  document.getElementById(
    "paymentNotice"
  );

const checkoutNoteEl =
  document.querySelector(
    ".checkout-note"
  );

function showConfirm(orderId) {

  checkoutFieldsEl.style.display =
    "none";

  checkoutBtn.style.display =
    "none";

  if (checkoutNoteEl) {
    checkoutNoteEl.style.display =
      "none";
  }

  if (paymentNoticeEl) {
    paymentNoticeEl.style.display =
      "none";
  }

  document.getElementById(
    "orderConfirmId"
  ).textContent =
    orderId;

  const statusLine =
    document.getElementById(
      "orderConfirmStatus"
    );

  statusLine.textContent =
    "Payment successful â€” your order has been received and confirmed.";

  orderConfirm.style.display =
    "block";
}

function hideConfirm() {

  checkoutFieldsEl.style.display =
    "flex";

  checkoutBtn.style.display =
    "flex";

  if (checkoutNoteEl) {
    checkoutNoteEl.style.display =
      "block";
  }

  if (paymentNoticeEl) {
    paymentNoticeEl.style.display =
      "block";
  }

  orderConfirm.style.display =
    "none";
}

// ============================================================
// Confirmation close / reset cart
// ============================================================
orderConfirmClose.addEventListener(
  "click",
  () => {

    hideConfirm();

    closeCart();

    Object.keys(cart).forEach(
      id => {
        delete cart[id];
      }
    );

    document.getElementById(
      "custName"
    ).value = "";

    document.getElementById(
      "custPhone"
    ).value = "";

    document.getElementById(
      "custAddress"
    ).value = "";

    renderCart();
  }
);

// ============================================================
// Checkout
//
// Flow:
//
// 1. Validate customer details
// 2. Calculate final total
// 3. Start Razorpay payment
// 4. Wait for server-verified "paid" status
// 5. ONLY THEN open WhatsApp
// 6. ONLY THEN show order confirmation
//
// Any other payment result stops the order.
// ============================================================
checkoutBtn.addEventListener(
  "click",
  () => {

    const name =
      document.getElementById(
        "custName"
      ).value.trim();

    const phone =
      document.getElementById(
        "custPhone"
      ).value.trim();

    const address =
      document.getElementById(
        "custAddress"
      ).value.trim();

    // --------------------------------------------------------
    // Clear previous error
    // --------------------------------------------------------
    checkoutError.style.display =
      "none";

    checkoutError.textContent =
      "";

    // --------------------------------------------------------
    // Validate name and phone
    // --------------------------------------------------------
    if (!name || !phone) {

      checkoutError.textContent =
        "Please add your name and phone number so we can confirm the order.";

      checkoutError.style.display =
        "block";

      return;
    }

    // --------------------------------------------------------
    // Validate Indian mobile number
    // --------------------------------------------------------
    if (!isValidPhone(phone)) {

      checkoutError.textContent =
        "Please enter a valid 10-digit mobile number.";

      checkoutError.style.display =
        "block";

      return;
    }

    // --------------------------------------------------------
    // Delivery address is required
    // --------------------------------------------------------
    if (!address) {

      checkoutError.textContent =
        "Please add a delivery address â€” we currently deliver only, no stall pickup.";

      checkoutError.style.display =
        "block";

      return;
    }

    // --------------------------------------------------------
    // Make sure cart isn't empty
    // --------------------------------------------------------
    const items =
      Object.values(cart);

    if (items.length === 0) {

      checkoutError.textContent =
        "Your cart is empty. Please add an item before continuing.";

      checkoutError.style.display =
        "block";

      return;
    }

    // --------------------------------------------------------
    // Calculate final total
    // --------------------------------------------------------
    const totals =
      computeTotals(items);

    const orderId =
      generateOrderId();

    // --------------------------------------------------------
    // Disable checkout while payment starts
    // --------------------------------------------------------
    checkoutBtn.disabled =
      true;

    const originalButtonText =
      checkoutBtn.textContent;

    checkoutBtn.textContent =
      "Opening secure paymentâ€¦";

    // --------------------------------------------------------
    // Start Razorpay payment
    //
    // payment.js must call the success callback ONLY after
    // the server has verified the Razorpay signature.
    // --------------------------------------------------------
    initiatePayment(

      totals,

      {
        name,
        phone,
        address
      },
      
      items,

      // ------------------------------------------------------
      // PAYMENT SUCCESS
      // ------------------------------------------------------
      paymentResult => {

        checkoutBtn.disabled =
          false;

        checkoutBtn.textContent =
          originalButtonText;

        if (
          !paymentResult ||
          paymentResult.status !==
            "paid"
        ) {

          checkoutError.textContent =
            "Payment could not be verified. Your order has not been confirmed.";

          checkoutError.style.display =
            "block";

          return;
        }

        // ----------------------------------------------------
        // Payment is verified.
        //
        // ONLY NOW create/send the WhatsApp order.
        // ----------------------------------------------------
        const message =
          buildWhatsAppMessage(
            items,
            totals,
            {
              name,
              phone,
              address
            },
            orderId,
            "paid"
          );

        openWhatsAppOrder(
          message
        );

        // ----------------------------------------------------
        // ONLY NOW show confirmation.
        // ----------------------------------------------------
        showConfirm(orderId);
      },

      // ------------------------------------------------------
      // PAYMENT FAILURE / CANCELLED
      // ------------------------------------------------------
      error => {

        checkoutBtn.disabled =
          false;

        checkoutBtn.textContent =
          originalButtonText;

        console.error(
          "Checkout payment error:",
          error
        );

        checkoutError.textContent =
          error?.message ||
          "Payment could not be completed. Your order has not been confirmed. Please try again.";

        checkoutError.style.display =
          "block";
      }
    );
  }
);

// ============================================================
// Scroll reveal
// ============================================================
function initReveal() {

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

  const revealEls =
    document.querySelectorAll(
      ".reveal"
    );

  if (reduceMotion) {

    revealEls.forEach(
      el =>
        el.classList.add("in")
    );

  } else {

    const io =
      new IntersectionObserver(
        entries => {

          entries.forEach(
            entry => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  "in"
                );

                io.unobserve(
                  entry.target
                );
              }
            }
          );
        },
        {
          threshold: 0.15
        }
      );

    revealEls.forEach(
      el =>
        io.observe(el)
    );
  }
}

// ============================================================
// Marquee strip
// ============================================================
function initMarquee() {

  const stripItems = [
    "FOXTAIL",
    "BARNYARD",
    "LITTLE",
    "KODO",
    "BROWNTOP",
    "STONE-GROUND",
    "SLOW-SIMMERED",
    "NO PRESERVATIVES"
  ];

  const track =
    document.getElementById(
      "stripTrack"
    );

  if (!track) return;

  const doubled = [
    ...stripItems,
    ...stripItems
  ];

  track.innerHTML =
    doubled
      .map(
        i =>
          `<span>${i}</span>`
      )
      .join("");
}

// ============================================================
// Init
// ============================================================
document
  .querySelectorAll(
    ".delivery-area-text"
  )
  .forEach(el => {

    el.textContent =
      CONFIG.deliveryAreaMessage;
  });

renderProducts();
renderMilletInfo();
renderAmbali();
renderPrepSteps();
initMarquee();
initReveal();
renderCart();
