const stripe = require("stripe")("sk_test_51PtnI8FsZfFCyFzNbAAkd1cCdQ0ssB5kcAe2bGjF1gFg1MwMJjwe0nbUXrcCWkk5ZVC8smFz2ISQDmO4X3G4JGor00s75fN4ex");
const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validate-token");

router.post("/client-payment-intent", validateToken, async (req, resp) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "usd",
      description: "Shiveven-mern stack project",
    });

    return resp.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return resp.status(500).json({ message: error.message });
  }
});

module.exports = router;
