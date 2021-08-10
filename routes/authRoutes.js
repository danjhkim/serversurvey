const passport = require('passport');
const express = require('express');
const router = express.Router();

//! accessing google asking for profile and email
//whenever this route is accessed it will use passport to authenticate with google. this is just passport syntax.
//"google" is associated with googlestrate.
//the scope is what access u want to have. saying u want their profile and email.

//ASKS FOR PERMISSION AND in passport.js it callsbacks to /google/callback
//login
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	}),
);

//! this route hanlder will have a google key/code in the address signifying it has permission. thats why the one above looks the same but
//! produces a different result. one auths one redirects
router.get('/google/callback', passport.authenticate('google'));

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/current_user', (req, res) => {
	// res.send(req.session); <-- shows the id that is asscioated with the users in the database based on
	// mongodb id... once you have that its basically using the cookie to ASSICOATE the user with the account.
	res.send(req.user);
});

module.exports = router;
