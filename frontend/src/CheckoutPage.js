import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import React from 'react'

const CheckoutPage = () => {
    const [amount,setAmount]=React.useState(0);
  const stripe = useStripe();
  const elements = useElements();
  const handlePayment = async (event) => {
    event.preventDefault();
    const response = await axios.post(`http://localhost:5000/payment-intent`, {
      amount:amount,
    });
    if (response.status === 200) {
      console.log(response.data);
      const confirmPayment = await stripe.confirmCardPayment(
        response.data,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement),
          },
        }
      );
      if (confirmPayment.paymentIntent.status === "succeeded") {
        console.log("payment confirmed");
      }
    }
  };

  return (
    <form onSubmit={handlePayment}>
      <CardNumberElement />
      <CardExpiryElement />
      <CardCvcElement />
      <input type="text" value={amount} onChange={(e)=>setAmount(e.target.value)}/>
      <button>Confirm Payment</button>
    </form>
  );
};

export default CheckoutPage;
