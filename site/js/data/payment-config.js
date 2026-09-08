/**
 * Razorpay payment configuration.
 *
 * IMPORTANT:
 * - This file is sent to the browser.
 * - Only the Razorpay PUBLIC/TEST Key ID belongs here.
 * - NEVER put the Razorpay Key Secret in this file.
 * - The Key Secret will be stored securely on the server later.
 */

const PAYMENT_CONFIG = {
  provider: "razorpay",

  // Your Razorpay TEST Key ID.
  // Replace this with your actual rzp_test_... key.
  keyId: "rzp_test_TZEDiGtrhnu70d",

  configured: true
};