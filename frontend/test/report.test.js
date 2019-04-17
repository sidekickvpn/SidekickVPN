import { describe } from 'riteway';
import render from 'riteway/render-component';
import React from 'react';
import Report from '../src/components/reports/Report';

describe('Report component', async assert => {
  const createReport = report =>
    render(<Report report={report} onDeleteClick={() => {}} />);

  {
    const report = {
      _id: '1',
      name: 'SSH Login',
      severity: 'high',
      message: 'SSH login detected, password length of 15',
      date: Date.now()
    };

    const ReportComponent = createReport(report);

    assert({
      given: 'a report',
      should: 'render the report with given name',
      actual: ReportComponent('h5.headline')
        .html()
        .trim(),
      expected: report.name
    });

    assert({
      given: 'a report',
      should: 'render the report with given message',
      actual: ReportComponent('p')
        .html()
        .trim(),
      expected: report.message
    });

    assert({
      given: 'a report',
      should: 'render the report with given severity',
      actual: ReportComponent('.badge')
        .html()
        .trim(),
      expected: report.severity
    });

    assert({
      given: 'a report',
      should: 'render the delete report button',
      actual: ReportComponent('.btn').length,
      expected: 1
    });
  }

  {
    const report = {
      _id: '2',
      name: 'SSH Sessions',
      severity: 'low',
      message: 'SSH session detected'
    };
    const ReportComponent = createReport(report);

    assert({
      given: 'a report',
      should: 'render the report',
      actual: ReportComponent('h5.headline')
        .html()
        .trim(),
      expected: report.name
    });
  }

  {
    const report = {
      _id: '1',
      name: 'SSH Login',
      severity: 'high',
      message: 'SSH login detected, password length of 15',
      date: Date.now()
    };

    const ReportComponent = createReport(report);

    assert({
      given: 'a HIGH severity report',
      should: 'render danger badge for HIGH severity reports',
      actual: ReportComponent('.badge-danger')
        .html()
        .trim()
        .toLowerCase(),
      expected: 'high'
    });
  }
  {
    const report = {
      _id: '2',
      name: 'Some low severity event',
      severity: 'low',
      message: 'Something happened',
      date: Date.now()
    };

    const ReportComponent = createReport(report);

    assert({
      given: 'a LOW severity report',
      should: 'render success badge for LOW severity reports',
      actual: ReportComponent('.badge-success')
        .html()
        .trim()
        .toLowerCase(),
      expected: 'low'
    });
  }
  {
    const report = {
      _id: '3',
      name: 'Hidden keystrokes',
      severity: 'medium',
      message: 'Hidden keystrokes detected',
      date: Date.now()
    };

    const ReportComponent = createReport(report);

    assert({
      given: 'a MEDIUM severity report',
      should: 'render warning badge for MEDIUM severity reports',
      actual: ReportComponent('.badge-warning')
        .html()
        .trim()
        .toLowerCase(),
      expected: 'medium'
    });
  }

  {
    const report = {
      _id: '4',
      name: 'Hidden keystrokes',
      severity: 'unknown',
      message: 'Hidden keystrokes detected',
      date: Date.now()
    };

    const ReportComponent = createReport(report);

    assert({
      given: 'a report with invalid severity type',
      should: 'render warning badge',
      actual: ReportComponent('.badge-warning')
        .html()
        .trim()
        .toLowerCase(),
      expected: report.severity
    });
  }
});
