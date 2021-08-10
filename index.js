const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');

//condense require just loads everything and runs it
require('./services/passport');
require('./models/User');

const authRoutes = require('./routes/authRoutes');
const { Passport } = require('passport');

const app = express();

//middleware cookie setting encrypt and how long it says 30 days
//extracting cookiedata
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: keys.cookieKey,
	}),
);
//both required to apply the initalization and persistent login session.
app.use(passport.initialize());
app.use(passport.session());

mongoose
	.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(result => console.log('connected to db'))
	.catch(err => console.log(err));

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Listening port ${PORT}`);
});
