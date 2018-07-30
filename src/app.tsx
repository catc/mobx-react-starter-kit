import React, { Component, Fragment } from 'react';
import { Provider, observer } from 'mobx-react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import 'styles/main.scss';

// components
import ModalContainer from 'components/common/modal/modal-container'

// routes
import Home from 'routes/home/index'

// If you use React Router, make this component
// render <Router> with your routes. Currently,
// only synchronous routes are hot reloaded, and
// you will see a warning from <Router> on every reload.
// You can ignore this warning. For details, see:
// https://github.com/reactjs/react-router/issues/2182
@observer
export default class App extends Component {
	render(){
		return (
			<Router>
				<Provider
					// any stores...
				>
					<Fragment>
						<div>
							<nav>
								<Link to="/">Home</Link>
							</nav>

							{/* can place routes here */}
							<Switch>
								<Route path="/" component={Home}/>
								{/* other routes */}
							</Switch>
						</div>

						{/* other stuff - ie: modal, growls, etc */}
						<ModalContainer/>
					</Fragment>
				</Provider>
			</Router>
		)
	}
}
