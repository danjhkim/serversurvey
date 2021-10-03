import React, { useEffect } from 'react';
import { fetchSurveys } from '../../actions/';
import { useSelector, useDispatch } from 'react-redux';

const SurveyList = () => {
	const dispatch = useDispatch();
	const list = useSelector(state => state.surveys);

	useEffect(() => {
		dispatch(fetchSurveys());
	}, [dispatch]);

	const renderSurveys = () => {
		return list.map(item => {
			return (
				<div className='card blue-grey darken-1' key={item._id}>
					<div className='card-content white-text'>
						<span className='card-title'>{item.title}</span>
						<p>{item.body}</p>
						<p className='right'>
							Seny On :{' '}
							{new Date(item.dateSent).toLocaleDateString()}
						</p>
					</div>
					<div className='card-action'>
						<span
							className='white-text waves-effect waves-light btn'
							style={{ marginRight: '1em' }}>
							Yes: {item.yes}
						</span>
						<span className='white-text waves-effect waves-light btn'>
							No: {item.yes}
						</span>
					</div>
				</div>
			);
		});
	};
	return <div>{renderSurveys()}</div>;
};

export default SurveyList;
