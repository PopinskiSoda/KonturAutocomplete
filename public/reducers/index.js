import { combineReducers } from 'redux-immutablejs';
import AddressesReducer from './addresses';

const rootReducer = combineReducers({
	addressesState: AddressesReducer
});

export default rootReducer;