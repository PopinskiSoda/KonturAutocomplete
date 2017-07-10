import React from 'react';
import { connect } from 'react-redux';
import Autocomplete from '../../components/autocomplete';
import { 
	getAddresses,
	getAddressesSuccess,
	getAddressesFailure,
	clearAddresses
} from '../../actions/addresses';

const mapStateToProps = (state) => {
	const addressesState = state.get('addressesState');

	return {
		addresses: addressesState.get('addresses'),
		validated: addressesState.get('validated'),
		errors: addressesState.get('errors'),
		status: addressesState.get('status'),
		total: addressesState.get('total')
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		getAddresses: (cityPrefix) => {
			const request = dispatch(getAddresses(cityPrefix)).payload;

			request.then((response) => {	
				if (response.status < 400) {
					dispatch(getAddressesSuccess(response.data));
				}
			}).catch((error) => {
				dispatch(getAddressesFailure(error));
			});
		},

		clearAddresses: () => {
			dispatch(clearAddresses());
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Autocomplete);