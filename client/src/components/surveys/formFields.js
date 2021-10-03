const FIELDS = [
	{
		label: 'Survey Title',
		name: 'title',
		noValueError: 'You must enter a title',
	},
	{
		label: 'Subject Line',
		name: 'subject',
		noValueError: 'You must enter a subject',
	},
	{
		label: 'Email Body',
		name: 'body',
		noValueError: 'You must enter a body',
	},
	{
		label: 'Recipient List (Seperate multiple emails with a comma)',
		name: 'recipients',
		noValueError: 'You must enter at least 1 email',
	},
];

export default FIELDS;
