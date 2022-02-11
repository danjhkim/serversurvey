const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const User = require('../models/User');

//! done() function. It is an internal PASSPORT js function that takes care of
//  supplying user credentials after user is authenticated successfully.
// ! This function attaches the email id to the request object so that it is
//  available on the callback url inside req OBJECT

// the user argument is existingUser or newUser so whatever was just retrieved from database. look at the bottom of this file the passport code

//user is basically the same as req.id

//serializeUser determines which data of the user object should be stored in the session.

//! req.user is passportjs created through done
// user.id is from mongodb  __id is what u are geting u dont need the undercores __ due to mongoose.
//we use this mongodb id because IF you have multiple ways to login ei. google facebook email/password.. not all those will have a googleid
// SO we use the mongodb id which is unique to each entry

//! this is the actual auth association to the mongodb ID to the user.
//! serialize  then finds the mongodb ID and makes it the association between the db and client
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// we are only sending out the user.id thats why the first arugment is only id
// this done sends the info to the req.body  IMPORANT ITS ALL IN THE REQ NOW!!!!!  REQ = currently loaded user from DATABASE
//! deserialize uses that id then retrieves the infomartion from the db and puts it in the req.user
passport.deserializeUser((id, done) => {
	User.findById(id)
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
		async (accessToken, refreshToken, profile, done) => {
			//accesstoken is the code that allows us to get the google info from the account
			///refreshtroken allows an ability to refresh the access token
			//! profile is the passport argument that took the info from google.
			const existingUser = await User.findOne({ googleId: profile.id });
			// find googlid thats the same as the profile.id

			if (existingUser) {
				// we already have a record with the given profile ID
				return done(null, existingUser);
			}
			// we don't have a user record with this ID, make a new record!
			const user = await new User({ googleId: profile.id }).save();
			done(null, user);

			// both these dones will send the user record to serializeUser  this entire part is only finding an existing user or creating anew one.
			//! serialize create session with user.id
			//! deserialize uses id and adds it to req.body
			//! 1. ITS ALWAYS GOOGLE TO PASSPORT.  2. FIND USER OR CREATE.  3. FIND ID. 4. GET INFO
		},
	),
);
