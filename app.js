require('dotenv').config()
const express = require('express');
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SCRIPT_KEY);
console.log(process.env.STRIPE_SCRIPT_KEY);
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');


const signup = require('./controller/signupController');
const {createSetUpIntent} = require('./controller/paymentController');

app.use(cors());
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log(stripe);
const paymentRouter = require('./routes/payment');
app.post('/signup', signup.signupController);
app.use('/payment', paymentRouter);
app.post("/payment-intent", async(req,res)=>{
  const {amount} =req.body
  //enter your checks whether the payment is correct
  if(!amount){
    return res.status(400).json({error:"Please provide amount"});
  }
  const paymentIntent = await stripe.paymentIntents.create({
    amount ,
    currency: "usd", 
    description: "Payment for order", 
  });
  console.log(paymentIntent.client_secret);
  res.status(200).json(paymentIntent.client_secret);

  })



  app.get('/',(req,res)=>{
    res.send('<center><h1>Stripe</h1></center>');
  })


  const PORT = process.env.PORT || 5000;

  mongoose.connect( `mongodb+srv://LMHasib:LMShsb@cluster0.db2ry.mongodb.net/stripe`)
      .then(() => {
          console.log('connected to mongodb');
          app.listen(PORT, () => {
              console.log(`Server is running on port ${PORT}`);
          });
      }).catch(err => {
          console.log(err);
      });
  

