import EmailValidator from 'email-validator';

const validateEmails = emails => {
	const invalidEmails = emails
		.split(',')
		.map(email => email.trim())
		.filter(cleanEmail => !EmailValidator.validate(cleanEmail))
		.join(', ');

	//split then trim then filter the bad ones and same them to inValidEmails

	if (invalidEmails.length) {
		return `These emails are invalid: ${invalidEmails}`;
	}
	// if there is an error on the error is then send back this test

	return;

	// if not just return
};

export default validateEmails;
