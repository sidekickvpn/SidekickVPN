import { describe } from 'riteway';
import React from 'react';
import render from 'riteway/render-component';
import Device from '../src/components/devices/Device';

describe('Device Component', async assert => {
  const createDevice = device => render(<Device device={device} />);

  {
    const device = {
      _id: '1',
      name: 'iPad',
      vpnIp: '192.168.25.12/24',
      publicKey: 'some-public-key'
    };

    const DeviceComponent = createDevice(device);

    assert({
      given: 'a device',
      should: 'render the device with given name',
      actual: DeviceComponent('span.headline')
        .html()
        .trim(),
      expected: device.name
    });
  }

  {
    const device = {
      _id: '2',
      name: 'Dell Laptop',
      vpnIp: '192.168.25.54/24',
      publicKey: 'some-public-key'
    };

    const DeviceComponent = createDevice(device);

    assert({
      given: 'a device',
      should: 'render the device',
      actual: DeviceComponent('span.headline')
        .html()
        .trim(),
      expected: device.name
    });
  }
});
