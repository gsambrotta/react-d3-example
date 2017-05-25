import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';

class Description extends Meta {
	getAllDataByYear(year, data) {
		data || (data = this.props.allData);

		return data.filter((d) => d.submit_date.getFullYear() == year );
	}

	getAllDataByUSState(USstate, data) {
		data || (data = this.props.allData);

		return data.filter((d) => d.state == USstate);
	}

	getPreviousYearFragment() {
		const years = this.getYears().map(Number);
		let fragment;

		if (years.length > 1) {
			fragment = '';
		} else if (years[0] == 2012) { //2012 first year of our dataset!
			fragment = '';

		} else {
			const year = years[0];
			let lastYear = this.getAllDataByYear(year-1);
			const USstates = this.getUSStates();

			// user filter by US State as well as year
			if (USstates.length == 1) {
				lastYear = this.getAllDataByUSState(USstates[0], lastYear);
			}

			// factor between this year and last year is big:
			if (this.props.data.length/lastYear.length > 2) {
				const times_more = (this.props.data.length/lastYear.length).toFixed();
				fragment = `, ${times_more} timesmore then the year before`;

			// factor between this year and last year is small:
			} else {
				const percent = ((1 - lastYear.length / this.props.data.length)*100).toFixed();
				const moreLess = percent > 0 ? 'more' : 'less';
				fragment = `, ${Math.abs(percent)}% ${moreLess} than the year before`;
			}
		}

		return fragment;
	}

	getYearFragment() {
		const years = this.getYears();
		let fragment;

		if(years.length > 1) {
			fragment = '';
		} else {
			fragment = `In ${years[0]}`;
		}

		return fragment;
	}

	getUSStateFragment() {
		const states = this.getUSStates();
		let fragment;

		if(states.length > 1) {
			fragment = 'US';
		} else {
			fragment = StatesMap[states[0].toUpperCase()];
		}

		return fragment;
	}

	render() {
		const formatter = this.getFormatter();
		const mean = d3.mean(this.props.data, (d) => d.base_salary);
		const deviation = d3.deviation(this.props.data, (d) => d.base_salary);
		const yearFragment = this.getYearFragment();
		const USStateFragment = this.getUSStateFragment();
		const previousYearF = this.getPreviousYearFragment();
		const N = formatter(this.props.data.length);
		const min_salary = formatter(mean - deviation);
		const max_salary = formatter(mean + deviation);

		return (
			<p className='lead'>
				{yearFragment.length ? yearFragment : 'Since 2012'} the {USStateFragment} software industry
				{yearFragment ? ' gave' : ' has given'} jobs to {N} foreign nationals {previousYearF}.
				<br/> Most of them made between ${min_salary} and ${max_salary} per year.
			</p>
		)
	}
}

export default Description;
