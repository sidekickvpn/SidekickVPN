import { describe } from 'riteway';
import {
  deleteClick,
  defaultState,
  reducer,
  addDevice
} from '../src/reducers/deviceReducer';

describe('Device Reducer', async assert => {
  assert({
    given: 'no arguments',
    should: 'return the initial state',
    actual: reducer(),
    expected: defaultState
  });

  const devices = [
    {
      _id: '1',
      name: 'iPad',
      vpnIp: '192.168.25.12/24',
      publicKey: 'some-public-key'
    },
    {
      _id: '2',
      name: 'Dell Laptop',
      vpnIp: '192.168.25.54/24',
      publicKey: 'some-public-key'
    }
  ];

  assert({
    given: 'a delete click',
    should: 'return the device with given id',
    actual: reducer({ devices }, deleteClick('2')),
    expected: {
      devices: [
        {
          _id: '1',
          name: 'iPad',
          vpnIp: '192.168.25.12/24',
          publicKey: 'some-public-key'
        }
      ]
    }
  });

  const device = {
    _id: '3',
    name: 'Android Phone',
    vpnIp: '192.168.25.76/24',
    publicKey: 'some-public-key'
  };

  assert({
    given: 'a new device to add',
    should: 'add device to state',
    actual: reducer({ devices }, addDevice(device)),
    expected: { devices: devices.concat(device) }
  });
});
