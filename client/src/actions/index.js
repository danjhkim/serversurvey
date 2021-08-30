import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () => async dispatch => {
	const response = await axios.get('api/current_user');

	dispatch({ type: FETCH_USER, payload: response.data });
};

export const handleToken = token => async dispatch => {
	try {
		const response = await axios.post('api/stripe', token);
		dispatch({ type: FETCH_USER, payload: response.data });
	} catch (err) {
		alert('You must log in to add credits');
		return;
	}

	//this is the same as the first one because its essentially saying.
	// hey post the token through that end point.
	//then the backend said the token into the mongo db
	// then is says attach the response u get to the state,
	// which will be an updated profile with token info
};
