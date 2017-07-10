import React from 'react';
import Autocomplete from '../../containers/autocomplete';

export default class Home extends React.Component {
	
	render () {
		return (
			<div>
				<Autocomplete
					placeholder='Начните вводить название города'
				/>
			</div>
		);
	}
}