const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
	email: String,
	responded: { type: Boolean, default: false },
	//this alone would be enough to remove duplicate results as if responded we will not accept
	// BUT because the server can lag and mess up
	// to remove duplicate clicks we will preprocess the data USING
	// MAP AND FILTER in the survey routes. its a double check
});

module.exports = recipientSchema;
