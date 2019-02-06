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
    if (auth.isLoading) {
      return (
        <Route
          render={() => (
            <div className="d-flex justify-content-center">
              <div
                className="spinner-grow"
                role="status"
                style={{ width: '5rem', height: '5rem' }}
              >
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
        />
      );
    } else if (!auth.isAuthenticated) {
      return <Redirect to="/login" />;
    } else {
      return <Route {...rest} component={RouteComponent} />;
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
