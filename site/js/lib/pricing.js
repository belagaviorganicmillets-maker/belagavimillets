/**
 * Pricing engine — the ONLY place order totals are calculated.
 *
 * Cart rendering, checkout summary, and WhatsApp message builder
 * all use this function.
 *
 * DELIVERY RULE:
 *
 * Subtotal BELOW ₹99
 * → Delivery ₹30
 * → Packing ₹10
 *
 * Subtotal ₹99 OR ABOVE
 * → Delivery FREE (₹0)
 * → Packing ₹10
 *
 * These rules apply to ALL orders, including powder-only orders.
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
  // DELIVERY
  //
  // ₹99 OR ABOVE = FREE DELIVERY
  // BELOW ₹99 = ₹30 DELIVERY
  //
  // Applies to ALL orders.
  // ----------------------------------------------------------

  let delivery = 0;

  if (subtotal >= 99) {
    delivery = 0;
  } else {
    delivery = CONFIG.ambaliDeliveryCharge;
  }

  // ----------------------------------------------------------
  // PACKING
  //
  // ₹10 for EVERY order.
  // ----------------------------------------------------------

  const packing =
    CONFIG.ambaliPackingCharge;

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