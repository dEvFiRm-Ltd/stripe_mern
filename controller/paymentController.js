const stripe = require("stripe")(process.env.STRIPE_SCRIPT_KEY);
const User = require("../models/User");

exports.createSetUpIntent = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }
    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeId,
      payment_method_types: ["card"],
    });

    res.status(200).json({ client_secret: setupIntent.client_secret });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
exports.paymentMethodUpdate = async (req, res) => {
  const { paymentMethodId } = req.body;
  const { email } = req.body; // from req.user
  try {
    const user = await User.findOne({ email });
    const customer = await stripe.customers.update(user.stripeId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    console.log(customer);
    const subscription = await stripe.subscriptions.create({
      customer: user.stripeId,
      default_payment_method: paymentMethodId,
      default_source: customer.default_source,
      items: [
        {
          price: "price_1L5NrSD6jjMbKOtsp8Vnb04L",
        },
      ],
      add_invoice_items: [
        {
          price: "price_1L5NrSD6jjMbKOtsp8Vnb04L",
        },
      ],
    });
    res.status(200).json({
      msg: "subscription created",
      subscription,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
