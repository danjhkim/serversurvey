import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';
//note this client said stripe Checkout doesnt actually charge the credit card
// u just get an authorization to. You have to setup an actual charge on the backend
// that swhat the action creator does. connects to backend to complete charge.

class Payments extends Component {
	render() {
		return (
			<StripeCheckout
				name='Survey'
				description='$5 for 5 survey credits'
				amount={500}
				token={token => {
					this.props.handleToken(token);
				}}
				stripeKey={process.env.REACT_APP_STRIPE_KEY}>
				<button className='btn'>Add Credits</button>
			</StripeCheckout>
		);
	}
}

const mapStateToProps = state => {
	return {
		auth: state.auth,
	};
};

export default connect(mapStateToProps, actions)(Payments);
