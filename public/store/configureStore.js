import { createStore } from 'redux';
import { combineReducers } from 'redux-immutablejs';

import Immutable from 'immutable';
import rootReducer from '../reducers';

const state = Immutable.fromJS({});
const store = rootReducer(state);

export default createStore(rootReducer, store);