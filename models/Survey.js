const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
	title: String,
	body: String,
	subject: String,
	recipients: [RecipientSchema],
	yes: { type: Number, default: 0 },
	no: { type: Number, default: 0 },
});

const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;

// the FIRSDT parameter "user" is important cuz it will look into db and look for the plural of it so in MONGODB it will look for "Blogs"
//capitals are not important

//this is a mongodb schema
// template to format the db to send to DB
