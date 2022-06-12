const router = require('express').Router();

const {createSetUpIntent,paymentMethodUpdate,customerPaymentStatus} = require('../controller/paymentController');

router.post('/create-setup-intent', createSetUpIntent);
router.post('/paymentUpdate', paymentMethodUpdate);
router.get('/customer-payment-status', customerPaymentStatus);


module.exports = router;