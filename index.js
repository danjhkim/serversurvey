const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const keys = require('./config/keys');

//condense form of require just loads everything and runs it
require('./services/passport');
require('./models/User');

const authRoutes = require('./routes/authRoutes');
const billingRoutes = require('./routes/billingRoutes');

const app = express();

// takes all the url info and passes onto object. usefel for FORM DATA
app.use(express.json());
//or
//app.use(express.urlencoded({ extended: true }));

//middleware cookie setting encrypt and how long it says 30 days
//extracting cookiedata.
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey],
	}),
);
//both required to apply the initalization and persistent login session.
app.use(passport.initialize());
app.use(passport.session());

mongoose
	.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(result => console.log('connected to db'))
	.catch(err => console.log(err));

app.use(authRoutes);

app.use(billingRoutes);

//! note this is without react,  with react u need a conditional that says if you find it in react package
//! send it if not check backend     the example is below
// app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
	//if in production and the routes arent in authroutes anb billingroutes check react
	const path = require('path');

	// serve production assets e.g. main.js if route exists
	//! checking reach folders
	app.use(express.static(path.resolve(__dirname, '../client/build')));

	// serve index.html if route is not recognized
	//! if not found just send the index.html
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Listening port ${PORT}`);
});
