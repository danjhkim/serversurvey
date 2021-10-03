import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/validateEmails';
import formFields from './formFields';

class SurveyForm extends Component {
	renderFields() {
		return (
			<div>
				{/* iterating through the object then using the SurveyField component to create fields */}
				{formFields.map(item => {
					return (
						<Field
							key={item.name}
							name={item.name}
							label={item.label}
							component={SurveyField}
							type='text'></Field>
					);
				})}
				{/* since the component is a component or function (SurveyField). reduxform passes alot of its props to it.  WE CAN USE */}
			</div>
		);
	}
	render() {
		return (
			<div>
				<form
					onSubmit={this.props.handleSubmit(
						this.props.onSurveySubmit,
					)}>
					{/* handlesumbit is provided by redux-form and handled the submit if u have ur own u just callback it */}
					{this.renderFields()}
					<Link
						to='/surveys'
						className='red btn-flat left white-text'>
						Cancel
						<i className='material-icons right'>cancel</i>
					</Link>
					<button
						type='submit'
						className='teal btn-flat right white-text'>
						Next
						<i className='material-icons right'>done</i>
					</button>
				</form>
			</div>
		);
	}
}

const validate = formValues => {
	const errors = {};
	//this entire function is creating an errors object

	errors.recipients = validateEmails(formValues.recipients || '');

	formFields.forEach(({ name, noValueError }) => {
		if (!formValues[name]) {
			errors[name] = noValueError;
		}
	});

	if (formValues.title && formValues.title.length < 3) {
		errors.title = 'Must be greater than 3 characters';
	}

	return errors;
	//this will immediately match up all the field to the names
	// and pass the errors to the reduxform props
};

export default reduxForm({
	form: 'surveyForm',
	validate,
	destroyOnUnmount: false,
})(SurveyForm);
