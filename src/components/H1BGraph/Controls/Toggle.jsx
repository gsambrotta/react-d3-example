import React, { Component } from 'react';

class Toggle extends Component {
	constructor() {
    super();

    this.state = {value: false};
  }

  componentWillReceiveProps(nextProps) {
  	this.setState({value: nextProps.value});
  }

  handleClick() {
		let newValue = !this.state.value;
		this.setState({value: newValue});

		this.props.onClick(this.props.name, newValue);
	}

	render() {
		let className = 'btn btn-default';

		if(this.state.value) {
			className += ' btn-primary';
		}

		return (
			<button className={className} onClick={::this.handleClick}>
				{this.props.label}
			</button>
		)
	}
}

export default Toggle;
