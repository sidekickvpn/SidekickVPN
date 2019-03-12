import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { QRCode } from 'react-qr-svg';
import axios from 'axios';

interface AddDeviceState {
  name: string;
  privateKey: string;
  publicKey: string;
  vpnIp: string;
  copySuccess: string;
  serverInfo: {
    vpnName: string;
    vpnIp: string;
    publicIp: string;
    publicKey: string;
  };
  config: string;
}

export class AddDevice extends Component<any, AddDeviceState> {
  private config = React.createRef<HTMLTextAreaElement>();
  constructor(props: any) {
    super(props);

    this.state = {
      name: '',
      privateKey: '',
      publicKey: '',
      vpnIp: '',
      copySuccess: '',
      serverInfo: {
        vpnName: '',
        vpnIp: '',
        publicIp: '',
        publicKey: ''
      },
      config: ''
    };
  }

  async componentDidMount() {
    const res = await axios.get('/api/config');
    const serverInfo = await res.data;

    this.setState({ serverInfo });
  }

  onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await this.setState({ [e.target.name]: e.target.value } as any);
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, publicKey, vpnIp } = this.state;

    try {
      await this.genConfig();

      // Add device to server
      await axios.post('/api/clients', {
        name,
        publicKey,
        vpnIp
      });

      // Create/Download config file
      this.props.history.push('/dashboard/devices');
    } catch (err) {
      console.log(err);
    }
  };

  downloadFile() {
    const { serverInfo, config } = this.state;
    const element = document.createElement('a');

    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(config)
    );
    element.setAttribute('download', `${serverInfo.vpnName}.conf`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    const node = this.config.current;

    if (node) {
      node.select();
      document.execCommand('copy');
      this.setState({ copySuccess: 'Copied to Clipboard' });

      setTimeout(() => {
        this.setState({ copySuccess: '' });
      }, 2000);
    }
  };

  genConfig = async () => {
    const { vpnIp, privateKey, serverInfo } = this.state;

    const config = `[Interface]
Address = ${vpnIp}
PrivateKey = ${privateKey}
DNS = ${serverInfo.vpnIp}

[Peer]
PublicKey = ${serverInfo.publicKey}
AllowedIPs = 0.0.0.0/0
Endpoint = ${serverInfo.publicIp}
PersistentKeepalive = 25
`;
    this.setState({ config });
  };

  render() {
    const {
      name,
      privateKey,
      publicKey,
      vpnIp,
      config,
      serverInfo
    } = this.state;

    const configPreview =
      config.length > 0 ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Preview</h5>

            <div className="d-flex mb-2">
              <QRCode
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                style={{ width: 256 }}
                value={config}
              />
              <div>
                {document.queryCommandSupported('copy') && (
                  <div>
                    <button
                      type="button"
                      className="btn btn-light mb-1"
                      onClick={this.copyToClipboard}
                    >
                      <i className="fas fa-clipboard inline-icon" />
                      Copy
                    </button>
                    <span className="ml-1">{this.state.copySuccess}</span>
                  </div>
                )}
                <textarea
                  className="form-control"
                  ref={this.config}
                  value={config}
                  rows={5}
                  cols={60}
                  contentEditable={false}
                  readOnly
                />
                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    config
                  )}`}
                  download={`${serverInfo.vpnName}.conf`}
                  className="btn btn-info mt-1"
                >
                  <i className="fas fa-download inline-icon" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      );
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
              <div className="card mb-2">
                <div className="card-body">
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
                  <button type="submit" className="btn btn-primary btn-block">
                    Submit
                  </button>
                </div>
              </div>

              {configPreview}
              <Link
                to="/dashboard/devices"
                className="btn btn-success btn-block mt-2"
              >
                Done
              </Link>
            </form>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default AddDevice;
