import React, { Component } from 'react';

interface Report {
  text: string;
  severity: string;
}

interface ReportsState {
  reports: Report[];
}

class Reports extends Component<{}, ReportsState> {
  state = {
    reports: [
      {
        text: 'Password entry detected',
        severity: 'High'
      }
    ]
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">
            <i className="fas fa-flag inline-icon" />
            Reports
          </h3>

          <div className="list-group">
            {this.state.reports.map((report, index) => (
              <li key={index} className="list-group-item">
                {report.text} -{' '}
                <span className="badge badge-danger">{report.severity}</span>
              </li>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Reports;
