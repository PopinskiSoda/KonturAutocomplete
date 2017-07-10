import React from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';

const classes = BEMHelper({
	name: 'message-label'
})

export default class MessageLabel extends React.Component {

	render() {
		const { type, className } = this.props;
		
		return (
			<div {...classes({modifiers: type, extra: className})}>
				{this.props.children}
			</div>
		);
	}
}

MessageLabel.propTypes = {
	type: PropTypes.string
}