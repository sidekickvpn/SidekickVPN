import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
// import { Stomp } from '@stomp/stompjs';

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
import { ReportsContextState } from './context/ReportsContext';

interface AppState {
  auth: AuthContextState;
  reports: ReportsContextState;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      auth: {
        isAuthenticated: false,
        user: null,
        loginUser: this.loginUser,
        logoutUser: this.logoutUser
      },
      reports: {
        reports: []
      }
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
          auth: {
            ...this.state.auth,
            isAuthenticated: true,
            user: decoded
          }
        });
      })
      .catch(err => console.log(err));
  };

  logoutUser = () => {
    // Log user out
    localStorage.removeItem('jwtToken');
    setAuthToken('');
    this.setState({
      auth: {
        ...this.state.auth,
        isAuthenticated: false,
        user: null
      }
    });
  };

  async componentDidMount() {
    // Check for token
    if (localStorage.jwtToken) {
      // Set Auth token header auth
      setAuthToken(localStorage.jwtToken);
      // Decode token and get user info and expiration
      const decoded: any = jwt_decode(localStorage.jwtToken);
      // Set user and isAuthenticated
      // store.dispatch(setCurrentUser(decoded));
      this.setState({
        auth: {
          ...this.state.auth,
          isAuthenticated: true,
          user: decoded
        }
      });

      // Check for expired token
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        // Logout user
        // store.dispatch(logoutUser());
        this.setState({
          auth: {
            ...this.state.auth,
            isAuthenticated: false,
            user: null
          }
        });
      }
    }

    // try {
    //   const client = Stomp.client(`ws://${window.location.hostname}:15647`);

    //   const on_connect = () => {
    //     client.subscribe(`/reports/${this.state.auth.user.id}`, data => {
    //       console.log(data.body);
    //     });
    //   };

    //   client.connect('guest', 'guest', on_connect, on_error, '/');
    // } catch (e) {
    //   console.log(e);
    // }
  }

  render() {
    return (
      <AuthContext.Provider value={this.state.auth}>
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
