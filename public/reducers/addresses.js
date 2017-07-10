import * as ActionTypes from '../actions/addresses.js';
import Immutable from 'immutable';
import { createReducer } from 'redux-immutablejs';

const initState = Immutable.fromJS({
	addresses: [],
	validated: null,
	errors: {},
	status: null,
	total: 0
})

export default createReducer(initState, {
	
	[ActionTypes.GET_ADDRESSES_REQUEST]: (state, action) => {
		const updatedState = {
			status: 'request',
			errors: {}
		};
		return state.merge(Immutable.fromJS(updatedState));
	},
	
	[ActionTypes.GET_ADDRESSES_SUCCESS]: (state, action) => {
		const
			response = action.payload,
			updatedState = {	
				addresses: response.addresses,
				total: response.total,
				status: 'success',
				errors: {}
			}

		return state.merge(Immutable.fromJS(updatedState));
	},
	
	[ActionTypes.GET_ADDRESSES_FAILURE]: (state, action) => {
		const
			error = action.payload,
			updatedState = {
				errors: error && error.response ? {
					serverError: {
						code: error.response.status
					}
				} : {},
				status: 'failure'
			}
		return state.merge(Immutable.fromJS(updatedState));
	},

	[ActionTypes.CLEAR_ADDRESSES]: (state, action) => {
		const updatedState = {
			addresses: [],
			total: 0
		}
		return state.merge(Immutable.fromJS(updatedState));
	}
})