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
			proxy: true,
			//when providing a relative path, it gives u flexibilty
			// when going through heroku it goes with a heroku specific special proxy
			// which makes passport think it shouldnt send secure
			// one way is to write the full heroku address so like :https://heroku.app/blajbla
			//other option is telling passport to trust herokus proxy
			//! PROXY TRUE TELLS PASSPORT TO USE PROXIES AND THEY ARE SAFE
		},
		(accessToken, refreshToken, profile, done) => {
			Users.findOne({ googleId: profile.id }).then(existingUser => {
				if (existingUser) {
					// we already have a record with the given profile ID
					done(null, existingUser);
				} else {
					// we don't have a user record with this ID, make a new record!
					new Users({ googleId: profile.id })
						.save()
						.then(user => done(null, user));
				}
			});
		},
	),
);
