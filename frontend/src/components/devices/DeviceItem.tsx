import React, { Component } from 'react';
import { Device } from './types';

interface DeviceItemProps {
  key: string;
  deviceId: string;
  device: Device;
  onDeleteClick: (_id: string) => void;
}

interface DeviceItemState {
  toDevices: boolean;
}

export class DeviceItem extends Component<DeviceItemProps, DeviceItemState> {
  constructor(props: DeviceItemProps) {
    super(props);

    this.state = {
      toDevices: false
    };
  }

  render() {
    const { _id, name, vpnIp, publicKey } = this.props.device;
    return (
      <tr>
        <td>{name}</td>
        <td>{vpnIp}</td>
        <td>{publicKey}</td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => this.props.onDeleteClick(_id)}
          >
            <i className="fas fa-times" />
          </button>
        </td>
      </tr>
    );
  }
}

export default DeviceItem;
