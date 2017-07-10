import axios from 'axios';

export const GET_ADDRESSES_REQUEST = 'GET_ADDRESSES_REQUEST';
export const GET_ADDRESSES_SUCCESS = 'GET_ADDRESSES_SUCCESS';
export const GET_ADDRESSES_FAILURE = 'GET_ADDRESSES_FAILURE';
export const CLEAR_ADDRESSES = 'CLEAR_ADDRESSES';

const API_URL = 'http://localhost:8080/api';

export function getAddressesSuccess(response) {
	return {
		type: GET_ADDRESSES_SUCCESS,
		payload: response
	}
}

export function getAddressesFailure(error) {
	return {
		type: GET_ADDRESSES_FAILURE,
		payload: error
	}
}

export function getAddresses(cityPrefix) {
	const request = axios.get(
		`${API_URL}/addresses`,
		{
			params: { cityPrefix }
		}
	);
		
	return {
		type: GET_ADDRESSES_REQUEST,
		payload: request
	}
}

export function clearAddresses() {
	return {
		type: CLEAR_ADDRESSES
	}
}