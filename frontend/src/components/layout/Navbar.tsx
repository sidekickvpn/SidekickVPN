import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { auth } from '../../firebase';
import { connect } from 'react-redux';

import { AppState } from '../../reducers';
import { logout } from '../../actions/auth';
import { LogoutAction } from '../../actions';

interface NavbarProps {
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

class Navbar extends Component<NavbarProps> {
  render() {
    const authLinks = (
      <Fragment>
        <li>
          <a onClick={async () => await this.props.logout()}>Logout</a>
        </li>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <li>
          <NavLink activeClassName="active" to="/login">
            Login
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/register">
            Register
          </NavLink>
        </li>
      </Fragment>
    );

    return (
      <div>
        <nav>
          <div className="nav-wrapper blue darken-4">
            <a href="#!" className="brand-logo center">
              VPN Traffic Analysis
            </a>
            <a href="#" data-target="mobile-demo" className="sidenav-trigger">
              <i className="material-icons">menu</i>
            </a>
            <ul className="left hide-on-med-and-down">
              <li>
                <NavLink exact activeClassName="active" to="/">
                  Home
                </NavLink>
              </li>
            </ul>
            <ul className="right hide-on-med-and-down">
              {this.props.isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        </nav>

        <ul className="sidenav" id="mobile-demo">
          {this.props.isAuthenticated ? authLinks : guestLinks}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }: AppState) => ({
  isAuthenticated: auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { logout }
)(Navbar);
