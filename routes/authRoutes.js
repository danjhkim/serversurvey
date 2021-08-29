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

//! this route hanlder will have a google key/code in the address signifying it has permission.
//! after it redirects if login is successful
//! will get redirected to /google/callback after successful login, then authentic then redirec to surveys
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
	res.redirect('/surveys');
});

module.exports = router;
