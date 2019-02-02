import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import M from 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

import Navbar from './components/layout/Navbar';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { auth } from './firebase';
import { getUser } from './actions/auth';

class App extends Component {
  async componentDidMount() {
    M.AutoInit();
    await auth.onAuthStateChanged(
      async user => await store.dispatch(getUser(user))
    );
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <Navbar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
              </Switch>
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
