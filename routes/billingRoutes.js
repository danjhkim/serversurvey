const keys = require('../config/keys');
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

//u can add as many functions in the 2 parameter as you want in express. like requireLogin all it needs is a response
// 3 argument is req res
// this will automatically run the requireLogin as middleware before running the inner code
router.post('/api/stripe', requireLogin, async (req, res) => {
	const charge = await stripe.charges.create({
		amount: 500,
		currency: 'usd',
		source: req.body.id,
		description: `Charge for $5 for 5 credits for user ${req.body.email}`,
	});

	//req.user is the current user with the user model.
	// using req.user always ensure the latest model is used that is returned from passport and db
	req.user.credits += 5;
	const user = await req.user.save();

	res.send(user);
});

module.exports = router;
