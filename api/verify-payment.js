const crypto = require("crypto");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      verified: false,
      error: "Method not allowed"
    });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body || {};

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: "Incomplete payment details"
      });
    }

    const keyId = process.env.Razorpay_key_id;
const keySecret = process.env.Razorpay_key_secret;

    if (!keyId || !keySecret) {
      console.error(
        "Razorpay environment variables are missing."
      );

      return res.status(500).json({
        success: false,
        verified: false,
        error:
          "Payment verification is not configured"
      });
    }

    /*
     * STEP 1:
     * Verify the Razorpay signature.
     */
    const generatedSignature =
      crypto
        .createHmac("sha256", keySecret)
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

    const expectedBuffer =
      Buffer.from(
        generatedSignature,
        "utf8"
      );

    const receivedBuffer =
      Buffer.from(
        razorpay_signature,
        "utf8"
      );

    const signatureMatches =
      expectedBuffer.length ===
        receivedBuffer.length &&
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );

    if (!signatureMatches) {
      console.warn(
        "Razorpay signature verification failed."
      );

      return res.status(400).json({
        success: false,
        verified: false,
        error:
          "Payment signature verification failed"
      });
    }

    /*
     * STEP 2:
     * Ask Razorpay directly for the payment.
     *
     * This prevents us from treating a merely
     * signed callback as a completed payment.
     */
    const auth =
      Buffer
        .from(
          `${keyId}:${keySecret}`
        )
        .toString("base64");

    const paymentResponse =
      await fetch(
        `https://api.razorpay.com/v1/payments/${encodeURIComponent(
          razorpay_payment_id
        )}`,
        {
          method: "GET",
          headers: {
            "Authorization":
              `Basic ${auth}`
          }
        }
      );

    const paymentData =
      await paymentResponse.json();

    if (!paymentResponse.ok) {
      console.error(
        "Unable to fetch Razorpay payment:",
        paymentData
      );

      return res.status(502).json({
        success: false,
        verified: false,
        error:
          "Unable to confirm payment status"
      });
    }

    /*
     * STEP 3:
     * Require the payment to be captured.
     */
    if (
      paymentData.status !== "captured"
    ) {
      console.warn(
        "Razorpay payment is not captured:",
        paymentData.status
      );

      return res.status(400).json({
        success: false,
        verified: false,
        error:
          "Payment was not completed successfully"
      });
    }

    /*
     * STEP 4:
     * Confirm that Razorpay associates the
     * payment with the order we created.
     */
    if (
      paymentData.order_id !==
      razorpay_order_id
    ) {
      console.warn(
        "Payment/order mismatch."
      );

      return res.status(400).json({
        success: false,
        verified: false,
        error:
          "Payment order could not be verified"
      });
    }

    return res.status(200).json({
      success: true,
      verified: true,
      paymentStatus: "captured",
      paymentId:
        razorpay_payment_id,
      orderId:
        razorpay_order_id
    });

  } catch (error) {
    console.error(
      "Payment verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      verified: false,
      error:
        "Unable to verify payment"
    });
  }
};