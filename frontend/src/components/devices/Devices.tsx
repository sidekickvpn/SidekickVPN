import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Devices extends Component {
  render() {
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

            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>VPN IP</th>
                  <th>Public Key</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Luke's Laptop</td>
                  <td>192.168.10.5</td>
                  <td>some public key</td>
                </tr>
                <tr>
                  <td>Luke's iPad</td>
                  <td>192.168.10.6</td>
                  <td>some other public key</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Devices;
