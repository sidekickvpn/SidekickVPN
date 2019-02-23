import React, { Component } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

class PrivateRoute extends Component<RouteProps, {}> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  render() {
    const { component: RouteComponent, render, ...rest } = this.props;
    if (this.context.isAuthenticated) {
      return <Route {...rest} component={RouteComponent} />;
    } else {
      return <Redirect to="/login" />;
    }
  }
}

export default PrivateRoute;
