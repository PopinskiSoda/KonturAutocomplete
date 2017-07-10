import React from 'react';
import BEMHelper from 'react-bem-helper';

const classes = new BEMHelper({
	name: 'loader'
})

export default class Loader extends React.Component {
	
	render() {
		const { className } = this.props;

		return (
			<div {...classes({extra: className})}/>
		);
	}
} 