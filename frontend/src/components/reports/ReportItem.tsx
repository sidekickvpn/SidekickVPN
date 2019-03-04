import React, { Component } from 'react';
import { Report } from '../../context/ReportsContext';
import axios from 'axios';

interface ReportItemProps {
  key: number;
  report: Report;
  onDeleteClick: (_id: string) => void;
}

export class ReportItem extends Component<ReportItemProps, {}> {
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
    const { report } = this.props;

    return (
      <li className="list-group-item">
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <h5>{report.name}</h5>
            <h5 className="text-muted ml-2">
              {new Date(report.date).toLocaleDateString()} -{' '}
              {new Date(report.date).toLocaleTimeString()}
            </h5>
          </div>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() => this.props.onDeleteClick(report._id)}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <span className={`badge badge-${this.getBadgeType(report.severity)}`}>
          {report.severity}
        </span>
        <p>{report.message}</p>
      </li>
    );
  }
}

export default ReportItem;
