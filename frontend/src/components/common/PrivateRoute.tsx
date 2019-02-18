import React, { Component } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { AuthState } from '../../reducers/auth';
import { AppState } from '../../reducers';

interface StateProps {
  auth: AuthState;
}

class PrivateRoute extends Component<RouteProps & StateProps, {}> {
  render() {
    const { component: RouteComponent, render, auth, ...rest } = this.props;
    if (auth.isAuthenticated) {
      return <Route {...rest} component={RouteComponent} />;
    } else {
      return <Redirect to="/login" />;
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
