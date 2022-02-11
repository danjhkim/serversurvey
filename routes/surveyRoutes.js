const express = require('express');
const router = express.Router();
const { URL } = require('url');
//this comes with express, it helps with url parsing
const { Path } = require('path-parser');
// this helps with exacting our url parsing making it more specific
const _ = require('lodash');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireLogin');
const Survey = require('../models/Survey');

const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

router.get('/api/surveys', requireLogin, async (req, res) => {
	const { id } = req.user;
	const surveys = await Survey.find({ _user: id })
		.select({ recipients: 0 })
		// select basically removes the recipients cuz the field is uncessary and large
		// 0 or -recipients   mean exclude   whereas 1 or +recipients means include
		// $nin is for arrays including or excluding items within the array
		.sort({ dateSent: -1 })
		.then(result => {
			res.send(result);
		})
		.catch(err => {
			res.status().send(err);
		});
});

//middleware ORDER is important. IN THIS CASE YOU WANT TO CHECK LOGIN BEFORE YOU CHECK CREDITS
router.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
	const { title, subject, body, recipients } = req.body;

	const survey = new Survey({
		title,
		subject,
		body,
		recipients: recipients
			.split(',')
			.map(email => ({ email: email.trim() })),
		//taking the submitted string of emails and splitting them into an array of objects that have an email and id together

		_user: req.user.id,
		// user.id is provided by mongoose (this is NOT GOOGLE ID)

		dateSent: Date.now(),
	});

	// console.log(survey.id, 'just the id');
	// console.log(survey._id, 'just the id');
	//! id and _id the same thing.

	//send a mail
	//surveytemplate is a function that will be called with survey as the argument
	//first argument is the object with the info, the second is the template BUT it needs to be passed
	// the survey so it can use the survey object meta data
	//! refer to surveytemplate
	const mailer = new Mailer(survey, surveyTemplate(survey));

	try {
		await mailer.send();
		// send all mail
		await survey.save();
		// save survey
		req.user.credits -= 1;
		// user loses 1 credit
		const user = await req.user.save();
		// saving to db

		res.send(user);
		//return updated user to the client side
		// the client side goes through action creator and send to reducer
		// which will force an update to the state which is repsonsible for the
		// client info
		//! res.redirect('/');
		// will not work here cuz u already send the res, also even if u figure out the syntax
		//this will redirect and dump the application STATE. u dont want that. u want a redirect from client side.
	} catch (err) {
		res.status(422).send(err);
		// sendng error message for code 422
		// u can on the FRONT do an if u get 422 code show this
	}
});

router.post('/api/surveys/webhooks', (req, res) => {
	// req.body is an array of objects with propertioes such as
	// email timestap url(with yes or no)
	const p = new Path('/api/surveys/:surveyId/:choice');
	//! sendgrid posts every 30 mins or so so its in a batch.

	// this is path parser
	// so this object filters and extracts variables out of the routes
	// the surveyID and choice

	_.chain(req.body)
		.map(({ email, url }) => {
			const match = p.test(new URL(url).pathname);
			// confirming if url matches pathname
			/// "api/surveys/6152043aee71317754ff2b3c/no"
			//? path parser library tests and returns desstructed params as variables

			if (match) {
				return {
					email,
					surveyId: match.surveyId,
					choice: match.choice,
				};
			}
			//! the match is saying if the test pass that means the url matches p
			//! therefore this post request is most certainly from the webhook that we want
			//! which is the click from sendGrid. So we only return those and we now have a new
			//! array of only the events we want.
		})
		.compact()
		// compact removes undefined elements
		.uniqBy('email', 'surveyId')
		//if any duplicates of email and surveyid remove them
		//? this is only removed if both of them are within the same object.
		//? allowing the same email to have multiple suverys that are different
		.each(({ surveyId, email, choice }) => {
			// let survey = await Survery.findById(surveyId)
			// survey.recipients.find(recipient => recipiient.emai === email && !recipiient.email)
			// survey.ricipients.id(responder_id).responded = true;
			//! the above way is bad cuz the sub document of recipients might be extremely long
			// big O notiation would be O of cubed?
			//! its not performant thus for each object we use updateOne
			//? also findandupdateone which returns a document
			//! in the case where you will draw large data, u can narrow ur search with more paramaters
			Survey.updateOne(
				// mongodb syntax from here
				// for each object update mongo db
				{
					_id: surveyId,
					//when its mongoose id is ok for _id when working internally with mongo u have to specifically use _id
					recipients: {
						$elemMatch: { email: email, responded: false },
						// this matches id and email and responded false
						//! if responded is true it wont count so only the first vote counts.
					},
				},
				{
					//$inc increments a field by set amount
					$inc: { [choice]: 1 },
					// $ between recipients and responded signifies that you are going into nested level schema
					// refers to the elemmatch earlier
					$set: { 'recipients.$.responded': true },
					lastResponded: new Date(),

					//$set in this case is not needed why?we're using mongoose for our communication.
					// Mongoose is the one that is allowing this behavior. It's just a little "extra" convenience it provides.
					// Behind the scenes, mongoose will convert this to a $set operator.
					//! Note that $set is still required for recipients.$.responded, as it is not a "top level" assignment. its nested
				},
			).exec();
			//exec is needed to execute the actual query othe other routes dont need this because
			// they are only building the query object however this is actually building
			//! look at the get one u are just setuping it up and the execution of it happens when the route gets calls right?
			//? we need .exec() because we need to manually exec it
		})
		.value();
	//value is what is needed with lodash chaining to return final value

	res.send({});
});

router.get('/api/surveys/:surveyId/:choice', (req, resp) => {
	resp.send(`<h1>THANKS FOR VOTING! </h1>
	<h4>Category: ${req.params.surveyId}</h4>
    <h4>smallercategory: ${req.params.choice}</h4>`);
});

module.exports = router;
