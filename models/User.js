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

const users = mongoose.model('user', userSchema);
module.exports = users;
// the FIRSDT parameter "Blog" is important cuz it will look into db and look for the plural of it so in MONGODB it will look for "Blogs"
//capitals are not important

//this is a mongodb schema
// template to format the db to send to DB
