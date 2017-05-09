import React, { Component } from 'react';
import _ from 'lodash';

import ControlRow from './ControlRow';

class Controls extends Component {
	constructor(props) {
		super(props);

		this.state = {
			yearFilter: () => true,
			year: '*',
			UsstateFilter: () => true,
			USstate: '*',
		};
	}

	updateYearFilter(year, reset) {
		// checks for true between data years and clicked year
		let filter = (d) => d.submit_date.getFullYear() == year;

		if(reset || !year){
			filter = () => true;
			year = '*'
		}

		this.setState({yearFilter: filter, year: year});
	}

	updateUSStateFilter(USstate, reset) {
		let filter = (d) => d.state == USstate;

		if(reset || !USstate) {
			filter = () => true;
			USstate = '*'
		}

		this.setState({UsstateFilter: filter, USstate: USstate});
	}

	componentDidUpdate(prevProps, prevState) {
		this.props.updateDataFilter(
			// filter wrapped in a function
			((filters) => {
				return (d) => filters.yearFilter(d) && filters.UsstateFilter(d)
			})(this.state)
		);
	}

	// if we don't write this, it will goes in infinite loop
	// because when react re-render (componentDidUpdate) it do a superficial comparison of this.state.
	// to prevent infinite loop, we need a better check, so we build our own.
	shouldComponentUpdate(nextProps, nextState) {
		// component update just if the two state are actually different.
		return !_.isEqual(this.state, nextState);
	}

	render() {
		let getYears = (data) => {
			// _.keys -> dictionary's keys/groupBy's keys
			// _.groupBy -> dictionary of years as keys
			// .map(Number) make sure they are all numbers.
			// return: i.e. [2009, 2010, 2011, 2012, 2013, 2014]
			return _.keys(_.groupBy(data,
                        (d) => d.submit_date.getFullYear()) )
      				.map(Number);
		}

		let getState = (data) => {
			return _.sortBy(_.keys( _.groupBy(data, (d) => d.state)));
		}

		return (
			<div>
				<ControlRow data={this.props.data}
										getToggleNames={getYears}
										updateDataFilter={ ::this.updateYearFilter }
				/>
				<ControlRow data={this.props.data}
										getToggleNames={getState}
										updateDataFilter={ ::this.updateUSStateFilter }
										capitalize='true'
				/>
			</div>
		)
	}
}

export default Controls;
