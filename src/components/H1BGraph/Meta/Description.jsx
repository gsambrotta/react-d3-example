import React, { Component } from 'react';
import d3 from 'd3';

import Meta from './BaseComponent';
import StatesMap from './StatesMap';

class Description extends Meta {
	render() {
		return (
			<p className='lead'> This is a description</p>
		)
	}
}

export default Description;
