const router = require('express').Router();

const {createSetUpIntent,paymentMethodUpdate} = require('../controller/paymentController');

router.post('/create-setup-intent', createSetUpIntent);
router.post('/paymentUpdate', paymentMethodUpdate);


module.express = router;