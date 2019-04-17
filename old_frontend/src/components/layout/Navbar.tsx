import React, { Component, Fragment } from 'react';
import { NavLink, Link } from 'react-router-dom';

import AuthContext, { AuthContextState } from '../../context/AuthContext';

class Navbar extends Component<{}, {}> {
  static contextType = AuthContext;
  context!: React.ContextType<typeof AuthContext>;

  render() {
    const { isAuthenticated, user, logoutUser } = this.context;

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
            <div className="navbar-nav d-lg-none d-xl-none">
              {isAuthenticated ? (
                <Fragment>
                  <NavLink exact to="/dashboard" className="nav-item nav-link">
                    <i className="fas fa-chart-bar inline-icon" />
                    Summary
                  </NavLink>
                  <NavLink
                    to="/dashboard/devices"
                    className="nav-item nav-link"
                  >
                    <i className="fas fa-desktop inline-icon" />
                    Devices
                  </NavLink>
                  <NavLink
                    to="/dashboard/reports"
                    className="nav-item nav-link"
                  >
                    <i className="fas fa-flag inline-icon" />
                    Reports
                  </NavLink>
                  <NavLink
                    to="/dashboard/billing"
                    className="nav-item nav-link"
                  >
                    <i className="fas fa-receipt inline-icon" />
                    Billing
                  </NavLink>
                  <NavLink
                    to="/dashboard/subscription"
                    className="nav-item nav-link"
                  >
                    <i className="fas fa-shopping-cart inline-icon" />
                    Subscription
                  </NavLink>
                </Fragment>
              ) : (
                ''
              )}
            </div>
            <div className="ml-auto d-lg-flex d-md-block">
              <div className="navbar-nav">
                {isAuthenticated ? (
                  <Fragment>
                    <Link className="nav-item nav-link" to="/dashboard">
                      <i className="fas fa-user inline-icon" />
                      {`${user!.firstname} ${user!.lastname}`}
                    </Link>
                    <a
                      className="nav-item nav-link pointer"
                      onClick={async () => await logoutUser()}
                    >
                      Logout
                    </a>
                  </Fragment>
                ) : (
                  <Fragment>
                    <NavLink className="nav-item nav-link" to="/login">
                      Login
                    </NavLink>
                    <NavLink className="nav-item nav-link" to="/register">
                      Register
                    </NavLink>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Navbar;