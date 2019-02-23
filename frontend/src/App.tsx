import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
// import store from './store';

import setAuthToken from './utils/setAuthToken';

import Navbar from './components/layout/Navbar';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/common/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import AddDevice from './components/devices/AddDevice';
import AuthContext, {
  UserLogin,
  AuthContextState,
  User
} from './context/AuthContext';
import axios from 'axios';

class App extends Component<{}, AuthContextState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: null,
      loginUser: this.loginUser,
      logoutUser: this.logoutUser
    };
  }

  // Login - Get User Token
  loginUser = (userData: UserLogin) => {
    axios
      .post('/api/users/login', userData)
      .then(res => {
        // Save token to local storage
        const { token } = res.data;
        localStorage.setItem('jwtToken', token);

        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded: User = jwt_decode(token);
        // Set current user
        // dispatch(setCurrentUser(decoded));
        this.setState({
          isAuthenticated: true,
          user: decoded
        });
      })
      .catch(err => console.log(err));
  };

  logoutUser = () => {
    // Log user out
    localStorage.removeItem('jwtToken');
    setAuthToken('');
    this.setState({ isAuthenticated: false, user: null });
  };

  componentDidMount() {
    // Check for token
    if (localStorage.jwtToken) {
      // Set Auth token header auth
      setAuthToken(localStorage.jwtToken);
      // Decode token and get user info and expiration
      const decoded: any = jwt_decode(localStorage.jwtToken);
      // Set user and isAuthenticated
      // store.dispatch(setCurrentUser(decoded));
      this.setState({
        isAuthenticated: true,
        user: decoded
      });

      // Check for expired token
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Logout user
        // store.dispatch(logoutUser());
        this.setState({
          isAuthenticated: false,
          user: null
        });
      }
    }
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        <Router>
          <div>
            <Navbar />
            <div className="container mt-3">
              <Switch>
                <Route exact path="/" component={Landing} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <PrivateRoute exact path="/dashboard/" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/dashboard/:selected"
                  component={Dashboard}
                />
                <PrivateRoute
                  exact
                  path="/dashboard/devices/add"
                  component={AddDevice}
                />
              </Switch>
            </div>
          </div>
        </Router>
      </AuthContext.Provider>
    );
  }
}

export default App;
