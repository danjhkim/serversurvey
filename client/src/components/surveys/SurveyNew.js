import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component {
	state = { showReview: false };

	renderContent() {
		if (this.state.showReview) {
			return (
				<SurveyFormReview
					onCancel={() => this.setState({ showReview: false })}
				/>
			);
		} else {
			return (
				<SurveyForm
					onSurveySubmit={() => this.setState({ showReview: true })}
				/>
			);
		}
	}

	render() {
		return <div>{this.renderContent()}</div>;
	}
}

export default reduxForm({ form: 'surveyForm' })(SurveyNew);
// we do this again here in order to clear the form its a trick
//in SurveyForm.js  we have it set to retain form values
