/**
 * Site-wide configuration.
 * Change business details, WhatsApp number, and fixed charges here —
 * nothing else in the codebase should hardcode these values.
 */
const CONFIG = {
  businessName: "Belagavi Organic Millets",
  // Same WhatsApp number already used by the existing checkout flow — unchanged.
  whatsappNumber: "919164245475", // wa.me format, no + or spaces
  deliveryAreaMessage: "Delivery available within Belagavi city and surrounding city range only.",
// Fixed per-order charges.
// Delivery is ₹30 when subtotal is below ₹99 and FREE at ₹99 or above.
// Packing is ₹10 for every order.
// These charges do NOT multiply by item quantity.
  ambaliDeliveryCharge: 30,
  ambaliPackingCharge: 10,
  // Millet powder pack shelf life, shown on every powder product card.
  powderShelfLife: "3 months"
};
