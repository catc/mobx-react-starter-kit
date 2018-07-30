import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';

@observer
export default class CompOne extends Component {
	render(){
		return (
			<div>
				home
			</div>
		)
	}
}
