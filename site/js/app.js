// ============================================================
// Order ID generator
//
// Creates a unique reference for the customer's order.
// This ID is used for the WhatsApp order message and
// confirmation panel.
//
// IMPORTANT:
// This is only a customer-facing reference.
// Razorpay's actual payment/order IDs are created and
// verified by the secure server-side API.
// ============================================================
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
        "Please add a delivery address — we currently deliver only, no stall pickup.";

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

    // --------------------------------------------------------
    // Generate our customer-facing order reference
    // --------------------------------------------------------
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
      "Opening secure payment…";

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