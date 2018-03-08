import React, { Component } from 'react';
import 'styles/main.scss';

import CompOne from 'components/comp-one'

export default class App extends Component {
	render(){
		return (
			<div>
				hello world!
				<CompOne/>
			</div>
		)
	}
}
