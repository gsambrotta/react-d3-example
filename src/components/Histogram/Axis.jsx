import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

class Axis extends Component {
	constructor(props) {
		super();

		this.yScale = d3.scale.linear();
		this.axis = d3.svg.axis() // linear axis for y coordinate
									.scale(this.yScale) // use linear scale
									.orient('left') // labels on left
									.tickFormat((d) => `${this.yScale.tickFormat()(d)}$`); // each tickFormat is prepend with $

		this.update_d3(props);
	}

	componentWillReceiveProps(newProps) {
		this.update_d3(newProps);
	}

	componentDidUpdate() {
		this.renderAxis();
	}

	componentDidMount() {
		this.renderAxis();
	}

	renderAxis() {
		//this function re-render Axis from scratch on every update

		let node = ReactDOM.findDOMNode(this); // find this component DOM node

		d3.select(node).call(this.axis); // .call() invoke func
	}

	update_d3(props) {
		let thicknessInPosition = props.data.map((d) => d.x + d.dx);
		let ticksValuesLabel = props.data[props.data.length-1].x + props.data[props.data.length-1].dx

		this.yScale
				.domain( [0, d3.max(thicknessInPosition)] )
				.range([0, props.height-props.topMargin-props.bottomMargin]);

		this.axis
				.ticks(props.data.length) // same numb of bars
				.tickValues( props.data.map((d) => d.x).concat(ticksValuesLabel) ); // list of specific values for the ticks
	}

	render() {
		let translate = `translate(${this.props.axisMargin-3}, 0)`;

		return (
			<g className='axis' transform={translate}></g>
		)
	}
}

export default Axis;
