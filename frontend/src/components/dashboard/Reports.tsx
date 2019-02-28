import React, { Component } from 'react';
import axios from 'axios';
import ReportContext, { Report } from '../../context/ReportsContext';

interface ReportsState {
  reports: Report[];
}

class Reports extends Component<{}, ReportsState> {
  // static contextType = ReportContext;
  // context!: React.ContextType<typeof ReportContext>;

  state = {
    reports: []
  };

  async componentDidMount() {
    try {
      const res = await axios.get('/api/reports');
      const { reports } = await res.data;

      if (reports) {
        this.setState({ reports });
      }
    } catch (e) {
      console.log(e);
    }
  }

  getBadgeType = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'warning';
    }
  };

  render() {
    const reports =
      this.state.reports.length > 0 ? (
        <div className="list-group">
          {this.state.reports.map((report: Report, index) => (
            <li key={index} className="list-group-item">
              {report.name} -{' '}
              <span
                className={`badge badge-${this.getBadgeType(report.severity)}`}
              >
                {report.severity}
              </span>
              <p>{report.message}</p>
            </li>
          ))}
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
