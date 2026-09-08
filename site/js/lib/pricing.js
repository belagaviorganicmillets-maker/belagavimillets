/**
 * Pricing engine — the ONLY place order totals are calculated.
 * Cart rendering, the checkout summary, and the WhatsApp message builder
 * all call into this file rather than computing totals themselves.
 */

function money(n) {
  return "₹" + n.toLocaleString("en-IN");
}

function lineTotal(item) {
  return item.unitPrice * item.qty;
}

/**
 * cartItems: array of
 *   { id, name, sub, unitPrice, qty, isAmbali }
 *
 * Returns { subtotal, hasAmbali, delivery, packing, grandTotal }.
 * Delivery (₹30) and packing (₹10) are FIXED per order and only apply
 * when the cart contains at least one fresh Ambali item — they never
 * multiply by quantity, and powder-only orders don't incur them (the
 * powder is shelf-stable and pickup/delivery is arranged manually).
 */
function computeTotals(cartItems) {
  const subtotal = cartItems.reduce((sum, item) => sum + lineTotal(item), 0);
  const hasAmbali = cartItems.some(item => item.isAmbali);
  const delivery = hasAmbali ? CONFIG.ambaliDeliveryCharge : 0;
  const packing = hasAmbali ? CONFIG.ambaliPackingCharge : 0;
  const grandTotal = subtotal + delivery + packing;
  return { subtotal, hasAmbali, delivery, packing, grandTotal };
}
