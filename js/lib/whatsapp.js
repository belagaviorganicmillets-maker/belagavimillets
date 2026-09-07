/**
 * Builds the WhatsApp order message.
 *
 * IMPORTANT:
 * This function is called only after Razorpay payment
 * has been successfully verified by the server.
 *
 * There is NO COD or offline-payment option.
 */

function buildWhatsAppMessage(
  cartItems,
  totals,
  customer,
  orderId,
  paymentStatus
) {
  const lines = cartItems.map(item =>
    `• ${item.name} — ${item.sub} × ${item.qty} — ${money(item.unitPrice)} each — ${money(lineTotal(item))}`
  );

  const parts = [
    `Hi, I'd like to order from ${CONFIG.businessName}.`,
    ``,
    `ORDER ID: ${orderId}`,
    ``,
    `ORDER:`,
    ...lines,
    ``,
    `Subtotal: ${money(totals.subtotal)}`
  ];

  // Ambali orders have fixed delivery + packing charges.
  if (totals.hasAmbali) {
    parts.push(
      `Delivery: ${money(totals.delivery)}`
    );

    parts.push(
      `Packing: ${money(totals.packing)}`
    );
  }

  parts.push(
    `Total: ${money(totals.grandTotal)}`
  );

  parts.push(``);

  // Only verified payment should reach this function.
  parts.push(
    `PAYMENT: ${
      paymentStatus === "paid"
        ? "PAID"
        : "NOT VERIFIED"
    }`
  );

  parts.push(``);

  parts.push(
    `Name: ${customer.name}`
  );

  parts.push(
    `Phone: ${customer.phone}`
  );

  parts.push(
    `Fulfilment: Delivery`
  );

  parts.push(
    `Delivery Address: ${customer.address}`
  );

  if (totals.hasAmbali) {
    parts.push(``);

    parts.push(
      `Note: Order includes fresh Ambali. Please confirm delivery timing.`
    );
  }

  return parts.join("\n");
}

/**
 * Opens WhatsApp with the prepared order message.
 *
 * This should only be called after successful
 * Razorpay payment verification.
 */
function openWhatsAppOrder(message) {
  const phone =
    CONFIG.whatsappNumber;

  const url =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}