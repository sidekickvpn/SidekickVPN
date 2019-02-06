import React, { Component } from 'react';
import Subscription from './Subscription';
import Summary from './Summary';
import Devices from './Devices';
import Reports from './Reports';
import Billing from './Billing';

class Dashboard extends Component<any, any> {
  state = {
    selected: <Summary />
  };

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-3">
            <div className="list-group">
              <button
                className="list-group-item list-group-item-action pointer"
                onClick={() => this.setState({ selected: <Summary /> })}
              >
                <i className="fas fa-chart-bar inline-icon" />
                Summary
              </button>
              <button
                className="list-group-item list-group-item-action pointer"
                onClick={() => this.setState({ selected: <Devices /> })}
              >
                <i className="fas fa-desktop inline-icon" />
                Devices
              </button>
              <button
                className="list-group-item list-group-item-action pointer"
                onClick={() => this.setState({ selected: <Reports /> })}
              >
                <i className="fas fa-flag inline-icon" />
                Reports
              </button>
              <button
                className="list-group-item list-group-item-action pointer"
                onClick={() => this.setState({ selected: <Billing /> })}
              >
                <i className="fas fa-receipt inline-icon" />
                Billing
              </button>
              <button
                className="list-group-item list-group-item-action pointer"
                onClick={() => this.setState({ selected: <Subscription /> })}
              >
                <i className="fas fa-shopping-cart inline-icon" />
                Subscription
              </button>
            </div>
          </div>
          <div className="col-md-9">{this.state.selected}</div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
