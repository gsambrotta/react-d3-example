import React, { Component } from 'react';
import _ from 'lodash';

import Toggle from './Toggle';

class ControlRow extends Component {
	makePick(picked, newState) {
		let toggleValues = this.state.toggleValues;

		// rebuilding the toggleValues dictionary
		toggleValues = _.mapValues(toggleValues,
																(value, key) => newState && key === picked);
		// if newState is false, we reset it
		this.props.updateDataFilter(picked, !newState);
		this.setState({toggleValues: toggleValues});
	}

	componentWillMount() {
		let toggles = this.props.getToggleNames(this.props.data);
		// loop trought getToggleNames values and assign false to them.
		// return: {2009: false, 2010: false, 2011: false, 2012: false, 2013: false, 2014: false}
		let toggleValues = _.zipObject(toggles, toggles.map(() => false));

		// define state here. Exceptional situation
		this.state = {toggleValues: toggleValues};
	}

	_addToggle(name) {
		let key = `toggle-${name}`;
		let label = name;

		if(this.props.capitalize){
			label = label.toUpperCase();
		}

		return (
			<Toggle label={label}
							name={name}
							key={key}
							value={this.state.toggleValues[name]}
							onClick={::this.makePick}
			/>
		)
	}

	render() {

		return (
			<div className='row'>
				<div className='col-md-12'>
					{this.props
               .getToggleNames(this.props.data)
               .map((name) => this._addToggle(name))}
				</div>
			</div>
		)

	}
}

export default ControlRow;
