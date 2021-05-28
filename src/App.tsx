import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import TestGame from './pages/TestGame';

const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route exact path='/test' component={TestGame} />
			</Switch>
		</BrowserRouter>
	);
};

export default App;
