//! NOTE: PRESSING SUBMIT TO SHOW THIS PAGE THE DATA ON THE FORM WILL NOT PERSIST. THIS IS A REDUXFORM FEATURE CUZ ATER U SUBMIT
// U WOULD NORMALLY WANNA EMPTY THE FORM
// U CAN PERSIST THE DATA IF U WANT.

//! on survery form component  its this part
// export default reduxForm({
// 	form: 'suveryForm',
// 	validate,
// 	destroyOnUnmount: false,
// })(SurveyForm);
import { useSelector, useDispatch } from 'react-redux';
import formFields from './formFields';
import { submitSurvey } from '../../actions/';
import { withRouter } from 'react-router-dom';

const SurveyFormReview = ({ onCancel, history }) => {
	// onCancel and history is provided by withRouter
	const formValues = useSelector(state => state.form.surveyForm.values);
	const dispatch = useDispatch();

	const reviewFields = formFields.map(item => {
		return (
			<div key={item.name}>
				<label htmlFor='titleDiv'>{item.label}</label>
				<div className='titleDiv'>{formValues[item.name]}</div>
			</div>
		);
	});

	return (
		<div>
			<h5>Please confirm your entries</h5>
			<div>{reviewFields}</div>
			<div style={{ marginTop: '2em' }}>
				<button
					className='darken-3 yellow btn-flat left white-text'
					onClick={onCancel}>
					Back
					<i className='material-icons right'>cancel</i>
				</button>
				<button
					onClick={() => dispatch(submitSurvey(formValues, history))}
					// history being passed to action creator
					type='submit'
					className='green btn-flat right white-text'>
					Send Survey
					<i className='material-icons right'>email</i>
				</button>
			</div>
		</div>
	);
};

export default withRouter(SurveyFormReview);
