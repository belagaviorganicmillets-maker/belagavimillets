/**
 * Creates a Razorpay Order securely on the server.
 *
 * IMPORTANT:
 * - Razorpay credentials are server-side environment variables.
 * - NEVER put RAZORPAY_KEY_SECRET in frontend code.
 * - The server calculates the payable amount from trusted prices.
 * - The browser is NOT trusted to provide the final payment amount.
 */

const PRODUCTS = {
  "foxtail-millet-powder": {
    name: "Foxtail Millet Powder",
    price: 29
  },

  "barnyard-millet-powder": {
    name: "Barnyard Millet Powder",
    price: 29
  },

  "little-millet-powder": {
    name: "Little Millet Powder",
    price: 29
  },

  "kodo-millet-powder": {
    name: "Kodo Millet Powder",
    price: 29
  },

  "browntop-millet-powder": {
    name: "Browntop Millet Powder",
    price: 29
  },

  "five-millet-combo-pack": {
    name: "5 Millet Combo Pack",
    price: 130
  }
};

const AMBALI = {
  "200ml": {
    price: 39
  },

  "300ml": {
    price: 49
  }
};

const AMBALI_DELIVERY_CHARGE = 30;
const AMBALI_PACKING_CHARGE = 10;

module.exports = async function handler(req, res) {

  // ----------------------------------------------------------
  // Only POST requests are allowed.
  // ----------------------------------------------------------
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  try {

    // --------------------------------------------------------
    // Safely read the request body.
    // --------------------------------------------------------
    let body;

    try {
      body = req.body || {};
    } catch (error) {
      console.error("Invalid request JSON:", error);

      return res.status(400).json({
        success: false,
        error: "Invalid request JSON"
      });
    }

    const {
      items,
      receipt
    } = body;

    // --------------------------------------------------------
    // Validate cart payload.
    // --------------------------------------------------------
    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty or invalid"
      });
    }

    let subtotal = 0;
    let hasAmbali = false;

    // --------------------------------------------------------
    // Validate every cart line and calculate its price
    // using ONLY the server-side catalogue.
    // --------------------------------------------------------
    for (const item of items) {

      if (
        !item ||
        typeof item.id !== "string" ||
        !Number.isInteger(item.qty) ||
        item.qty < 1 ||
        item.qty > 20
      ) {
        return res.status(400).json({
          success: false,
          error: "Invalid cart item"
        });
      }

      let unitPrice = null;

      // ------------------------------------------------------
      // Regular powder / combo product
      // ------------------------------------------------------
      if (PRODUCTS[item.id]) {

        unitPrice =
          PRODUCTS[item.id].price;

      }

      // ------------------------------------------------------
      // Ambali line
      //
      // Example IDs:
      // foxtail-ambali-200ml
      // barnyard-ambali-300ml
      // ------------------------------------------------------
      else if (
        item.id.endsWith("-ambali-200ml")
      ) {

        unitPrice =
          AMBALI["200ml"].price;

        hasAmbali = true;

      }

      else if (
        item.id.endsWith("-ambali-300ml")
      ) {

        unitPrice =
          AMBALI["300ml"].price;

        hasAmbali = true;

      }

      // ------------------------------------------------------
      // Unknown product ID
      // ------------------------------------------------------
      else {

        return res.status(400).json({
          success: false,
          error: "Invalid product in cart"
        });
      }

      subtotal +=
        unitPrice * item.qty;
    }

    // --------------------------------------------------------
    // Fixed Ambali charges.
    //
    // Delivery = ₹30
    // Packing  = ₹10
    //
    // These are charged once per order, not per item.
    // --------------------------------------------------------
    const delivery =
      hasAmbali
        ? AMBALI_DELIVERY_CHARGE
        : 0;

    const packing =
      hasAmbali
        ? AMBALI_PACKING_CHARGE
        : 0;

    const grandTotal =
      subtotal +
      delivery +
      packing;

    // --------------------------------------------------------
    // Convert INR to paise.
    // --------------------------------------------------------
    const amountInPaise =
      Math.round(
        grandTotal * 100
      );

    if (
      !Number.isInteger(amountInPaise) ||
      amountInPaise <= 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid calculated payment amount"
      });
    }

    // --------------------------------------------------------
    // Razorpay credentials.
    //
    // These MUST be environment variables.
    // --------------------------------------------------------
    const keyId =
      process.env.RAZORPAY_KEY_ID;

    const keySecret =
      process.env.RAZORPAY_KEY_SECRET;

    if (
      !keyId ||
      !keySecret
    ) {

      console.error(
        "Razorpay environment variables are missing."
      );

      return res.status(500).json({
        success: false,
        error:
          "Payment system is not configured"
      });
    }

    // --------------------------------------------------------
    // Create Razorpay Basic Auth header.
    // --------------------------------------------------------
    const auth =
      Buffer
        .from(
          `${keyId}:${keySecret}`
        )
        .toString("base64");

    // --------------------------------------------------------
    // Create Razorpay order.
    // --------------------------------------------------------
    const response =
      await fetch(
        "https://api.razorpay.com/v1/orders",
        {
          method: "POST",

          headers: {
            "Authorization":
              `Basic ${auth}`,

            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            amount: amountInPaise,

            currency: "INR",

            receipt:
              receipt ||
              `BOM-${Date.now()}`,

            payment_capture: 1
          })
        }
      );

    const data =
      await response.json();

    // --------------------------------------------------------
    // Handle Razorpay API error.
    // --------------------------------------------------------
    if (!response.ok) {

      console.error(
        "Razorpay order creation failed:",
        data
      );

      return res.status(
        response.status
      ).json({
        success: false,
        error:
          data?.error?.description ||
          "Unable to create payment order"
      });
    }

    // --------------------------------------------------------
    // Return ONLY the information the frontend needs.
    //
    // Never return the secret key.
    // --------------------------------------------------------
    return res.status(200).json({
      success: true,

      order: {
        id: data.id,
        amount: data.amount,
        currency: data.currency
      }
    });

  } catch (error) {

    console.error(
      "Create order error:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        "Unable to create payment order"
    });
  }
};