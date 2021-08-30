const passport = require('passport');
const express = require('express');
const router = express.Router();

router.get('/api/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/api/current_user', (req, res) => {
	// res.send(req.session); <-- shows the id that is asscioated with the users in the database based on
	// mongodb id... once you have that its basically using the cookie to ASSICOATE the user with the account.
	res.send(req.user);
	//req.user shows current user
});

//! accessing google asking for profile and email
//whenever this route is accessed it will use passport to authenticate with google. this is just passport syntax.
//"google" is associated with googlestrate.
//the scope is what access u want to have. saying u want their profile and email.

//ASKS FOR PERMISSION AND in passport.js it callsbacks to /google/callback
//login
router.get(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	}),
);

//! this route hanlder will have a google key/code in the address signifying it has permission.
//! after it redirects if login is successful
//! will get redirected to /google/callback after successful login, then authentic then redirec to surveys
router.get(
	'/auth/google/callback',
	passport.authenticate('google'),
	(req, res) => {
		res.redirect('/surveys');
	},
);

module.exports = router;
