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
	const mailer = new Mailer(survey, surveyTemplate(survey));

	try {
		await mailer.send();
		await survey.save();
		req.user.credits -= 1;
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
	const p = new Path('/api/surveys/:surveyId/:choice');
	// this is path parser
	// so this object filters and extracts variables out of the routes
	// the surveyID and choice

	_.chain(req.body)
		.map(({ email, url }) => {
			const match = p.test(new URL(url).pathname);
			//getting the entire route so
			/// "api/surveys/6152043aee71317754ff2b3c/no"
			if (match) {
				return {
					email,
					surveyId: match.surveyId,
					choice: match.choice,
				};
			}
		})
		.compact()
		.uniqBy('email', 'surveyId')
		.each(({ surveyId, email, choice }) => {
			Survey.updateOne(
				{
					_id: surveyId,
					//when its mongoose id is ok for _id when working internally with mongo u have to specifically use _id
					recipients: {
						$elemMatch: { email: email, responded: false },
					},
				},
				{
					$inc: { [choice]: 1 },
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
			// then EXECUTING
		})
		.value();

	res.send({});
});

router.get('/api/surveys/:surveyId/:choice', (req, resp) => {
	resp.send(`<h1>THANKS FOR VOTING! </h1>
	<h4>Category: ${req.params.surveyId}</h4>
    <h4>smallercategory: ${req.params.choice}</h4>`);
});

module.exports = router;
