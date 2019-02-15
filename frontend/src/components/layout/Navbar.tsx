import React, { Component, Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { AppState } from '../../reducers';
import { logoutUser } from '../../actions/auth';
import { AuthState } from '../../reducers/auth';

interface NavbarProps {
  logoutUser: () => void;
  auth: AuthState;
}

class Navbar extends Component<NavbarProps> {
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const authLinks = (
      <Fragment>
        {user ? (
          <Link className="nav-item nav-link" to="/dashboard">
            <i className="fas fa-user inline-icon" />
            {`${user.firstname}${user.lastname}`}
          </Link>
        ) : (
          ''
        )}
        <a
          className="nav-item nav-link pointer"
          onClick={async () => await this.props.logoutUser()}
        >
          Logout
        </a>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <NavLink className="nav-item nav-link" to="/login">
          Login
        </NavLink>
        <NavLink className="nav-item nav-link" to="/register">
          Register
        </NavLink>
      </Fragment>
    );

    return (
      <div className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link to="/" className="navbar-brand">
            VPN Traffic Analysis
          </Link>
          <button
            className="navbar-toggler"
            data-toggle="collapse"
            data-target="#navbarResponsive"
            aria-controls="navbarResponsive"
            aria-expanded="false"
            aria-label="Toggle nagivation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <div className="navbar-nav">
              {isAuthenticated ? (
                <NavLink className="nav-item nav-link" to="/dashboard">
                  Dashboard
                </NavLink>
              ) : (
                ''
              )}
            </div>
            <div className="ml-auto d-lg-flex d-md-block">
              <div className="navbar-nav">
                {isAuthenticated ? authLinks : guestLinks}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser },
  null,
  {
    pure: false
  }
)(Navbar);
