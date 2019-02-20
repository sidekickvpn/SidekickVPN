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
    reports: []
  };

  render() {
    const reports =
      this.state.reports.length > 0 ? (
        <div className="list-group">
          {/* {this.state.reports.map((report, index) => (
            <li key={index} className="list-group-item">
              {report.text} -{' '}
              <span className="badge badge-danger">{report.severity}</span>
            </li>
          ))} */}
        </div>
      ) : (
        <h4>No Reports</h4>
      );

    return (
      <div className="card">
        <div className="card-body">
          <h3 className="card-title">
            <i className="fas fa-flag inline-icon" />
            Reports
          </h3>

          {reports}
        </div>
      </div>
    );
  }
}

export default Reports;
