const express = require('express');
const passport = require('passport');
const GoogleStragtey = require('passport-google-oauth20').Strategy;
const keys = require('./config/keys');

const app = express();

// appying strategy to passport as middleware
//using keys.js importing the id and key
//callbackurl is the route that the user will sent to after they recieve auth from google. So what page on ur site.
passport.use(
	new GoogleStragtey(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.GoogleClientSecret,
			callbackURL: '/auth/google/callback',
		},
		accessToken => {
			console.log(accessToken);
		},
	),
);

app.get('/', (req, res) => {
	res.send({ hi: 'there!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log('Listening port 5000');
});
