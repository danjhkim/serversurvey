import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

export const fetchUser = () => async dispatch => {
	const response = await axios.get('/api/current_user');

	dispatch({ type: FETCH_USER, payload: response.data });
};

export const fetchSurveys = () => async dispatch => {
	try {
		const response = await axios.get('/api/surveys');

		dispatch({ type: FETCH_SURVEYS, payload: response.data });
	} catch (err) {
		console.log(err);
		return;
	}
};

export const handleToken = token => async dispatch => {
	try {
		const response = await axios.post('/api/stripe', token);
		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (err) {
		alert('You must log in to add credits');
		return;
	}
	// post the token through that end point.
	//then the backend send the token into the mongo db
	// then is says attach the response u get to the state,
	// which will be an updated profile with token info
};

export const submitSurvey = (values, history) => async dispatch => {
	try {
		const response = await axios.post('/api/surveys', values);

		// is something coming? req.send(user) from the backend is.
		//how do u wanna store it? look below!
		dispatch({ type: FETCH_USER, payload: response.data });
		alert('Emails has been sent!');

		history.push('/surveys');
	} catch (err) {
		alert('An error occured during the emailing process');
		return;
	}
};
