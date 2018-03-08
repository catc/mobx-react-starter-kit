import './style.scss';
import React, { Component } from 'react';
import { observable, action, computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { asyncAction } from 'mobx-utils';
import P from 'prop-types';

/*@inject(stores => ({
	session: stores.sessionStore,
}))*/
@observer
export default class MY_COMPONENT extends Component {
	constructor(props){
		super(props)
	}

	yourAction = asyncAction(function*(){
		// ...
	})

	render(){
		return (
			<div>
				component
			</div>
		)
	}
}

MY_COMPONENT.propTypes = {
	
}