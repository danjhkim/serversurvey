import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Payments from './Payments';

const Header = () => {
	const auth = useSelector(state => state.auth);

	const renderContent = () => {
		switch (auth) {
			case null:
				return;

			case false:
				return <a href='/auth/google'>Login with Google</a>;

			default:
				return (
					<>
						<li>
							<Payments />
						</li>
						<li style={{ margin: '0 0 0 10px' }}>
							Credits: {auth.credits}
						</li>
						<li>
							<a href='/api/logout'>Logout</a>
						</li>
					</>
				);
		}
	};

	return (
		<nav>
			<div className='nav-wrapper'>
				<div className='row'>
					<div className='col s12'>
						<Link
							to={auth ? '/surveys' : '/'}
							className='left brand-logo'>
							Survey
						</Link>
						<ul className='right'>{renderContent()}</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Header;
