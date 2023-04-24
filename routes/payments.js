var express = require('express');
var router = express.Router();
const paymentController = require('../controllers/payment_controller')

router.get('/create/:amount/:currency/:user_id/:donation_id',paymentController.create_charges);
router.post('/success-payment',paymentController.success_payment);
router.post('/withdraw',paymentController.withdraw);
router.get('/mywithdraw/:user_id',paymentController.withdraw_by_user);
router.get('/withdraws',paymentController.withdraws);
router.post('/verify_payment',paymentController.verify_payment);





module.exports = router;