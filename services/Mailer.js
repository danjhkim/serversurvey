const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

//this is the Mailer template
class Mailer extends helper.Mail {
	constructor({ subject, recipients }, content) {
		//remember these arguments are coming from surveyroutes content is the template which takes the body out of the survey

		super();

		this.sgApi = sendgrid(keys.sendGridKey);
		this.from_email = new helper.Email('danportfoliomessage@gmail.com');
		this.subject = subject;
		this.body = new helper.Content('text/html', content);
		this.recipients = this.formatAddresses(recipients);

		this.addContent(this.body);
		//! addContent is a sendgrid specific fuinction
		// this.body isnt necessary u can just do this.addContent(new helper.Content etc..)
		// this.body is just used for continuity to make it easier to read.
		this.addClickTracking();
		this.addRecipients();
		// addRecipients is just two part of new helper.Email(email)
	}

	formatAddresses(recipients) {
		// instead of using the index typical of map u are destructing email out of each iteration.

		return recipients.map(({ email }) => {
			return new helper.Email(email);
			//! now u have an array with just emails again
			// if u are sending one email u dont eve need this formatAddresses function.
			//u just add new helper.Email(email at the this.recipients line)
		});
	}

	addClickTracking() {
		const trackingSettings = new helper.TrackingSettings();
		const clickTracking = new helper.ClickTracking(true, true);

		trackingSettings.setClickTracking(clickTracking);
		this.addTrackingSettings(trackingSettings);
	}

	addRecipients() {
		// const personalize = new helper.Personalization();
		// console.log(personalize);
		// //one email

		// this.recipients.forEach(recipient => {
		// 	personalize.addTo(recipient);
		// 	// take the array of emails provided by this.recipients and for each add to personalize.
		// });

		// this.addPersonalization(personalize);
		// console.log(this.addPersonalization(personalize));
		// // this just finalizes the personalize emails

		this.recipients.forEach(recipient => {
			const personalize = new helper.Personalization();
			personalize.addTo(recipient);
			// take the array of emails provided by this.recipients and for each add to personalize.
			this.addPersonalization(personalize);
		});
	}

	async send() {
		const request = this.sgApi.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: this.toJSON(),
		});

		const response = await this.sgApi.API(request);
		return response;
	}
}

module.exports = Mailer;
