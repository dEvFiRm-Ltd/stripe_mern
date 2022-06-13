import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import axios from 'axios';

const SetupForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    // Save Payment Details to the user's account

    const { error, setupIntent } = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: 'if_required',
    });
    console.log('Payment ID!', setupIntent?.payment_method);
    // Update user's Default Payment Method

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      const updateData = await axios.post(
        'http://localhost:5000/payment/paymentUpdate',
        {
          email: 'alem@gmail.com',
          paymentMethodId: setupIntent?.payment_method,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('default payment details', updateData);
    }
  };

  return (
    <>
      {' '}
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          disabled={!stripe}
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            margin: '15px 0',
            border: '1px solid #80E9FF',
            backgroundColor: '#7A73FF',
            color: '#fff',
            fontWeight: '600',
          }}
        >
          Save Payment Details
        </button>
        {/* Show error message to your customers */}
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </>
  );
};

export default SetupForm;
