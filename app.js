require('dotenv').config()
const express = require('express');
const app = express();
const stripe = require("stripe")(process.env.STRIPE_SCRIPT_KEY);
console.log(process.env.STRIPE_SCRIPT_KEY);
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// console.log(stripe);


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
    res.send('hello world');
  })

  const PORT = process.env.PORT || 5000;

  app.listen(PORT ||5000, () => {
    console.log(`Server is running on port ${PORT}`);
  })
  

