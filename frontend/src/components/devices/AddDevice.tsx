import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface AddDeviceState {
  name: string;
  privateKey: string;
  publicKey: string;
  vpnIp: string;
  serverPublicKey: string;
}

export class AddDevice extends Component<any, AddDeviceState> {
  constructor(props: any) {
    super(props);

    this.state = {
      name: 'iPad',
      privateKey: 'qMBqoIE69a24vRu/tmXGgvolOMgfAst9a7n+taewC0I=',
      publicKey: 'UjjQu8S0rdUDx6UAurqjjd47TUsAAVEy4Yo1zdpvKRg=',
      vpnIp: '192.168.10.92/24',
      serverPublicKey: ''
    };
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [e.target.name]: e.target.value } as any);
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, privateKey, publicKey, vpnIp } = this.state;

    // Get server info
    try {
      const res = await axios.get('/api/config');
      const serverInfo = await res.data;

      // Add device to server
      await axios.post('/api/clients', {
        name,
        publicKey,
        vpnIp
      });

      // Create/Download config file
      this.downloadFile(serverInfo, privateKey, vpnIp);
      this.props.history.push('/dashboard/devices');
    } catch (err) {
      console.log(err);
    }
  };

  downloadFile(serverInfo: any, privateKey: string, vpnIp: string) {
    const element = document.createElement('a');
    const contents = `[Interface]
Address = ${vpnIp}
PrivateKey = ${privateKey}
DNS = ${serverInfo.vpnIp}

[Peer]
PublicKey = ${serverInfo.publicKey}
AllowedIPs = 0.0.0.0/0
Endpoints = ${serverInfo.publicIp}
PersistentKeepalive = 25
`;

    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(contents)
    );
    element.setAttribute('download', `${serverInfo.vpn_name}.conf`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  render() {
    const { name, privateKey, publicKey, vpnIp } = this.state;
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
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="privateKey">Private Key</label>
                <span className="bg-info" />
                <i
                  className="fas fa-info-circle ml-2"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Don't Worry. Private Key never leaves your browser. This is
                  just to fill out the config file."
                />

                <input
                  name="privateKey"
                  type="text"
                  className="form-control"
                  value={privateKey}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="publicKey">Public Key</label>
                <input
                  name="publicKey"
                  type="text"
                  className="form-control"
                  value={publicKey}
                  onChange={this.onChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="vpnIp">
                  VPN IP{' '}
                  <span className="text-danger">
                    (TEMPORARY UNTIL IP PROVISIONING IMPLEMENTED)
                  </span>
                </label>
                <input
                  name="vpnIp"
                  type="text"
                  className="form-control"
                  value={vpnIp}
                  onChange={this.onChange}
                />
              </div>

              <button type="submit" className="btn btn-success btn-block">
                Add Device and Download Config
              </button>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AddDevice;
