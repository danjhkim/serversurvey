const keys = require('../config/keys');
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');

//u can add as many functions beside the 2 parameter as you want in express. like requireLogin in this case.
// this will automatically run the requireLogin as middleware before running the inner code
router.post('/api/stripe', requireLogin, async (req, res) => {
	const charge = await stripe.charges.create({
		amount: 500,
		currency: 'usd',
		source: req.body.id,
		//that body.id is the id that is authorized for the charge
		description: `Charge for $5 for 5 credits for user ${req.body.email}`,
	});

	//req.user is the current user with the user model.
	// using req.user always ensure the latest model is used that is returned from passport and db
	req.user.credits += 5;
	const user = await req.user.save();
	//save to the db the changes

	res.send(user);
	//return updated user to the client side
	// the client side goes through action creator and send to reducer
	// which will force an update to the state which is repsonsible for the
	// client info
});

module.exports = router;
