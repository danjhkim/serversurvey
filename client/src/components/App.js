import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import * as actions from '../actions/';

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew';

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(actions.fetchUser());
	}, [dispatch]);

	return (
		<div className='container'>
			<Router>
				<div className='App'>
					<Header />
					<div className='content'>
						<Switch>
							<Route exact path='/'>
								<Landing />
							</Route>
							<Route exact path='/surveys'>
								<Dashboard />
							</Route>
							<Route exact path='/surveys/new'>
								<SurveyNew />
							</Route>
						</Switch>
					</div>
				</div>
			</Router>
		</div>
	);
}

export default App;
