import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Home from './components/home'; 
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom';

const store = configureStore;

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Route exact path="/" component={Home}/>
		</Router>
	</Provider>,
	document.getElementById('app')
);