/**
 * Pricing engine — the ONLY place order totals are calculated.
 *
 * Cart rendering, checkout summary, and WhatsApp message builder
 * all use this function.
 *
 * DELIVERY RULE:
 *
 * Ambali subtotal BELOW ₹99
 * → Delivery ₹30
 * → Packing ₹10
 *
 * Ambali subtotal ₹99 OR ABOVE
 * → Delivery FREE (₹0)
 * → Packing ₹10
 *
 * Powder-only orders
 * → Delivery ₹0
 * → Packing ₹0
 */

function money(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function lineTotal(item) {
  return Number(item.unitPrice) * Number(item.qty);
}

function computeTotals(cartItems) {

  // ----------------------------------------------------------
  // Calculate subtotal
  // ----------------------------------------------------------

  const subtotal = cartItems.reduce(
    (sum, item) => sum + lineTotal(item),
    0
  );

  // ----------------------------------------------------------
  // Check whether cart contains Ambali
  // ----------------------------------------------------------

  const hasAmbali = cartItems.some(
    item => item.isAmbali === true
  );

  // ----------------------------------------------------------
  // DELIVERY RULE
  //
  // ₹99 OR ABOVE = FREE DELIVERY
  // BELOW ₹99 = ₹30 DELIVERY
  // ----------------------------------------------------------

  let delivery = 0;

  if (hasAmbali) {

    if (subtotal >= 99) {
      delivery = 0;
    } else {
      delivery = CONFIG.ambaliDeliveryCharge;
    }

  } else {

    delivery = 0;

  }

  // ----------------------------------------------------------
  // PACKING
  //
  // ₹10 whenever Ambali is present.
  // ----------------------------------------------------------

  const packing = hasAmbali
    ? CONFIG.ambaliPackingCharge
    : 0;

  // ----------------------------------------------------------
  // FINAL TOTAL
  // ----------------------------------------------------------

  const grandTotal =
    subtotal +
    delivery +
    packing;

  return {
    subtotal,
    hasAmbali,
    delivery,
    packing,
    grandTotal
  };
}