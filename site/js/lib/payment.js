/**
 * Razorpay payment integration.
 *
 * Flow:
 *
 * 1. Frontend sends cart items to our server.
 * 2. Server validates the products, quantities and prices.
 * 3. Server calculates the final amount.
 * 4. Server creates a Razorpay Order.
 * 5. Razorpay Checkout opens.
 * 6. Customer completes payment.
 * 7. Razorpay returns payment details.
 * 8. Payment details are sent to our server.
 * 9. Server verifies the Razorpay signature.
 * 10. Only a verified payment is reported as successful.
 *
 * IMPORTANT:
 * The Razorpay Secret Key is NEVER used in this browser-side file.
 */

async function initiatePayment(
  totals,
  customer,
  items,
  onSuccess,
  onFailure
) {
  try {

    // ----------------------------------------------------------
    // Check Razorpay configuration.
    // ----------------------------------------------------------
    if (
      !PAYMENT_CONFIG ||
      PAYMENT_CONFIG.provider !== "razorpay" ||
      !PAYMENT_CONFIG.configured ||
      !PAYMENT_CONFIG.keyId
    ) {
      throw new Error(
        "Razorpay payment is not configured."
      );
    }

    // ----------------------------------------------------------
    // Make sure Razorpay Checkout has loaded.
    // ----------------------------------------------------------
    if (
      typeof Razorpay === "undefined"
    ) {
      throw new Error(
        "Razorpay Checkout could not be loaded."
      );
    }

    // ----------------------------------------------------------
    // Validate cart before contacting the server.
    // ----------------------------------------------------------
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error(
        "Your cart is empty."
      );
    }

    // ----------------------------------------------------------
    // Ask our server to:
    //
    // 1. Validate the cart.
    // 2. Calculate the trusted final amount.
    // 3. Create the Razorpay Order.
    //
    // IMPORTANT:
    // We deliberately do NOT send totals.grandTotal
    // as the source of truth.
    // ----------------------------------------------------------
    const createOrderResponse =
      await fetch(
        "/api/create-order",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            items: items.map(item => ({
              id: item.id,
              qty: item.qty
            })),

            receipt:
              `BOM-${Date.now()}`
          })
        }
      );

    const createOrderData =
      await createOrderResponse.json();

    // ----------------------------------------------------------
    // Handle server error.
    // ----------------------------------------------------------
    if (
      !createOrderResponse.ok ||
      !createOrderData.success ||
      !createOrderData.order
    ) {
      throw new Error(
        createOrderData?.error ||
        "Unable to create payment order."
      );
    }

    const razorpayOrder =
      createOrderData.order;

    // ----------------------------------------------------------
    // Make sure the server returned a valid amount.
    // ----------------------------------------------------------
    if (
      !Number.isInteger(
        razorpayOrder.amount
      ) ||
      razorpayOrder.amount <= 0
    ) {
      throw new Error(
        "Invalid payment amount received from server."
      );
    }

    // ----------------------------------------------------------
    // Open Razorpay Checkout.
    // ----------------------------------------------------------
    const options = {

      key:
        PAYMENT_CONFIG.keyId,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      name:
        "Belagavi Organic Millets",

      description:
        "Millet Ambali & Millet Products",

      order_id:
        razorpayOrder.id,

      prefill: {
        name:
          customer.name,

        contact:
          customer.phone
      },

      notes: {
        customer_name:
          customer.name,

        customer_phone:
          customer.phone
      },

      theme: {
        color:
          "#1f3e2e"
      },

      // --------------------------------------------------------
      // Razorpay returns payment details after successful
      // completion of the Checkout flow.
      // --------------------------------------------------------
      handler:
        async function (
          paymentResponse
        ) {

          try {

            // --------------------------------------------------
            // Make sure all Razorpay values exist.
            // --------------------------------------------------
            if (
              !paymentResponse ||
              !paymentResponse.razorpay_payment_id ||
              !paymentResponse.razorpay_order_id ||
              !paymentResponse.razorpay_signature
            ) {
              throw new Error(
                "Incomplete payment response received."
              );
            }

            // --------------------------------------------------
            // Send Razorpay response to our server.
            //
            // The server owns the secret key and verifies
            // the signature.
            // --------------------------------------------------
            const verifyResponse =
              await fetch(
                "/api/verify-payment",
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  body: JSON.stringify({
                    razorpay_order_id:
                      paymentResponse.razorpay_order_id,

                    razorpay_payment_id:
                      paymentResponse.razorpay_payment_id,

                    razorpay_signature:
                      paymentResponse.razorpay_signature
                  })
                }
              );

            const verifyData =
              await verifyResponse.json();

            // --------------------------------------------------
            // NEVER treat the payment as successful unless
            // the server explicitly returns verified: true.
            // --------------------------------------------------
            if (
              !verifyResponse.ok ||
              !verifyData.success ||
              verifyData.verified !== true
            ) {
              throw new Error(
                verifyData?.error ||
                "Payment could not be verified."
              );
            }

            // --------------------------------------------------
            // Payment is now verified by our server.
            // --------------------------------------------------
            if (
              typeof onSuccess ===
              "function"
            ) {
              onSuccess({
                status:
                  "paid",

                razorpayPaymentId:
                  verifyData.paymentId ||
                  paymentResponse.razorpay_payment_id,

                razorpayOrderId:
                  verifyData.orderId ||
                  paymentResponse.razorpay_order_id
              });
            }

          } catch (error) {

            console.error(
              "Payment verification error:",
              error
            );

            if (
              typeof onFailure ===
              "function"
            ) {
              onFailure(error);
            }
          }
        },

      // --------------------------------------------------------
      // Customer closed the Razorpay window.
      // --------------------------------------------------------
      modal: {

        ondismiss:
          function () {

            if (
              typeof onFailure ===
              "function"
            ) {
              onFailure(
                new Error(
                  "Payment window was closed."
                )
              );
            }
          }
      }
    };

    // ----------------------------------------------------------
    // Create Razorpay Checkout instance.
    // ----------------------------------------------------------
    const razorpay =
      new Razorpay(options);

    // ----------------------------------------------------------
    // Handle Razorpay payment failure.
    // ----------------------------------------------------------
    razorpay.on(
      "payment.failed",
      function (response) {

        console.error(
          "Razorpay payment failed:",
          response?.error
        );

        if (
          typeof onFailure ===
          "function"
        ) {
          onFailure(
            new Error(
              response?.error?.description ||
              "Payment failed. Please try again."
            )
          );
        }
      }
    );

    // ----------------------------------------------------------
    // Open secure payment window.
    // ----------------------------------------------------------
    razorpay.open();

  } catch (error) {

    console.error(
      "Payment initiation error:",
      error
    );

    if (
      typeof onFailure ===
      "function"
    ) {
      onFailure(error);
    }
  }
}