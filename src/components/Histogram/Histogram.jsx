import React, { Component } from 'react';
import d3 from 'd3';

class Histogram extends Component {
	constructor(props) {
		super(props);

		this.histogram = d3.layout.histogram();
		this.widthScale = d3.scale.linear();
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

		this.widthScale
				.domain([d3.min(counts), d3.max(counts)])
				.range([9, props.width - props.axisMargin]);

		this.yScale
				.domain([0, d3.max(thicknessInPosition) ]) // we use x value in yScale because is horizontal histogram
				.range([0, props.height-props.topMargin-props.bottomMargin]); //chart dimension properties
	}

	makeBar(bar) {
		let percent = bar.y / this.props.data.length * 100;

		let props = {
			percent: percent,
			x: this.props.axisMargin,
			y: this.yScale(bar.x), // yScale is not a function !! ?
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

		return (
			<g className='histogram' transform={translate}>
				<g className='bars'>
					{bars.map(::this.makeBar)} //ES7 this.makeBar.bind(this)
				</g>
			</g>
		)
	}
}

// Subcomponent HistogramBar
const HistogramBar = (props) => {
	let translate = `translate(${props.x}, ${props.y})`;
	let label = `${props.percent.toFixed(0)} %`;

	if(props.percent < 1 ) {
		label = `${props.percent.toFixed(2)} %`;
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
