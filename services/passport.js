const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const Users = require('../models/User');

//! done() function. It is an internal PASSPORT js function that takes care of
// !supplying user credentials after user is authenticated successfully.
// !This function attaches the email id to the request object so that it is
// !available on the callback url inside req.

// the user argument is existingUser or newUser so whatever was just retrieved from database.

// serializeUser determines which data of the user object should be stored in the session (cookie).
//user is basically the same as req.id
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// REMOVE COOKIE
passport.deserializeUser((id, done) => {
	Users.findById(id)
		.then(user => {
			done(null, user);
		})
		.catch(err => {
			console.log(err);
		});
});

//! appying strategy to passport as middleware
//using keys.js importing the id and key
//callbackurl is the route that the user will sent to after they recieve auth from google. So what page on ur site also u need to add that url to google side.
passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
		},
		(accessToken, refreshToken, profile, done, req, res) => {
			Users.findOne({ googleId: profile.id }).then(existingUser => {
				if (existingUser) {
					//found user
					done(null, existingUser);
				} else {
					// no user found make a new record
					const user = new Users({ googleId: profile.id });

					user.save().then(newUser => {
						done(null, newUser);
					});
				}
			});
		},
	),
);