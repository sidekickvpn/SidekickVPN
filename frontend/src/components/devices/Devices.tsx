import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Device } from './types';
import DeviceItem from './DeviceItem';

interface DevicesState {
  devices: Device[];
}

class Devices extends Component<{}, DevicesState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      devices: []
    };
  }

  onDeleteClick = async (_id: string) => {
    await axios.delete(`/api/clients/${_id}`);
    const updatedDevices = await this.state.devices.filter(
      device => device._id !== _id
    );
    this.setState({ devices: updatedDevices });
  };

  async componentDidMount() {
    try {
      const res = await axios.get('/api/clients/all');
      const { devices } = await res.data;

      if (devices) {
        this.setState({ devices });
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const { devices } = this.state;
    const deviceEntries =
      devices.length > 0 ? (
        <table className="table table-striped table-responsive-md mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>VPN IP</th>
              <th>Public Key</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {devices.map((device: Device) => (
              <DeviceItem
                key={device._id}
                deviceId={device._id}
                device={device}
                onDeleteClick={(_id: string) => this.onDeleteClick(_id)}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <h3>No Devices</h3>
      );

    return (
      <div>
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h3 className="card-title">
                <i className="fas fa-desktop inline-icon" />
                Devices
              </h3>
              <Link className="btn btn-success" to="/dashboard/devices/add">
                <i className="fas fa-plus inline-icon" />
                Add Device
              </Link>
            </div>

            {deviceEntries}
          </div>
        </div>
      </div>
    );
  }
}

export default Devices;
