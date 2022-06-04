const stripe = require("stripe")(process.env.STRIPE_SCRIPT_KEY);
const User = require('../models/User');


exports.signupController = async (req, res) => {
    const {email}= req.body;

    try {
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({error:"User already exists"});
        }
        const customer = await stripe.customers.create({
            email,
            // name,
            // description,
        });
        const stripeId = customer.id;
        const newUser = new User({email,stripeId});
        await newUser.save();
        res.status(200).json({stripeId});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({error:err.message});
    }
}
