import React, { Component } from 'react';
import axios from 'axios';
import ReportContext, { Report } from '../../context/ReportsContext';
import ReportItem from './ReportItem';

interface ReportsState {
  reports: Report[];
}

class Reports extends Component<{}, ReportsState> {
  // static contextType = ReportContext;
  // context!: React.ContextType<typeof ReportContext>;

  constructor(props: {}) {
    super(props);

    this.state = {
      reports: []
    };
  }

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

  onDeleteAllClick = async () => {
    if (confirm('Delete ALL reports?')) {
      await axios.delete(`/api/reports/all`);
      this.setState({ reports: [] });
    }
  };

  onDeleteClick = async (_id: string) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`/api/reports/${_id}`);
      const updatedReports = await this.state.reports.filter(
        report => report._id !== _id
      );
      this.setState({ reports: updatedReports });
    }
  };

  render() {
    const reports =
      this.state.reports.length > 0 ? (
        <div className="list-group">
          {this.state.reports.map((report: Report, index) => (
            <ReportItem
              key={index}
              report={report}
              onDeleteClick={(_id: string) => this.onDeleteClick(_id)}
            />
          ))}
        </div>
      ) : (
        <h4>No Reports</h4>
      );

    return (
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <h3 className="card-title">
              <i className="fas fa-flag inline-icon" />
              Reports
            </h3>
            <button
              className="btn btn-outline-danger"
              onClick={this.onDeleteAllClick}
            >
              Clear All
            </button>
          </div>

          {reports}
        </div>
      </div>
    );
  }
}

export default Reports;
