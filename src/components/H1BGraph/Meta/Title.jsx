import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';

class Title extends Meta {
	getYearsFragment() {
		const years = this.getYears();
		let title;


		if (years.length < 1) { return; }
		if (years.length > 1) {
			title = '';
		} else {
			// if there is just one year, we assume it because is been filtered
			title = `in ${years[0]}`;
		}

		return title;
	}

	getUSStateFragment() {
		const states = this.getUSStates();
		let title;

		if ( states.length < 1 ) { return; }
		if ( states.length > 1 ) {
			title = '';
		} else {
			title = `in ${StatesMap[states[0].toUpperCase()]}`;
		}

		return title;
	}

	render () {
		const mean = d3.mean(this.props.data, (d) => d.base_salary);
		const format = this.getFormatter();
		const yearsFragment = this.getYearsFragment();
		const USstateFragment = this.getUSStateFragment();
		let title;

		if ( yearsFragment && USstateFragment ) {
			title = (
				<h2>{USstateFragment}, H1B workers in the software industry
				made ${format(mean)}/year {yearsFragment}</h2>
				);
		} else {
			title = (
				<h2> H1B workers in the software industry {yearsFragment.length ? 'make ': 'made '}
				 ${format(mean)}/year {USstateFragment} {yearsFragment}</h2>
			);
		}

		return title;
	}
}

export default Title;
