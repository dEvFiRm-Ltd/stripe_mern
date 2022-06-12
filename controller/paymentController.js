const stripe = require('stripe')(process.env.STRIPE_SCRIPT_KEY);
const User = require('../models/User');

//payment methods create
exports.createSetUpIntent = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    const setupIntent = await stripe.setupIntents.create({
      customer: user.stripeId,
      payment_method_types: ['card'],
    });

    res.status(200).json({ client_secret: setupIntent.client_secret });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
exports.paymentMethodUpdate = async (req, res) => {
  const { paymentMethodId } = req.body; //
  const { email } = req.body; // from req.user
  try {
    const user = await User.findOne({ email });
    // console.log('user', user);
    //default payment method
    const customer = await stripe.customers.update(user.stripeId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    console.log(customer);
    const subscription = await stripe.subscriptions.create({
      customer: user.stripeId,
      default_payment_method: paymentMethodId,
      items: [
        {
          price: 'price_1L9pUmD6jjMbKOtsdP7XGftd',
        },
      ],
    });
    res.status(200).json({
      msg: 'subscription created',
      customer,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.customerPaymentStatus = async (req, res) => {
  const { email } = req.body; // from req.user
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User does not exist' });
    }
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeId,
      price: 'price_1L5Ms5D6jjMbKOtscPyPdCI6',
    });
    res.status(200).json({ subscriptions });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
