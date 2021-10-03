const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	googleId: {
		type: String,
		required: true,
	},
	credits: {
		type: Number,
		default: 0,
	},
});

const User = mongoose.model('User', userSchema);

module.exports = User;

//this is a mongodb schema
// template to format the db to send to DB
