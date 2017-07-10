import React from 'react';
import BEMHelper from 'react-bem-helper';
import Loader from '../loader';
import MessageLabel from '../messageLabel';
import PropTypes from 'prop-types';

const classes = new BEMHelper({
	name: 'autocomplete'
});

export default class Autocomplete extends React.Component {

	constructor() {
		super();

		this.state = {
			opened: false,
			doneTyping: false,
			value: '',
			selectedIndex: 0,
			requestIsLagged: false,
			isBlurError: false,
			tryAgainOptionClicked: false
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.renderOption = this.renderOption.bind(this);
		this.handleOptionMouseOver = this.handleOptionMouseOver.bind(this);
		this.handleMessageOptionMouseDown = this.handleMessageOptionMouseDown.bind(this);
	}

	componentWillReceiveProps(newProps) {
		const {status, clearAddresses} = this.props;
		const {status: newStatus} = newProps;

		if (newStatus === 'failure' && newStatus !== status) {
			clearAddresses();
		}
	}

	open() {
		this.setState ({
			opened: true
		})
	}

	close() {
		clearTimeout(this._doneTypingTimer);
		this.setState ({
			opened: false,
			selectedIndex: 0
		})
	}

	startLoaderTimer() {
		const { minLoaderDelay } = this.props;

		this._loaderTimer = setTimeout(() => {
			this.setState({
				requestIsLagged: false
			});
		}, minLoaderDelay);
	}

	startRequestTimer() {
		const { maxRequestDelay } = this.props;

		this._requestTimer = setTimeout(() => {
			const { status } = this.props;

			if( status === 'request') {
				this.setState({
					requestIsLagged: true
				});
				this.startLoaderTimer();
				return;
			}
		}, maxRequestDelay);
	}

	startDoneTypingTimer() {
		const {
			getAddresses,
			clearAddresses,
			doneTypingDelay
		} = this.props;

		this._doneTypingTimer = setTimeout(() => {
			const { value } = this.state;

			const trimmedValue = value ? value.trim() : '';


			this.setState({
				doneTyping: true,
				selectedIndex: 0
			});

			if (trimmedValue === ''){
				this.close();
				clearAddresses();
				return;
			}

			typeof getAddresses === 'function' && getAddresses(trimmedValue);
			this.open();
			this.startRequestTimer();
		}, doneTypingDelay);
	}

	handleChange(e) {
		this.setState({
			doneTyping: false,
			value: e.target.value,
			isBlurError: false
		});
		clearTimeout(this._doneTypingTimer);
		this.startDoneTypingTimer();
	}

	handleBlur(e) {
		const { status } = this.props;
		const { doneTyping, value, tryAgainOptionClicked } = this.state;

		this.close();

		if (value && (status === 'request' || !doneTyping) && !tryAgainOptionClicked ) {
			this.setState({
				isBlurError: true,
				tryAgainOptionClicked: false
			});
		}
	}

	handleFocus() {
		this.setState({
			isBlurError: false
		});
	}

	selectOption(index) {
		const { addresses } = this.props;

		this.setState({
			value: addresses.getIn([index, 'City'])
		})
		this.close();
	}

	handleKeyDown({ keyCode }) {
		const { addresses, status, getAddresses, errors } = this.props;
		const { selectedIndex, opened, value, doneTyping } = this.state;

		const
			UP_ARROW_CODE = 38,
			DOWN_ARROW_CODE = 40,
			ENTER_CODE = 13,
			ESC_CODE = 27,
			maxIndex = (addresses && addresses.size - 1),
			errorCode = errors.getIn(['serverError', 'code']),
			isValid = (errorCode !== 400);

		if ( opened ) {
			if (addresses && (addresses.size > 0) ) {
				if(keyCode === UP_ARROW_CODE) {
					this.setState({
						selectedIndex: selectedIndex === 0 ? 0 : selectedIndex - 1
					});
					return;
				}
				if(keyCode === DOWN_ARROW_CODE) {
					this.setState({
						selectedIndex: selectedIndex === maxIndex ? maxIndex : selectedIndex + 1
					})
					return;
				}
			}
			if(keyCode === ENTER_CODE) {
				if (!doneTyping || status === 'request') {
					return;
				}
				if (!isValid) {
					return;
				}
				if (status === 'failure') {
					typeof getAddresses === 'function' && value && getAddresses(value); // if failure then try again
					return;
				}
				if (addresses && (addresses.size > 0) ) {
					this.selectOption(selectedIndex);
				}
				return;
			}
			if (keyCode === ESC_CODE) {
				this.close();
				return;
			}
		}
	}

	handleOptionMouseOver(index) {
		this.setState({
			selectedIndex: index
		});
	}

	handleOptionMouseDown(index) {	// using onMouseDown event fires before onBlur which onClick one doesn't
		this.selectOption(index);
	}

	handleMessageOptionMouseDown() {
		const { getAddresses } = this.props;
		
		this.setState({
			tryAgainOptionClicked: true
		})
		this.close();
		getAddresses();
	}

	renderOption(address, index) {
		const { selectedIndex } = this.state;

		return (
			<li {
				...classes('dropdown-option', index === selectedIndex && 'selected')}
				key={index}
				onMouseOver={ () => {this.handleOptionMouseOver(index)} }
				onMouseDown={ () => {this.handleOptionMouseDown(index)} }
			>
				{address.get('City')}
			</li>
		);
	}

	renderMessageText() {
		const { status, addresses, errors } = this.props;

		const
			isEmptyList = (addresses && addresses.size === 0),
			isFailure = (status === 'failure'),
			isSuccess = (status === 'success'),
			isValid = (errors.getIn(['serverError', 'code']) !== 400),
			isHiddenMessageText = !(isEmptyList && isSuccess || isFailure) || !isValid;

		return (
			<div {...classes(
				'dropdown-message',
				isHiddenMessageText && 'hidden'
			)}>
				{
					isFailure ? (
						"Что-то пошло не так. Проверьте соединение с интернетом и попробуйте еще раз"
					) : isEmptyList && isSuccess && "Ничего не найдено"
				}
			</div>
		);
	}

	renderMessageLabel() {
		const { errors } = this.props;
		const { isBlurError } = this.state;

		const
			isValid = (errors.getIn(['serverError', 'code']) !== 400),
			isHiddenMessageLabel = !(isBlurError || !isValid);

		return(
			<MessageLabel
				{...classes('message-label', isHiddenMessageLabel && 'hidden')}
				type={'error'}
			>
				{
					!isValid ? (
						'В названии города присутствуют недопустимые символы'
					) : isBlurError && 'Выберите значение из списка'
				}
			</MessageLabel>
		);
	}

	render() {
		const {
			addresses,
			placeholder,
			status,
			errors,
			total
		} = this.props;

		const {
			opened,
			value,
			requestIsLagged,
			isBlurError
		} = this.state;

		const
			serverErrorCode = errors.getIn(['serverError', 'code']),
			isHiddenLoader = !(status === 'request' || requestIsLagged),
			isEmptyList = addresses && addresses.size === 0,
			isFailure = status === 'failure',
			isSuccess = status === 'success',
			isValid = serverErrorCode !== 400,
			isHiddenMessageText = !(isEmptyList && isSuccess || isFailure) || !isValid,
			isHiddenMessageOption = isHiddenMessageText || !isFailure,
			isHiddenDropdown = !opened || isEmptyList && isHiddenMessageText,
			isInputError = isBlurError || !isValid,
			isHiddenMessageLabel = !isInputError,
			addressesSize = addresses && addresses.size,
			isHiddenTotalLabel = addresses.size >= total;

		return (
			<div {...classes()}>
				<input
					{...classes('input', isInputError && 'error')}
					type="text"
					spellCheck="false"
					placeholder={placeholder}
					value={value}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}
					onBlur={this.handleBlur}
				/>
				<Loader {
					...classes(
						'loader',
						isHiddenLoader && 'hidden'
					)
				}/>
				<div {...classes('dropdown', isHiddenDropdown && 'hidden')}>
					<ul {...classes('dropdown-list')}>
						{addresses.map(this.renderOption)}
					</ul>
					<div {...classes('dropdown-total-label', isHiddenTotalLabel && 'hidden')} >
						{
							`Показано ${addressesSize} из ${total} городов. Уточните запрос, чтобы увидеть остальные.`
						}
					</div>
					{this.renderMessageText()}
					<div 
						{...classes(
							'dropdown-message-option',
							isHiddenMessageOption && 'hidden'
						)}
						onMouseDown={this.handleMessageOptionMouseDown}
					>
						Обновить
					</div>
				</div>
				{this.renderMessageLabel()}
			</div>
		);
	}

}

Autocomplete.propTypes = {
	placeholder: PropTypes.string,
	doneTypingDelay: PropTypes.number,
	maxRequestDelay: PropTypes.number,
	minLoaderDelay: PropTypes.number,
	status: PropTypes.string,
	errors: PropTypes.object,
	addresses: PropTypes.object,
	total: PropTypes.number
}

Autocomplete.defaultProps = {
	placeholder: '',
	doneTypingDelay: 300,
	maxRequestDelay: 500,
	minLoaderDelay: 500
}