import React, { Component } from 'react';
import SideNav from './SideNav';
import Summary from './Summary';
import Devices from '../devices/Devices';
import Reports from './Reports';
import Billing from './Billing';
import Subscription from './Subscription';

interface DasbboardState {
  selected: JSX.Element;
}

class Dashboard extends Component<any, DasbboardState> {
  state = {
    selected: <Summary />
  };

  updateSelected = () => {
    const { selected } = this.props.match.params;
    switch (selected) {
      case 'summary':
        this.setState({ selected: <Summary /> });
        break;
      case 'devices':
        this.setState({ selected: <Devices /> });
        break;
      case 'reports':
        this.setState({ selected: <Reports /> });
        break;
      case 'billing':
        this.setState({ selected: <Billing /> });
        break;
      case 'subscription':
        this.setState({ selected: <Subscription /> });
        break;
      default:
        this.setState({ selected: <Summary /> });
    }
  };

  componentDidMount() {
    this.updateSelected();
  }

  componentDidUpdate(prevProps: any) {
    if (this.props !== prevProps) {
      console.log('changed');
      this.updateSelected();
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-3 mb-3">
            <SideNav />
          </div>
          <div className="col-md-9">{this.state.selected}</div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
