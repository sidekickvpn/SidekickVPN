import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function SideNav() {
  return (
    <div className="list-group">
      <NavLink
        exact
        className="list-group-item list-group-item-action pointer"
        to="/dashboard"
      >
        <i className="fas fa-chart-bar inline-icon" />
        Summary
      </NavLink>
      <NavLink
        className="list-group-item list-group-item-action pointer"
        to="/dashboard/devices"
      >
        <i className="fas fa-desktop inline-icon" />
        Devices
      </NavLink>
      <NavLink
        className="list-group-item list-group-item-action pointer"
        to="/dashboard/reports"
      >
        <i className="fas fa-flag inline-icon" />
        Reports
      </NavLink>
      <NavLink
        className="list-group-item list-group-item-action pointer"
        to="/dashboard/billing"
      >
        <i className="fas fa-receipt inline-icon" />
        Billing
      </NavLink>
      <NavLink
        className="list-group-item list-group-item-action pointer"
        to="/dashboard/subscription"
      >
        <i className="fas fa-shopping-cart inline-icon" />
        Subscription
      </NavLink>
    </div>
  );
}

export default SideNav;
