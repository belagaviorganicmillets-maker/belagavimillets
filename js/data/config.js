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
  // Fixed per-order charges for FRESH AMBALI orders only (not the shelf-stable
  // powder). These do NOT multiply by item quantity — see lib/pricing.js.
  ambaliDeliveryCharge: 30,
  ambaliPackingCharge: 10,
  // Millet powder pack shelf life, shown on every powder product card.
  powderShelfLife: "3 months"
};
