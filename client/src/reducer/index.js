import { combineReducers } from 'redux';
import authReducer from './authReducer';

const combinedReducers = combineReducers({
	auth: authReducer,
});

export default combinedReducers;
