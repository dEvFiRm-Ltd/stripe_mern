import './App.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutPage from './CheckoutPage';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const stripePromise = loadStripe(`${process.env.REACT_APP_PUBLISHABLE_KEY}`);

const App = () => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    (async () => {
      const response = await axios.post(
        'http://localhost:5000/payment/create-setup-intent',
        {
          email: `alem@gmail.com`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // Render the form using the clientSecret
      console.log(response);
      setClientSecret(response?.data?.client_secret);
    })();
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };
  return (
    <>
      <center>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutPage />
        </Elements>
      </center>
    </>
  );
};

export default App;
