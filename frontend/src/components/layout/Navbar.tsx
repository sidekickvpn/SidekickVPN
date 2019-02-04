import React, { Component, Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { AppState } from '../../reducers';
import { logout } from '../../actions/auth';

interface NavbarProps {
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

class Navbar extends Component<NavbarProps> {
  render() {
    const authLinks = (
      <Fragment>
        <NavLink className="nav-item nav-link" to="/dashboard">
          Dashboard
        </NavLink>
        <a
          className="nav-item nav-link"
          onClick={async () => await this.props.logout()}
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
              {this.props.isAuthenticated ? authLinks : guestLinks}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { logout },
  null,
  {
    pure: false
  }
)(Navbar);
