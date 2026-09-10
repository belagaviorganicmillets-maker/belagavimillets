async function initiatePayment(
  totals,
  customer,
  items,
  onSuccess,
  onError
) {
  try {
    // Create the Razorpay order on the server.
    const createOrderResponse = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items,
        customer
      })
    });

    const orderData = await createOrderResponse.json();

    if (!createOrderResponse.ok || !orderData.success) {
      throw new Error(
        orderData.error || "Unable to create payment order."
      );
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: CONFIG.businessName,
      description: "Millet products and fresh Ambali",
      order_id: orderData.orderId,

      prefill: {
        name: customer.name,
        contact: customer.phone
      },

      notes: {
        customer_name: customer.name,
        customer_phone: customer.phone
      },

      theme: {
        color: "#1F3E2E"
      },

      handler: async function (response) {
        try {
          // Never trust the browser alone.
          // The server verifies the Razorpay signature
          // and confirms that the payment is captured.
          const verifyResponse = await fetch(
            "/api/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                razorpay_order_id:
                  response.razorpay_order_id,
                razorpay_payment_id:
                  response.razorpay_payment_id,
                razorpay_signature:
                  response.razorpay_signature
              })
            }
          );

          const verification = await verifyResponse.json();

          if (
            !verifyResponse.ok ||
            !verification.success ||
            verification.verified !== true ||
            verification.paymentStatus !== "captured"
          ) {
            throw new Error(
              "Payment could not be verified."
            );
          }

          onSuccess({
            status: "paid",
            paymentId: verification.paymentId,
            orderId: verification.orderId
          });
        } catch (error) {
          console.error(
            "Payment verification error:",
            error
          );

          onError(error);
        }
      },

      modal: {
        ondismiss: function () {
          onError(
            new Error(
              "Payment was cancelled or the payment window was closed."
            )
          );
        }
      }
    };

    if (typeof Razorpay === "undefined") {
      throw new Error(
        "Razorpay Checkout could not be loaded."
      );
    }

    const razorpay = new Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error(
        "Razorpay payment failed:",
        response.error
      );

      onError(
        new Error(
          response.error?.description ||
            "Payment failed. Please try again."
        )
      );
    });

    razorpay.open();
  } catch (error) {
    console.error("Payment initiation error:", error);
    onError(error);
  }
}