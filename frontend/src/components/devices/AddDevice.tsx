import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

interface AddDeviceState {
  name: string;
  pubkey: string;
  vpnip: string;
}

export class AddDevice extends Component<{}, AddDeviceState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: '',
      pubkey: '',
      vpnip: ''
    };
  }

  onChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [e.target.name]: e.target.value } as any);
  };

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  };

  render() {
    const { name, pubkey, vpnip } = this.state;
    return (
      <Fragment>
        <Link to="/dashboard" className="btn btn-primary mb-2">
          <i className="fas fa-arrow-left inline-icon" />
          Go Back
        </Link>
        <div className="card">
          <div className="card-body">
            <h3 className="card-title">Add Device</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="name">Device Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  value={name}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pubkey">Public Key</label>
                <input
                  name="pubkey"
                  type="text"
                  className="form-control"
                  value={pubkey}
                />
              </div>
              <div className="form-group">
                <label htmlFor="vpnip">
                  VPN IP{' '}
                  <span className="text-danger">
                    (TEMPORARY UNTIL IP PROVISIONING IMPLEMENTED)
                  </span>
                </label>
                <input
                  name="vpnip"
                  type="text"
                  className="form-control"
                  value={vpnip}
                />
              </div>

              <button type="submit" className="btn btn-success btn-block">
                Add Device
              </button>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AddDevice;
