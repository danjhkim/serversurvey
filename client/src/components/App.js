import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import history from '../history';

import * as actions from '../actions/';

import Header from './Header';
import Landing from './Landing';

const Dashboard = () => <h2>dashboard</h2>;
const SurveryNew = () => <h2>survey</h2>;

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
								<SurveryNew />
							</Route>
						</Switch>
					</div>
				</div>
			</Router>
		</div>
	);
}

export default App;
