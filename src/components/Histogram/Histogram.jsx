import React, { Component } from 'react';
import d3 from 'd3';

import Axis from './Axis';


class Histogram extends Component {
	constructor(props) {
		super(props);

		this.histogram = d3.layout.histogram();
		this.widthScale = d3.scale.linear(); //scale data to 1:1 or to the propotion indicate
		this.yScale = d3.scale.linear();

		this.update_d3(props);
	}

	componentWillReceiveProps(nextProps) {
		this.update_d3(nextProps);
	}

	update_d3(props) {
		this.histogram
				.bins(props.bins)
				.value(props.value);

		let bars = this.histogram(props.data);
		let counts = bars.map((d) => d.y );
		let thicknessInPosition = bars.map((d) => d.x + d.dx);
		const maxNumbCounts = d3.max(counts);
		const minNumbCounts = d3.min(counts);

		this.widthScale
				.domain([minNumbCounts, maxNumbCounts]) // range di data di partenza (i.e.: 0, 10000)
				.range([9, props.width - props.axisMargin]); // range di data a cui vogliamo arrivare (i.e.: 0, 100)

		this.yScale
				.domain([0, d3.max(thicknessInPosition) ]) // we use x value in yScale because is horizontal histogram
				.range([0, props.height-props.topMargin-props.bottomMargin]); // chart dimension properties
	}

	makeBar(bar) {
		let percent = bar.y / this.props.data.length * 100;

		let props = {
			percent: percent,
			x: this.props.axisMargin,
			y: this.yScale(bar.x), // yScale is not a function?? yes, d3.scale.linear is a function
			width: this.widthScale(bar.y),
			height: this.yScale(bar.dx),
			key: `histogram-bar-${bar.x}-${bar.y}`
		}
		return (
			<HistogramBar {...props} /> // subcomponent
		)
	}

	render () {
		let translate = `translate(0, ${this.props.topMargin})`;
		let bars = this.histogram(this.props.data);

		// ::this.makeBar is ES7 way of this.makeBar.bind(this)
		return (
			<g className='histogram' transform={translate}>
				<g className='bars'>
					{bars.map(::this.makeBar)}
				</g>
				<Axis {...this.props} data={bars} />
			</g>
		)
	}
}

// Subcomponent HistogramBar
const HistogramBar = (props) => {
	let translate = `translate(${props.x}, ${props.y})`;
	let label = `${props.percent.toFixed(0)}%`;

	if(props.percent < 1 ) {
		label = `${props.percent.toFixed(2)}%`;
	}

	if (props.width < 20) {
		label = label.replace('%', '');
	}

	if (props.width < 10) {
		label = '';
	}


	return (
		<g transform={translate} className='bar'>
			<rect width={props.width}
						height={props.height-2}
						transform='translate(0, 1)'>
			</rect>
			<text textAnchor='end'
						x={props.width-5}
						y={props.height/2+3}>
				{label}
			</text>
		</g>
	);
}


export default Histogram;
